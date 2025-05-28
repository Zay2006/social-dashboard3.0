import { KpiCards } from '@/components/dashboard/kpi-cards';
import { PlatformStats } from '@/components/dashboard/platform-stats';
import { EngagementChart } from '@/components/dashboard/engagement-chart';
import { PlatformComparison } from '@/components/dashboard/platform-comparison';
import { MainLayout } from '@/components/layout/main-layout';

export default function Home() {
  return (
    <MainLayout>
      {/* KPI Cards */}
      <KpiCards />
      
      {/* Platform Stats */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Platform Overview</h2>
        <PlatformStats />
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Platform Comparison Chart */}
        <PlatformComparison />
        
        {/* Engagement Chart */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <EngagementChart />
        </div>
      </div>
    </MainLayout>
  );
}
