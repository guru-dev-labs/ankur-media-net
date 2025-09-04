// pages/triggers.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ---------- helpers ----------
const fmt = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "-";
  const num = Number(n);
  if (Math.abs(num) >= 1000) return num.toLocaleString();
  return num % 1 === 0 ? String(num) : Number(num).toFixed(4);
};

const friendlyDate = (d) => {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleString();
  } catch {
    return String(d);
  }
};

const medianAndIqr = (arr) => {
  if (!arr || arr.length === 0) return { median: 0, iqr: 0 };
  const a = [...arr].sort((x, y) => x - y);
  const q = (arr, qv) => {
    const pos = (arr.length - 1) * qv;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined) {
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    }
    return arr[base];
  };
  const q1 = q(a, 0.25);
  const q2 = q(a, 0.5);
  const q3 = q(a, 0.75);
  const iqr = q3 - q1;
  return { median: q2, iqr };
};

// compute metric value from a metrics row based on metricKey
const metricValueFromRow = (row, metricKey) => {
  // row fields: impressions, clicks, spend, ts
  const impressions = Number(row.impressions || 0);
  const clicks = Number(row.clicks || 0);
  const spend = Number(row.spend || 0);
  if (metricKey === "CTR") {
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  } else if (metricKey === "Spend") {
    return spend;
  } else if (metricKey === "CPM") {
    return impressions > 0 ? (spend / impressions) * 1000 : 0;
  } else if (metricKey === "ROAS") {
    // if revenue present in metrics row, use it; else fallback 0
    return Number(row.revenue || 0);
  } else {
    return 0;
  }
};

// sliding window alert detector (array of {ts, value}), op '<'|'>' and threshold numeric
const slidingWindowsDetect = (series, windowHours, op, threshold) => {
  // series is sorted ascending by ts (ms)
  if (!series.length) return { windowsChecked: 0, matches: [] };
  const msPerHour = 3600 * 1000;
  const res = { windowsChecked: 0, matches: [] };

  // use two-pointer window
  let left = 0;
  for (let right = 0; right < series.length; right++) {
    // expand right
    // shrink left to maintain windowHours
    while (series[right].ts - series[left].ts >= windowHours * msPerHour) {
      left++;
    }
    // compute aggregate over [left..right]
    // For simplicity, treat window as average of values in bucket (you can change to sum if metric is 'Spend')
    const windowSlice = series.slice(left, right + 1);
    if (!windowSlice.length) continue;
    res.windowsChecked++;
    // derive window value: for CTR/CPM/ROAS -> take mean, for Spend -> sum
    const sampleMetric = windowSlice[0].metricKey;
    const isSpendLike = sampleMetric === "Spend";
    const value = isSpendLike
      ? windowSlice.reduce((s, x) => s + x.value, 0)
      : windowSlice.reduce((s, x) => s + x.value, 0) / windowSlice.length;

    const triggered = op === "<" ? value < threshold : value > threshold;
    if (triggered) {
      res.matches.push({
        window_start: new Date(windowSlice[0].ts).toISOString(),
        window_end: new Date(windowSlice[windowSlice.length - 1].ts).toISOString(),
        value,
      });
    }
  }
  return res;
};

