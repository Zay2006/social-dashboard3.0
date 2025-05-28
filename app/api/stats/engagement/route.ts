import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface EngagementData {
  platform_id: number;
  platform_name: string;
  platform_color: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  impressions: number;
  total_engagement: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get('platform');
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]; // Default to today

    let engagementQuery = `
      SELECT 
        em.platform_id,
        p.name as platform_name,
        p.color as platform_color,
        em.date,
        em.likes,
        em.comments,
        em.shares,
        em.clicks,
        em.impressions,
        (em.likes + em.comments + em.shares) as total_engagement
      FROM 
        engagement_metrics em
      JOIN 
        platforms p ON em.platform_id = p.id
      WHERE 
        em.date BETWEEN $1 AND $2
    `;

    const params: any[] = [startDate, endDate];

    if (platformId) {
      engagementQuery += ' AND em.platform_id = $3';
      params.push(platformId);
    }

    engagementQuery += ' ORDER BY em.date, p.name';

    const engagementData = await query<EngagementData>(engagementQuery, params);
    
    // Ensure the data is serializable by converting to plain objects
    const serializedData = engagementData.map(item => ({
      platform_id: item.platform_id,
      platform_name: item.platform_name,
      platform_color: item.platform_color,
      date: item.date,
      likes: item.likes,
      comments: item.comments,
      shares: item.shares,
      clicks: item.clicks,
      impressions: item.impressions,
      total_engagement: item.total_engagement
    }));

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement metrics' },
      { status: 500 }
    );
  }
}
