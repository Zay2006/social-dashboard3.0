"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/utils";

interface PlatformData {
  id: number;
  name: string;
  icon: string;
  color: string;
  followers: number;
  growth: number;
}

interface PerformanceData {
  platform_id: number;
  platform_name: string;
  platform_color: string;
  date: string;
  engagement_rate: number;
  growth_rate: number;
}

export function PlatformComparison() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<"followers" | "engagement" | "growth">("followers");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch platform stats
        const platformResponse = await fetch("/api/stats/platform");
        if (!platformResponse.ok) {
          throw new Error("Failed to fetch platform data");
        }
        const platformData = await platformResponse.json();
        setPlatforms(platformData);
        
        // Fetch performance data
        const performanceResponse = await fetch("/api/stats/performance");
        if (!performanceResponse.ok) {
          throw new Error("Failed to fetch performance data");
        }
        const performanceData = await performanceResponse.json();
        
        // Get the most recent performance data for each platform
        const latestPerformance = performanceData.reduce((acc: PerformanceData[], curr: PerformanceData) => {
          const existingPlatform = acc.findIndex(item => item.platform_id === curr.platform_id);
          
          if (existingPlatform === -1) {
            acc.push(curr);
          } else if (new Date(curr.date) > new Date(acc[existingPlatform].date)) {
            acc[existingPlatform] = curr;
          }
          
          return acc;
        }, []);
        
        setPerformance(latestPerformance);
      } catch (err) {
        console.error("Error fetching platform comparison data:", err);
        setError("Failed to load platform comparison data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Prepare chart data based on selected metric
  const chartData = platforms.map(platform => {
    const performanceData = performance.find(p => p.platform_id === platform.id);
    
    return {
      name: platform.name,
      color: platform.color,
      followers: platform.followers,
      engagement: performanceData?.engagement_rate || 0,
      growth: platform.growth,
    };
  });

  const getMetricLabel = () => {
    switch (metric) {
      case "followers":
        return "Followers";
      case "engagement":
        return "Engagement Rate (%)";
      case "growth":
        return "Growth Rate (%)";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error</h3>
                <div className="mt-2 text-sm text-destructive/80">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Platform Comparison</CardTitle>
        <div className="flex items-center space-x-2">
          <select
            className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={metric}
            onChange={(e) => setMetric(e.target.value as "followers" | "engagement" | "growth")}
          >
            <option value="followers">Followers</option>
            <option value="engagement">Engagement Rate</option>
            <option value="growth">Growth Rate</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ 
                    value: getMetricLabel(), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                  tickFormatter={(value) => 
                    metric === "followers" ? formatNumber(value) : `${value}%`
                  }
                />
                <Tooltip
                  formatter={(value) => 
                    metric === "followers" ? [formatNumber(value as number), "Followers"] : [`${value}%`, getMetricLabel()]
                  }
                />
                <Legend />
                <Bar 
                  dataKey={metric} 
                  name={getMetricLabel()}
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No platform data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
