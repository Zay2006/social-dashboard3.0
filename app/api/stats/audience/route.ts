import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get('platform');
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]; // Default to today

    let audienceQuery = `
      SELECT 
        ar.platform_id,
        p.name as platform_name,
        p.color as platform_color,
        ar.date,
        ar.reach
      FROM 
        audience_reach ar
      JOIN 
        platforms p ON ar.platform_id = p.id
      WHERE 
        ar.date BETWEEN $1 AND $2
    `;

    const params: any[] = [startDate, endDate];

    if (platformId) {
      audienceQuery += ' AND ar.platform_id = $3';
      params.push(platformId);
    }

    audienceQuery += ' ORDER BY ar.date, p.name';

    const result = await query(audienceQuery, params);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching audience reach data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audience reach data' },
      { status: 500 }
    );
  }
}
