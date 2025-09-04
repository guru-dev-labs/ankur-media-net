"use client";

import DocumentationNav from "../../components/DocumentationNav";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, List, AlertCircle, Target, Loader2 } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  platform_campaign_id?: string;
  created_at: string;
};

// Skeleton component for loading state
const LoadingSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12 px-6">
    <Target className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">
      No campaigns found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by adding your first campaign to monitor.
    </p>
  </div>
);

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
      .select("id, name, platform_campaign_id, created_at")
      .order("created_at", { ascending: false });

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
    if (!name.trim()) {
      setError("Campaign name is required.");
      return;
    }
    setAdding(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("campaigns")
      .insert({ name, platform_campaign_id: platformId || null });
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
    <main className="bg-slate-50 min-h-screen">
      <DocumentationNav />
      <section className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Campaign Management
          </h1>
          <p className="text-lg text-gray-600">
            Add and manage your advertising campaigns for anomaly monitoring.
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
              Add New Campaign
            </CardTitle>
            <CardDescription>
              Enter the details of a new campaign you want to monitor. The name
              is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    type="text"
                    placeholder="e.g., Summer Sale 2024"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform-id">
                    Platform Campaign ID (Optional)
                  </Label>
                  <Input
                    id="platform-id"
                    type="text"
                    placeholder="e.g., 1234567890"
                    value={platformId}
                    onChange={(e) => setPlatformId(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={adding}>
                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {adding ? "Adding..." : "Add Campaign"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <List size={20} />
              Your Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSkeleton />
            ) : campaigns.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Platform ID</TableHead>
                      <TableHead className="text-right">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">
                          {c.platform_campaign_id || "N/A"}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {new Date(c.created_at).toLocaleDateString()}
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
