import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface PlatformData {
  id: number;
  name: string;
  icon: string;
  color: string;
  followers: number;
  previous_followers: number;
  growth?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platformId = searchParams.get('platform');

    let platformQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.icon, 
        p.color, 
        pf.count as followers,
        COALESCE(
          (SELECT count FROM platform_followers pf2 
           WHERE pf2.platform_id = p.id AND pf2.date < pf.date 
           ORDER BY pf2.date DESC LIMIT 1), 
          0
        ) as previous_followers
      FROM 
        platforms p
      LEFT JOIN 
        (SELECT DISTINCT ON (platform_id) 
          platform_id, count, date
         FROM platform_followers
         ORDER BY platform_id, date DESC) pf ON p.id = pf.platform_id
    `;

    const params: any[] = [];

    if (platformId) {
      platformQuery += ' WHERE p.id = $1';
      params.push(platformId);
    }

    platformQuery += ' ORDER BY p.name';

    const platforms = await query<PlatformData>(platformQuery, params);

    // Calculate growth percentages
    const platformsWithGrowth = platforms.map(platform => {
      const growth = platform.previous_followers > 0 
        ? ((platform.followers - platform.previous_followers) / platform.previous_followers) * 100 
        : 0;
      
      return {
        ...platform,
        growth: parseFloat(growth.toFixed(2))
      };
    });

    return NextResponse.json(platformsWithGrowth);
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    );
  }
}
