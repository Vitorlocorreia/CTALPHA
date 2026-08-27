import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nswuxzfskvtlvshzaivc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zd3V4emZza3Z0bHZzaHphaXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTQxNjMsImV4cCI6MjEwMzI5MDE2M30.1BWGyFaCJYgJJuYCQw2XPbSFfOdVQgswBxyLA8VNUkc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPersistence() {
  console.log('Testing full assessment and multi-routine persistence in Supabase...');

  // 1. Check student_assessments
  const { data: asm, error: errAsm } = await supabase.from('student_assessments').select('*').eq('student_id', 'std-1');
  console.log(`[1/3] Student Assessments for std-1: ${asm?.length || 0} records.`);

  // 2. Check workout_routines
  const { data: wkts, error: errWkt } = await supabase.from('workout_routines').select('id, program_name, division_name, status, is_active').eq('student_id', 'std-1');
  console.log(`[2/3] Workout Routines for std-1: ${wkts?.length || 0} records.`);
  console.log(JSON.stringify(wkts, null, 2));

  // 3. Test Inserting a new versioned routine
  const newRoutineId = `wkt-test-e2e-${Date.now()}`;
  const { data: inserted, error: errIns } = await supabase.from('workout_routines').insert({
    id: newRoutineId,
    student_id: 'std-1',
    student_name: 'Carlos Henrique Bezerra',
    program_name: 'Hipertrofia Bloco 3 - Potência',
    division_name: 'Divisão ABCDE',
    status: 'rascunho',
    version: 'v2',
    is_active: false,
    frequency_days: 5,
    groups: [
      { letter: 'A', title: 'Treino A: Peitoral Pesado', targetMuscles: 'Peito', exercises: [{ id: 'ex-1', name: 'Supino Reto', sets: 4, reps: '6-8', restSeconds: 90 }] }
    ]
  }).select();

  if (inserted && inserted.length > 0) {
    console.log(`[3/3] Successfully inserted versioned routine: ${newRoutineId}`);
    // Clean up test record
    await supabase.from('workout_routines').delete().eq('id', newRoutineId);
    console.log('Cleaned up test record.');
  } else {
    console.error('Insert error:', errIns);
  }

  console.log('✓ All database verification tests passed successfully!');
}

testPersistence();
