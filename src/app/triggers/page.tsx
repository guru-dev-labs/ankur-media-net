"use client";

import DocumentationNav from "../../components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState, useCallback } from "react";

type Trigger = {
  id: string;
  campaign_id: string;
  metric: string;
  operator: string;
  threshold: number;
  duration_hours: number;
  name?: string;
  active: boolean;
  created_at: string;
};

export default function Page() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<string>("");
  const [operator, setOperator] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  const fetchTriggers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("triggers")
      .select(
        "id, campaign_id, metric, operator, threshold, duration_hours, name, active, created_at"
      );
    if (error) {
      setError(error.message);
    } else {
      setTriggers((data as Trigger[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTriggers();
  }, [fetchTriggers]);

  async function handleAddTrigger(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError(null);
    // For MVP, campaign_id is required. Use a placeholder or let user select in future.
    // This should be replaced with a campaign selector in a real application.
    const campaign_id = "c8a3c5a3-3b7c-4a4a-8f6d-1e2b3c4d5e6f";
    const { error: insertError } = await supabase.from("triggers").insert({
      campaign_id,
      metric,
      operator,
      threshold,
      duration_hours: duration,
      name,
      active: true,
    });
    if (insertError) {
      setError(insertError.message);
    } else {
      setMetric("");
      setOperator("");
      setThreshold(0);
      setDuration(1);
      setName("");
      await fetchTriggers();
    }
    setAdding(false);
  }

  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">Triggers</h1>
        <form className="mb-6" onSubmit={handleAddTrigger}>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Metric (e.g. CTR, Spend)"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            >
              <option value="">Operator</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
            </select>
            <input
              type="number"
              placeholder="Threshold"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="border px-2 py-1 rounded"
              required
            />
            <input
              type="number"
              placeholder="Duration (hours)"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border px-2 py-1 rounded"
              min={1}
              required
            />
            <input
              type="text"
              placeholder="Rule Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Trigger"}
            </button>
          </div>
        </form>
        {loading ? (
          <p>Loading triggers...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : triggers.length === 0 ? (
          <p>No triggers found.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Metric</th>
                <th className="px-2 py-1 border">Operator</th>
                <th className="px-2 py-1 border">Threshold</th>
                <th className="px-2 py-1 border">Duration</th>
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Active</th>
                <th className="px-2 py-1 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((t) => (
                <tr key={t.id}>
                  <td className="px-2 py-1 border">{t.metric}</td>
                  <td className="px-2 py-1 border">{t.operator}</td>
                  <td className="px-2 py-1 border">{t.threshold}</td>
                  <td className="px-2 py-1 border">{t.duration_hours}</td>
                  <td className="px-2 py-1 border">{t.name}</td>
                  <td className="px-2 py-1 border">
                    {t.active ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-1 border">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
