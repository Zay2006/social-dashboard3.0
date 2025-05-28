import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface KpiData {
  id: number;
  name: string;
  value: number;
  previous_value: number;
  date: string;
  growth_percentage: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]; // Default to today

    // Get latest KPIs
    const kpisQuery = `
      SELECT 
        id,
        name,
        value,
        previous_value,
        date,
        CASE 
          WHEN previous_value = 0 THEN 0
          ELSE ((value - previous_value) / previous_value) * 100
        END as growth_percentage
      FROM 
        dashboard_kpis
      WHERE 
        date = $1
      ORDER BY 
        name
    `;

    const kpisData = await query<KpiData>(kpisQuery, [date]);

    // If no KPIs found for the requested date, get the most recent ones
    if (kpisData.length === 0) {
      const latestKpisQuery = `
        SELECT 
          id,
          name,
          value,
          previous_value,
          date,
          CASE 
            WHEN previous_value = 0 THEN 0
            ELSE ((value - previous_value) / previous_value) * 100
          END as growth_percentage
        FROM 
          dashboard_kpis
        WHERE 
          date = (SELECT MAX(date) FROM dashboard_kpis)
        ORDER BY 
          name
      `;

      const latestKpisData = await query<KpiData>(latestKpisQuery);
      
      // Ensure the data is serializable by converting to plain objects
      const serializedData = latestKpisData.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        previous_value: item.previous_value,
        date: item.date,
        growth_percentage: item.growth_percentage
      }));
      
      return NextResponse.json(serializedData);
    }

    // Ensure the data is serializable by converting to plain objects
    const serializedData = kpisData.map(item => ({
      id: item.id,
      name: item.name,
      value: item.value,
      previous_value: item.previous_value,
      date: item.date,
      growth_percentage: item.growth_percentage
    }));
    
    return NextResponse.json(serializedData);
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard KPIs' },
      { status: 500 }
    );
  }
}