// ---------- component ----------
export default function Triggers() {
  // form fields
  const [editingId, setEditingId] = useState(null);
  const [campaignId, setCampaignId] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [metric, setMetric] = useState("");
  const [mode, setMode] = useState("absolute"); // absolute / relative (relative means percent drop)
  const [operator, setOperator] = useState("<");
  const [threshold, setThreshold] = useState("");
  const [duration, setDuration] = useState(3); // hours
  const [severity, setSeverity] = useState("info");
  const [suppressionHours, setSuppressionHours] = useState(0);
  const [name, setName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [active, setActive] = useState(true);

  // UI state
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [msg, setMsg] = useState(null);
  const [alertStats, setAlertStats] = useState({}); // { trigger_id: {count, last} }

  // -------- Load campaigns (for dropdown) ----------
  const loadCampaigns = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id,name")
        .order("name", { ascending: true });

      if (error) {
        console.error("loadCampaigns:", error);
        setMsg({ type: "error", text: "Failed to load campaigns" });
        setCampaigns([]);
        return;
      }
      const mapped = (data || []).map((c) => ({ id: String(c.id), name: c.name }));
      setCampaigns(mapped);
      if (!campaignId && mapped.length > 0) setCampaignId(mapped[0].id);
    } catch (e) {
      console.error(e);
      setCampaigns([]);
    }
  }, [campaignId]);

  // -------- Load triggers list ----------
  const loadTriggers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("triggers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("loadTriggers:", error);
        setRows([]);
        setLoading(false);
        return;
      }
      setRows(data || []);
      // load alert stats for these triggers
      const ids = (data || []).map((r) => r.id);
      if (ids.length > 0) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
        const { data: alertsData, error: alertsErr } = await supabase
          .from("alerts")
          .select("trigger_id,created_at")
          .in("trigger_id", ids)
          .gte("created_at", thirtyDaysAgo);

        if (!alertsErr) {
          const stats = {};
          (alertsData || []).forEach((a) => {
            const t = a.trigger_id;
            stats[t] = stats[t] || { count: 0, last: null };
            stats[t].count += 1;
            if (!stats[t].last || new Date(a.created_at) > new Date(stats[t].last)) {
              stats[t].last = a.created_at;
            }
          });
          // for triggers with zero alerts, ensure an object exists
          ids.forEach((id) => {
            stats[id] = stats[id] || { count: 0, last: null };
          });
          setAlertStats(stats);
        }
      } else {
        setAlertStats({});
      }
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadCampaigns();
    loadTriggers();
  }, [loadCampaigns, loadTriggers]);

  // when campaign or metric changes, compute suggestion
  useEffect(() => {
    if (!campaignId || !metric) {
      setSuggestion(null);
      return;
    }
    computeSuggestionForCampaign(campaignId, metric);
  }, [campaignId, metric]);

  // ---------- computeSuggestionForCampaign ----------
  async function computeSuggestionForCampaign(campaign_id, metricKey) {
    // 7-day baseline using metrics table (hourly)
    try {
      const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("metrics")
        .select("ts,impressions,clicks,spend")
        .eq("campaign_id", campaign_id)
        .gte("ts", since)
        .order("ts", { ascending: true });

      if (error) {
        console.error("suggestion fetch error:", error);
        setSuggestion(null);
        return;
      }
      const rows = data || [];
      const series = rows.map((r) => metricValueFromRow({ impressions: r.impressions, clicks: r.clicks, spend: r.spend, revenue: r.revenue }, metricKey));
      const { median, iqr } = medianAndIqr(series);
      const absSuggestion = Math.max(0, median - iqr); // naive, but effective start
      const relOptions = [10, 20, 30, 50];
      setSuggestion({
        baseline: median,
        spread: iqr,
        absSuggestion: Number(absSuggestion).toFixed(4),
        relOptions,
      });
    } catch (e) {
      console.error(e);
      setSuggestion(null);
    }
  }

  // ---------- runSimulation ----------
  // simulate over last 30 days with sliding windows of duration (hours)
  async function runSimulation({ campaign_id, metricKey, op, thresh, durationHours }) {
    if (!campaign_id || !metricKey) {
      setMsg({ type: "error", text: "Campaign and metric required for simulation" });
      return;
    }
    setSimulating(true);
    setSimulationResult(null);

    try {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("metrics")
        .select("ts,impressions,clicks,spend")
        .eq("campaign_id", campaign_id)
        .gte("ts", since)
        .order("ts", { ascending: true });

      if (error) {
        console.error("simulation fetch error:", error);
        setMsg({ type: "error", text: "Failed to fetch metrics for simulation" });
        setSimulating(false);
        return;
      }
      // build series: sorted ascending, each entry {ts(ms), value, metricKey}
      const rows = (data || []).map((r) => {
        const ts = new Date(r.ts).getTime();
        return { ts, value: metricValueFromRow(r, metricKey), metricKey };
      });

      const sim = slidingWindowsDetect(rows, durationHours, op, thresh);
      // sample up to 20 matches for UI readability
      const sample = sim.matches.slice(0, 20);

      setSimulationResult({
        totalWindows: sim.windowsChecked,
        expectedAlerts: sim.matches.length,
        sample,
      });
    } catch (e) {
      console.error(e);
      setSimulationResult(null);
    } finally {
      setSimulating(false);
    }
  }

  // ---------- addOrUpdateTrigger ----------
  const validateForm = () => {
    if (!campaignId) return "Choose a campaign";
    if (!metric) return "Choose a metric";
    if (!operator) return "Choose an operator";
    if (threshold === "" || threshold === null) return "Threshold required";
    if (Number.isNaN(Number(threshold))) return "Threshold must be numeric";
    if (!duration || Number(duration) < 1) return "Duration must be >= 1 hour";
    return null;
  };

  async function addOrUpdateTrigger() {
    const v = validateForm();
    if (v) {
      setMsg({ type: "error", text: v });
      return;
    }
    setLoading(true);
    try {
      // convert relative mode to absolute threshold if needed
      let t = Number(threshold);
      if (mode === "relative" && suggestion) {
        // interpret threshold as percent drop; baseline * (1 - p/100)
        t = Math.max(0, suggestion.baseline * (1 - Number(threshold) / 100));
      }

      const payload = {
        campaign_id: campaignId,
        metric,
        operator,
        threshold: t,
        duration_hours: Number(duration),
        name: name || null,
        active,
        // we keep severity and customMessage as UI-only for now; store in triggers table if desired
      };

      if (editingId) {
        const { error } = await supabase.from("triggers").update(payload).eq("id", editingId);
        if (error) throw error;
        setMsg({ type: "success", text: "Trigger updated" });
      } else {
        const { error } = await supabase.from("triggers").insert([payload]);
        if (error) throw error;
        setMsg({ type: "success", text: "Trigger created" });
      }
      // reset + reload
      resetForm();
      await loadTriggers();
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: "Failed to save trigger" });
    } finally {
      setLoading(false);
    }
  }

  // ---------- editTrigger ----------
  function editTrigger(trigger) {
    setEditingId(trigger.id);
    setCampaignId(String(trigger.campaign_id));
    setMetric(trigger.metric);
    setMode("absolute");
    setOperator(trigger.operator);
    setThreshold(String(trigger.threshold));
    setDuration(trigger.duration_hours || 1);
    setSeverity(trigger.severity || "info");
    setSuppressionHours(trigger.suppression_hours || 0);
    setName(trigger.name || "");
    setCustomMessage(trigger.custom_message || "");
    setActive(Boolean(trigger.active));
    setMsg(null);
    // compute suggestion for campaign/metric
    computeSuggestionForCampaign(String(trigger.campaign_id), trigger.metric);
  }

  // ---------- deleteTrigger ----------
  async function deleteTrigger(triggerId) {
    const ok = confirm("Delete this trigger? This action cannot be undone.");
    if (!ok) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("triggers").delete().eq("id", triggerId);
      if (error) throw error;
      setMsg({ type: "success", text: "Trigger deleted" });
      if (editingId === triggerId) resetForm();
      await loadTriggers();
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: "Failed to delete trigger" });
    } finally {
      setLoading(false);
    }
  }

  // ---------- toggleActive ----------
  async function toggleActive(trigger) {
    setLoading(true);
    try {
      const { error } = await supabase.from("triggers").update({ active: !trigger.active }).eq("id", trigger.id);
      if (error) throw error;
      setMsg({ type: "success", text: trigger.active ? "Paused" : "Resumed" });
      await loadTriggers();
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: "Failed to toggle trigger" });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setCampaignId(campaigns.length > 0 ? campaigns[0].id : "");
    setMetric("");
    setMode("absolute");
    setOperator("<");
    setThreshold("");
    setDuration(3);
    setSeverity("info");
    setSuppressionHours(0);
    setName("");
    setCustomMessage("");
    setActive(true);
    setSuggestion(null);
    setMsg(null);
    setSimulationResult(null);
  }

  // ---------- render ----------
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-normal text-gray-900">Triggers</h1>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">BETA</span>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl">
            Create rules to monitor CTR drops, spend overshoots, CPM spikes, or ROAS dips. Test with simulation before going live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">{editingId ? "Edit trigger" : "Create trigger"}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className={`text-xs font-medium ${active ? "text-green-700" : "text-gray-500"}`}>{active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {msg?.text && (
                  <div className={`text-sm px-3 py-2 rounded-md border ${msg.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                    {msg.text}
                  </div>
                )}

                {/* Campaign */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Campaign</Label>
                  <Select value={campaignId} onValueChange={(v) => setCampaignId(String(v))}>
                    <SelectTrigger className="h-9 border-gray-200">
                      <SelectValue placeholder={campaigns.length ? "Choose campaign" : "No campaigns found"} />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200">
                      {campaigns.length === 0 ? (
                        <SelectItem value="">No campaigns</SelectItem>
                      ) : (
                        campaigns.map((c) => (
                          <SelectItem key={c.id} value={c.id} className="text-sm">{c.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Metric + Mode */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Metric</Label>
                    <Select value={metric} onValueChange={setMetric}>
                      <SelectTrigger className="h-9 border-gray-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200">
                        <SelectItem value="CTR">CTR</SelectItem>
                        <SelectItem value="Spend">Spend</SelectItem>
                        <SelectItem value="CPM">CPM</SelectItem>
                        <SelectItem value="ROAS">ROAS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Mode</Label>
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger className="h-9 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200">
                        <SelectItem value="absolute">Absolute</SelectItem>
                        <SelectItem value="relative">Relative %</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Threshold + Duration */}
                <div className="grid grid-cols-5 gap-3 items-end">
                  <div className="col-span-1 space-y-2">
                    <Label className="text-sm font-medium text-gray-900">When</Label>
                    <Select value={operator} onValueChange={setOperator}>
                      <SelectTrigger className="h-9 border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200">
                        <SelectItem value="<">Below</SelectItem>
                        <SelectItem value=">">Above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Threshold</Label>
                    <Input
                      value={threshold}
                      onChange={(e) => setThreshold(e.target.value)}
                      placeholder={mode === "relative" ? "30" : "1.2"}
                      className="h-9 border-gray-200"
                      inputMode="decimal"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Duration</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value || "1"))}
                        className="h-9 border-gray-200"
                      />
                      <span className="text-xs text-gray-500">hours</span>
                    </div>
                  </div>
                </div>

                {/* Effective threshold for relative mode */}
                {mode === "relative" && suggestion?.baseline != null && (
                  <div className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                    Effective threshold: {fmt(Math.max(0, suggestion.baseline * (1 - Number(threshold || 0) / 100)))}
                  </div>
                )}

                {/* Smart suggestions */}
                {suggestion && (
                  <div className="bg-blue-50/50 rounded-lg border border-blue-200/50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-blue-900">Smart suggestions</span>
                    </div>

                    <div className="text-xs text-blue-800 space-y-1">
                      <div>7-day baseline: <strong>{fmt(suggestion.baseline)}</strong></div>
                      <div>Variance (IQR): <strong>{fmt(suggestion.spread)}</strong></div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {mode === "absolute" ? (
                        <button onClick={() => setThreshold(String(suggestion.absSuggestion))} className="text-xs px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded hover:bg-blue-50 transition-colors">Use {suggestion.absSuggestion}</button>
                      ) : (
                        suggestion.relOptions.map((o) => (
                          <button key={o} onClick={() => setThreshold(String(o))} className="text-xs px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded hover:bg-blue-50 transition-colors">{o}% drop</button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                {/* advanced */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Advanced settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Severity</Label>
                      <Select value={severity} onValueChange={setSeverity}>
                        <SelectTrigger className="h-9 border-gray-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="border-gray-200">
                          <SelectItem value="info"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Info</div></SelectItem>
                          <SelectItem value="warning"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Warning</div></SelectItem>
                          <SelectItem value="critical"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Critical</div></SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Cooldown</Label>
                      <div className="flex items-center gap-1">
                        <Input type="number" min="0" value={suppressionHours} onChange={(e) => setSuppressionHours(parseInt(e.target.value || "0"))} className="h-9 border-gray-200" />
                        <span className="text-xs text-gray-500">hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Rule name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional descriptive name" className="h-9 border-gray-200" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Custom message</Label>
                    <Input value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} placeholder="Optional context for alerts" className="h-9 border-gray-200" />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Enable trigger</Label>
                      <p className="text-xs text-gray-500 mt-1">Automatically send alerts when conditions are met</p>
                    </div>
                    <Switch checked={active} onCheckedChange={setActive} className="data-[state=checked]:bg-blue-600" />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button onClick={addOrUpdateTrigger} disabled={loading} className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm">
                    {editingId ? "Save changes" : "Create trigger"}
                  </Button>

                  <Button variant="outline" onClick={() => { resetForm(); setMsg(null); }} className="h-9 px-4 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50">Reset</Button>

                  <Button variant="outline" onClick={async () => {
                    if (!campaignId || threshold === "") return setMsg({ type: "error", text: "Campaign and threshold required" });
                    let t = Number(threshold);
                    if (mode === "relative" && suggestion) {
                      t = Math.max(0, suggestion.baseline * (1 - Number(threshold) / 100));
                    }
                    await runSimulation({ campaign_id: campaignId, metricKey: metric, op: operator, thresh: t, durationHours: duration });
                  }} disabled={simulating} className="h-9 px-4 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50">
                    {simulating ? "Simulating..." : "Test run"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Simulation results */}
            {(simulationResult || simulating) && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-medium text-gray-900">Simulation (30 days)</h3>
                </div>

                <div className="p-6">
                  {simulating ? (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Running simulation...</span>
                    </div>
                  ) : simulationResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-normal text-gray-900">{simulationResult.totalWindows}</div>
                          <div className="text-xs text-gray-500">Windows checked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-normal text-gray-900">{simulationResult.expectedAlerts}</div>
                          <div className="text-xs text-gray-500">Expected alerts</div>
                        </div>
                      </div>

                      {simulationResult.sample.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-gray-900">Sample matches</div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {simulationResult.sample.map((s, idx) => (
                              <div key={idx} className="text-xs p-2 bg-gray-50 rounded border">
                                <div className="font-medium text-gray-900">{friendlyDate(s.window_start)} → {friendlyDate(s.window_end)}</div>
                                <div className="text-gray-600">Value: {fmt(s.value)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Triggers list */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Active triggers</h3>
                <span className="text-xs text-gray-500">{rows.length} total</span>
              </div>

              <div className="divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No triggers created yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first trigger using the form</p>
                  </div>
                ) : (
                  rows.map((r) => (
                    <div key={r.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{r.name || `${r.metric} ${r.operator} ${fmt(r.threshold)}`}</h4>

                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${r.severity === "critical" ? "bg-red-500" : r.severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`}></div>

                            {r.active ? (
                              <span className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded">LIVE</span>
                            ) : (
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">PAUSED</span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Condition: {r.metric} {r.operator} {fmt(r.threshold)} for {r.duration_hours}h {typeof r.suppression_hours === "number" && r.suppression_hours > 0 && `• ${r.suppression_hours}h cooldown`}</div>
                          <div className="flex items-center gap-4 text-gray-500">
                            <span>Alerts (30d): <strong>{alertStats[r.id]?.count || 0}</strong></span>
                            <span>Last: {friendlyDate(alertStats[r.id]?.last)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => editTrigger(r)} className="text-xs px-2 py-1 text-blue-700 hover:bg-blue-50 rounded transition-colors">Edit</button>
                        <button onClick={() => toggleActive(r)} className="text-xs px-2 py-1 text-gray-700 hover:bg-gray-100 rounded transition-colors">{r.active ? "Pause" : "Resume"}</button>
                        <button onClick={() => deleteTrigger(r.id)} className="text-xs px-2 py-1 text-red-700 hover:bg-red-50 rounded transition-colors">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pro tips */}
            <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Pro tips</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex gap-2"><span className="text-gray-400">•</span><span>Test rules with simulation before activating to avoid noise</span></div>
                <div className="flex gap-2"><span className="text-gray-400">•</span><span>Low-volume campaigns work better with longer windows (6-24h) and relative thresholds</span></div>
                <div className="flex gap-2"><span className="text-gray-400">•</span><span>Set cooldowns (4+ hours) to prevent alert storms during incidents</span></div>
                <div className="flex gap-2"><span className="text-gray-400">•</span><span>Review and adjust thresholds weekly based on performance data</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
