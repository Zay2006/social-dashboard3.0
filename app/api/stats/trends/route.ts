import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]; // Default to today

    const trendsQuery = `
      SELECT 
        date,
        total_engagement,
        total_followers,
        total_posts
      FROM 
        overall_trends
      WHERE 
        date BETWEEN $1 AND $2
      ORDER BY 
        date
    `;

    const result = await query(trendsQuery, [startDate, endDate]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching overall trends data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overall trends data' },
      { status: 500 }
    );
  }
}
