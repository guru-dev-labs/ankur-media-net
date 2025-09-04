import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
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
import { Switch } from "@/components/ui/switch";

export default function Campaigns() {
  const [name, setName] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [platform, setPlatform] = useState("google_ads");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("active");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRows(data || []);
    } catch {
      setError("Failed to load campaigns: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!name.trim()) {
      setError("Campaign name is required");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const campaignData = {
        name: name.trim(),
        platform_campaign_id: platformId.trim() || null,
        platform,
        budget: budget ? parseFloat(budget) : null,
        status,
      };

      const { error } = await supabase.from("campaigns").insert([campaignData]);

      if (error) throw error;

      // Reset form
      setName("");
      setPlatformId("");
      setBudget("");
      setPlatform("google_ads");
      setStatus("active");
      setSuccess("Campaign added successfully!");

      // Reload data
      await load();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add campaign: " + err.message);
    } finally {
      setAdding(false);
    }
  }

  async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      await load();
    } catch (err) {
      setError("Failed to update campaign status");
    }
  }

  const filteredCampaigns = rows.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      campaign.platform_campaign_id
        ?.toLowerCase()
        .includes(searchFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      active: { variant: "default", color: "bg-green-100 text-green-800" },
      paused: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      error: { variant: "destructive", color: "bg-red-100 text-red-800" },
    };
    return (
      variants[status] || {
        variant: "outline",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      google_ads: "🔍",
      facebook_ads: "📘",
      microsoft_ads: "Ⓜ️",
      linkedin_ads: "💼",
      twitter_ads: "🐦",
    };
    return icons[platform] || "📊";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">← Back to Dashboard</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Campaign Management
          </h1>
          <p className="text-gray-600 mt-1">
            Add and manage your advertising campaigns for anomaly monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Campaigns</div>
          <div className="text-2xl font-bold text-gray-900">{rows.length}</div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ✅ {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Add Campaign Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>➕</span>
            <span>Add New Campaign</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Summer Sale 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-id">Platform Campaign ID</Label>
              <Input
                id="platform-id"
                placeholder="e.g., 12345678"
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Advertising Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_ads">🔍 Google Ads</SelectItem>
                  <SelectItem value="facebook_ads">📘 Facebook Ads</SelectItem>
                  <SelectItem value="microsoft_ads">
                    Ⓜ️ Microsoft Ads
                  </SelectItem>
                  <SelectItem value="linkedin_ads">💼 LinkedIn Ads</SelectItem>
                  <SelectItem value="twitter_ads">🐦 Twitter Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Daily Budget (optional)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={status === "active"}
              onCheckedChange={(checked) =>
                setStatus(checked ? "active" : "paused")
              }
            />
            <Label>Start monitoring immediately</Label>
          </div>

          <Button
            onClick={add}
            disabled={adding || !name.trim()}
            className="w-full md:w-auto"
          >
            {adding ? "Adding Campaign..." : "Add Campaign"}
          </Button>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Your Campaigns ({filteredCampaigns.length})</span>
            </CardTitle>

            <div className="flex space-x-2">
              <Input
                placeholder="Search campaigns..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-48"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900">
                {rows.length === 0
                  ? "No campaigns yet"
                  : "No campaigns match your filters"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {rows.length === 0
                  ? "Start by adding your first advertising campaign to begin monitoring for performance anomalies."
                  : "Try adjusting your search terms or status filter to find the campaigns you're looking for."}
              </p>
              {rows.length === 0 && (
                <Button
                  onClick={() =>
                    document.getElementById("campaign-name")?.focus()
                  }
                >
                  Add Your First Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Platform ID</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {campaign.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{getPlatformIcon(campaign.platform)}</span>
                          <span className="capitalize">
                            {campaign.platform?.replace("_", " ") ||
                              "Google Ads"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {campaign.platform_campaign_id || "—"}
                        </code>
                      </TableCell>
                      <TableCell>
                        {campaign.budget ? `$${campaign.budget}/day` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(campaign.status).variant}
                          className={getStatusBadge(campaign.status).color}
                        >
                          {campaign.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleStatus(campaign.id, campaign.status)
                            }
                          >
                            {campaign.status === "active"
                              ? "Pause"
                              : "Activate"}
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/campaigns/${campaign.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {campaign.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span>{getPlatformIcon(campaign.platform)}</span>
                        <span className="text-sm text-gray-500 capitalize">
                          {campaign.platform?.replace("_", " ") || "Google Ads"}
                        </span>
                        <Badge
                          variant={getStatusBadge(campaign.status).variant}
                          className={getStatusBadge(campaign.status).color}
                        >
                          {campaign.status || "active"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Platform ID:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {campaign.platform_campaign_id || "—"}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span>
                        {campaign.budget ? `$${campaign.budget}/day` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(campaign.id, campaign.status)}
                      className="flex-1"
                    >
                      {campaign.status === "active" ? "Pause" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link href={`/campaigns/${campaign.id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bulk Actions */}
          {filteredCampaigns.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {filteredCampaigns.length} of {rows.length} campaigns
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {rows.filter((r) => r.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">Active Campaigns</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {rows.filter((r) => r.status === "paused").length}
              </div>
              <div className="text-sm text-gray-600">Paused Campaigns</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(rows.map((r) => r.platform)).size}
              </div>
              <div className="text-sm text-gray-600">Platforms</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                $
                {rows
                  .reduce((sum, r) => sum + (r.budget || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Daily Budget</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold">Platform Campaign ID</h4>
              <p>
                Use the unique ID from your ad platform for better tracking and
                integration.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Budget Monitoring</h4>
              <p>
                Set daily budgets to get alerts when spending exceeds your
                limits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
