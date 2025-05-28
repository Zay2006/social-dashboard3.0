import { Pool, Client, PoolConfig } from 'pg';

// Custom error types for better error handling
class DatabaseConnectionError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

class DatabaseQueryError extends Error {
  constructor(message: string, public readonly query: string, public readonly params?: any[]) {
    super(message);
    this.name = 'DatabaseQueryError';
  }
}

// Define data interfaces
interface PlatformData {
  id: number;
  name: string;
  icon: string;
  color: string;
  followers: number;
  growth: number;
}

interface KpiData {
  id: number;
  name: string;
  value: number;
  previous_value: number;
  growth_percentage: number;
}

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

interface PerformanceData {
  platform_id: number;
  platform_name: string;
  platform_color: string;
  date: string;
  engagement_rate: number;
  growth_rate: number;
}

// Database configuration interface
interface DatabaseConfig extends PoolConfig {
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

// Create PostgreSQL connection pool with error handling
let pool: Pool;

try {
  // Log environment for debugging
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.DATABASE_URL) {
    console.error('⚠️ No DATABASE_URL provided. Database connection is required.');
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  // Log partial connection string for debugging (hide credentials)
  const connectionString = process.env.DATABASE_URL;
  const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log(`⚠️ Attempting to connect with: ${maskedUrl}`);
  
  // Always use SSL with rejectUnauthorized: false for Supabase connections
  pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  // Test the connection immediately
  pool.query('SELECT NOW()', []).then(() => {
    console.log('✅ Database pool created and connected successfully');
  }).catch(err => {
    console.error('❌ Database connection test failed:', err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  });
} catch (error) {
  console.error('❌ Error creating database pool:', error);
  throw new Error('Failed to initialize database connection');
}

// Function to execute database queries
export async function query<T>(queryText: string, params: any[] = []): Promise<T[]> {
  // Extract the table name from the query for better error handling
  const tableMatch = queryText.match(/FROM\s+(\w+)/i);
  const tableName = tableMatch ? tableMatch[1] : 'unknown';
  
  try {
    if (!process.env.DATABASE_URL) {
      throw new DatabaseConnectionError('DATABASE_URL is not defined');
    }
    
    const config: DatabaseConfig = {
      connectionString: process.env.DATABASE_URL,
      // Always use SSL with rejectUnauthorized: false for Supabase connections
      ssl: {
        rejectUnauthorized: false
      }
    };
    
    console.log('\n🔌 Attempting database connection...');
    const client = new Client(config);
    
    try {
      await client.connect();
      console.log('✅ Database connected successfully!');
      
      const result = await client.query(queryText, params);
      console.log(`✅ Query executed successfully, returned ${result.rows.length} rows`);
      await client.end();
      return result.rows as T[];
    } catch (error) {
      const dbError = error as Error;
      console.error(`❌ Database operation failed: ${dbError.message}`);
      await client.end().catch(() => {}); // Silently handle end errors
      throw new DatabaseQueryError(`Query execution failed: ${dbError.message}`, queryText, params);
    }
  } catch (error) {
    console.error('\n❌ DATABASE CONNECTION ERROR ❌');
    console.error('----------------------------');
    if (error instanceof DatabaseConnectionError) {
      console.error(error.message);
      if (error.originalError) console.error('Original error:', error.originalError);
    } else if (error instanceof DatabaseQueryError) {
      console.error(`Query error: ${error.message}`);
      console.error(`Query: ${error.query}`);
    } else {
      console.error(error instanceof Error ? error.message : String(error));
    }
    console.error('----------------------------');
    throw new Error(`Database query failed for table '${tableName}': ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Function to get a client from the pool
export async function getClient() {
  try {
    if (!pool.connect) {
      throw new Error('Database pool is not initialized');
    }
    
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error getting client:', error);
    throw new Error('Failed to get database client');
  }
}

// Function to check database connection
export async function checkConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not defined');
      return false;
    }
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Export the pool for direct use
export { pool };
