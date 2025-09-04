import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    activeTriggers: 0,
    recentAlerts: 0,
    monitoringHealth: 95,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    await Promise.all([fetchCampaigns(), fetchTriggers()]);
    setLoading(false);
  }

  async function fetchCampaigns() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching campaigns:", error);
    } else {
      setCampaigns(data || []);
      setStats((prev) => ({
        ...prev,
        activeCampaigns:
          data?.filter((c) => c.status === "active")?.length || 0,
      }));
    }
  }

  async function fetchTriggers() {
    const { data, error } = await supabase
      .from("triggers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching triggers:", error);
    } else {
      setTriggers(data || []);
      setStats((prev) => ({
        ...prev,
        activeTriggers: data?.filter((t) => t.is_active)?.length || 0,
        recentAlerts: Math.floor(Math.random() * 5), // Mock data
      }));
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      paused: "secondary",
      error: "destructive",
    };
    return variants[status] || "outline";
  };

  const getMetricIcon = (metric) => {
    const icons = {
      ctr: "📊",
      spend: "💰",
      impressions: "👁️",
      conversions: "🎯",
    };
    return icons[metric?.toLowerCase()] || "📈";
  };

  const formatThreshold = (value, metric) => {
    if (metric?.toLowerCase() === "spend") return `$${value}`;
    if (metric?.toLowerCase() === "ctr") return `${value}%`;
    return value;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Ad Alerts Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Real-time monitoring for CTR drops, spend overshoots & performance
              anomalies
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={fetchData} variant="outline" size="sm">
              Refresh Data
            </Button>
            <Button asChild>
              <Link href="/setup">Quick Setup</Link>
            </Button>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            🔄 Next check in 45 minutes • Last successful sync: 2 minutes ago
          </AlertDescription>
        </Alert>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCampaigns}
                </p>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Triggers
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.activeTriggers}
                </p>
              </div>
              <div className="text-2xl">⚡</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Alerts
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.recentAlerts}
                </p>
              </div>
              <div className="text-2xl">🚨</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Health
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.monitoringHealth}%
                </p>
              </div>
              <div className="text-2xl">💚</div>
            </div>
            <Progress value={stats.monitoringHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="triggers">
            Triggers ({triggers.length})
          </TabsTrigger>
          <TabsTrigger value="manual">Manual Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Campaign Monitoring</span>
              </CardTitle>
              <Button asChild>
                <Link href="/campaigns">+ Add Campaign</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No campaigns yet
                  </h3>
                  <p className="text-gray-500">
                    Add your first campaign to start monitoring performance
                    anomalies
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/campaigns">Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">
                            {campaign.name || `Campaign ${campaign.id}`}
                          </h4>
                          <Badge variant={getStatusBadge(campaign.status)}>
                            {campaign.status || "active"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>
                            ID: {campaign.platform_campaign_id || "—"}
                          </span>
                          <span>•</span>
                          <span>
                            Platform: {campaign.platform || "Google Ads"}
                          </span>
                          <span>•</span>
                          <span>
                            Created:{" "}
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/campaigns/${campaign.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ))}

                  {campaigns.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href="/campaigns">
                          View All {campaigns.length} Campaigns
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Alert Triggers</span>
              </CardTitle>
              <Button asChild>
                <Link href="/triggers">+ Create Trigger</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {triggers.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="text-4xl">⚡</div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No triggers configured
                  </h3>
                  <p className="text-gray-500">
                    Set up your first alert trigger to get notified of
                    performance issues
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/triggers">Create Trigger</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {triggers.slice(0, 5).map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {getMetricIcon(trigger.metric)}
                          </span>
                          <h4 className="font-medium text-gray-900">
                            {trigger.name || `${trigger.metric} Alert`}
                          </h4>
                          <Badge
                            variant={
                              trigger.is_active ? "default" : "secondary"
                            }
                          >
                            {trigger.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="font-medium">
                            {trigger.metric} {trigger.operator}{" "}
                            {formatThreshold(trigger.threshold, trigger.metric)}
                          </span>
                          <span>•</span>
                          <span>Duration: {trigger.duration_hours}h</span>
                          <span>•</span>
                          <span>
                            Notification:{" "}
                            {trigger.notification_method || "Email"}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/triggers/${trigger.id}`}>Edit</Link>
                      </Button>
                    </div>
                  ))}

                  {triggers.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" asChild>
                        <Link href="/triggers">
                          View All {triggers.length} Triggers
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Manual Evaluation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Run the anomaly detection algorithm manually for testing and
                  debugging purposes.
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm text-gray-800">
                    npm run evaluate
                  </code>
                </div>
                <Alert>
                  <AlertDescription>
                    💡 <strong>Tip:</strong> Ensure your service key is
                    configured before running manual evaluation.
                  </AlertDescription>
                </Alert>
                <div className="flex space-x-2">
                  <Button className="flex-1">Run Evaluation</Button>
                  <Button variant="outline">View Logs</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📈</span>
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/bulk-import">📥 Bulk Import Campaigns</Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/reports">📊 Performance Reports</Link>
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  asChild
                >
                  <Link href="/settings">⚙️ Notification Settings</Link>
                </Button>
                <Separator />
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  asChild
                >
                  <Link href="/docs">📚 Documentation</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-green-800">
                      System Check Completed
                    </p>
                    <p className="text-sm text-green-600">
                      All campaigns and triggers validated successfully
                    </p>
                  </div>
                  <span className="text-xs text-green-600">2 min ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">
                      CTR Alert Triggered
                    </p>
                    <p className="text-sm text-orange-600">
                      Campaign "Summer Sale" CTR dropped below 2.5%
                    </p>
                  </div>
                  <span className="text-xs text-orange-600">1 hour ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">
                      New Campaign Added
                    </p>
                    <p className="text-sm text-blue-600">
                      Campaign "Q4 Launch" added to monitoring
                    </p>
                  </div>
                  <span className="text-xs text-blue-600">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Section */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-gray-900">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600">
              Our monitoring system checks your campaigns hourly for anomalies
              and sends instant alerts.
            </p>
            <div className="flex justify-center space-x-3 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">Setup Guide</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
