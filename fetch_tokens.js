import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchTokens() {
  const { data, error } = await supabase.from('tokens').select('token').order('token');
  if (error) {
    console.error('Error fetching tokens:', error);
    return;
  }
  
  let markdown = '# Student Login Codes\n\n| Token |\n| --- |\n';
  data.forEach(row => {
    markdown += `| ${row.token} |\n`;
  });
  
  fs.writeFileSync('tokens_list.md', markdown);
  console.log('Tokens saved to tokens_list.md');
}

fetchTokens().catch(console.error);
