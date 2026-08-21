import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function exportTokensCsv() {
  const { data, error } = await supabase.from('tokens').select('token').order('token');
  if (error) {
    console.error('Error fetching tokens:', error);
    return;
  }
  
  let csv = 'Token,Student Name\n';
  data.forEach(row => {
    csv += `${row.token},\n`;
  });
  
  fs.writeFileSync('students_login_codes.csv', csv);
  console.log(`Generated students_login_codes.csv with ${data.length} tokens.`);
}

exportTokensCsv().catch(console.error);
