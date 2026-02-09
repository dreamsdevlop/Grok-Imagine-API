
const { Pool } = require('pg');

const configs = [
    'postgresql://postgres.drygjewhgwoopqpjqtiy:ogQLs58aT2btlJGT@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    'postgresql://postgres.drygjewhgwoopqpjqtiy:ogQLs58aT2btlJGT@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
    'postgresql://postgres:ogQLs58aT2btlJGT@db.drygjewhgwoopqpjqtiy.supabase.co:5432/postgres'
];

async function test(connStr) {
    const pool = new Pool({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });
    console.log('Testing:', connStr.replace(/:[^:@]+@/, ':****@'));
    try {
        const client = await pool.connect();
        console.log('✅ Connected');
        client.release();
        return true;
    } catch (err) {
        console.error('❌ Failed:', err.message);
        return false;
    } finally {
        await pool.end();
    }
}

async function main() {
    for (const c of configs) {
        await test(c);
    }
}

main();
