"use client";
import DocumentationNav from "../../components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState, useCallback } from "react";

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
  // This property comes from the Supabase JOIN
  campaigns: { name: string } | null;
};

const INITIAL_FORM_STATE = {
  campaign_id: "",
  metric: "",
  operator: ">",
  threshold: 0,
  duration_hours: 1,
  name: "",
};

export default function Page() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Tracks which trigger is being updated/deleted to disable buttons
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // This function now loads all campaigns and the list of triggers.
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch all available campaigns to populate the dropdown.
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

    // If campaigns exist, pre-select the first one in the form.
    if (fetchedCampaigns.length > 0) {
      setFormState((prevState) => ({
        ...prevState,
        campaign_id: prevState.campaign_id || fetchedCampaigns[0].id,
      }));
    }

    // 2. Fetch existing triggers and join the campaign name for display.
    const { data: triggersData, error: triggersError } = await supabase
      .from("triggers")
      .select(
        "id, campaign_id, metric, operator, threshold, duration_hours, name, active, created_at, campaigns(name)"
      )
      .order("created_at", { ascending: false });

    if (triggersError) {
      setError(`Failed to load triggers: ${triggersError.message}`);
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

    // The campaign_id is now part of the form state and is required.
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
      // Reset form, but keep the first campaign selected for convenience.
      setFormState({
        ...INITIAL_FORM_STATE,
        campaign_id: campaigns[0]?.id || "",
      });
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
        name === "campaign_id"
          ? value
          : name === "threshold" || name === "duration_hours"
          ? Number(value)
          : value,
    }));
  };

  return (
    <main className="flex-1 p-8">
      <DocumentationNav />
      <section className="p-8"></section>
      <h1 className="text-2xl font-bold mb-4">Triggers</h1>
      <div className="prose prose-stone max-w-none mb-6">
        <p>
          Triggers are automated rules that monitor your campaign metrics. When
          a metric crosses a specified threshold for a certain duration, an
          action can be initiated (e.g., sending a notification, pausing a
          campaign). This helps you manage your campaigns proactively.
        </p>
      </div>

      <fieldset
        className="border p-4 rounded-md mb-8 disabled:opacity-60"
        disabled={isSubmitting || loading}
      >
        <legend className="text-lg font-semibold px-2">Add New Trigger</legend>
        {campaigns.length === 0 && !loading && (
          <div className="text-center text-yellow-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            You must create a campaign before you can add a trigger.
          </div>
        )}
        <form
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end mt-4"
          onSubmit={handleAddTrigger}
        >
          <div className="flex flex-col">
            <label htmlFor="campaign_id" className="text-sm font-medium mb-1">
              Campaign
            </label>
            <select
              id="campaign_id"
              name="campaign_id"
              value={formState.campaign_id}
              onChange={handleFormChange}
              className="border px-2 py-1.5 rounded-md shadow-sm"
              required
              disabled={campaigns.length === 0}
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
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
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 w-full"
              disabled={isSubmitting || campaigns.length === 0}
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
                Campaign
              </th>
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
                <td className="px-4 py-3 border font-medium">
                  {t.campaigns?.name || (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </td>
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
                      {actionInProgress === `delete-${t.id}` ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
