import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function cleanup() {
  console.log('Cleaning up codex_transactions...');
  await supabase.from('codex_transactions').delete().neq('id', 'dummy'); // delete all (neq dummy id which doesn't exist)

  console.log('Cleaning up attendance_records...');
  await supabase.from('attendance_records').delete().neq('id', 'dummy');

  console.log('Cleaning up students...');
  await supabase.from('students').delete().neq('id', 'dummy');

  console.log('Cleaning up tokens...');
  await supabase.from('tokens').delete().neq('token', 'dummy');

  console.log('Generating 100 new 6-digit tokens...');
  const newTokens = [];
  const tokenSet = new Set();
  
  while (tokenSet.size < 100) {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (!tokenSet.has(randomCode)) {
      tokenSet.add(randomCode);
      newTokens.push({
        token: randomCode,
        is_onboarded: false,
        created_at: new Date().toISOString().split('T')[0],
        assigned_grade: 'Grade 10',
        student_name: null
      });
    }
  }

  console.log('Inserting 100 tokens...');
  const { error } = await supabase.from('tokens').insert(newTokens);
  if (error) {
    console.error('Error inserting tokens:', error);
  } else {
    console.log('Successfully inserted 100 fresh 6-digit tokens!');
  }
}

cleanup().catch(console.error);
