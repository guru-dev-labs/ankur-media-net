"use client";

import DocumentationNav from "@/components/DocumentationNav";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { AlertCircle, BellRing, CheckCircle, XCircle } from "lucide-react";

type AlertLog = {
  id: string;
  metric: string;
  value: number;
  message: string;
  notified: boolean;
  created_at: string;
  campaigns: { name: string } | null;
  triggers: { name: string | null } | null;
};

const LoadingSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 px-6">
    <BellRing className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">No alerts yet</h3>
    <p className="mt-1 text-sm text-gray-500">
      When a trigger{"'"}s conditions are met, alerts will appear here.
    </p>
  </div>
);

export default function Page() {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("alerts")
        .select("*, campaigns(name), triggers(name)")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setAlerts((data as AlertLog[]) || []);
      }
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  const formatValue = (value: number, metric: string) => {
    if (!metric) return value;
    const lowerMetric = metric.toLowerCase();
    if (lowerMetric.includes("spend") || lowerMetric.includes("cpm")) {
      return `$${value.toFixed(2)}`;
    }
    if (lowerMetric.includes("ctr")) {
      return `${value.toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Alerts Log
          </h1>
          <p className="text-lg text-gray-600">
            A chronological record of all triggered alerts from your active
            rules.
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
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Showing the most recent {alerts.length} alerts triggered by your
              monitoring rules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : alerts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign & Rule</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Notified</TableHead>
                      <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          <div className="font-medium">
                            {a.campaigns?.name || "Unknown Campaign"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {a.triggers?.name || "Untitled Rule"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">
                            {a.metric}: {formatValue(a.value, a.metric)}
                          </code>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                          {a.message}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={a.notified ? "default" : "secondary"}
                            className={
                              a.notified
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {a.notified ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {a.notified ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {new Date(a.created_at).toLocaleString()}
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
