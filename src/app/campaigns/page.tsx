"use client";

import DocumentationNav from "../../components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState, useCallback } from "react";

type Campaign = {
  id: string;
  name: string;
  platform_campaign_id?: string;
  created_at: string;
};

export default function Page() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [platformId, setPlatformId] = useState<string>("");
  const [adding, setAdding] = useState<boolean>(false);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, name, platform_campaign_id, created_at");
    if (error) {
      setError(error.message);
    } else {
      setCampaigns((data as Campaign[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleAddCampaign(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("campaigns")
      .insert({ name, platform_campaign_id: platformId });
    if (insertError) {
      setError(insertError.message);
    } else {
      setName("");
      setPlatformId("");
      await fetchCampaigns();
    }
    setAdding(false);
  }

  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
        <form className="mb-6" onSubmit={handleAddCampaign}>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
            <input
              type="text"
              placeholder="Platform Campaign ID"
              value={platformId}
              onChange={(e) => setPlatformId(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded"
              disabled={adding}
            >
              {adding ? "Adding..." : "Add Campaign"}
            </button>
          </div>
        </form>
        {loading ? (
          <p>Loading campaigns...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : campaigns.length === 0 ? (
          <p>No campaigns found.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Name</th>
                <th className="px-2 py-1 border">Platform ID</th>
                <th className="px-2 py-1 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className="px-2 py-1 border">{c.name}</td>
                  <td className="px-2 py-1 border">{c.platform_campaign_id}</td>
                  <td className="px-2 py-1 border">
                    {new Date(c.created_at).toLocaleString()}
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
