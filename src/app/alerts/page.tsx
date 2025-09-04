"use client";

import DocumentationNav from "../../components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

type Alert = {
  id: string;
  trigger_id: string;
  campaign_id: string;
  metric: string;
  value: number;
  message: string;
  notified: boolean;
  created_at: string;
};

export default function Page() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("alerts")
        .select(
          "id, trigger_id, campaign_id, metric, value, message, notified, created_at"
        );
      if (error) setError(error.message);
      setAlerts((data as Alert[]) || []);
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  return (
    <main>
      <DocumentationNav />
      <section className="p-8">
        <h1 className="text-2xl font-bold mb-4">Alerts</h1>
        {loading ? (
          <p>Loading alerts...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : alerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Metric</th>
                <th className="px-2 py-1 border">Value</th>
                <th className="px-2 py-1 border">Message</th>
                <th className="px-2 py-1 border">Notified</th>
                <th className="px-2 py-1 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id}>
                  <td className="px-2 py-1 border">{a.metric}</td>
                  <td className="px-2 py-1 border">{a.value}</td>
                  <td className="px-2 py-1 border">{a.message}</td>
                  <td className="px-2 py-1 border">
                    {a.notified ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-1 border">
                    {new Date(a.created_at).toLocaleString()}
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
