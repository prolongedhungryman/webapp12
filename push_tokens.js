import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushTokens() {
  try {
    const csvPath = path.resolve(__dirname, 'students_login_codes.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    // Skip header line
    const tokens = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      const token = parts[0]?.trim();
      if (token) {
        tokens.push({
          token: token,
          is_onboarded: false,
          created_at: new Date().toISOString().split('T')[0],
          assigned_grade: 'Grade 10', // Default
          student_name: null
        });
      }
    }

    console.log(`Found ${tokens.length} tokens to insert.`);

    // Insert in chunks of 50
    for (let i = 0; i < tokens.length; i += 50) {
      const chunk = tokens.slice(i, i + 50);
      const { data, error } = await supabase.from('tokens').upsert(chunk, { onConflict: 'token' });
      if (error) {
        console.error('Error inserting chunk:', error);
      } else {
        console.log(`Inserted chunk ${i / 50 + 1}`);
      }
    }
    console.log('Finished pushing tokens.');
  } catch (err) {
    console.error('Error reading/pushing tokens:', err);
  }
}

pushTokens();
