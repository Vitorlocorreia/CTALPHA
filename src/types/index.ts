export type UnitId = 'unidade-1' | 'unidade-2' | 'todas';

export type UserRole = 'gestor' | 'recepcao' | 'personal' | 'aluno';

export type Modality = 'musculacao' | 'crossfit' | 'luta' | 'todas';

export type Biotype = 'ectomorfo' | 'mesomorfo' | 'endomorfo';

export type Goal = 
  | 'hipertrofia' 
  | 'emagrecimento' 
  | 'forca' 
  | 'condicionamento' 
  | 'resistencia' 
  | 'performance_esportiva' 
  | 'saude_qualidade_vida' 
  | 'mobilidade' 
  | 'reabilitacao_retorno' 
  | 'performance_luta';

export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface PainDetail {
  hasPain: boolean;
  location?: string;
  side?: 'esquerdo' | 'direito' | 'bilateral' | 'central';
  intensity?: number; // 1 to 10
  whenAppears?: string;
  triggerMovements?: string;
  safeMovements?: string;
  notes?: string;
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  unit: 'unidade-1' | 'unidade-2';
  assessmentDate: string;
  assessorName: string;
  isCurrent: boolean;
  
  // Basic & Goals
  age?: number;
  gender?: 'masculino' | 'feminino' | 'outro';
  heightCm: number;
  weightKg: number;
  primaryGoal: string;
  secondaryGoals: string[];
  
  // Training Experience
  experienceLevel: ExperienceLevel;
  trainingYears?: number;
  currentlyTraining: boolean;
  currentFrequencyDays?: number;
  otherSports: string[];
  machineExperience?: 'pouca' | 'moderada' | 'boa';
  freeWeightsExperience?: 'pouca' | 'moderada' | 'boa';
  complexLiftsExperience?: 'pouca' | 'moderada' | 'boa';
  
  // Availability
  daysPerWeek: number;
  sessionDurationMinutes: number;
  preferredTimeOfDay: 'manha' | 'tarde' | 'noite';
  preferredDays: string[]; // e.g. ['Seg', 'Ter', 'Qui', 'Sex']
  
  // Health, Pain & Limitations (Pre-activity / Anamnesis)
  hasPain: boolean;
  painDetails?: PainDetail;
  pastInjuries?: string;
  surgeries?: string;
  avoidMovements: string[];
  prescriptionAlerts: string[];
  medicalClearance?: boolean;
  exerciseSymptoms?: {
    dizziness?: boolean;
    unusualShortnessBreath?: boolean;
    chestPain?: boolean;
    interruptedWorkoutPast?: boolean;
  };
  
  // Lifestyle
  sleepHoursAvg?: number;
  sleepQuality?: 'ruim' | 'regular' | 'boa' | 'excelente';
  stressLevel?: 'baixo' | 'moderado' | 'alto';
  workRoutine?: 'sentado' | 'em_pe' | 'misto' | 'pesado';
  dailyStepsEstimate?: number;
  
  // Preferences
  favoriteExercises: string[];
  dislikedExercises: string[];
  preferredEquipment: string[];
  preferenceWeightsVsMachines: 'pesos_livres' | 'maquinas' | 'misto';
  preferenceIntensity?: 'baixa' | 'moderada' | 'moderada_alta' | 'alta';
  workoutPacePreference?: 'curtos_densos' | 'longos_espacados' | 'equilibrado';
  
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  avatar: string;
  unit: 'unidade-1' | 'unidade-2';
  planName: string;
  planValue: number;
  paymentStatus: 'adimplente' | 'vencendo' | 'atrasado';
  dueDate: string;
  daysLate?: number;
  modalities: ('musculacao' | 'crossfit' | 'luta')[];
  lastCheckIn?: string;
  biotype?: Biotype;
  goal?: Goal;
  height?: number; // cm
  weight?: number; // kg
  restrictions?: string[];
  activeWorkoutId?: string;
  createdAt?: string;
  source?: string;
}

export type MuscleGroup = 
  | 'peito' 
  | 'costas' 
  | 'ombros' 
  | 'biceps' 
  | 'triceps' 
  | 'quadriceps' 
  | 'posterior' 
  | 'gluteos' 
  | 'panturrilha' 
  | 'core' 
  | 'fullbody';

export type EquipmentType = 
  | 'barra' 
  | 'halteres' 
  | 'maquina' 
  | 'cabo' 
  | 'peso_corporal' 
  | 'elastico' 
  | 'kettlebell' 
  | 'outros';

export type MovementPattern = 
  | 'empurrar_horizontal' 
  | 'empurrar_vertical' 
  | 'puxar_horizontal' 
  | 'puxar_vertical' 
  | 'agachamento' 
  | 'dobradica_quadril' 
  | 'avanco' 
  | 'isolado' 
  | 'core_estabilidade';

