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

const INITIAL_FORM_STATE = {
  metric: "",
  operator: ">",
  threshold: 0,
  duration_hours: 1,
  name: "",
};

export default function Page() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Tracks which trigger is being updated/deleted to disable buttons
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  // We need a valid campaign to associate new triggers with.
  const [defaultCampaignId, setDefaultCampaignId] = useState<string | null>(
    null
  );

  // This function now loads both a valid campaign ID and the list of triggers.
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch a valid campaign ID to use for new triggers.
    const { data: campaignData, error: campaignError } = await supabase
      .from("campaigns")
      .select("id")
      .limit(1)
      .single();

    if (campaignError || !campaignData) {
      setError(
        "Could not find a valid campaign. Please create a campaign before adding triggers."
      );
      setLoading(false);
      return;
    }
    setDefaultCampaignId(campaignData.id);

    // 2. Fetch existing triggers.
    const { data: triggersData, error: triggersError } = await supabase
      .from("triggers")
      .select(
        "id, campaign_id, metric, operator, threshold, duration_hours, name, active, created_at"
      )
      .order("created_at", { ascending: false });

    if (triggersError) {
      setError(triggersError.message);
    } else {
      setTriggers((triggersData as Trigger[]) || []);
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

    // For MVP, campaign_id is required. Use a placeholder or let user select in future.
    if (!defaultCampaignId) {
      setError("Cannot add trigger: No valid campaign ID is available.");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("triggers").insert({
      campaign_id: defaultCampaignId,
      ...formState,
      active: true,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setFormState(INITIAL_FORM_STATE); // Reset form
      // Re-fetch triggers to show the new one at the top of the list.
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
      // Optimistically update UI by removing the trigger from state
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
      .match({ id })
      .select()
      .single(); // .single() ensures we get the updated row back

    if (updateError) {
      setError(updateError.message);
    } else if (data) {
      // Optimistically update UI with the new status
      setTriggers((prevTriggers) =>
        prevTriggers.map((t) => (t.id === id ? data : t))
      );
    }
    setActionInProgress(null);
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]:
        name === "threshold" || name === "duration_hours"
          ? Number(value)
          : value,
    }));
  };

  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">Triggers</h1>
        <div className="prose prose-stone max-w-none mb-6">
          <p>
            Triggers are automated rules that monitor your campaign metrics.
            When a metric crosses a specified threshold for a certain duration,
            an action can be initiated (e.g., sending a notification, pausing a
            campaign). This helps you manage your campaigns proactively.
          </p>
        </div>

        <fieldset className="border p-4 rounded-md mb-8">
          <legend className="text-lg font-semibold px-2">
            Add New Trigger
          </legend>
          <form
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end"
            onSubmit={handleAddTrigger}
          >
            <div className="flex flex-col">
              <label htmlFor="metric" className="text-sm font-medium mb-1">
                Metric
              </label>
              <input
                id="metric"
                name="metric"
                type="text"
                placeholder="e.g. CTR, Spend"
                value={formState.metric}
                onChange={handleFormChange}
                className="border px-2 py-1.5 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="operator" className="text-sm font-medium mb-1">
                Operator
              </label>
              <select
                id="operator"
                name="operator"
                value={formState.operator}
                onChange={handleFormChange}
                className="border px-2 py-1.5 rounded-md shadow-sm"
                required
              >
                <option value=">">&gt; (Greater Than)</option>
                <option value="<">&lt; (Less Than)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="threshold" className="text-sm font-medium mb-1">
                Threshold
              </label>
              <input
                id="threshold"
                name="threshold"
                type="number"
                placeholder="e.g. 0.5"
                value={formState.threshold}
                onChange={handleFormChange}
                className="border px-2 py-1.5 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="duration_hours"
                className="text-sm font-medium mb-1"
              >
                Duration (hrs)
              </label>
              <input
                id="duration_hours"
                name="duration_hours"
                type="number"
                placeholder="e.g. 24"
                value={formState.duration_hours}
                onChange={handleFormChange}
                className="border px-2 py-1.5 rounded-md shadow-sm"
                min={1}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium mb-1">
                Rule Name (Optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. High Spend Alert"
                value={formState.name}
                onChange={handleFormChange}
                className="border px-2 py-1.5 rounded-md shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Trigger"}
              </button>
            </div>
          </form>
        </fieldset>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {loading ? (
          <p>Loading triggers...</p>
        ) : triggers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No triggers found. Add one using the form above to get started.
          </p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300 shadow-sm">
            <thead className="bg-gray-50">
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Condition
                </th>
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Duration
                </th>
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {triggers.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {t.name || <span className="text-gray-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3 border font-mono">{`${t.metric} ${t.operator} ${t.threshold}`}</td>
                  <td className="px-4 py-3 border">{t.duration_hours} hours</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 border text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(t.id, t.active)}
                        disabled={actionInProgress === `toggle-${t.id}`}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          t.active
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } disabled:bg-gray-400`}
                      >
                        {actionInProgress === `toggle-${t.id}`
                          ? "..."
                          : t.active
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteTrigger(t.id)}
                        disabled={actionInProgress === `delete-${t.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:bg-gray-400"
                      >
                        {actionInProgress === `delete-${t.id}`
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
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
