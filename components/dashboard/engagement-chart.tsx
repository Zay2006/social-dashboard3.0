"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EngagementData {
  platform_id: number;
  platform_name: string;
  platform_color: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  total_engagement: number;
}

export function EngagementChart() {
  const [data, setData] = useState<EngagementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("30"); // Default to 30 days

  useEffect(() => {
    async function fetchEngagementData() {
      try {
        setLoading(true);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeframe));
        
        const response = await fetch(
          `/api/stats/engagement?startDate=${startDate.toISOString().split("T")[0]}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch engagement data");
        }
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error("Error fetching engagement data:", err);
        setError("Failed to load engagement data");
      } finally {
        setLoading(false);
      }
    }

    fetchEngagementData();
  }, [timeframe]);

  // Define a proper type with index signature for chart data
  interface ChartDataEntry {
    date: string;
    [key: string]: string | number; // Allow any string key with number or string value
  }

  // Process data for the chart
  const processedData = data.reduce((acc: ChartDataEntry[], curr) => {
    const existingDate = acc.find((item) => item.date === curr.date);
    
    if (existingDate) {
      existingDate[curr.platform_name] = curr.total_engagement;
    } else {
      const newEntry: ChartDataEntry = { date: curr.date };
      newEntry[curr.platform_name] = curr.total_engagement;
      acc.push(newEntry);
    }
    
    return acc;
  }, []);

  // Get unique platform names for the chart lines
  const platformSet = new Set(data.map((item) => item.platform_name));
  const platforms = Array.from(platformSet);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Engagement Metrics</CardTitle>
        <div className="flex items-center space-x-2">
          <select
            className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {processedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {platforms.map((platform, index) => {
                  const platformColor = data.find(
                    (item) => item.platform_name === platform
                  )?.platform_color;
                  
                  return (
                    <Line
                      key={platform}
                      type="monotone"
                      dataKey={platform}
                      stroke={platformColor || `hsl(${index * 40}, 70%, 50%)`}
                      activeDot={{ r: 8 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No engagement data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
