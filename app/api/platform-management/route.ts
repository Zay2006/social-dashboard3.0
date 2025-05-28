import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/platform-management - Get all platforms
export async function GET() {
  try {
    const platformsQuery = `
      SELECT id, name, icon, color
      FROM platforms
      ORDER BY name
    `;
    
    const platforms = await query(platformsQuery);
    
    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}

// POST /api/platform-management - Add a new platform
export async function POST(request: NextRequest) {
  try {
    const { name, icon, color } = await request.json();
    
    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: 'Name, icon, and color are required' },
        { status: 400 }
      );
    }
    
    const insertQuery = `
      INSERT INTO platforms (name, icon, color)
      VALUES ($1, $2, $3)
      RETURNING id, name, icon, color
    `;
    
    const result = await query<{ id: number, name: string, icon: string, color: string }>(insertQuery, [name, icon, color]);
    
    // Add initial data for the new platform
    const platformId = result[0].id;
    
    // Add platform followers
    const followersQuery = `
      INSERT INTO platform_followers (platform_id, date, count)
      VALUES 
        ($1, CURRENT_DATE, 1000),
        ($1, (CURRENT_DATE - INTERVAL '30 days')::DATE, 900)
    `;
    
    await query(followersQuery, [platformId]);
    
    // Add engagement metrics
    const engagementQuery = `
      INSERT INTO engagement_metrics (platform_id, date, likes, comments, shares, clicks, impressions)
      VALUES
        ($1, CURRENT_DATE, 500, 100, 50, 800, 5000),
        ($1, (CURRENT_DATE - INTERVAL '30 days')::DATE, 450, 90, 45, 750, 4500)
    `;
    
    await query(engagementQuery, [platformId]);
    
    // Add platform performance
    const performanceQuery = `
      INSERT INTO platform_performance (platform_id, date, engagement_rate, growth_rate)
      VALUES
        ($1, CURRENT_DATE, 3.5, 10.0),
        ($1, (CURRENT_DATE - INTERVAL '30 days')::DATE, 3.2, 8.5)
    `;
    
    await query(performanceQuery, [platformId]);
    
    // Update KPIs
    const updateKpisQuery = `
      UPDATE dashboard_kpis 
      SET value = value + 1000,
          previous_value = previous_value + 900
      WHERE name = 'Total Followers' AND date = CURRENT_DATE
    `;
    
    await query(updateKpisQuery);
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error adding platform:', error);
    return NextResponse.json(
      { error: 'Failed to add platform' },
      { status: 500 }
    );
  }
}

// DELETE /api/platform-management - Delete a platform
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }
    
    // First, delete related data (cascade will handle this in the database, but we need to update KPIs)
    // Get the follower count to subtract from total KPIs
    const followerQuery = `
      SELECT SUM(count) as count 
      FROM platform_followers 
      WHERE platform_id = $1 AND date = CURRENT_DATE
    `;
    
    const followerResult = await query<{ count: number }>(followerQuery, [id]);
    const followerCount = followerResult[0]?.count || 0;
    
    // Get the previous follower count
    const prevFollowerQuery = `
      SELECT SUM(count) as count 
      FROM platform_followers 
      WHERE platform_id = $1 AND date = (CURRENT_DATE - INTERVAL '30 days')::DATE
    `;
    
    const prevFollowerResult = await query<{ count: number }>(prevFollowerQuery, [id]);
    const prevFollowerCount = prevFollowerResult[0]?.count || 0;
    
    // Update KPIs before deleting
    const updateKpisQuery = `
      UPDATE dashboard_kpis 
      SET value = value - $1,
          previous_value = previous_value - $2
      WHERE name = 'Total Followers' AND date = CURRENT_DATE
    `;
    
    await query(updateKpisQuery, [followerCount, prevFollowerCount]);
    
    // Delete the platform (cascade will handle related records)
    const deleteQuery = `DELETE FROM platforms WHERE id = $1 RETURNING *`;
    const result = await query<{ id: number, name: string }>(deleteQuery, [id]);
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Platform ${result[0].name} deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting platform:', error);
    return NextResponse.json(
      { error: 'Failed to delete platform' },
      { status: 500 }
    );
  }
}
