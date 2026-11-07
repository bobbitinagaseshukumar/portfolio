import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const { Client } = pg;

async function runMigration() {
  const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || process.argv[2];
  if (!password) {
    console.error('❌ Usage: node backend/scripts/migrate_supabase.js <YOUR_SUPABASE_DB_PASSWORD>');
    process.exit(1);
  }

  const host = 'aws-0-ap-northeast-2.pooler.supabase.com';
  console.log(`🔍 Resolving IPv4 for ${host}...`);
  let ip = host;
  try {
    const ips = await resolver.resolve4(host);
    if (ips && ips.length > 0) {
      ip = ips[0];
      console.log(`✅ Resolved ${host} -> ${ip}`);
    }
  } catch (err) {
    console.warn(`⚠️ DNS resolution fallback to hostname directly: ${err.message}`);
  }

  const client = new Client({
    user: 'postgres.hwxfrbxpbvpsuzdhlbtn',
    password: password,
    host: ip,
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false, servername: host },
    connectionTimeoutMillis: 10000
  });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully to Supabase!');

    const schemaPath = path.resolve(__dirname, '../../database/00_complete_boxed_schema.sql');
    console.log(`📖 Reading schema file: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🚀 Executing SQL schema to create all tables, indexes, and RLS policies...');
    await client.query(sql);

    console.log('🎉 SUCCESS: All 13 tables created and initialized in Supabase!');
    
    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('📋 Verified Tables in public schema:');
    res.rows.forEach((r, idx) => console.log(`   ${idx + 1}. ${r.table_name}`));

    await client.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

runMigration();
