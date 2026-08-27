import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Dumbbell, 
  CheckCircle2, 
  Search,
  Filter,
  User,
  RotateCcw, 
  ShieldCheck, 
  Sliders,
  FileText,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  Flame,
  AlertTriangle,
  Play,
  Save,
  Check,
  X,
  BookOpen,
  Layers,
  Send,
  UserCheck,
  Target,
  Clock,
  Award,
  Zap,
  CheckCircle,
  Activity,
  HeartPulse,
  Info,
  Timer,
  Calendar,
  Settings2,
  Printer,
  ArrowUp,
  ArrowDown,
  Copy,
  ArrowRightLeft,
  History,
  TrendingUp,
  SlidersHorizontal,
  Bot,
  Scale,
  Percent,
  Droplets,
  Ruler,
  FileSpreadsheet,
  AlertCircle,
  MoreVertical,
  Archive,
  CheckSquare,
  BedDouble,
  Briefcase,
  Footprints,
  HeartCrack,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { 
  Goal, 
  Student, 
  Biotype, 
  WorkoutRoutine, 
  WorkoutTemplate, 
  WorkoutLevel, 
  WorkoutGroup, 
  WorkoutLetter, 
  Exercise, 
  ExerciseLibraryItem, 
  SpecialTechnique,
  ProgressionRule,
  WorkoutVersionHistory,
  StudentAssessment,
  ExperienceLevel,
  RoutineStatus,
  SetDetail
} from '@/types';
import { calculateWorkoutMetrics } from '@/utils/workoutMetrics';

