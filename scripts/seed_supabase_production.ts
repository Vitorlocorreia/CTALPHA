import { createClient } from '@supabase/supabase-js';
import { INITIAL_EXERCISE_LIBRARY } from '../src/data/exerciseLibraryData';
import { INITIAL_WORKOUT_TEMPLATES, INITIAL_STUDENTS, SAMPLE_WORKOUT_ROUTINES } from '../src/data/mockData';

const supabaseUrl = 'https://nswuxzfskvtlvshzaivc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zd3V4emZza3Z0bHZzaHphaXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTQxNjMsImV4cCI6MjEwMzI5MDE2M30.1BWGyFaCJYgJJuYCQw2XPbSFfOdVQgswBxyLA8VNUkc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedProduction() {
  console.log('Seeding Supabase Production Database...');

  // 1. Seed Exercise Library
  console.log(`Upserting ${INITIAL_EXERCISE_LIBRARY.length} exercises...`);
  const mappedExercises = INITIAL_EXERCISE_LIBRARY.map(ex => ({
    id: ex.id,
    name: ex.name,
    alternate_name: ex.alternateName || null,
    primary_muscle: ex.primaryMuscle,
    secondary_muscles: ex.secondaryMuscles || [],
    equipment: ex.equipment,
    movement_pattern: ex.movementPattern || 'isolado',
    level: ex.level || 'intermediario',
    modality: ex.modality || 'musculacao',
    instructions: ex.instructions || '',
    observations: ex.observations || '',
    video_url: ex.videoUrl || null,
    image_url: ex.imageUrl || null,
    video_thumb: ex.videoThumb || null,
    contraindications: ex.contraindications || [],
    tags: ex.tags || [],
    author_coach: ex.authorCoach || 'Coach Diego',
    created_at: new Date().toISOString()
  }));

  const { error: errEx } = await supabase.from('exercise_library').upsert(mappedExercises, { onConflict: 'id' });
  if (errEx) {
    console.error('Error seeding exercise_library:', errEx);
  } else {
    console.log('✓ exercise_library seeded successfully in Supabase!');
  }

  // 2. Seed Workout Templates
  console.log(`Upserting ${INITIAL_WORKOUT_TEMPLATES.length} templates...`);
  const mappedTemplates = INITIAL_WORKOUT_TEMPLATES.map(tpl => ({
    id: tpl.id,
    name: tpl.name,
    description: tpl.description,
    goal: tpl.goal,
    level: tpl.level,
    frequency_days: tpl.frequencyDays,
    division_name: tpl.divisionName,
    target_biotype: tpl.targetBiotype || 'todos',
    restrictions_safe: tpl.restrictionsSafe || [],
    coach_author: tpl.coachAuthor || 'Coach Diego',
    groups: tpl.groups,
    usage_count: tpl.usageCount || 0,
    created_at: new Date().toISOString()
  }));

  const { error: errTpl } = await supabase.from('workout_templates').upsert(mappedTemplates, { onConflict: 'id' });
  if (errTpl) {
    console.error('Error seeding workout_templates:', errTpl);
  } else {
    console.log('✓ workout_templates seeded successfully in Supabase!');
  }

  // 3. Update Students with Bioimpedance
  console.log(`Updating ${INITIAL_STUDENTS.length} students with bioimpedance and metrics...`);
  for (const s of INITIAL_STUDENTS) {
    const { error: errStd } = await supabase.from('students').upsert({
      id: s.id,
      name: s.name,
      cpf: s.cpf,
      phone: s.phone,
      email: s.email,
      avatar: s.avatar,
      unit: s.unit,
      plan_name: s.planName,
      plan_value: s.planValue,
      payment_status: s.paymentStatus,
      due_date: s.dueDate,
      days_late: s.daysLate || 0,
      modalities: s.modalities,
      biotype: s.biotype || 'mesomorfo',
      goal: s.goal || 'hipertrofia',
      height: s.height || 175,
      weight: s.weight || 75,
      restrictions: s.restrictions || [],
      bioimpedance: s.bioimpedance || {},
      source: s.source || 'CT ALPHA'
    }, { onConflict: 'id' });

    if (errStd) console.error(`Error updating student ${s.name}:`, errStd);
  }
  console.log('✓ Students with Bioimpedance updated in Supabase!');

  // 4. Seed Workout Routines
  console.log(`Upserting workout routines...`);
  const mappedRoutines = SAMPLE_WORKOUT_ROUTINES.map(r => ({
    id: r.id,
    student_id: r.studentId,
    student_name: r.studentName,
    division_name: r.divisionName,
    coach_name: r.coachName,
    biotype: r.biotype,
    goal: r.goal,
    status: r.status,
    groups: r.groups,
    approved_at: r.approvedAt || null,
    created_at: new Date().toISOString()
  }));

  const { error: errRoutines } = await supabase.from('workout_routines').upsert(mappedRoutines, { onConflict: 'id' });
  if (errRoutines) {
    console.error('Error seeding workout_routines:', errRoutines);
  } else {
    console.log('✓ workout_routines seeded in Supabase!');
  }

  console.log('--- ALL SUPABASE PRODUCTION TABLES SYNCHRONIZED ---');
}

seedProduction();
