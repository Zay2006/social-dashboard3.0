import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface PerformanceData {
  platform_id: number;
  platform_name: string;
  platform_color: string;
  date: string;
  engagement_rate: number;
  growth_rate: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get('platform');
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]; // Default to today

    let performanceQuery = `
      SELECT 
        pp.platform_id,
        p.name as platform_name,
        p.color as platform_color,
        pp.date,
        pp.engagement_rate,
        pp.growth_rate
      FROM 
        platform_performance pp
      JOIN 
        platforms p ON pp.platform_id = p.id
      WHERE 
        pp.date BETWEEN $1 AND $2
    `;

    const params: any[] = [startDate, endDate];

    if (platformId) {
      performanceQuery += ' AND pp.platform_id = $3';
      params.push(platformId);
    }

    performanceQuery += ' ORDER BY pp.date, p.name';

    const performanceData = await query<PerformanceData>(performanceQuery, params);
    
    // Ensure the data is serializable by converting to plain objects
    const serializedData = performanceData.map(item => ({
      platform_id: item.platform_id,
      platform_name: item.platform_name,
      platform_color: item.platform_color,
      date: item.date,
      engagement_rate: item.engagement_rate,
      growth_rate: item.growth_rate
    }));

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Error fetching platform performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform performance data' },
      { status: 500 }
    );
  }
}