export type SpecialTechnique = 
  | 'normal' 
  | 'aquecimento' 
  | 'drop_set' 
  | 'bi_set' 
  | 'tri_set' 
  | 'rest_pause' 
  | 'isometria' 
  | 'falha' 
  | 'cluster_set';

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  alternateName?: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  movementPattern?: MovementPattern;
  level: WorkoutLevel;
  modality: 'musculacao' | 'crossfit' | 'lutas' | 'funcional';
  instructions?: string;
  observations?: string;
  videoUrl?: string;
  videoThumb?: string;
  imageUrl?: string;
  contraindications?: string[];
  tags?: string[];
  createdAt?: string;
  authorCoach?: string;
}

export interface SetDetail {
  setIndex: number;
  reps: string;
  loadKg?: number;
  rir?: number;
  rpe?: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup | 'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'core' | 'crossfit' | 'luta';
  sets: number;
  reps: string;
  restSeconds: number;
  weightKg?: number;
  notes?: string;
  videoThumb?: string;
  rir?: number; // Repetições na Reserva (ex: 1, 2, 0)
  rpe?: number; // Escala de Esforço Percebido (ex: 8, 9, 10)
  cadence?: string; // Ex: 3-0-1-0
  timeUnderTensionSec?: number;
  isUnilateral?: boolean;
  unilateralSide?: 'bilateral' | 'esquerdo' | 'direito' | 'alternado';
  specialTechnique?: SpecialTechnique;
  executionOrder?: number;
  setsDetail?: SetDetail[];
}

export interface ProgressionRule {
  type: 'carga' | 'repeticoes' | 'periodizacao_semanal';
  description: string;
  incrementKg?: number;
  repsScheme?: string; // Ex: "8 -> 10 -> 12"
  weeklyScheme?: {
    week: number;
    sets: number;
    reps: string;
    intensity: string;
  }[];
}

export interface WorkoutVersionHistory {
  version: string;
  timestamp: string;
  authorName: string;
  changesSummary: string;
  snapshot: WorkoutGroup[];
}

export type WorkoutLevel = 'iniciante' | 'intermediario' | 'avancado';

export type WorkoutLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | string;

export interface WorkoutGroup {
  letter: WorkoutLetter;
  title: string;
  targetMuscles: string;
  objective?: string;
  observations?: string;
  exercises: Exercise[];
  estimatedMinutes?: number;
  intensity?: 'moderada' | 'alta' | 'extrema';
}

export type RoutineStatus = 'ativa' | 'rascunho' | 'revisao' | 'arquivada' | 'concluida';

export interface RoutineChangeLog {
  date: string;
  coachName: string;
  description: string;
}

export interface WorkoutRoutine {
  id: string;
  name?: string;
  programName?: string;
  studentId: string;
  studentName: string;
  biotype?: Biotype;
  goal?: Goal | string;
  level?: WorkoutLevel;
  durationWeeks?: number;
  frequencyDays?: number;
  status: RoutineStatus | 'gerado_ia' | 'aprovado_coach' | 'em_andamento';
  version?: string;
  isActive?: boolean;
  coachName: string;
  divisionName: string; // Ex: Divisão ABC, Upper/Lower, ABCD, etc.
  observations?: string;
  notes?: string;
  progression?: ProgressionRule;
  history?: WorkoutVersionHistory[];
  changeLog?: RoutineChangeLog[];
  groups: WorkoutGroup[];
  unit?: string;
  generatedAt: string;
  approvedAt?: string;
  createdAt?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  goal: Goal | 'hipertrofia' | 'emagrecimento' | 'forca';
  level: WorkoutLevel;
  frequencyDays: number;
  divisionName: string;
  targetBiotype?: Biotype | 'todos';
  restrictionsSafe?: string[];
  coachAuthor?: string;
  groups: WorkoutGroup[];
  progression?: ProgressionRule;
  usageCount?: number;
  createdAt?: string;
}

export interface CheckInLog {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  unit: 'unidade-1' | 'unidade-2';
  modality: 'musculacao' | 'crossfit' | 'luta';
  timestamp: string;
  status: 'autorizado' | 'bloqueado' | 'liberado' | 'aviso';
  message?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  interest: 'crossfit' | 'luta' | 'musculacao' | 'completo';
  unit: 'unidade-1' | 'unidade-2';
  status: 'novo' | 'contatado' | 'visita_agendada' | 'experimental_agendada' | 'matriculado' | 'perdido';
  source: string;
  createdAt: string;
  notes?: string;
}

export interface FinancialMetric {
  totalRevenue: number;
  activeStudents: number;
  occupancyRate: number;
  latePaymentsCount: number;
  latePaymentsAmount: number;
  revenueByUnit: {
    unit1: number;
    unit2: number;
  };
  monthlyGrowth: number;
  mrr?: number;
  delinquencyRate?: number;
  activeSubscriptions?: number;
  pixRevenue?: number;
  cardRevenue?: number;
  cashRevenue?: number;
}
