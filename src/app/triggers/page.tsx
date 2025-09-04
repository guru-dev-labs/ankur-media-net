"use client";

import DocumentationNav from "@/components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, List, AlertCircle, Zap, Loader2 } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
};

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
  campaigns: { name: string } | null;
};

const INITIAL_FORM_STATE = {
  campaign_id: "",
  metric: "CTR",
  operator: ">",
  threshold: 0,
  duration_hours: 1,
  name: "",
};

const LoadingSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 px-6">
    <Zap className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">
      No triggers found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Create your first trigger to start monitoring campaign performance.
    </p>
  </div>
);

export default function Page() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: campaignData, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, name")
      .order("name", { ascending: true });

    if (campaignError) {
      setError(`Failed to load campaigns: ${campaignError.message}`);
      setLoading(false);
      return;
    }

    const fetchedCampaigns = campaignData || [];
    setCampaigns(fetchedCampaigns);

    if (fetchedCampaigns.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        campaign_id: prevState.campaign_id || fetchedCampaigns[0].id,
      }));
    }

    const { data: triggersData, error: triggersError } = await supabase
      .from("triggers")
      .select(
        "id, campaign_id, metric, operator, threshold, duration_hours, name, active, created_at, campaigns(name)"
      )
      .order("created_at", { ascending: false });

    if (triggersError) {
      setError(`Failed to load triggers: ${triggersError.message}`);
    } else {
      // Map triggersData to ensure campaigns property matches Trigger type
      const mappedTriggers = (triggersData || []).map((trigger: unknown) => {
        const t = trigger as Trigger & {
          campaigns: { name: string }[] | { name: string } | null;
        };
        return {
          ...t,
          campaigns:
            t.campaigns && Array.isArray(t.campaigns)
              ? t.campaigns[0] || null
              : t.campaigns || null,
        };
      });
      setTriggers(mappedTriggers);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function handleAddTrigger(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formState.campaign_id) {
      setError("Please select a campaign.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("triggers").insert({
      ...formState,
      active: true,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setFormState({
        ...INITIAL_FORM_STATE,
        campaign_id: campaigns[0]?.id || "",
      });
      await loadInitialData();
    }
    setIsSubmitting(false);
  }

  async function handleDeleteTrigger(id: string) {
    if (!window.confirm("Are you sure you want to delete this trigger?")) {
      return;
    }
    setActionInProgress(`delete-${id}`);
    setError(null);

    const { error: deleteError } = await supabase
      .from("triggers")
      .delete()
      .match({ id });

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setTriggers((prevTriggers) => prevTriggers.filter((t) => t.id !== id));
    }
    setActionInProgress(null);
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    setActionInProgress(`toggle-${id}`);
    setError(null);

    const { data, error: updateError } = await supabase
      .from("triggers")
      .update({ active: !currentStatus })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      // Must re-fetch campaign name as it's not returned on update
      const updatedTrigger = {
        ...data,
        campaigns: triggers.find((t) => t.id === id)?.campaigns || null,
      };
      setTriggers((prevTriggers) =>
        prevTriggers.map((t) => (t.id === id ? updatedTrigger : t))
      );
    }
    setActionInProgress(null);
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        name === "threshold" || name === "duration_hours"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Trigger Management
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage automated rules to proactively monitor your
            campaign performance.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <PlusCircle size={20} />
              Add New Trigger
            </CardTitle>
            <CardDescription>
              Define a condition that, when met, will generate an alert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 && !loading && (
              <Alert
                variant="default"
                className="bg-yellow-50 border-yellow-200 text-yellow-800"
              >
                <AlertCircle className="h-4 w-4 !text-yellow-700" />
                <AlertTitle>No Campaigns Found</AlertTitle>
                <AlertDescription>
                  You must create a campaign before you can add a trigger.
                </AlertDescription>
              </Alert>
            )}
            <form className="mt-4" onSubmit={handleAddTrigger}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div className="space-y-2">
                  <Label htmlFor="campaign_id">Campaign</Label>
                  <Select
                    name="campaign_id"
                    required
                    value={formState.campaign_id}
                    onValueChange={(value) =>
                      handleSelectChange("campaign_id", value)
                    }
                    disabled={campaigns.length === 0}
                  >
                    <SelectTrigger id="campaign_id">
                      <SelectValue placeholder="Select a campaign..." />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric</Label>
                  <Input
                    id="metric"
                    name="metric"
                    type="text"
                    placeholder="e.g. CTR, Spend"
                    value={formState.metric}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator">Condition</Label>
                  <div className="flex gap-2">
                    <Select
                      name="operator"
                      required
                      value={formState.operator}
                      onValueChange={(value) =>
                        handleSelectChange("operator", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">Greater Than (&gt;)</SelectItem>
                        <SelectItem value="<">Less Than (&lt;)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="threshold"
                      name="threshold"
                      type="number"
                      placeholder="Value"
                      value={formState.threshold}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duration (hrs)</Label>
                  <Input
                    id="duration_hours"
                    name="duration_hours"
                    type="number"
                    placeholder="e.g. 24"
                    value={formState.duration_hours}
                    onChange={handleFormChange}
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name (Optional)</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. High Spend Alert"
                    value={formState.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2 self-end">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || campaigns.length === 0}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Adding..." : "Add Trigger"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <List size={20} />
              Your Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : triggers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {triggers.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Badge
                            variant={t.active ? "default" : "secondary"}
                            className={
                              t.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {t.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {t.campaigns?.name || (
                              <span className="text-gray-400">Unknown</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {t.name || "Untitled Rule"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{`${t.metric} ${t.operator} ${t.threshold}`}</code>{" "}
                          for {t.duration_hours}h
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleActive(t.id, t.active)}
                              disabled={actionInProgress === `toggle-${t.id}`}
                            >
                              {actionInProgress === `toggle-${t.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : t.active ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteTrigger(t.id)}
                              disabled={actionInProgress === `delete-${t.id}`}
                            >
                              {actionInProgress === `delete-${t.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
