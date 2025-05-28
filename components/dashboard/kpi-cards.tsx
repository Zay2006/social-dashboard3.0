"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage, getGrowthColor } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface KPI {
  id: number;
  name: string;
  value: number;
  previous_value: number;
  growth_percentage: number;
}

export function KpiCards() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        setLoading(true);
        const response = await fetch("/api/stats/kpis");
        
        if (!response.ok) {
          throw new Error("Failed to fetch KPI data");
        }
        
        const data = await response.json();
        setKpis(data);
      } catch (err) {
        console.error("Error fetching KPIs:", err);
        setError("Failed to load KPI data");
      } finally {
        setLoading(false);
      }
    }

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium animate-pulse bg-muted h-4 w-32 rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-pulse bg-muted h-8 w-24 rounded"></div>
              <p className="text-xs text-muted-foreground animate-pulse bg-muted h-4 w-32 mt-2 rounded"></p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">Error</h3>
            <div className="mt-2 text-sm text-destructive/80">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default KPIs if none are found in the database
  const defaultKpis = [
    { id: 1, name: "Total Followers", value: 0, previous_value: 0, growth_percentage: 0 },
    { id: 2, name: "Engagement Rate", value: 0, previous_value: 0, growth_percentage: 0 },
    { id: 3, name: "Total Reach", value: 0, previous_value: 0, growth_percentage: 0 },
    { id: 4, name: "Growth Rate", value: 0, previous_value: 0, growth_percentage: 0 },
  ];

  // Use KPIs from database or default KPIs if none are found
  const displayKpis = kpis.length > 0 ? kpis : defaultKpis;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {displayKpis.map((kpi) => (
        <Card key={kpi.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(kpi.value)}</div>
            <p className="text-xs flex items-center gap-1">
              <span className={getGrowthColor(kpi.growth_percentage)}>
                {kpi.growth_percentage > 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : kpi.growth_percentage < 0 ? (
                  <ArrowDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {formatPercentage(kpi.growth_percentage)}
              </span>
              <span className="text-muted-foreground">since last period</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
