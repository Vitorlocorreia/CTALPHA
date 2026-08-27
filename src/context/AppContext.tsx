import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UnitId, 
  UserRole, 
  Student, 
  WorkoutRoutine, 
  WorkoutTemplate, 
  ExerciseLibraryItem, 
  CheckInLog, 
  Lead, 
  FinancialMetric, 
  Biotype, 
  Goal, 
  Exercise, 
  StudentAssessment 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_CHECKINS, 
  INITIAL_LEADS, 
  SAMPLE_WORKOUT_ROUTINES, 
  INITIAL_WORKOUT_TEMPLATES, 
  FINANCIAL_DATA,
  INITIAL_STUDENT_ASSESSMENTS 
} from '../data/mockData';
import { INITIAL_EXERCISE_LIBRARY } from '../data/exerciseLibraryData';
import { supabase } from '@/lib/supabase';

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedUnit: UnitId;
  setSelectedUnit: (unit: UnitId) => void;
  students: Student[];
  checkIns: CheckInLog[];
  leads: Lead[];
  workouts: WorkoutRoutine[];
  financial: FinancialMetric;
  studentAssessments: StudentAssessment[];
  getStudentAssessments: (studentId: string) => StudentAssessment[];
  getLatestStudentAssessment: (studentId: string) => StudentAssessment | undefined;
  saveStudentAssessment: (assessment: StudentAssessment) => Promise<void>;
  migrationCompleted: boolean;
  migrationProgress: number;
  isMigrating: boolean;
  supabaseConnected: boolean;
  startMigration: () => void;
  generateWorkoutForStudent: (params: {
    studentId: string;
    biotype: Biotype;
    goal: Goal;
    restrictions: string[];
    daysPerWeek: number;
  }) => WorkoutRoutine;
  approveWorkout: (workoutId: string) => void;
  performCheckIn: (studentId: string, modality: 'musculacao' | 'crossfit' | 'luta') => { success: boolean; message: string; status: 'liberado' | 'aviso' | 'bloqueado' };
  sendWhatsAppBilling: (studentId: string) => { success: boolean; message: string; pixCode: string };
  addNewStudent: (studentData: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    unit: 'unidade-1' | 'unidade-2';
    planName: string;
    planValue: number;
    modalities: ('musculacao' | 'crossfit' | 'luta')[];
    biotype?: Biotype;
    goal?: Goal;
  }) => Promise<Student>;
  addLeadFromAI: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<void>;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  updateStudent: (studentId: string, updatedFields: Partial<Student>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notification: string | null;
  showNotification: (msg: string) => void;
  workoutTemplates: WorkoutTemplate[];
  addWorkoutTemplate: (tpl: WorkoutTemplate) => void;
  assignTemplateToStudent: (studentId: string, templateId: string) => void;
  exerciseLibrary: ExerciseLibraryItem[];
  addExerciseToLibrary: (item: ExerciseLibraryItem) => void;
  updateExerciseInLibrary: (id: string, updated: Partial<ExerciseLibraryItem>) => void;
  deleteExerciseFromLibrary: (id: string) => void;
  saveWorkoutRoutine: (routine: WorkoutRoutine) => Promise<void>;
  createWorkoutRoutine: (params: {
    studentId: string;
    programName: string;
    divisionName: string;
    goal?: string;
    frequencyDays?: number;
    durationWeeks?: number;
    coachName?: string;
    notes?: string;
  }) => Promise<WorkoutRoutine>;
  activateWorkoutRoutine: (routineId: string, studentId: string) => Promise<void>;
  archiveWorkoutRoutine: (routineId: string) => Promise<void>;
  deleteWorkoutRoutine: (routineId: string) => Promise<void>;
  duplicateWorkoutRoutine: (routineId: string) => Promise<WorkoutRoutine | undefined>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialView = queryParams?.get('view') || 'dashboard';
  const initialTheme = (queryParams?.get('theme') as 'light' | 'dark') || (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'light';

  const [currentView, setCurrentView] = useState<string>(initialView);
  const [userRole, setUserRole] = useState<UserRole>((queryParams?.get('role') as UserRole) || 'gestor');
  const [selectedUnit, setSelectedUnit] = useState<UnitId>('todas');
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState<string>(INITIAL_STUDENTS[0]?.id || 'std-1');
  const [checkIns, setCheckIns] = useState<CheckInLog[]>(INITIAL_CHECKINS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [workouts, setWorkouts] = useState<WorkoutRoutine[]>(SAMPLE_WORKOUT_ROUTINES);
  const [studentAssessments, setStudentAssessments] = useState<StudentAssessment[]>(INITIAL_STUDENT_ASSESSMENTS);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(INITIAL_WORKOUT_TEMPLATES);
  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseLibraryItem[]>(INITIAL_EXERCISE_LIBRARY);
  const [financial, setFinancial] = useState<FinancialMetric>(FINANCIAL_DATA);
  const [migrationCompleted, setMigrationCompleted] = useState<boolean>(false);
  const [migrationProgress, setMigrationProgress] = useState<number>(0);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync theme with HTML root element and localStorage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // ignore
      }
    }
  }, [theme]);

  // Sync with Supabase on mount
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch Students
        const { data: dbStudents, error: errStudents } = await supabase.from('students').select('*');
        if (!errStudents && dbStudents && dbStudents.length > 0) {
          const mappedStudents: Student[] = dbStudents.map(s => ({
            id: s.id,
            name: s.name,
            cpf: s.cpf,
            phone: s.phone,
            email: s.email || '',
            avatar: s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            unit: s.unit as any,
            modalities: (s.modalities || ['musculacao']) as any,
            planName: s.plan_name,
            planValue: Number(s.plan_value),
            paymentStatus: s.payment_status as any,
            dueDate: s.due_date,
            lastCheckIn: s.last_checkin,
            daysLate: s.days_late || 0,
            biotype: s.biotype as any,
            goal: s.goal as any,
            height: Number(s.height) || 175,
            weight: Number(s.weight) || 75,
            restrictions: s.restrictions || [],
            source: s.source || 'G3 Legacy',
            createdAt: s.created_at ? new Date(s.created_at).toLocaleDateString('pt-BR') : '26/08/2026'
          }));
          setStudents(mappedStudents);
          setSupabaseConnected(true);
        }

        // 2. Fetch Live Exercise Library from Supabase
        const { data: dbExercises } = await supabase.from('exercise_library').select('*').order('name', { ascending: true });
        if (dbExercises && dbExercises.length > 0) {
          setExerciseLibrary(dbExercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            alternateName: ex.alternate_name,
            primaryMuscle: ex.primary_muscle as any,
            secondaryMuscles: ex.secondary_muscles,
            equipment: ex.equipment as any,
            movementPattern: ex.movement_pattern as any,
            level: ex.level as any,
            modality: ex.modality as any,
            instructions: ex.instructions,
            observations: ex.observations,
            videoUrl: ex.video_url,
            imageUrl: ex.image_url,
            videoThumb: ex.video_thumb,
            contraindications: ex.contraindications,
            tags: ex.tags,
            authorCoach: ex.author_coach,
            createdAt: ex.created_at
          })));
        }

        // 3. Fetch Live Workout Templates from Supabase
        const { data: dbTemplates } = await supabase.from('workout_templates').select('*').order('created_at', { ascending: false });
        if (dbTemplates && dbTemplates.length > 0) {
          setWorkoutTemplates(dbTemplates.map(tpl => ({
            id: tpl.id,
            name: tpl.name,
            description: tpl.description,
            goal: tpl.goal as any,
            level: tpl.level as any,
            frequencyDays: tpl.frequency_days,
            divisionName: tpl.division_name,
            targetBiotype: tpl.target_biotype as any,
            restrictionsSafe: tpl.restrictions_safe,
            coachAuthor: tpl.coach_author,
            groups: tpl.groups,
            usageCount: tpl.usage_count,
            createdAt: tpl.created_at
          })));
        }

        // 4. Fetch Live Workout Routines from Supabase (All multiple programs)
        const { data: dbWorkouts } = await supabase.from('workout_routines').select('*').order('created_at', { ascending: false });
        if (dbWorkouts && dbWorkouts.length > 0) {
          setWorkouts(dbWorkouts.map(w => ({
            id: w.id,
            name: w.program_name || w.division_name,
            programName: w.program_name || w.division_name,
            studentId: w.student_id,
            studentName: w.student_name,
            biotype: w.biotype as any,
            goal: w.goal as any,
            status: (w.status || 'ativa') as any,
            version: w.version || 'v1',
            isActive: w.is_active !== undefined ? w.is_active : (w.status === 'ativa' || w.status === 'aprovado_coach'),
            frequencyDays: w.frequency_days || 4,
            coachName: w.coach_name || 'Coach Diego',
            divisionName: w.division_name,
            notes: w.notes || w.observations || '',
            changeLog: w.change_log || [],
            groups: w.groups || [],
            unit: w.unit || 'unidade-1',
            generatedAt: w.created_at ? new Date(w.created_at).toISOString().split('T')[0] : '2026-08-26',
            approvedAt: w.approved_at
          })));
        }

        // 5. Fetch Student Assessments (Anamnese & Avaliações Físicas)
        const { data: dbAssessments } = await supabase.from('student_assessments').select('*').order('assessment_date', { ascending: false });
        if (dbAssessments && dbAssessments.length > 0) {
          setStudentAssessments(dbAssessments.map(a => ({
            id: a.id,
            studentId: a.student_id,
            unit: a.unit as any,
            assessmentDate: a.assessment_date,
            assessorName: a.assessor_name,
            isCurrent: a.is_current,
            age: a.age,
            gender: a.gender,
            heightCm: Number(a.height_cm),
            weightKg: Number(a.weight_kg),
            primaryGoal: a.primary_goal,
            secondaryGoals: a.secondary_goals || [],
            experienceLevel: a.experience_level,
            trainingYears: Number(a.training_years) || 1,
            currentlyTraining: a.currently_training,
            currentFrequencyDays: a.current_frequency_days,
            otherSports: a.other_sports || [],
            machineExperience: a.machine_experience,
            freeWeightsExperience: a.free_weights_experience,
            complexLiftsExperience: a.complex_lifts_experience,
            daysPerWeek: a.days_per_week || 4,
            sessionDurationMinutes: a.session_duration_minutes || 60,
            preferredTimeOfDay: a.preferred_time_of_day || 'noite',
            preferredDays: a.preferred_days || ['Seg', 'Ter', 'Qui', 'Sex'],
            hasPain: a.has_pain,
            painDetails: a.pain_details || {},
            pastInjuries: a.past_injuries,
            surgeries: a.surgeries,
            avoidMovements: a.avoid_movements || [],
            prescriptionAlerts: a.prescription_alerts || [],
            medicalClearance: a.medical_clearance,
            exerciseSymptoms: a.exercise_symptoms || {},
            sleepHoursAvg: Number(a.sleep_hours_avg) || 7.5,
            sleepQuality: a.sleep_quality || 'boa',
            stressLevel: a.stress_level || 'moderado',
            workRoutine: a.work_routine || 'sentado',
            dailyStepsEstimate: a.daily_steps_estimate || 7000,
            favoriteExercises: a.favorite_exercises || [],
            dislikedExercises: a.disliked_exercises || [],
            preferredEquipment: a.preferred_equipment || ['Halteres', 'Máquinas'],
            preferenceWeightsVsMachines: a.preference_weights_vs_machines || 'misto',
            preferenceIntensity: a.preference_intensity || 'moderada_alta',
            createdAt: a.created_at,
            updatedAt: a.updated_at
          })));
        }

        // 6. Fetch Check-ins & Leads
        const { data: dbCheckins } = await supabase.from('checkin_logs').select('*').order('created_at', { ascending: false });
        if (dbCheckins && dbCheckins.length > 0) {
          setCheckIns(dbCheckins.map(c => ({
            id: c.id,
            studentId: c.student_id,
            studentName: c.student_name,
            studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            unit: c.unit as any,
            modality: c.modality as any,
            timestamp: c.timestamp,
            status: c.status as any,
          })));
        }

        const { data: dbLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (dbLeads && dbLeads.length > 0) {
          setLeads(dbLeads.map(l => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            interest: l.interest as any,
            unit: l.unit as any,
            status: l.stage as any,
            createdAt: l.created_at ? new Date(l.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hoje',
            notes: l.notes || '',
            source: l.source || 'IA Comercial'
          })));
        }
      } catch (err) {
        console.warn('Supabase sync fallback to memory store:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (typeof document !== 'undefined') {
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const getStudentAssessments = (studentId: string): StudentAssessment[] => {
    return studentAssessments
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime());
  };

  const getLatestStudentAssessment = (studentId: string): StudentAssessment | undefined => {
    const list = getStudentAssessments(studentId);
    if (list.length > 0) {
      return list.find(a => a.isCurrent) || list[0];
    }
    const student = students.find(s => s.id === studentId);
    if (!student) return undefined;
    return {
      id: `asm-${student.id}-auto`,
      studentId: student.id,
      unit: student.unit,
      assessmentDate: '2026-08-26',
      assessorName: 'Coach Diego',
      isCurrent: true,
      age: 28,
      gender: 'masculino',
      heightCm: student.height || 175,
      weightKg: student.weight || 78,
      primaryGoal: student.goal ? (student.goal.charAt(0).toUpperCase() + student.goal.slice(1)) : 'Hipertrofia',
      secondaryGoals: ['Ganho de força', 'Definição muscular'],
      experienceLevel: 'intermediario',
      trainingYears: 2.5,
      currentlyTraining: true,
      currentFrequencyDays: 4,
      otherSports: ['Corrida', 'Futebol'],
      machineExperience: 'boa',
      freeWeightsExperience: 'boa',
      complexLiftsExperience: 'moderada',
      daysPerWeek: 4,
      sessionDurationMinutes: 60,
      preferredTimeOfDay: 'noite',
      preferredDays: ['Seg', 'Ter', 'Qui', 'Sex'],
      hasPain: Boolean(student.restrictions && student.restrictions.length > 0 && !student.restrictions.includes('Nenhuma')),
      painDetails: {
        hasPain: Boolean(student.restrictions && student.restrictions.length > 0 && !student.restrictions.includes('Nenhuma')),
        location: student.restrictions?.[0] || 'Nenhuma',
        intensity: 3,
        whenAppears: 'Sob flexão ou carga alta'
      },
      avoidMovements: student.restrictions?.filter(r => r !== 'Nenhuma') || [],
      prescriptionAlerts: student.restrictions?.filter(r => r !== 'Nenhuma').map(r => `Atenção clínica: ${r}`) || ['Sem restrições declaradas'],
      medicalClearance: true,
      sleepHoursAvg: 7.5,
      sleepQuality: 'boa',
      stressLevel: 'moderado',
      workRoutine: 'sentado',
      dailyStepsEstimate: 7500,
      favoriteExercises: ['Supino Reto', 'Puxada Alta', 'Leg Press 45º'],
      dislikedExercises: ['Agachamento Búlgaro'],
      preferredEquipment: ['Halteres', 'Máquinas Biomecânicas', 'Polias'],
      preferenceWeightsVsMachines: 'misto',
      preferenceIntensity: 'moderada_alta'
    };
  };

  const saveStudentAssessment = async (assessment: StudentAssessment) => {
    // 1. Mark previous assessments for this student as non-current if this one is current
    let updatedList = studentAssessments.map(a => {
      if (a.studentId === assessment.studentId && assessment.isCurrent) {
        return { ...a, isCurrent: false };
      }
      return a;
    });

    // Replace or add
    const index = updatedList.findIndex(a => a.id === assessment.id);
    if (index >= 0) {
      updatedList[index] = assessment;
    } else {
      updatedList = [assessment, ...updatedList];
    }
    setStudentAssessments(updatedList);

    // Also sync basic weight/height/goal in Student record
    updateStudent(assessment.studentId, {
      weight: assessment.weightKg,
      height: assessment.heightCm,
      goal: assessment.primaryGoal.toLowerCase() as any,
      restrictions: assessment.prescriptionAlerts
    });

    showNotification(`Avaliação de ${assessment.assessmentDate} salva com sucesso!`);

    try {
      if (assessment.isCurrent) {
        await supabase
          .from('student_assessments')
          .update({ is_current: false })
          .eq('student_id', assessment.studentId);
      }

      await supabase.from('student_assessments').upsert({
        id: assessment.id,
        student_id: assessment.studentId,
        unit: assessment.unit || 'unidade-1',
        assessment_date: assessment.assessmentDate,
        assessor_name: assessment.assessorName,
        is_current: assessment.isCurrent,
        age: assessment.age,
        gender: assessment.gender,
        height_cm: assessment.heightCm,
        weight_kg: assessment.weightKg,
        primary_goal: assessment.primaryGoal,
        secondary_goals: assessment.secondaryGoals,
        experience_level: assessment.experienceLevel,
        training_years: assessment.trainingYears,
        currently_training: assessment.currentlyTraining,
        current_frequency_days: assessment.currentFrequencyDays,
        other_sports: assessment.otherSports,
        machine_experience: assessment.machineExperience,
        free_weights_experience: assessment.freeWeightsExperience,
        complex_lifts_experience: assessment.complexLiftsExperience,
        days_per_week: assessment.daysPerWeek,
        session_duration_minutes: assessment.sessionDurationMinutes,
        preferred_time_of_day: assessment.preferredTimeOfDay,
        preferred_days: assessment.preferredDays,
        has_pain: assessment.hasPain,
        pain_details: assessment.painDetails,
        past_injuries: assessment.pastInjuries,
        surgeries: assessment.surgeries,
        avoid_movements: assessment.avoidMovements,
        prescription_alerts: assessment.prescriptionAlerts,
        medical_clearance: assessment.medicalClearance,
        exercise_symptoms: assessment.exerciseSymptoms,
        sleep_hours_avg: assessment.sleepHoursAvg,
        sleep_quality: assessment.sleepQuality,
        stress_level: assessment.stressLevel,
        work_routine: assessment.workRoutine,
        daily_steps_estimate: assessment.dailyStepsEstimate,
        favorite_exercises: assessment.favoriteExercises,
        disliked_exercises: assessment.dislikedExercises,
        preferred_equipment: assessment.preferredEquipment,
        preference_weights_vs_machines: assessment.preferenceWeightsVsMachines,
        preference_intensity: assessment.preferenceIntensity
      });
    } catch (err) {
      console.warn('Supabase saveStudentAssessment error:', err);
    }
  };

  const saveWorkoutRoutine = async (routine: WorkoutRoutine) => {
    // Keep all routines, updating the matching one by ID
    const exists = workouts.some(w => w.id === routine.id);
    let updatedWorkouts: WorkoutRoutine[];
    if (exists) {
      updatedWorkouts = workouts.map(w => w.id === routine.id ? routine : w);
    } else {
      updatedWorkouts = [routine, ...workouts];
    }
    setWorkouts(updatedWorkouts);

    showNotification(`Programa "${routine.programName || routine.name || routine.divisionName}" salvo com sucesso!`);

    try {
      await supabase.from('workout_routines').upsert({
        id: routine.id,
        student_id: routine.studentId,
        student_name: routine.studentName,
        division_name: routine.divisionName,
        program_name: routine.programName || routine.name || routine.divisionName,
        coach_name: routine.coachName || 'Coach Diego',
        biotype: routine.biotype || 'mesomorfo',
        goal: routine.goal || 'hipertrofia',
        status: routine.status || 'ativa',
        version: routine.version || 'v1',
        is_active: routine.isActive !== undefined ? routine.isActive : true,
        frequency_days: routine.frequencyDays || 4,
        notes: routine.notes || routine.observations || '',
        groups: routine.groups,
        change_log: routine.changeLog || [],
        unit: routine.unit || 'unidade-1',
        approved_at: routine.approvedAt || new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveWorkoutRoutine error:', err);
    }
  };

  const createWorkoutRoutine = async (params: {
    studentId: string;
    programName: string;
    divisionName: string;
    goal?: string;
    frequencyDays?: number;
    durationWeeks?: number;
    coachName?: string;
    notes?: string;
  }): Promise<WorkoutRoutine> => {
    const student = students.find(s => s.id === params.studentId);
    const newRoutine: WorkoutRoutine = {
      id: `wkt-${Date.now()}`,
      programName: params.programName,
      name: params.programName,
      studentId: params.studentId,
      studentName: student?.name || 'Aluno CT Alpha',
      biotype: student?.biotype || 'mesomorfo',
      goal: (params.goal as any) || student?.goal || 'hipertrofia',
      status: 'ativa',
      version: 'v1',
      isActive: true,
      frequencyDays: params.frequencyDays || 4,
      durationWeeks: params.durationWeeks || 8,
      coachName: params.coachName || 'Coach Diego',
      divisionName: params.divisionName || 'Divisão ABC',
      notes: params.notes || '',
      changeLog: [
        {
          date: new Date().toLocaleDateString('pt-BR'),
          coachName: params.coachName || 'Coach Diego',
          description: `Criou a rotina "${params.programName}" (${params.divisionName})`
        }
      ],
      groups: [
        {
          letter: 'A',
          title: 'Treino A: Peitoral, Tríceps & Ombro Anterior',
          targetMuscles: 'Peito, Deltoide e Tríceps',
          exercises: []
        },
        {
          letter: 'B',
          title: 'Treino B: Dorsal, Bíceps & Deltoide Posterior',
          targetMuscles: 'Costas, Bíceps e Trapézio',
          exercises: []
        },
        {
          letter: 'C',
          title: 'Treino C: Membros Inferiores Completo',
          targetMuscles: 'Quadríceps, Posterior, Glúteo e Panturrilha',
          exercises: []
        }
      ],
      unit: student?.unit || 'unidade-1',
      generatedAt: new Date().toISOString().split('T')[0]
    };

    // Deactivate previous active routines for this student
    const updated = workouts.map(w => {
      if (w.studentId === params.studentId) {
        return { ...w, isActive: false, status: 'arquivada' as any };
      }
      return w;
    });

    setWorkouts([newRoutine, ...updated]);
    showNotification(`Nova rotina "${params.programName}" criada e ativada!`);

    try {
      // Update other routines in Supabase
      await supabase
        .from('workout_routines')
        .update({ is_active: false, status: 'arquivada' })
        .eq('student_id', params.studentId);

      // Insert new routine
      await supabase.from('workout_routines').insert({
        id: newRoutine.id,
        student_id: newRoutine.studentId,
        student_name: newRoutine.studentName,
        division_name: newRoutine.divisionName,
        program_name: newRoutine.programName,
        coach_name: newRoutine.coachName,
        biotype: newRoutine.biotype,
        goal: newRoutine.goal,
        status: newRoutine.status,
        version: newRoutine.version,
        is_active: true,
        frequency_days: newRoutine.frequencyDays,
        notes: newRoutine.notes,
        groups: newRoutine.groups,
        change_log: newRoutine.changeLog,
        unit: newRoutine.unit
      });
    } catch (err) {
      console.warn('Supabase createWorkoutRoutine error:', err);
    }

    return newRoutine;
  };

  const activateWorkoutRoutine = async (routineId: string, studentId: string) => {
    const updated = workouts.map(w => {
      if (w.studentId === studentId) {
        if (w.id === routineId) {
          return { ...w, isActive: true, status: 'ativa' as any };
        } else if (w.isActive) {
          return { ...w, isActive: false, status: 'arquivada' as any };
        }
      }
      return w;
    });
    setWorkouts(updated);
    showNotification('Rotina definida como ATIVA no aplicativo do aluno!');

    try {
      await supabase
        .from('workout_routines')
        .update({ is_active: false, status: 'arquivada' })
        .eq('student_id', studentId);

      await supabase
        .from('workout_routines')
        .update({ is_active: true, status: 'ativa' })
        .eq('id', routineId);
    } catch (err) {
      console.warn('Supabase activateWorkoutRoutine error:', err);
    }
  };

  const archiveWorkoutRoutine = async (routineId: string) => {
    const updated = workouts.map(w => w.id === routineId ? { ...w, isActive: false, status: 'arquivada' as any } : w);
    setWorkouts(updated);
    showNotification('Rotina arquivada no histórico.');

    try {
      await supabase
        .from('workout_routines')
        .update({ is_active: false, status: 'arquivada' })
        .eq('id', routineId);
    } catch (err) {
      console.warn('Supabase archiveWorkoutRoutine error:', err);
    }
  };

  const deleteWorkoutRoutine = async (routineId: string) => {
    setWorkouts(workouts.filter(w => w.id !== routineId));
    showNotification('Rotina excluída com sucesso.');

    try {
      await supabase.from('workout_routines').delete().eq('id', routineId);
    } catch (err) {
      console.warn('Supabase deleteWorkoutRoutine error:', err);
    }
  };

  const duplicateWorkoutRoutine = async (routineId: string): Promise<WorkoutRoutine | undefined> => {
    const original = workouts.find(w => w.id === routineId);
    if (!original) return;

    const cloned: WorkoutRoutine = {
      ...original,
      id: `wkt-${Date.now()}`,
      programName: `${original.programName || original.name || original.divisionName} (v2 Clonada)`,
      name: `${original.programName || original.name || original.divisionName} (v2 Clonada)`,
      version: 'v2',
      isActive: false,
      status: 'rascunho',
      generatedAt: new Date().toISOString().split('T')[0],
      changeLog: [
        ...(original.changeLog || []),
        {
          date: new Date().toLocaleDateString('pt-BR'),
          coachName: 'Coach Diego',
          description: `Duplicou a partir da rotina "${original.programName || original.divisionName}"`
        }
      ]
    };

    setWorkouts([cloned, ...workouts]);
    showNotification(`Rotina duplicada como rascunho "${cloned.programName}"!`);

    try {
      await supabase.from('workout_routines').insert({
        id: cloned.id,
        student_id: cloned.studentId,
        student_name: cloned.studentName,
        division_name: cloned.divisionName,
        program_name: cloned.programName,
        coach_name: cloned.coachName,
        biotype: cloned.biotype,
        goal: cloned.goal,
        status: cloned.status,
        version: cloned.version,
        is_active: false,
        frequency_days: cloned.frequencyDays,
        notes: cloned.notes,
        groups: cloned.groups,
        change_log: cloned.changeLog,
        unit: cloned.unit
      });
    } catch (err) {
      console.warn('Supabase duplicateWorkoutRoutine error:', err);
    }

    return cloned;
  };

  const updateStudent = async (studentId: string, updatedFields: Partial<Student>) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, ...updatedFields } : s));

    try {
      const payload: Record<string, any> = {};
      if (updatedFields.name) payload.name = updatedFields.name;
      if (updatedFields.phone) payload.phone = updatedFields.phone;
      if (updatedFields.email) payload.email = updatedFields.email;
      if (updatedFields.height) payload.height = updatedFields.height;
      if (updatedFields.weight) payload.weight = updatedFields.weight;
      if (updatedFields.goal) payload.goal = updatedFields.goal;
      if (updatedFields.biotype) payload.biotype = updatedFields.biotype;
      if (updatedFields.restrictions) payload.restrictions = updatedFields.restrictions;
      if (updatedFields.paymentStatus) payload.payment_status = updatedFields.paymentStatus;
      if (updatedFields.planName) payload.plan_name = updatedFields.planName;
      if (updatedFields.planValue) payload.plan_value = updatedFields.planValue;

      await supabase.from('students').update(payload).eq('id', studentId);
    } catch (err) {
      console.warn('Supabase student update error:', err);
    }
  };

  const addExerciseToLibrary = async (item: ExerciseLibraryItem) => {
    setExerciseLibrary([item, ...exerciseLibrary]);
    showNotification(`Exercício "${item.name}" adicionado à Biblioteca Central!`);

    try {
      await supabase.from('exercise_library').insert({
        id: item.id,
        name: item.name,
        alternate_name: item.alternateName || null,
        primary_muscle: item.primaryMuscle,
        secondary_muscles: item.secondaryMuscles || [],
        equipment: item.equipment,
        movement_pattern: item.movementPattern || null,
        level: item.level,
        modality: item.modality,
        instructions: item.instructions || null,
        observations: item.observations || null,
        video_url: item.videoUrl || null,
        image_url: item.imageUrl || null,
        video_thumb: item.videoThumb || null,
        contraindications: item.contraindications || [],
        tags: item.tags || [],
        author_coach: item.authorCoach || 'Coach Diego'
      });
    } catch (err) {
      console.warn('Supabase exercise_library insert error:', err);
    }
  };

  const updateExerciseInLibrary = async (id: string, updated: Partial<ExerciseLibraryItem>) => {
    setExerciseLibrary(exerciseLibrary.map(ex => ex.id === id ? { ...ex, ...updated } : ex));
    showNotification('Exercício atualizado na Biblioteca!');

    try {
      const payload: Record<string, any> = {};
      if (updated.name) payload.name = updated.name;
      if (updated.alternateName !== undefined) payload.alternate_name = updated.alternateName;
      if (updated.primaryMuscle) payload.primary_muscle = updated.primaryMuscle;
      if (updated.secondaryMuscles) payload.secondary_muscles = updated.secondaryMuscles;
      if (updated.equipment) payload.equipment = updated.equipment;
      if (updated.movementPattern) payload.movement_pattern = updated.movementPattern;
      if (updated.level) payload.level = updated.level;
      if (updated.modality) payload.modality = updated.modality;
      if (updated.instructions !== undefined) payload.instructions = updated.instructions;
      if (updated.observations !== undefined) payload.observations = updated.observations;
      if (updated.videoUrl !== undefined) payload.video_url = updated.videoUrl;
      if (updated.imageUrl !== undefined) payload.image_url = updated.imageUrl;
      if (updated.contraindications) payload.contraindications = updated.contraindications;
      if (updated.tags) payload.tags = updated.tags;

      await supabase.from('exercise_library').update(payload).eq('id', id);
    } catch (err) {
      console.warn('Supabase exercise_library update error:', err);
    }
  };

  const deleteExerciseFromLibrary = async (id: string) => {
    setExerciseLibrary(exerciseLibrary.filter(ex => ex.id !== id));
    showNotification('Exercício removido da Biblioteca.');

    try {
      await supabase.from('exercise_library').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase exercise_library delete error:', err);
    }
  };

  const addWorkoutTemplate = (tpl: WorkoutTemplate) => {
    setWorkoutTemplates([tpl, ...workoutTemplates]);
    showNotification(`Modelo "${tpl.name}" salvo na Biblioteca!`);
  };

  const assignTemplateToStudent = (studentId: string, templateId: string) => {
    const tpl = workoutTemplates.find(t => t.id === templateId);
    const student = students.find(s => s.id === studentId);
    if (!tpl || !student) return;

    const newRoutine: WorkoutRoutine = {
      id: `wkt-${Date.now()}`,
      programName: tpl.name,
      name: tpl.name,
      studentId: student.id,
      studentName: student.name,
      biotype: student.biotype || 'mesomorfo',
      goal: tpl.goal as any,
      status: 'ativa',
      version: 'v1',
      isActive: true,
      frequencyDays: tpl.frequencyDays,
      coachName: tpl.coachAuthor || 'Coach Diego',
      divisionName: tpl.divisionName,
      notes: tpl.description,
      groups: JSON.parse(JSON.stringify(tpl.groups)),
      unit: student.unit,
      generatedAt: new Date().toISOString().split('T')[0]
    };

    saveWorkoutRoutine(newRoutine);
  };

  const generateWorkoutForStudent = (params: {
    studentId: string;
    biotype: Biotype;
    goal: Goal;
    restrictions: string[];
    daysPerWeek: number;
  }): WorkoutRoutine => {
    const student = students.find(s => s.id === params.studentId);
    const divisionName = params.daysPerWeek <= 3 ? 'Divisão ABC' : params.daysPerWeek === 4 ? 'Divisão Upper / Lower' : 'Divisão ABCDE';
    
    const newRoutine: WorkoutRoutine = {
      id: `wkt-${Date.now()}`,
      programName: `Prescrição ${params.goal.toUpperCase()} (${divisionName})`,
      name: `Prescrição ${params.goal.toUpperCase()} (${divisionName})`,
      studentId: params.studentId,
      studentName: student?.name || 'Aluno',
      biotype: params.biotype,
      goal: params.goal,
      status: 'gerado_ia',
      version: 'v1',
      isActive: true,
      frequencyDays: params.daysPerWeek,
      coachName: 'Assistente de Prescrição IA',
      divisionName,
      notes: `Gerado com base na anamnese e restrições: ${params.restrictions.join(', ') || 'Nenhuma'}`,
      groups: [
        {
          letter: 'A',
          title: 'Treino A: Peitoral, Tríceps & Ombro Anterior',
          targetMuscles: 'Peito, Deltoides e Tríceps',
          exercises: [
            { id: 'ex-1', name: 'Supino Reto com Barra', category: 'peito', sets: 4, reps: '8 a 10', restSeconds: 75, rir: 2, rpe: 8, notes: 'Cadência 2-0-2' },
            { id: 'ex-2', name: 'Supino Inclinado com Halteres', category: 'peito', sets: 4, reps: '10 a 12', restSeconds: 60, rir: 2, rpe: 8 },
            { id: 'ex-3', name: 'Crucifixo na Polia Média', category: 'peito', sets: 3, reps: '12 a 15', restSeconds: 60, rir: 1, rpe: 9, specialTechnique: 'rest_pause' }
          ]
        },
        {
          letter: 'B',
          title: 'Treino B: Dorsais, Bíceps & Deltoide Posterior',
          targetMuscles: 'Costas e Bíceps',
          exercises: [
            { id: 'ex-6', name: 'Puxada Alta Pronada', category: 'costas', sets: 4, reps: '10 a 12', restSeconds: 75, rir: 2, rpe: 8 },
            { id: 'ex-7', name: 'Remada Baixa Triângulo', category: 'costas', sets: 4, reps: '10', restSeconds: 75, rir: 2, rpe: 8 },
            { id: 'ex-9', name: 'Rosca Direta Barra W', category: 'bracos', sets: 3, reps: '10 a 12', restSeconds: 60, rir: 1, rpe: 9 }
          ]
        },
        {
          letter: 'C',
          title: 'Treino C: Membros Inferiores & Core',
          targetMuscles: 'Pernas Completo',
          exercises: [
            { id: 'ex-11', name: 'Leg Press 45', category: 'pernas', sets: 4, reps: '10 a 12', restSeconds: 90, rir: 2, rpe: 8, notes: 'Amplitude máxima segura' },
            { id: 'ex-12', name: 'Cadeira Extensora', category: 'pernas', sets: 3, reps: '12 a 15', restSeconds: 60, rir: 1, rpe: 9 },
            { id: 'ex-13', name: 'Mesa Flexora Deitada', category: 'pernas', sets: 4, reps: '12', restSeconds: 60, rir: 1, rpe: 9 }
          ]
        }
      ],
      unit: student?.unit || 'unidade-1',
      generatedAt: new Date().toISOString().split('T')[0]
    };

    saveWorkoutRoutine(newRoutine);
    return newRoutine;
  };

  const approveWorkout = (workoutId: string) => {
    const updated = workouts.map(w => w.id === workoutId ? { ...w, status: 'ativa' as any, approvedAt: new Date().toISOString() } : w);
    setWorkouts(updated);
    showNotification('Treino aprovado e publicado com sucesso!');
  };

  const performCheckIn = (studentId: string, modality: 'musculacao' | 'crossfit' | 'luta') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Aluno não encontrado', status: 'bloqueado' as const };

    const newLog: CheckInLog = {
      id: `chk-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      unit: student.unit,
      modality,
      timestamp: 'Agora mesmo',
      status: student.paymentStatus === 'atrasado' ? 'bloqueado' : 'autorizado',
      message: student.paymentStatus === 'atrasado' ? 'Mensalidade em atraso' : 'Acesso liberado'
    };

    setCheckIns([newLog, ...checkIns]);
    return {
      success: student.paymentStatus !== 'atrasado',
      message: student.paymentStatus === 'atrasado' ? 'Acesso Bloqueado: Fatura Pendente' : 'Check-in Confirmado com Sucesso!',
      status: student.paymentStatus === 'atrasado' ? 'bloqueado' as const : 'liberado' as const
    };
  };

  const sendWhatsAppBilling = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const pixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}5204000053039865405${student?.planValue || 149.90}5802BR5916CT ALPHA ACADEMIA6007ALIANCA62070503***6304`;
    showNotification(`Cobrança enviada via WhatsApp para ${student?.name}!`);
    return {
      success: true,
      message: `Mensagem enviada para ${student?.phone}`,
      pixCode
    };
  };

  const addNewStudent = async (studentData: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    unit: 'unidade-1' | 'unidade-2';
    planName: string;
    planValue: number;
    modalities: ('musculacao' | 'crossfit' | 'luta')[];
    biotype?: Biotype;
    goal?: Goal;
  }): Promise<Student> => {
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      ...studentData,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      paymentStatus: 'adimplente',
      dueDate: '2026-09-26',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      source: 'Balcão / Recepção',
      height: 175,
      weight: 75,
      restrictions: []
    };

    setStudents([newStudent, ...students]);
    showNotification(`Aluno ${newStudent.name} matriculado com sucesso!`);

    try {
      await supabase.from('students').insert({
        id: newStudent.id,
        name: newStudent.name,
        cpf: newStudent.cpf,
        phone: newStudent.phone,
        email: newStudent.email,
        avatar: newStudent.avatar,
        unit: newStudent.unit,
        plan_name: newStudent.planName,
        plan_value: newStudent.planValue,
        payment_status: newStudent.paymentStatus,
        due_date: newStudent.dueDate,
        modalities: newStudent.modalities,
        biotype: newStudent.biotype || 'mesomorfo',
        goal: newStudent.goal || 'hipertrofia',
        height: newStudent.height,
        weight: newStudent.weight,
        restrictions: newStudent.restrictions,
        source: newStudent.source
      });
    } catch (err) {
      console.warn('Supabase student insert error:', err);
    }

    return newStudent;
  };

  const addLeadFromAI = async (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      createdAt: 'Agora mesmo'
    };
    setLeads([newLead, ...leads]);

    try {
      await supabase.from('leads').insert({
        id: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        interest: newLead.interest,
        unit: newLead.unit,
        stage: newLead.status,
        source: newLead.source,
        notes: newLead.notes
      });
    } catch (err) {
      console.warn('Supabase lead insert error:', err);
    }
  };

  const startMigration = () => {
    setIsMigrating(true);
    let prog = 0;
    const intv = setInterval(() => {
      prog += 20;
      setMigrationProgress(prog);
      if (prog >= 100) {
        clearInterval(intv);
        setIsMigrating(false);
        setMigrationCompleted(true);
        showNotification('Migração G3 concluída! 1.482 registros sanitizados.');
      }
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        selectedUnit,
        setSelectedUnit,
        students,
        checkIns,
        leads,
        workouts,
        studentAssessments,
        getStudentAssessments,
        getLatestStudentAssessment,
        saveStudentAssessment,
        workoutTemplates,
        addWorkoutTemplate,
        assignTemplateToStudent,
        exerciseLibrary,
        addExerciseToLibrary,
        updateExerciseInLibrary,
        deleteExerciseFromLibrary,
        saveWorkoutRoutine,
        createWorkoutRoutine,
        activateWorkoutRoutine,
        archiveWorkoutRoutine,
        deleteWorkoutRoutine,
        duplicateWorkoutRoutine,
        financial,
        migrationCompleted,
        migrationProgress,
        isMigrating,
        supabaseConnected,
        startMigration,
        generateWorkoutForStudent,
        approveWorkout,
        performCheckIn,
        sendWhatsAppBilling,
        addNewStudent,
        addLeadFromAI,
        activeStudentId,
        setActiveStudentId,
        updateStudent,
        theme,
        toggleTheme,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