const LETTER_SEQUENCE: WorkoutLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const WorkoutBuilderView: React.FC = () => {
  const { 
    students, 
    workouts, 
    exerciseLibrary, 
    saveWorkoutRoutine,
    createWorkoutRoutine,
    activateWorkoutRoutine,
    archiveWorkoutRoutine,
    deleteWorkoutRoutine,
    duplicateWorkoutRoutine,
    studentAssessments,
    getStudentAssessments,
    getLatestStudentAssessment,
    saveStudentAssessment,
    updateStudent,
    showNotification,
    setCurrentView 
  } = useApp();

  // Search & Filter for Lateral Student List
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'todos' | 'com_ficha' | 'pendente'>('todos');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-1');
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // All routines belonging to the selected student
  const studentRoutines = workouts.filter(w => w.studentId === selectedStudentId);
  const activeRoutine = studentRoutines.find(w => w.isActive || w.status === 'ativa') || studentRoutines[0];

  // Selected routine ID in workspace
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(activeRoutine?.id || '');

  // Current routine being edited
  const currentRoutine = studentRoutines.find(w => w.id === selectedRoutineId) || activeRoutine || studentRoutines[0];

  // Latest assessment for the selected student
  const currentAssessment = getLatestStudentAssessment(selectedStudentId) || {
    id: `asm-${selectedStudentId}-default`,
    studentId: selectedStudentId,
    unit: selectedStudent.unit,
    assessmentDate: new Date().toISOString().split('T')[0],
    assessorName: 'Coach Diego',
    isCurrent: true,
    heightCm: selectedStudent.height || 175,
    weightKg: selectedStudent.weight || 75,
    primaryGoal: selectedStudent.goal ? (selectedStudent.goal.charAt(0).toUpperCase() + selectedStudent.goal.slice(1)) : 'Hipertrofia',
    secondaryGoals: ['Ganho de força'],
    experienceLevel: 'intermediario' as ExperienceLevel,
    trainingYears: 1.5,
    currentlyTraining: true,
    currentFrequencyDays: 4,
    otherSports: [],
    daysPerWeek: 4,
    sessionDurationMinutes: 60,
    preferredTimeOfDay: 'noite' as const,
    preferredDays: ['Seg', 'Ter', 'Qui', 'Sex'],
    hasPain: (selectedStudent.restrictions && selectedStudent.restrictions.length > 0 && selectedStudent.restrictions[0] !== 'Nenhuma') || false,
    painDetails: {
      hasPain: (selectedStudent.restrictions && selectedStudent.restrictions.length > 0 && selectedStudent.restrictions[0] !== 'Nenhuma') || false,
      location: selectedStudent.restrictions?.[0] || '',
      intensity: 3
    },
    avoidMovements: selectedStudent.restrictions || [],
    prescriptionAlerts: selectedStudent.restrictions || [],
    favoriteExercises: ['Supino Reto', 'Puxada Alta'],
    dislikedExercises: [],
    preferredEquipment: ['Halteres', 'Máquinas'],
    preferenceWeightsVsMachines: 'misto' as const,
    preferenceIntensity: 'moderada_alta' as const
  };

  // Synchronize selectedRoutineId when student changes
  useEffect(() => {
    const studentWorkouts = workouts.filter(w => w.studentId === selectedStudentId);
    const active = studentWorkouts.find(w => w.isActive || w.status === 'ativa') || studentWorkouts[0];
    if (active) {
      setSelectedRoutineId(active.id);
      setGroups(active.groups || []);
      setProgramName(active.programName || active.name || active.divisionName);
      setDivisionName(active.divisionName);
    } else {
      setSelectedRoutineId('');
      setGroups([
        {
          letter: 'A',
          title: 'Treino A: Peito & Tríceps',
          targetMuscles: 'Peito e Tríceps',
          exercises: []
        },
        {
          letter: 'B',
          title: 'Treino B: Costas & Bíceps',
          targetMuscles: 'Costas e Bíceps',
          exercises: []
        }
      ]);
    }
  }, [selectedStudentId, workouts]);

  // Program Level Fields
  const [programName, setProgramName] = useState(currentRoutine?.programName || currentRoutine?.name || 'Hipertrofia Estrutural ABC');
  const [divisionName, setDivisionName] = useState(currentRoutine?.divisionName || 'Divisão ABC');
  const [groups, setGroups] = useState<WorkoutGroup[]>(currentRoutine?.groups || []);
  const [activeGroupLetter, setActiveGroupLetter] = useState<WorkoutLetter>('A');
  const currentGroup = groups.find(g => g.letter === activeGroupLetter) || groups[0];

  // Drawer / Modal states
  const [isNewRoutineModalOpen, setIsNewRoutineModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isLibraryDrawerOpen, setIsLibraryDrawerOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isRoutineMenuOpen, setIsRoutineMenuOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // New Routine Form State
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDivision, setNewRoutineDivision] = useState('Divisão ABC');
  const [newRoutineGoal, setNewRoutineGoal] = useState('Hipertrofia');
  const [newRoutineFrequency, setNewRoutineFrequency] = useState(4);
  const [newRoutineDurationWeeks, setNewRoutineDurationWeeks] = useState(8);
  const [newRoutineCoach, setNewRoutineCoach] = useState('Coach Diego');
  const [newRoutineNotes, setNewRoutineNotes] = useState('');

  // Assessment Edit State (Tabs inside Anamnese Modal)
  const [assessmentTab, setAssessmentTab] = useState<'basico' | 'experiencia' | 'disponibilidade' | 'dores' | 'estilo' | 'historico'>('basico');
  const [editingAssessment, setEditingAssessment] = useState<StudentAssessment>(currentAssessment);

  // Library Drawer Filter
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerMuscleFilter, setDrawerMuscleFilter] = useState<string>('todos');

  // Replace Exercise Target State
  const [exerciseToReplace, setExerciseToReplace] = useState<{ exerciseIndex: number; exercise: Exercise } | null>(null);

  // AI Suggestion State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestionText, setAiSuggestionText] = useState<string | null>(null);

  // Filtered Lateral Student List
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.cpf.includes(studentSearch);
    const hasWorkout = workouts.some(w => w.studentId === s.id && (w.isActive || w.status === 'ativa'));
    if (studentFilter === 'com_ficha') return matchesSearch && hasWorkout;
    if (studentFilter === 'pendente') return matchesSearch && !hasWorkout;
    return matchesSearch;
  });

  // Handle Save Current Routine
  const handleSaveRoutine = async () => {
    if (!currentRoutine) return;
    const updated: WorkoutRoutine = {
      ...currentRoutine,
      programName,
      name: programName,
      divisionName,
      groups,
      studentId: selectedStudentId,
      studentName: selectedStudent.name,
      unit: selectedStudent.unit
    };
    await saveWorkoutRoutine(updated);
  };

  // Handle Create New Routine
  const handleCreateNewRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;

    const created = await createWorkoutRoutine({
      studentId: selectedStudentId,
      programName: newRoutineName.trim(),
      divisionName: newRoutineDivision,
      goal: newRoutineGoal,
      frequencyDays: newRoutineFrequency,
      durationWeeks: newRoutineDurationWeeks,
      coachName: newRoutineCoach,
      notes: newRoutineNotes
    });

    setIsNewRoutineModalOpen(false);
    setSelectedRoutineId(created.id);
    setProgramName(created.programName || created.name || '');
    setDivisionName(created.divisionName);
    setGroups(created.groups);
    setActiveGroupLetter('A');
    setNewRoutineName('');
    setNewRoutineNotes('');
  };

  // Handle Save Assessment
  const handleSaveAssessment = async () => {
    await saveStudentAssessment({
      ...editingAssessment,
      studentId: selectedStudentId,
      assessmentDate: editingAssessment.assessmentDate || new Date().toISOString().split('T')[0]
    });
    setIsAssessmentModalOpen(false);
  };

  // Add Exercise from Library Drawer into Active Group
  const handleAddExerciseToCurrentGroup = (item: ExerciseLibraryItem) => {
    const newExercise: Exercise = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.name,
      category: item.primaryMuscle as any,
      sets: 4,
      reps: '10 a 12',
      restSeconds: 60,
      weightKg: 20,
      rir: 2,
      rpe: 8,
      cadence: '2-0-2',
      specialTechnique: 'normal',
      notes: item.observations || ''
    };

    setGroups(groups.map(g => {
      if (g.letter === activeGroupLetter) {
        return {
          ...g,
          exercises: [...g.exercises, newExercise]
        };
      }
      return g;
    }));

    showNotification(`"${item.name}" adicionado ao Treino ${activeGroupLetter}!`);
  };

  // Replace Exercise Implementation
  const handleConfirmReplace = (replacementItem: ExerciseLibraryItem) => {
    if (!exerciseToReplace) return;
    const { exerciseIndex, exercise } = exerciseToReplace;

    const updatedExercises = [...currentGroup.exercises];
    updatedExercises[exerciseIndex] = {
      ...exercise,
      id: `ex-repl-${Date.now()}`,
      name: replacementItem.name,
      category: replacementItem.primaryMuscle as any,
      notes: `Substituído de "${exercise.name}". ${replacementItem.observations || ''}`
    };

    setGroups(groups.map(g => g.letter === activeGroupLetter ? { ...g, exercises: updatedExercises } : g));
    setIsReplaceModalOpen(false);
    setExerciseToReplace(null);
    showNotification(`Exercício substituído por "${replacementItem.name}"!`);
  };

  // Exercise Modification Helpers
  const handleUpdateExercise = (exerciseIndex: number, field: keyof Exercise, value: any) => {
    setGroups(groups.map(g => {
      if (g.letter === activeGroupLetter) {
        const updatedExs = [...g.exercises];
        updatedExs[exerciseIndex] = { ...updatedExs[exerciseIndex], [field]: value };
        return { ...g, exercises: updatedExs };
      }
      return g;
    }));
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    setGroups(groups.map(g => {
      if (g.letter === activeGroupLetter) {
        return {
          ...g,
          exercises: g.exercises.filter((_, idx) => idx !== exerciseIndex)
        };
      }
      return g;
    }));
  };

  const handleDuplicateExercise = (exerciseIndex: number) => {
    setGroups(groups.map(g => {
      if (g.letter === activeGroupLetter) {
        const target = g.exercises[exerciseIndex];
        const clone = { ...target, id: `ex-dup-${Date.now()}` };
        const updatedExs = [...g.exercises];
        updatedExs.splice(exerciseIndex + 1, 0, clone);
        return { ...g, exercises: updatedExs };
      }
      return g;
    }));
  };

  const handleMoveExercise = (exerciseIndex: number, direction: 'up' | 'down') => {
    setGroups(groups.map(g => {
      if (g.letter === activeGroupLetter) {
        const updatedExs = [...g.exercises];
        const targetIdx = direction === 'up' ? exerciseIndex - 1 : exerciseIndex + 1;
        if (targetIdx < 0 || targetIdx >= updatedExs.length) return g;
        const temp = updatedExs[exerciseIndex];
        updatedExs[exerciseIndex] = updatedExs[targetIdx];
        updatedExs[targetIdx] = temp;
        return { ...g, exercises: updatedExs };
      }
      return g;
    }));
  };

  // Add New Workout Group (Treino D, E, etc.)
  const handleAddWorkoutGroup = () => {
    const nextLetterIndex = groups.length;
    if (nextLetterIndex >= LETTER_SEQUENCE.length) {
      showNotification('Limite de divisões atingido.');
      return;
    }
    const nextLetter = LETTER_SEQUENCE[nextLetterIndex];
    const newGroup: WorkoutGroup = {
      letter: nextLetter,
      title: `Treino ${nextLetter}: Nova Divisão`,
      targetMuscles: 'Grupamentos a definir',
      exercises: []
    };
    setGroups([...groups, newGroup]);
    setActiveGroupLetter(nextLetter);
  };

  // Trigger AI Contextual Prescription
  const handleTriggerAIAssistant = () => {
    setAiLoading(true);
    setIsAIAssistantOpen(true);
    setAiSuggestionText(null);

    setTimeout(() => {
      setAiLoading(false);
      const text = `
🎯 **Análise de Contexto da Anamnese de ${selectedStudent.name}:**
• **Objetivo Principal:** ${currentAssessment.primaryGoal} ${currentAssessment.secondaryGoals?.length ? `(${currentAssessment.secondaryGoals.join(', ')})` : ''}
• **Nível do Aluno:** ${currentAssessment.experienceLevel.toUpperCase()} • Disponibilidade: ${currentAssessment.daysPerWeek} dias/semana (${currentAssessment.sessionDurationMinutes} min/sessão).
• **Alertas de Prescrição:** ${currentAssessment.prescriptionAlerts?.length ? currentAssessment.prescriptionAlerts.join('; ') : 'Nenhuma restrição articular.'}
• **Preferências de Equipamento:** ${currentAssessment.preferredEquipment?.join(', ')} (${currentAssessment.preferenceWeightsVsMachines}).

💡 **Sugestão de Periodização Recomendada:**
1. **Divisão:** ${currentAssessment.daysPerWeek === 4 ? 'Upper / Lower (4x/sem)' : currentAssessment.daysPerWeek <= 3 ? 'Divisão ABC Clássica' : 'Push / Pull / Legs / Upper / Lower (5x/sem)'}.
2. **Distribuição de Volume:** 14 a 18 séries semanais para grupamentos prioritários com RIR 2 a 1 (manter margem de segurança).
3. **Ajuste de Segurança:** ${currentAssessment.hasPain ? `Substituir agachamentos axiais pesados por Leg Press 45º e Cadeira Extensora isométrica conforme relato de "${currentAssessment.painDetails?.location || 'desconforto'}".` : 'Manter progressão linear padrão em exercícios compostos.'}
      `;
      setAiSuggestionText(text);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* 1. TOP HEADER & WORKSPACE BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-alpha-500 bg-alpha-500/10 px-2 py-0.5 rounded-md border border-alpha-500/20">
              Prescrição de Treinamento
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {selectedStudent.name}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Construtor de Rotinas & Avaliação do Aluno
          </h1>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir Ficha
          </button>

          <button
            onClick={handleTriggerAIAssistant}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-purple-200 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Sugerir com IA
          </button>

          <button
            onClick={handleSaveRoutine}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-alpha-500 hover:bg-alpha-600 text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar Rotina
          </button>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN WORKSPACE: LEFT LATERAL (STUDENTS) + RIGHT BUILDER & ASSESSMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* MOBILE STUDENT SWITCHER (Visible only on < 1024px) */}
        <div className="lg:hidden col-span-1 bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Selecionar Aluno ({filteredStudents.length})
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filteredStudents.map(s => {
              const isSelected = s.id === selectedStudentId;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStudentId(s.id);
                    const latestAsm = getLatestStudentAssessment(s.id);
                    if (latestAsm) setEditingAssessment(latestAsm);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-alpha-500 text-white font-bold border-alpha-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0D121D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <img src={s.avatar} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="truncate max-w-[120px]">{s.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* LEFT COLUMN (3 cols): LATERAL STUDENT LIST (Desktop only) */}
        <div className="hidden lg:block lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Alunos ({filteredStudents.length})
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-alpha-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
              <button
                onClick={() => setStudentFilter('todos')}
                className={`py-1 rounded-md transition-all ${studentFilter === 'todos' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setStudentFilter('com_ficha')}
                className={`py-1 rounded-md transition-all ${studentFilter === 'com_ficha' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Com Ficha
              </button>
              <button
                onClick={() => setStudentFilter('pendente')}
                className={`py-1 rounded-md transition-all ${studentFilter === 'pendente' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Pendente
              </button>
            </div>

            {/* Student List */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredStudents.map(s => {
                const isSelected = s.id === selectedStudentId;
                const studentWkts = workouts.filter(w => w.studentId === s.id);
                const hasActive = studentWkts.some(w => w.isActive || w.status === 'ativa');

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      const latestAsm = getLatestStudentAssessment(s.id);
                      if (latestAsm) setEditingAssessment(latestAsm);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-alpha-500/10 border-alpha-500/40 dark:bg-alpha-500/15'
                        : 'bg-white dark:bg-[#0D121D] border-slate-150 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <img 
                      src={s.avatar} 
                      alt={s.name} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-alpha-600 dark:text-alpha-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {s.name}
                        </span>
                        {hasActive ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Rotina Ativa" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-400" title="Sem rotina ativa" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {s.planName.split(' ')[0]} • {s.unit === 'unidade-1' ? 'Matriz' : 'U2'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (9 cols): SMART ASSESSMENT SUMMARY + MULTI-ROUTINE WORKSPACE */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* 2.1 SMART STUDENT ASSESSMENT SUMMARY BANNER (Substitui o card de bioimpedância) */}
          <div className="bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              
              {/* Left Profile Info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-alpha-500 shadow-xs" 
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedStudent.name}
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {currentAssessment.experienceLevel.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      {currentAssessment.daysPerWeek}x / semana ({currentAssessment.sessionDurationMinutes} min)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span><strong>Objetivo:</strong> {currentAssessment.primaryGoal}</span>
                    <span>•</span>
                    <span><strong>Altura:</strong> {(currentAssessment.heightCm / 100).toFixed(2)} m</span>
                    <span>•</span>
                    <span><strong>Peso:</strong> {currentAssessment.weightKg} kg</span>
                    <span>•</span>
                    <span><strong>Disponibilidade:</strong> {currentAssessment.preferredDays?.join(', ')} ({currentAssessment.preferredTimeOfDay})</span>
                  </div>

                  {/* Contextual Alerts & Preferences Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {currentAssessment.hasPain && currentAssessment.prescriptionAlerts?.map((alert, idx) => (
                      <span key={idx} className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {alert}
                      </span>
                    ))}
                    {currentAssessment.preferredEquipment?.map((eq, idx) => (
                      <span key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-500" />
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Assessment Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingAssessment(currentAssessment);
                    setIsAssessmentModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-alpha-400" />
                  Ver / Editar Anamnese
                </button>
              </div>

            </div>
          </div>

          {/* 2.2 MULTI-ROUTINE MANAGER BAR & SELECTOR */}
          <div className="bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs space-y-3">
            
            {/* Header: Routine List & Creator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-alpha-500" />
                  Programas & Rotinas de Treino ({studentRoutines.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setNewRoutineName(`Hipertrofia Bloco ${studentRoutines.length + 1}`);
                    setIsNewRoutineModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Rotina
                </button>
              </div>
            </div>

            {/* Routines Carousel / Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {studentRoutines.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">
                  Nenhuma rotina cadastrada para este aluno. Clique em "+ Nova Rotina" para criar a primeira ficha.
                </div>
              ) : (
                studentRoutines.map(rtn => {
                  const isSelected = rtn.id === selectedRoutineId;
                  const isActive = rtn.isActive || rtn.status === 'ativa';

                  return (
                    <div
                      key={rtn.id}
                      onClick={() => {
                        setSelectedRoutineId(rtn.id);
                        setProgramName(rtn.programName || rtn.name || rtn.divisionName);
                        setDivisionName(rtn.divisionName);
                        setGroups(rtn.groups || []);
                        setActiveGroupLetter('A');
                      }}
                      className={`cursor-pointer px-3.5 py-2 rounded-xl border text-xs transition-all flex items-center gap-2.5 shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-700 border-slate-900 dark:border-slate-600 shadow-xs font-bold'
                          : 'bg-slate-50 dark:bg-[#0D121D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Ativa no App do Aluno" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-400" title="Arquivada / Inativa" />
                        )}
                        <span>{rtn.programName || rtn.name || rtn.divisionName}</span>
                      </div>

                      {isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-400 uppercase">
                          Ativa
                        </span>
                      )}

                      {/* Dropdown Menu Trigger for this routine */}
                      {isSelected && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRoutineMenuOpen(!isRoutineMenuOpen);
                            }}
                            className="p-1 hover:bg-slate-800 rounded-md text-slate-300"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isRoutineMenuOpen && (
                            <div className="absolute right-0 top-6 z-50 w-44 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-slate-800 dark:text-slate-200 text-xs">
                              {!isActive && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    activateWorkoutRoutine(rtn.id, selectedStudentId);
                                    setIsRoutineMenuOpen(false);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-emerald-600"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Definir como Ativa
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateWorkoutRoutine(rtn.id);
                                  setIsRoutineMenuOpen(false);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                Duplicar Rotina
                              </button>
                              {isActive && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    archiveWorkoutRoutine(rtn.id);
                                    setIsRoutineMenuOpen(false);
                                  }}
                                  className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-amber-600"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                  Arquivar Rotina
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDeleteConfirmOpen(true);
                                  setIsRoutineMenuOpen(false);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 text-red-600 border-t border-slate-100 dark:border-slate-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir Rotina
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Editable Program Name & Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Nome do Programa / Ficha
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-alpha-500"
                  placeholder="Ex: Hipertrofia ABC - Bloco 1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Estrutura de Divisão
                </label>
                <input
                  type="text"
                  value={divisionName}
                  onChange={(e) => setDivisionName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-alpha-500"
                  placeholder="Ex: Divisão ABC (Push/Pull/Legs)"
                />
              </div>
            </div>

          </div>

          {/* 2.3 WORKOUT DIVISION TABS (Treino A, B, C...) & EXERCISES */}
          <div className="bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            
            {/* Division Letters Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 pt-3 bg-slate-50/50 dark:bg-[#0D121D]">
              <div className="flex items-center gap-1 overflow-x-auto">
                {groups.map((g) => {
                  const isActive = g.letter === activeGroupLetter;
                  return (
                    <button
                      key={g.letter}
                      onClick={() => setActiveGroupLetter(g.letter)}
                      className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400 bg-white dark:bg-[#101522] rounded-t-lg shadow-2xs'
                          : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>Treino {g.letter}</span>
                      <span className="text-[10px] font-normal text-slate-400">({g.exercises.length})</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleAddWorkoutGroup}
                  className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-alpha-500 flex items-center gap-1 rounded-md border border-dashed border-slate-300 dark:border-slate-700 my-1 ml-1"
                >
                  <Plus className="w-3 h-3" />
                  Novo Treino
                </button>
              </div>

              {/* Add Exercise to this group button */}
              <button
                onClick={() => setIsLibraryDrawerOpen(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-alpha-500 hover:bg-alpha-600 text-white flex items-center gap-1.5 shadow-xs transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Exercício
              </button>
            </div>

            {/* Active Group Meta & Details */}
            {currentGroup && (
              <div className="p-4 space-y-4">
                
                {/* Group Details Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800/80">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Título do Treino</label>
                    <input
                      type="text"
                      value={currentGroup.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGroups(groups.map(g => g.letter === activeGroupLetter ? { ...g, title: val } : g));
                      }}
                      className="w-full text-xs font-bold bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-alpha-500 focus:outline-none py-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Músculos Alvo</label>
                    <input
                      type="text"
                      value={currentGroup.targetMuscles}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGroups(groups.map(g => g.letter === activeGroupLetter ? { ...g, targetMuscles: val } : g));
                      }}
                      className="w-full text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-300 border-b border-transparent hover:border-slate-300 focus:border-alpha-500 focus:outline-none py-0.5"
                    />
                  </div>
                </div>

                {/* Exercises Table & Cards */}
                {currentGroup.exercises.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                    <Dumbbell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Nenhum exercício no Treino {currentGroup.letter} ainda.
                    </p>
                    <button
                      onClick={() => setIsLibraryDrawerOpen(true)}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-alpha-500 text-white inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Abrir Biblioteca Central de Exercícios
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentGroup.exercises.map((ex, idx) => {
                      // Check if student has pain in muscle related to this exercise
                      const isPainCaution = currentAssessment.hasPain && (
                        (ex.category === 'pernas' && currentAssessment.painDetails?.location?.toLowerCase().includes('joelho')) ||
                        (ex.category === 'ombros' && currentAssessment.painDetails?.location?.toLowerCase().includes('ombro'))
                      );

                      return (
                        <div 
                          key={ex.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          {/* Exercise Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {ex.name}
                                  </h4>
                                  <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                                    {ex.category}
                                  </span>
                                  {isPainCaution && (
                                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.2 rounded-md border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                                      Atenção: Dor relatada
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Exercise Actions (Replace, Up, Down, Duplicate, Delete) */}
                            <div className="flex items-center gap-1 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  setExerciseToReplace({ exerciseIndex: idx, exercise: ex });
                                  setIsReplaceModalOpen(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-all"
                                title="Substituir por exercício alternativo compatível"
                              >
                                <ArrowRightLeft className="w-3 h-3 text-alpha-500" />
                                Substituir
                              </button>

                              <button
                                onClick={() => handleMoveExercise(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveExercise(idx, 'down')}
                                disabled={idx === currentGroup.exercises.length - 1}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDuplicateExercise(idx)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                title="Duplicar"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRemoveExercise(idx)}
                                className="p-1 rounded-md text-slate-400 hover:text-red-600"
                                title="Remover"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Exercise Prescription Parameters (Séries, Reps, Carga, Descanso, RIR, RPE, Cadência, Técnica) */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Séries</label>
                              <input
                                type="number"
                                value={ex.sets}
                                onChange={(e) => handleUpdateExercise(idx, 'sets', Number(e.target.value))}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Repetições</label>
                              <input
                                type="text"
                                value={ex.reps}
                                onChange={(e) => handleUpdateExercise(idx, 'reps', e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                placeholder="8 a 10"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Carga (kg)</label>
                              <input
                                type="number"
                                value={ex.weightKg || 0}
                                onChange={(e) => handleUpdateExercise(idx, 'weightKg', Number(e.target.value))}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Descanso (s)</label>
                              <input
                                type="number"
                                value={ex.restSeconds}
                                onChange={(e) => handleUpdateExercise(idx, 'restSeconds', Number(e.target.value))}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">RIR (Reserva)</label>
                              <input
                                type="number"
                                value={ex.rir ?? 2}
                                onChange={(e) => handleUpdateExercise(idx, 'rir', Number(e.target.value))}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">RPE (Esforço)</label>
                              <input
                                type="number"
                                value={ex.rpe ?? 8}
                                onChange={(e) => handleUpdateExercise(idx, 'rpe', Number(e.target.value))}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cadência</label>
                              <input
                                type="text"
                                value={ex.cadence || '2-0-2'}
                                onChange={(e) => handleUpdateExercise(idx, 'cadence', e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                                placeholder="3-0-1-0"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Técnica</label>
                              <select
                                value={ex.specialTechnique || 'normal'}
                                onChange={(e) => handleUpdateExercise(idx, 'specialTechnique', e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                              >
                                <option value="normal">Normal</option>
                                <option value="drop_set">Drop-set</option>
                                <option value="bi_set">Bi-set</option>
                                <option value="rest_pause">Rest-pause</option>
                                <option value="isometria">Isometria</option>
                                <option value="cluster_set">Cluster</option>
                                <option value="falha">Até a Falha</option>
                              </select>
                            </div>
                          </div>

                          {/* Coach Instructions */}
                          <div>
                            <input
                              type="text"
                              value={ex.notes || ''}
                              onChange={(e) => handleUpdateExercise(idx, 'notes', e.target.value)}
                              className="w-full px-3 py-1 text-xs rounded-md bg-slate-50/50 dark:bg-[#101522]/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 focus:outline-none"
                              placeholder="Observações do treinador (ex: Banco inclinado a 30º, foco em amplitude máxima)..."
                            />
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. MODAL: NOVA ROTINA / PROGRAMA DE TREINO */}
      {isNewRoutineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-alpha-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Criar Nova Rotina de Treino
                </h3>
              </div>
              <button onClick={() => setIsNewRoutineModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRoutine} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nome do Programa *
                </label>
                <input
                  type="text"
                  required
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold focus:ring-1 focus:ring-alpha-500"
                  placeholder="Ex: Hipertrofia ABC (Fase 2)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Estrutura de Divisão
                  </label>
                  <select
                    value={newRoutineDivision}
                    onChange={(e) => setNewRoutineDivision(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                  >
                    <option value="Divisão ABC">Divisão ABC</option>
                    <option value="Divisão AB (Upper / Lower)">Divisão AB (Upper / Lower)</option>
                    <option value="Divisão ABCD">Divisão ABCD</option>
                    <option value="Divisão ABCDE">Divisão ABCDE</option>
                    <option value="Push / Pull / Legs (PPL)">Push / Pull / Legs (PPL)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Objetivo
                  </label>
                  <input
                    type="text"
                    value={newRoutineGoal}
                    onChange={(e) => setNewRoutineGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Frequência Semanal
                  </label>
                  <input
                    type="number"
                    value={newRoutineFrequency}
                    onChange={(e) => setNewRoutineFrequency(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Duração Estimada (Semanas)
                  </label>
                  <input
                    type="number"
                    value={newRoutineDurationWeeks}
                    onChange={(e) => setNewRoutineDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Observações / Diretrizes
                </label>
                <textarea
                  rows={2}
                  value={newRoutineNotes}
                  onChange={(e) => setNewRoutineNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                  placeholder="Foco em progressão de carga e técnica apurada..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRoutineModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Criar e Ativar Rotina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: AVALIAÇÃO / ANAMNESE COMPLETA DO ALUNO (6 ABAS ORGANIZADAS) */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] rounded-2xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scaleUp overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-alpha-500" />
                  Prontuário de Avaliação & Anamnese do Aluno
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStudent.name} • Dados antropométricos, disponibilidade, histórico de dores e estilo de vida.
                </p>
              </div>
              <button onClick={() => setIsAssessmentModalOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-[#0D121D] overflow-x-auto text-xs font-bold text-slate-600 dark:text-slate-400">
              <button
                onClick={() => setAssessmentTab('basico')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'basico' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                1. Dados & Metas
              </button>
              <button
                onClick={() => setAssessmentTab('experiencia')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'experiencia' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                2. Experiência de Treino
              </button>
              <button
                onClick={() => setAssessmentTab('disponibilidade')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'disponibilidade' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                3. Disponibilidade
              </button>
              <button
                onClick={() => setAssessmentTab('dores')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'dores' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                4. Dores & Limitações
              </button>
              <button
                onClick={() => setAssessmentTab('estilo')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'estilo' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                5. Estilo de Vida & Preferências
              </button>
              <button
                onClick={() => setAssessmentTab('historico')}
                className={`py-2.5 px-3 border-b-2 transition-all shrink-0 ${assessmentTab === 'historico' ? 'border-alpha-500 text-alpha-600 dark:text-alpha-400' : 'border-transparent'}`}
              >
                6. Histórico ({getStudentAssessments(selectedStudentId).length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* TAB 1: DADOS BÁSICOS & METAS */}
              {assessmentTab === 'basico' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Idade</label>
                      <input
                        type="number"
                        value={editingAssessment.age || 28}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, age: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sexo</label>
                      <select
                        value={editingAssessment.gender || 'masculino'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, gender: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Altura (cm)</label>
                      <input
                        type="number"
                        value={editingAssessment.heightCm || 178}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, heightCm: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingAssessment.weightKg || 82.5}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, weightKg: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Objetivo Principal *</label>
                    <select
                      value={editingAssessment.primaryGoal}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, primaryGoal: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-bold text-alpha-500"
                    >
                      <option value="Hipertrofia">Hipertrofia</option>
                      <option value="Emagrecimento">Emagrecimento</option>
                      <option value="Ganho de Força">Ganho de Força</option>
                      <option value="Condicionamento">Condicionamento</option>
                      <option value="Resistência">Resistência</option>
                      <option value="Performance Esportiva">Performance Esportiva</option>
                      <option value="Saúde/qualidade de vida">Saúde / Qualidade de Vida</option>
                      <option value="Mobilidade">Mobilidade</option>
                      <option value="Reabilitação/retorno">Reabilitação / Retorno ao Exercício</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Objetivos Secundários (Prioridades)</label>
                    <input
                      type="text"
                      value={editingAssessment.secondaryGoals?.join(', ') || ''}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, secondaryGoals: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      placeholder="Ex: Ganho de força, Definição muscular..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EXPERIÊNCIA DE TREINO */}
              {assessmentTab === 'experiencia' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nível Percebido</label>
                      <select
                        value={editingAssessment.experienceLevel}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, experienceLevel: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                      >
                        <option value="iniciante">Iniciante (menos de 6 meses)</option>
                        <option value="intermediario">Intermediário (6 meses a 2 anos)</option>
                        <option value="avancado">Avançado (mais de 2 anos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tempo de Treino (Anos)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingAssessment.trainingYears || 1.5}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, trainingYears: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Treina Atualmente?</label>
                      <select
                        value={editingAssessment.currentlyTraining ? 'sim' : 'nao'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, currentlyTraining: e.target.value === 'sim' })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="sim">Sim (Ativo)</option>
                        <option value="nao">Não (Retomando)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Experiência com Máquinas</label>
                      <select
                        value={editingAssessment.machineExperience || 'boa'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, machineExperience: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="pouca">Pouca</option>
                        <option value="moderada">Moderada</option>
                        <option value="boa">Boa / Domina</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Experiência com Pesos Livres</label>
                      <select
                        value={editingAssessment.freeWeightsExperience || 'boa'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, freeWeightsExperience: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="pouca">Pouca</option>
                        <option value="moderada">Moderada</option>
                        <option value="boa">Boa / Domina</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Levantamentos Complexos</label>
                      <select
                        value={editingAssessment.complexLiftsExperience || 'moderada'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, complexLiftsExperience: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="pouca">Pouca (Evitar Snatch/Clean)</option>
                        <option value="moderada">Moderada</option>
                        <option value="boa">Boa / Domina Técnica</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Outros Esportes / Modalidades Praticadas</label>
                    <input
                      type="text"
                      value={editingAssessment.otherSports?.join(', ') || ''}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, otherSports: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      placeholder="Ex: Futebol, Corrida de rua, Muay Thai..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: DISPONIBILIDADE */}
              {assessmentTab === 'disponibilidade' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dias por Semana</label>
                      <select
                        value={editingAssessment.daysPerWeek}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, daysPerWeek: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-bold text-alpha-500"
                      >
                        <option value={2}>2 dias / semana</option>
                        <option value={3}>3 dias / semana</option>
                        <option value={4}>4 dias / semana</option>
                        <option value={5}>5 dias / semana</option>
                        <option value={6}>6 dias / semana</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duração por Sessão (min)</label>
                      <input
                        type="number"
                        value={editingAssessment.sessionDurationMinutes || 60}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, sessionDurationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Horário / Turno Preferido</label>
                      <select
                        value={editingAssessment.preferredTimeOfDay}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, preferredTimeOfDay: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="manha">Manhã (05:00 às 11:00)</option>
                        <option value="tarde">Tarde (12:00 às 17:00)</option>
                        <option value="noite">Noite (18:00 às 22:00)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dias Preferenciais da Semana</label>
                    <div className="flex flex-wrap gap-2">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(day => {
                        const isSelected = editingAssessment.preferredDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const list = editingAssessment.preferredDays || [];
                              const updated = isSelected ? list.filter(d => d !== day) : [...list, day];
                              setEditingAssessment({ ...editingAssessment, preferredDays: updated });
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-alpha-500 border-alpha-600 text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-[#0D121D] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DORES, LESÕES E LIMITAÇÕES (ATENÇÃO ESPECIAL) */}
              {assessmentTab === 'dores' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Sente alguma dor ou desconforto atualmente?
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1 text-xs">
                          <input
                            type="radio"
                            name="hasPain"
                            checked={!editingAssessment.hasPain}
                            onChange={() => setEditingAssessment({ ...editingAssessment, hasPain: false })}
                          />
                          <span>Não</span>
                        </label>
                        <label className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                          <input
                            type="radio"
                            name="hasPain"
                            checked={editingAssessment.hasPain}
                            onChange={() => setEditingAssessment({ ...editingAssessment, hasPain: true })}
                          />
                          <span>Sim</span>
                        </label>
                      </div>
                    </div>

                    {editingAssessment.hasPain && (
                      <div className="space-y-3 pt-2 border-t border-amber-200/60 dark:border-amber-500/20">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Local da Dor</label>
                            <input
                              type="text"
                              value={editingAssessment.painDetails?.location || ''}
                              onChange={(e) => setEditingAssessment({
                                ...editingAssessment,
                                painDetails: { ...editingAssessment.painDetails, hasPain: true, location: e.target.value }
                              })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D121D] border border-amber-200 dark:border-amber-500/40 font-semibold"
                              placeholder="Ex: Joelho direito, Ombro esquerdo..."
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Lado</label>
                            <select
                              value={editingAssessment.painDetails?.side || 'direito'}
                              onChange={(e) => setEditingAssessment({
                                ...editingAssessment,
                                painDetails: { ...editingAssessment.painDetails, hasPain: true, side: e.target.value as any }
                              })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D121D] border border-amber-200 dark:border-amber-500/40"
                            >
                              <option value="direito">Direito</option>
                              <option value="esquerdo">Esquerdo</option>
                              <option value="bilateral">Bilateral</option>
                              <option value="central">Central / Coluna</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Intensidade (1 a 10)</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={editingAssessment.painDetails?.intensity || 3}
                              onChange={(e) => setEditingAssessment({
                                ...editingAssessment,
                                painDetails: { ...editingAssessment.painDetails, hasPain: true, intensity: Number(e.target.value) }
                              })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D121D] border border-amber-200 dark:border-amber-500/40"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quais movimentos pioram ou provocam dor?</label>
                          <input
                            type="text"
                            value={editingAssessment.painDetails?.triggerMovements || ''}
                            onChange={(e) => setEditingAssessment({
                              ...editingAssessment,
                              painDetails: { ...editingAssessment.painDetails, hasPain: true, triggerMovements: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D121D] border border-amber-200 dark:border-amber-500/40"
                            placeholder="Ex: Agachamento profundo com carga alta, elevação lateral acima de 90º..."
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Alertas de Prescrição para o Treinador (Exibidos no Construtor)
                    </label>
                    <input
                      type="text"
                      value={editingAssessment.prescriptionAlerts?.join('; ') || ''}
                      onChange={(e) => setEditingAssessment({
                        ...editingAssessment,
                        prescriptionAlerts: e.target.value.split(';').map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      placeholder="Ex: Desconforto no joelho direito em flexão profunda; Evitar impacto articular"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Histórico de Lesões Relevantes</label>
                      <input
                        type="text"
                        value={editingAssessment.pastInjuries || ''}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, pastInjuries: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                        placeholder="Ex: Entorse de tornozelo em 2022"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cirurgias Anteriores</label>
                      <input
                        type="text"
                        value={editingAssessment.surgeries || ''}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, surgeries: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                        placeholder="Ex: Artroscopia de ombro..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ESTILO DE VIDA & PREFERÊNCIAS */}
              {assessmentTab === 'estilo' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Sono Médio (Horas/Noite)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingAssessment.sleepHoursAvg || 7.5}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, sleepHoursAvg: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qualidade do Sono</label>
                      <select
                        value={editingAssessment.sleepQuality || 'boa'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, sleepQuality: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="ruim">Ruim / Insônia</option>
                        <option value="regular">Regular</option>
                        <option value="boa">Boa / Reparador</option>
                        <option value="excelente">Excelente</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rotina de Trabalho</label>
                      <select
                        value={editingAssessment.workRoutine || 'sentado'}
                        onChange={(e) => setEditingAssessment({ ...editingAssessment, workRoutine: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      >
                        <option value="sentado">Sentado (Escritório / Computador)</option>
                        <option value="em_pe">Em pé grande parte do dia</option>
                        <option value="misto">Misto (Caminha e senta)</option>
                        <option value="pesado">Trabalho Braçal Pesado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferência de Equipamentos</label>
                    <select
                      value={editingAssessment.preferenceWeightsVsMachines || 'misto'}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, preferenceWeightsVsMachines: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="misto">Equilibrado (Pesos Livres + Máquinas)</option>
                      <option value="maquinas">Prefere Máquinas Guiadas e Cabos</option>
                      <option value="pesos_livres">Prefere Pesos Livres (Halteres/Barras)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Exercícios Favoritos (Aumentam aderência)</label>
                    <input
                      type="text"
                      value={editingAssessment.favoriteExercises?.join(', ') || ''}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, favoriteExercises: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                      placeholder="Ex: Supino Reto, Puxada Alta, Leg Press..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: HISTÓRICO DE AVALIAÇÕES */}
              {assessmentTab === 'historico' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs">
                    Histórico de Avaliações Registradas ({getStudentAssessments(selectedStudentId).length})
                  </span>
                  
                  {getStudentAssessments(selectedStudentId).map((asm, idx) => (
                    <div key={asm.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D121D] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Avaliação em {asm.assessmentDate}
                          </span>
                          {asm.isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
                              Atual
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          Peso: {asm.weightKg} kg • Altura: {(asm.heightCm / 100).toFixed(2)} m • Objetivo: {asm.primaryGoal} • Avaliador: {asm.assessorName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0D121D]">
              <span className="text-[11px] text-slate-400">
                Informações declaradas pelo aluno para auxílio à prescrição de treinamento.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="px-5 py-2 rounded-lg bg-alpha-500 hover:bg-alpha-600 text-white font-bold shadow-xs"
                >
                  Salvar Prontuário
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. DRAWER: BIBLIOTECA CENTRAL DE EXERCÍCIOS (+ ADICIONAR AO TREINO) */}
      {isLibraryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-[#101522] w-full max-w-md h-full flex flex-col shadow-2xl animate-slideLeft border-l border-slate-200 dark:border-slate-800">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-alpha-500" />
                  Biblioteca Central de Exercícios
                </h3>
                <p className="text-xs text-slate-500">
                  Adicionar ao Treino {activeGroupLetter} ({currentGroup?.title})
                </p>
              </div>
              <button onClick={() => setIsLibraryDrawerOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Muscle Filters */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar exercício por nome..."
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {['todos', 'peito', 'costas', 'quadriceps', 'posterior', 'ombros', 'biceps', 'triceps', 'core'].map(m => (
                  <button
                    key={m}
                    onClick={() => setDrawerMuscleFilter(m)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-all ${drawerMuscleFilter === m ? 'bg-alpha-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-3 overflow-y-auto flex-1 space-y-2">
              {exerciseLibrary
                .filter(ex => {
                  const matchSearch = ex.name.toLowerCase().includes(drawerSearch.toLowerCase()) || ex.primaryMuscle.includes(drawerSearch.toLowerCase());
                  const matchMuscle = drawerMuscleFilter === 'todos' || ex.primaryMuscle === drawerMuscleFilter;
                  return matchSearch && matchMuscle;
                })
                .map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D121D] hover:border-alpha-500 transition-all flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {item.primaryMuscle.toUpperCase()} • {item.equipment}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddExerciseToCurrentGroup(item)}
                      className="px-3 py-1.5 rounded-lg bg-alpha-500 hover:bg-alpha-600 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      Adicionar
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL: SUBSTITUIÇÃO INTELIGENTE DE EXERCÍCIO */}
      {isReplaceModalOpen && exerciseToReplace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-alpha-500" />
                  Substituir "{exerciseToReplace.exercise.name}"
                </h3>
                <p className="text-xs text-slate-500">
                  Alternativas compatíveis para {exerciseToReplace.exercise.category.toUpperCase()}
                </p>
              </div>
              <button onClick={() => setIsReplaceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2 text-xs">
              {exerciseLibrary
                .filter(item => item.primaryMuscle === exerciseToReplace.exercise.category && item.name !== exerciseToReplace.exercise.name)
                .map(alt => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D121D] hover:border-alpha-500 flex items-center justify-between transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{alt.name}</h4>
                      <span className="text-[10px] text-slate-500 block">
                        Equipamento: {alt.equipment} • Padrão: {alt.movementPattern || 'Isolado'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleConfirmReplace(alt)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Escolher
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

      {/* 7. MODAL: ASSISTENTE DE PRESCRIÇÃO IA */}
      {isAIAssistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Assistente de Prescrição IA (Contexto da Anamnese)
                </h3>
              </div>
              <button onClick={() => setIsAIAssistantOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              {aiLoading ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-500 font-semibold">Analisando anamnese e limitações de {selectedStudent.name}...</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {aiSuggestionText}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span>IA ≠ Treinador. O profissional deve sempre validar a conduta.</span>
              <button
                onClick={() => setIsAIAssistantOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: CONFIRMAÇÃO DE EXCLUSÃO DE ROTINA */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#101522] rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-5 space-y-3.5 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Excluir esta rotina?
            </h3>
            <p className="text-xs text-slate-500">
              Esta ação removerá a rotina "{programName}" e todos os treinos associados.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteWorkoutRoutine(selectedRoutineId);
                  setIsDeleteConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: IMPRESSÃO DA FICHA FÍSICA */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base">Ficha de Treino Oficial • CT ALPHA</h3>
                <p className="text-xs text-slate-500">Aluno: {selectedStudent.name} • {programName}</p>
              </div>
              <button onClick={() => setIsPrintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Preview */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border flex justify-between">
                <span><strong>Objetivo:</strong> {currentAssessment.primaryGoal}</span>
                <span><strong>Nível:</strong> {currentAssessment.experienceLevel.toUpperCase()}</span>
                <span><strong>Divisão:</strong> {divisionName}</span>
                <span><strong>Frequência:</strong> {currentAssessment.daysPerWeek}x/sem</span>
              </div>

              {groups.map(g => (
                <div key={g.letter} className="border rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 font-bold border-b">
                    Treino {g.letter} — {g.title} ({g.targetMuscles})
                  </div>
                  <table className="w-full text-left text-[11px]">
                    <thead className="border-b bg-slate-50 text-slate-500 font-bold">
                      <tr>
                        <th className="p-2">Exercício</th>
                        <th className="p-2">Séries</th>
                        <th className="p-2">Reps</th>
                        <th className="p-2">Carga</th>
                        <th className="p-2">Descanso</th>
                        <th className="p-2">Observações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {g.exercises.map((ex, i) => (
                        <tr key={ex.id}>
                          <td className="p-2 font-semibold">{i + 1}. {ex.name}</td>
                          <td className="p-2">{ex.sets}</td>
                          <td className="p-2">{ex.reps}</td>
                          <td className="p-2">{ex.weightKg ? `${ex.weightKg} kg` : '-'}</td>
                          <td className="p-2">{ex.restSeconds}s</td>
                          <td className="p-2 text-slate-500">{ex.notes || ex.specialTechnique !== 'normal' ? ex.specialTechnique : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Imprimir Agora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
