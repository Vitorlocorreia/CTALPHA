import React, { useState } from 'react';
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
  Printer
} from 'lucide-react';
import { Goal, Student, Biotype, WorkoutRoutine, WorkoutTemplate, WorkoutLevel, WorkoutGroup, WorkoutLetter, Exercise } from '@/types';
import { calculateWorkoutMetrics } from '@/utils/workoutMetrics';

interface WorkoutEngineViewProps {
  initialMode?: 'prescricao' | 'biblioteca';
}

const LETTER_SEQUENCE: WorkoutLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const WorkoutEngineView: React.FC<WorkoutEngineViewProps> = ({ initialMode = 'prescricao' }) => {
  const { 
    students, 
    workouts, 
    workoutTemplates,
    addWorkoutTemplate,
    assignTemplateToStudent,
    generateWorkoutForStudent, 
    approveWorkout,
    showNotification 
  } = useApp();

  // Mode Tab: 'prescricao' vs 'biblioteca'
  const [activeMode, setActiveMode] = useState<'prescricao' | 'biblioteca'>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  // Search & Filter for Students List
  const [searchStudent, setSearchStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'com_ficha' | 'pendente'>('todos');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-1');

  // Workout state for selected student
  const [expandedDayLetter, setExpandedDayLetter] = useState<WorkoutLetter | null>('A');
  const [isNewWorkoutModalOpen, setIsNewWorkoutModalOpen] = useState(false);
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const [selectedExerciseDay, setSelectedExerciseDay] = useState<WorkoutLetter>('A');

  // Edit Exercise Modal State
  const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] = useState(false);
  const [editingGroupLetter, setEditingGroupLetter] = useState<WorkoutLetter>('A');
  const [editingExerciseId, setEditingExerciseId] = useState<string>('');
  const [editExName, setEditExName] = useState('');
  const [editExCategory, setEditExCategory] = useState<'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'core'>('peito');
  const [editExSets, setEditExSets] = useState(4);
  const [editExReps, setEditExReps] = useState('10 a 12');
  const [editExRest, setEditExRest] = useState(60);
  const [editExNotes, setEditExNotes] = useState('');

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Library filters
  const [libGoalFilter, setLibGoalFilter] = useState<string>('todos');
  const [libLevelFilter, setLibLevelFilter] = useState<string>('todos');
  const [libFreqFilter, setLibFreqFilter] = useState<string>('todos');
  const [libSearch, setLibSearch] = useState('');
  const [selectedTemplateForView, setSelectedTemplateForView] = useState<WorkoutTemplate | null>(null);

  // Assign modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [templateToAssign, setTemplateToAssign] = useState<WorkoutTemplate | null>(null);
  const [studentToAssignId, setStudentToAssignId] = useState<string>(students[0]?.id || 'std-1');

  // Create Template modal state
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [newTplName, setNewTplName] = useState('');
  const [newTplDesc, setNewTplDesc] = useState('');
  const [newTplGoal, setNewTplGoal] = useState<Goal>('hipertrofia');
  const [newTplLevel, setNewTplLevel] = useState<WorkoutLevel>('intermediario');
  const [newTplFreq, setNewTplFreq] = useState(4);
  const [newTplDivision, setNewTplDivision] = useState('PPL (Push / Pull / Legs)');
  const [newTplBiotype, setNewTplBiotype] = useState<'todos' | Biotype>('todos');
  const [newTplRestrictions, setNewTplRestrictions] = useState<string>('Nenhuma');

  // New Exercise Form
  const [newExName, setNewExName] = useState('');
  const [newExCategory, setNewExCategory] = useState<'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'core'>('peito');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState('10 a 12');
  const [newExRest, setNewExRest] = useState(60);
  const [newExNotes, setNewExNotes] = useState('Execução controlada 2-0-2');

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase()) || s.cpf.includes(searchStudent);
    const studentWorkout = workouts.find(w => w.studentId === s.id || w.studentName.toLowerCase().includes(s.name.toLowerCase()));
    
    if (filterStatus === 'com_ficha') return matchesSearch && !!studentWorkout;
    if (filterStatus === 'pendente') return matchesSearch && !studentWorkout;
    return matchesSearch;
  });

  // Filter Library Templates
  const filteredTemplates = workoutTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(libSearch.toLowerCase()) || t.description.toLowerCase().includes(libSearch.toLowerCase());
    const matchesGoal = libGoalFilter === 'todos' ? true : t.goal === libGoalFilter;
    const matchesLevel = libLevelFilter === 'todos' ? true : t.level === libLevelFilter;
    const matchesFreq = libFreqFilter === 'todos' ? true : String(t.frequencyDays) === libFreqFilter;
    return matchesSearch && matchesGoal && matchesLevel && matchesFreq;
  });

  // Find workout for selected student
  const activeWorkout = workouts.find(w => 
    w.studentId === selectedStudent.id || 
    w.studentName.toLowerCase().includes(selectedStudent.name.toLowerCase())
  ) || workouts[0];

  // Matching Template (O Treino Ideal Recomendado de acordo com as especificações do aluno)
  const idealTemplate = workoutTemplates.find(t => {
    if (selectedStudent.restrictions && selectedStudent.restrictions.length > 0 && selectedStudent.restrictions[0] !== 'Nenhuma') {
      const matchRestr = t.restrictionsSafe?.some(r => r.toLowerCase().includes(selectedStudent.restrictions![0].toLowerCase()));
      if (matchRestr) return true;
    }
    if (selectedStudent.goal && t.goal === selectedStudent.goal) return true;
    return false;
  }) || workoutTemplates[0];

  // Outros treinos da biblioteca (exceto o ideal)
  const alternativeTemplates = workoutTemplates.filter(t => t.id !== idealTemplate?.id);

  const handleApprove = () => {
    if (activeWorkout) {
      approveWorkout(activeWorkout.id);
      showNotification(`Treino assinado pelo Coach Diego e liberado no App de ${selectedStudent.name}!`);
    }
  };

  const handleApplyTemplateToCurrentStudent = (templateId: string) => {
    assignTemplateToStudent(selectedStudent.id, templateId);
    setIsNewWorkoutModalOpen(false);
    showNotification(`Periodização aplicada com sucesso para ${selectedStudent.name}!`);
  };

  // Add a new Day to the current active workout (up to 7 days)
  const handleAddNewDayToActiveWorkout = () => {
    if (!activeWorkout) return;
    const currentLength = activeWorkout.groups.length;
    if (currentLength >= 7) {
      showNotification('Limite máximo de 7 dias por semana atingido!');
      return;
    }

    const nextLetter = LETTER_SEQUENCE[currentLength] || `D${currentLength + 1}`;
    const newGroup: WorkoutGroup = {
      letter: nextLetter,
      title: `Treino ${nextLetter}: Personalizado / Foco Adicional`,
      targetMuscles: 'Grupos Musculares Complementares',
      exercises: [
        { id: `ex-add-${Date.now()}`, name: 'Exercício 1 (Composto)', category: 'peito', sets: 4, reps: '10 a 12', restSeconds: 60, notes: 'Início do dia' }
      ]
    };

    activeWorkout.groups.push(newGroup);
    setExpandedDayLetter(nextLetter);
    showNotification(`Dia de Treino ${nextLetter} adicionado à ficha de ${selectedStudent.name}!`);
  };

  // Remove a Day from the current active workout
  const handleRemoveDayFromActiveWorkout = (letterToRemove: WorkoutLetter) => {
    if (!activeWorkout || activeWorkout.groups.length <= 1) {
      showNotification('A ficha precisa ter ao menos 1 dia de treino.');
      return;
    }

    activeWorkout.groups = activeWorkout.groups.filter(g => g.letter !== letterToRemove);
    setExpandedDayLetter(activeWorkout.groups[0]?.letter || 'A');
    showNotification(`Dia de Treino ${letterToRemove} removido.`);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !activeWorkout) return;

    const targetGroup = activeWorkout.groups.find(g => g.letter === selectedExerciseDay);
    if (targetGroup) {
      targetGroup.exercises.push({
        id: `ex-custom-${Date.now()}`,
        name: newExName,
        category: newExCategory,
        sets: newExSets,
        reps: newExReps,
        restSeconds: newExRest,
        notes: newExNotes
      });
      showNotification(`Exercício "${newExName}" adicionado ao Treino ${selectedExerciseDay}!`);
      setIsAddExerciseModalOpen(false);
      setNewExName('');
    }
  };

  // Open Edit Exercise Modal
  const handleOpenEditExercise = (groupLetter: WorkoutLetter, ex: Exercise) => {
    setEditingGroupLetter(groupLetter);
    setEditingExerciseId(ex.id);
    setEditExName(ex.name);
    setEditExCategory(ex.category as any);
    setEditExSets(ex.sets || 4);
    setEditExReps(ex.reps || '10 a 12');
    setEditExRest(ex.restSeconds || 60);
    setEditExNotes(ex.notes || '');
    setIsEditExerciseModalOpen(true);
  };

  // Save Edited Exercise
  const handleSaveEditedExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkout || !editingExerciseId) return;

    const targetGroup = activeWorkout.groups.find(g => g.letter === editingGroupLetter);
    if (targetGroup) {
      const exIndex = targetGroup.exercises.findIndex(ex => ex.id === editingExerciseId);
      if (exIndex !== -1) {
        targetGroup.exercises[exIndex] = {
          ...targetGroup.exercises[exIndex],
          name: editExName,
          category: editExCategory,
          sets: editExSets,
          reps: editExReps,
          restSeconds: editExRest,
          notes: editExNotes
        };
        showNotification(`Exercício "${editExName}" atualizado com sucesso!`);
        setIsEditExerciseModalOpen(false);
      }
    }
  };

  const handleDeleteExercise = (groupLetter: string, exerciseId: string) => {
    if (!activeWorkout) return;
    const targetGroup = activeWorkout.groups.find(g => g.letter === groupLetter);
    if (targetGroup) {
      targetGroup.exercises = targetGroup.exercises.filter(ex => ex.id !== exerciseId);
      showNotification('Exercício removido do treino.');
    }
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplName.trim()) return;

    const newTemplate: WorkoutTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTplName,
      description: newTplDesc || 'Periodização estruturada pelo treinador da CT ALPHA.',
      goal: newTplGoal,
      level: newTplLevel,
      frequencyDays: newTplFreq,
      divisionName: newTplDivision,
      targetBiotype: newTplBiotype,
      restrictionsSafe: [newTplRestrictions],
      coachAuthor: 'Coach Diego',
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      groups: [
        {
          letter: 'A',
          title: `Treino A: Principal / ${newTplGoal.toUpperCase()}`,
          targetMuscles: 'Grupos Primários',
          exercises: [
            { id: `ex-cr-1`, name: 'Exercício Composto 1', category: 'peito', sets: 4, reps: '8 a 10', restSeconds: 90, notes: 'Foco em progressão' },
            { id: `ex-cr-2`, name: 'Exercício Auxiliar 2', category: 'ombros', sets: 4, reps: '10 a 12', restSeconds: 60 },
            { id: `ex-cr-3`, name: 'Isolador 3', category: 'bracos', sets: 3, reps: '12 a 15', restSeconds: 45 }
          ]
        },
        {
          letter: 'B',
          title: 'Treino B: Secundário & Antagonistas',
          targetMuscles: 'Grupos Secundários',
          exercises: [
            { id: `ex-cr-4`, name: 'Exercício Composto B1', category: 'costas', sets: 4, reps: '8 a 10', restSeconds: 90 },
            { id: `ex-cr-5`, name: 'Isolador B2', category: 'bracos', sets: 3, reps: '12', restSeconds: 45 }
          ]
        }
      ]
    };

    addWorkoutTemplate(newTemplate);
    setIsCreateTemplateModalOpen(false);
    setNewTplName('');
    setNewTplDesc('');
  };

  const handleExecuteAssign = () => {
    if (templateToAssign && studentToAssignId) {
      assignTemplateToStudent(studentToAssignId, templateToAssign.id);
      setIsAssignModalOpen(false);
      setSelectedStudentId(studentToAssignId);
      setActiveMode('prescricao');
    }
  };

  const triggerDirectPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Top Header & Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Prescrição de Treinamento & Periodização Personalizada
            </h1>
            <span className="text-[10px] font-bold text-alpha-600 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase">
              Painel Técnico
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prescreva fichas de 1 a 7 dias, edite exercícios em tempo real e imprima a ficha física para o aluno.
          </p>
        </div>

        {/* Top Switcher Tabs: Prescrição vs Biblioteca */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('prescricao')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMode === 'prescricao'
                ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Prescrição por Aluno</span>
          </button>

          <button
            onClick={() => setActiveMode('biblioteca')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeMode === 'biblioteca'
                ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca de Treinos ({workoutTemplates.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODO 1: PRESCRIÇÃO POR ALUNO (LISTA LATERAL + TREINOS DO ALUNO)
         ========================================================================= */}
      {activeMode === 'prescricao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start no-print">
          
          {/* COLUNA ESQUERDA: LISTA DE ALUNOS (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3.5 sticky top-20">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-alpha-500" />
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Alunos Cadastrados
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {filteredStudents.length} alunos
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome ou CPF..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-alpha-500"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold">
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === 'todos' 
                    ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('com_ficha')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === 'com_ficha' 
                    ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Com Ficha
              </button>
              <button
                onClick={() => setFilterStatus('pendente')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterStatus === 'pendente' 
                    ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Pendentes
              </button>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredStudents.map((student) => {
                const isSelected = student.id === selectedStudent.id;
                const hasWorkout = workouts.some(w => w.studentId === student.id || w.studentName.toLowerCase().includes(student.name.toLowerCase()));

                return (
                  <div
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setExpandedDayLetter('A');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-orange-50/50 dark:bg-orange-500/10 border-alpha-500 shadow-xs'
                        : 'bg-slate-50/50 dark:bg-[#101522]/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500">
                          <span className="capitalize">{student.goal || 'Hipertrofia'}</span>
                          <span>•</span>
                          <span>{student.unit === 'unidade-1' ? 'Matriz' : 'Expansão'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {hasWorkout ? (
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                          Ficha Ativa
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                          Prescrever
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* COLUNA DIREITA: CENTRAL DE TREINOS DO ALUNO (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Card de Perfil & Diagnóstico do Aluno Selecionado */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-alpha-500 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {selectedStudent.name}
                      </h2>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {selectedStudent.unit === 'unidade-1' ? 'Unidade Matriz' : 'Unidade Expansão'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedStudent.planName} • CPF: {selectedStudent.cpf}
                    </p>
                  </div>
                </div>

                {/* Ações: Imprimir Ficha + Novo Treino + Liberar no App */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    title="Imprimir ficha de treino em papel para o aluno"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    <span>Imprimir Ficha</span>
                  </button>

                  <button
                    onClick={() => setIsNewWorkoutModalOpen(true)}
                    className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-alpha-500/25 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Treino</span>
                  </button>

                  <button
                    onClick={handleApprove}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Liberar no App</span>
                  </button>
                </div>
              </div>

              {/* Ficha Biofísica, Nível e Restrições Destrinchadas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Objetivo do Aluno:</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize text-xs mt-0.5 block">{selectedStudent.goal || 'Hipertrofia'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Biotipo / Peso:</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize text-xs mt-0.5 block">{selectedStudent.biotype || 'Mesomorfo'} • {selectedStudent.weight || 75} kg</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Frequência Atual:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">
                    {activeWorkout?.groups?.length || 4} Dias / Semana ({activeWorkout?.groups?.map(g => g.letter).join('')})
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Restrição Anamnese:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 truncate text-xs mt-0.5 block">
                    {selectedStudent.restrictions?.[0] || 'Nenhuma restrição'}
                  </span>
                </div>
              </div>

            </div>

            {/* PASTAS DE TREINO DO ALUNO COM CÁLCULO DE TEMPO ESTIMADO */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {activeWorkout?.divisionName || 'Divisão Personalizada'}
                      </h3>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-500 font-bold px-2 py-0.2 rounded-full uppercase">
                        Ativa no App
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {activeWorkout?.groups?.length || 0} Dias de Treino • Editável pelo Treinador (até 7x)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddNewDayToActiveWorkout}
                    className="bg-orange-50 hover:bg-orange-100 text-alpha-600 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    title="Adicionar mais um dia de treino nesta ficha (até 7x)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Dia (até 7x)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedExerciseDay(expandedDayLetter || 'A');
                      setIsAddExerciseModalOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-alpha-400" />
                    <span>Adicionar Exercício</span>
                  </button>
                </div>
              </div>

              {/* Pastas dos Dias Sanfonadas com Tempo Estimado */}
              <div className="space-y-3">
                {activeWorkout?.groups?.map((group) => {
                  const isExpanded = expandedDayLetter === group.letter;
                  const metrics = calculateWorkoutMetrics(group.exercises);

                  return (
                    <div 
                      key={group.letter} 
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all"
                    >
                      
                      {/* Cabeçalho da Pasta do Dia */}
                      <div
                        onClick={() => setExpandedDayLetter(isExpanded ? null : group.letter)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                          isExpanded 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-50 dark:bg-[#101522] hover:bg-slate-100 dark:hover:bg-[#161D2E] text-slate-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                            isExpanded ? 'bg-alpha-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {group.letter}
                          </span>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-black leading-tight">
                                {group.title}
                              </h4>
                              
                              {/* Chip de Tempo Estimado do Dia */}
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                isExpanded 
                                  ? 'bg-white/10 text-orange-300 border border-white/10' 
                                  : 'bg-orange-50 dark:bg-orange-500/10 text-alpha-600 border border-orange-200 dark:border-orange-500/20'
                              }`}>
                                <Timer className="w-3 h-3" />
                                <span>~{metrics.estimatedMinutes} min</span>
                              </span>
                            </div>

                            <span className={`text-[10px] ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>
                              {group.targetMuscles} • {group.exercises.length} exercícios ({metrics.totalSets} séries totais)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {activeWorkout.groups.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDayFromActiveWorkout(group.letter);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title={`Remover Treino ${group.letter}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-alpha-400' : 'text-slate-400'
                          }`} />
                        </div>
                      </div>

                      {/* Conteúdo Expandido do Treino do Dia */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-50/70 dark:bg-[#0A0D14] border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                          
                          {/* Painel de Métricas Fisiológicas do Treino do Dia */}
                          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                                <Clock className="w-3 h-3 text-alpha-500" />
                                Tempo Estimado:
                              </span>
                              <span className="font-mono font-black text-slate-900 dark:text-white text-sm">
                                ~{metrics.estimatedMinutes} minutos
                              </span>
                            </div>

                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                Volume de Séries:
                              </span>
                              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                {metrics.totalSets} Séries Totais
                              </span>
                            </div>

                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                                <Timer className="w-3 h-3 text-blue-500" />
                                Descanso Total:
                              </span>
                              <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                                ~{metrics.totalRestMinutes} min descanso
                              </span>
                            </div>

                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-500" />
                                Nível de Intensidade:
                              </span>
                              <span className="font-bold text-orange-600 dark:text-orange-400 text-xs truncate block">
                                {metrics.intensityLabel}
                              </span>
                            </div>
                          </div>

                          {/* Tags de Músculos */}
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                              Músculos Trabalhados no Treino {group.letter}:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {group.targetMuscles.split(',').map((m, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                                  {m.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Tabela de Exercícios com Séries, Reps, Descanso e Ações de Edição */}
                          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#101522]">
                            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                              <thead className="bg-slate-50 dark:bg-[#0D121D] text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                  <th className="px-3 py-2.5">Exercício</th>
                                  <th className="px-2 py-2.5 text-center">Séries</th>
                                  <th className="px-2 py-2.5 text-center">Repetições</th>
                                  <th className="px-2 py-2.5 text-center">Descanso</th>
                                  <th className="px-3 py-2.5">Orientações do Coach</th>
                                  <th className="px-2 py-2.5 text-right">Ações</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {group.exercises.map((ex, idx) => (
                                  <tr key={ex.id} className="hover:bg-slate-50/60 dark:hover:bg-[#0D121D]/60 transition-colors">
                                    <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">
                                      <span className="text-slate-400 mr-2 font-mono">{idx + 1}.</span>
                                      {ex.name}
                                    </td>
                                    <td className="px-2 py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                                      {ex.sets}
                                    </td>
                                    <td className="px-2 py-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                      {ex.reps}
                                    </td>
                                    <td className="px-2 py-3 text-center font-mono text-slate-500">
                                      {ex.restSeconds}s
                                    </td>
                                    <td className="px-3 py-3 text-slate-500 text-[11px]">
                                      {ex.notes || 'Cadência controlada 2-0-2'}
                                    </td>
                                    <td className="px-2 py-3 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        <button
                                          onClick={() => handleOpenEditExercise(group.letter, ex)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-alpha-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                                          title="Editar Exercício (Séries, Reps, Descanso)"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>

                                        <button
                                          onClick={() => handleDeleteExercise(group.letter, ex.id)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                          title="Remover Exercício"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL: PRÉ-VISUALIZAÇÃO E IMPRESSÃO DA FICHA FÍSICA (PAPELZINHO DE ACADEMIA)
         ========================================================================= */}
      {isPrintModalOpen && activeWorkout && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="max-w-3xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 border border-slate-200 animate-scaleUp text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-alpha-600 flex items-center justify-center">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-slate-900">
                    Ficha Física de Treinamento (Impressão de Papel)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Layout oficial da academia pronto para imprimir e entregar ao aluno
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerDirectPrint}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-alpha-400" />
                  <span>Imprimir Agora</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Print Sheet Paper Preview Area */}
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl space-y-6 font-sans text-slate-900">
              
              {/* Top Gym Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="CT ALPHA" className="w-12 h-12 rounded-xl object-contain bg-slate-900 p-1" />
                  <div>
                    <h2 className="text-base font-black tracking-tight">CT ALPHA CENTRO DE TREINAMENTO</h2>
                    <p className="text-[10px] text-slate-600">Aliança - PE • Musculação • Crossfit • Lutas • Funcional</p>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="font-bold block">FICHA TÉCNICA DE MUSCULAÇÃO</span>
                  <span className="text-slate-500 font-mono text-[10px]">Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-white border border-slate-300 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold">ALUNO(A):</span>
                  <strong className="text-sm">{selectedStudent.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold">OBJETIVO / BIOTIPO:</span>
                  <strong className="capitalize">{selectedStudent.goal || 'Hipertrofia'} • {selectedStudent.biotype || 'Mesomorfo'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold">TREINADOR RESPONSÁVEL:</span>
                  <strong>{activeWorkout.coachName || 'Coach Diego'}</strong>
                </div>
              </div>

              {selectedStudent.restrictions && selectedStudent.restrictions.length > 0 && selectedStudent.restrictions[0] !== 'Nenhuma' && (
                <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg text-[10px] font-bold">
                  ⚠️ ALERTA MÉDICO / RESTRIÇÃO: {selectedStudent.restrictions.join(', ')}
                </div>
              )}

              {/* Workout Days Tables */}
              <div className="space-y-4">
                {activeWorkout.groups.map((grp) => (
                  <div key={grp.letter} className="space-y-1.5">
                    <div className="flex items-center justify-between bg-slate-200 px-3 py-1.5 rounded-lg text-slate-900 font-black text-xs">
                      <span>TREINO {grp.letter}: {grp.title}</span>
                      <span className="text-[10px] font-normal text-slate-700">{grp.targetMuscles}</span>
                    </div>

                    <table className="w-full text-left text-[11px] border border-slate-300 bg-white">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-600">
                          <th className="p-2">Exercício</th>
                          <th className="p-2 text-center w-16">Séries</th>
                          <th className="p-2 text-center w-20">Reps</th>
                          <th className="p-2 text-center w-20">Descanso</th>
                          <th className="p-2 text-center w-28">Carga (kg)</th>
                          <th className="p-2">Observações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {grp.exercises.map((ex, i) => (
                          <tr key={ex.id}>
                            <td className="p-2 font-bold">{i + 1}. {ex.name}</td>
                            <td className="p-2 text-center font-mono font-bold">{ex.sets}</td>
                            <td className="p-2 text-center font-mono font-bold text-emerald-700">{ex.reps}</td>
                            <td className="p-2 text-center font-mono text-slate-500">{ex.restSeconds}s</td>
                            <td className="p-2 text-center font-mono text-slate-400">[ ____ kg ]</td>
                            <td className="p-2 text-slate-500 text-[10px]">{ex.notes || 'Cadência 2-0-2'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Footer Signature */}
              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
                <span>Validade da Ficha: 60 dias a partir da emissão.</span>
                <div className="text-center">
                  <div className="w-48 border-b border-slate-400 mb-1"></div>
                  <span>Assinatura do Treinador</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          NATIVE PRINT ONLY CONTAINER (APENAS PARA IMPRESSÃO EM PAPEL DO NAVEGADOR)
         ========================================================================= */}
      <div className="print-only">
        {activeWorkout && (
          <div className="space-y-4 text-black bg-white p-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div>
                <h1 className="text-lg font-black tracking-tight">CT ALPHA CENTRO DE TREINAMENTO</h1>
                <p className="text-xs text-gray-700">Rua Marechal Deodoro da Fonseca, 150 • Aliança - PE</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold">FICHA DE TREINO INDIVIDUAL</p>
                <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border border-black p-2 text-xs">
              <div><strong>Aluno:</strong> {selectedStudent.name}</div>
              <div><strong>Objetivo:</strong> {selectedStudent.goal}</div>
              <div><strong>Treinador:</strong> {activeWorkout.coachName || 'Coach Diego'}</div>
            </div>

            {activeWorkout.groups.map(grp => (
              <div key={grp.letter} className="space-y-1 mt-3">
                <div className="bg-gray-200 p-1 font-bold text-xs">
                  TREINO {grp.letter}: {grp.title} ({grp.targetMuscles})
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black p-1">Exercício</th>
                      <th className="border border-black p-1 text-center w-12">Séries</th>
                      <th className="border border-black p-1 text-center w-16">Reps</th>
                      <th className="border border-black p-1 text-center w-16">Descanso</th>
                      <th className="border border-black p-1 text-center w-24">Carga (kg)</th>
                      <th className="border border-black p-1">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grp.exercises.map((ex, idx) => (
                      <tr key={ex.id}>
                        <td className="border border-black p-1 font-bold">{idx + 1}. {ex.name}</td>
                        <td className="border border-black p-1 text-center">{ex.sets}</td>
                        <td className="border border-black p-1 text-center font-bold">{ex.reps}</td>
                        <td className="border border-black p-1 text-center">{ex.restSeconds}s</td>
                        <td className="border border-black p-1 text-center">[ ____ kg ]</td>
                        <td className="border border-black p-1 text-[10px]">{ex.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="pt-6 mt-4 border-t border-black flex justify-between text-xs">
              <span>Validade: 60 dias</span>
              <div className="text-center">
                <div className="w-48 border-b border-black mb-1"></div>
                <span>Assinatura do Treinador</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: EDITAR EXERCÍCIO EXISTENTE (SÉRIES, REPS, DESCANSO, NOTAS)
         ========================================================================= */}
      {isEditExerciseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form onSubmit={handleSaveEditedExercise} className="max-w-md w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">Editar Exercício</h4>
                  <span className="text-[10px] text-slate-500">Treino {editingGroupLetter} • Aluno: {selectedStudent.name}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditExerciseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Exercício:</label>
                <input
                  type="text"
                  required
                  value={editExName}
                  onChange={(e) => setEditExName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grupo Muscular:</label>
                  <select
                    value={editExCategory}
                    onChange={(e) => setEditExCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="peito">Peitoral</option>
                    <option value="costas">Costas / Dorsal</option>
                    <option value="pernas">Pernas / Quadríceps</option>
                    <option value="ombros">Ombros / Deltoides</option>
                    <option value="bracos">Braços (Bíceps/Tríceps)</option>
                    <option value="core">Abdômen / Core</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Séries Planejadas:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editExSets}
                    onChange={(e) => setEditExSets(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Faixa de Repetições:</label>
                  <input
                    type="text"
                    placeholder="Ex: 8 a 10 ou 12-15"
                    value={editExReps}
                    onChange={(e) => setEditExReps(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descanso (segundos):</label>
                  <select
                    value={editExRest}
                    onChange={(e) => setEditExRest(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value={30}>30 segundos (Alta Densidade)</option>
                    <option value={45}>45 segundos (Queima / HIIT)</option>
                    <option value={60}>60 segundos (Hipertrofia Padrão)</option>
                    <option value={75}>75 segundos (Compostos)</option>
                    <option value={90}>90 segundos (Cargas Médias/Altas)</option>
                    <option value={120}>120 segundos (Força Pura / Terra / Agachamento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Orientações do Coach:</label>
                <input
                  type="text"
                  placeholder="Ex: Pico de contração no topo de 1s..."
                  value={editExNotes}
                  onChange={(e) => setEditExNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditExerciseModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
              >
                Atualizar Exercício
              </button>
            </div>

          </form>
        </div>
      )}

      {/* =========================================================================
          MODO 2: BIBLIOTECA DE TREINOS MASTER (CATÁLOGO, CRIAÇÃO E ATRIBUIÇÃO)
         ========================================================================= */}
      {activeMode === 'biblioteca' && (
        <div className="space-y-6 animate-fadeIn no-print">
          
          {/* Header da Biblioteca com Busca, Filtros e Botão Novo Treino */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Catálogo de Treinos & Periodizações Base
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modelos prontos e periodizações validadas para aplicar a qualquer aluno com 1 clique.
                </p>
              </div>

              <button
                onClick={() => setIsCreateTemplateModalOpen(true)}
                className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-alpha-500/25 flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Novo Treino Base</span>
              </button>
            </div>

            {/* Filtros em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Buscar por Nome / Foco:</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: Hipertrofia, PPL, Adaptação..."
                    value={libSearch}
                    onChange={(e) => setLibSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-alpha-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Objetivo Técnico:</label>
                <select
                  value={libGoalFilter}
                  onChange={(e) => setLibGoalFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <option value="todos">Todos os Objetivos</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="condicionamento">Condicionamento Crossfit</option>
                  <option value="performance_luta">Lutas & Potência</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nível de Aluno:</label>
                <select
                  value={libLevelFilter}
                  onChange={(e) => setLibLevelFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <option value="todos">Todos os Níveis</option>
                  <option value="iniciante">Iniciante (Adaptação)</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado (Alta Densidade)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Frequência Semanal:</label>
                <select
                  value={libFreqFilter}
                  onChange={(e) => setLibFreqFilter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <option value="todos">Qualquer Frequência</option>
                  <option value="3">3 dias (ABC)</option>
                  <option value="4">4 dias (ABCD / Upper-Lower)</option>
                  <option value="5">5 dias (ABCDE)</option>
                  <option value="6">6 dias (PPL 2x)</option>
                  <option value="7">7 dias (Completo)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Grid de Cards dos Modelos da Biblioteca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-alpha-500/80 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-alpha-700 dark:text-alpha-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        {tpl.divisionName} • {tpl.frequencyDays}x / semana
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md capitalize">
                        {tpl.level}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      Por {tpl.coachAuthor}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-alpha-600 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Especificações Técnicas */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold">Biotipo Recomendado:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{tpl.targetBiotype || 'Todos'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold">Cuidados / Restrições:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{tpl.restrictionsSafe?.join(', ') || 'Nenhuma'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold">Pastas de Divisão:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {tpl.groups.map(g => `Treino ${g.letter} (${g.exercises.length} ex)`).join(' • ')}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setTemplateToAssign(tpl);
                      setIsAssignModalOpen(true);
                    }}
                    className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Atribuir a Aluno</span>
                  </button>

                  <button
                    onClick={() => setSelectedTemplateForView(selectedTemplateForView?.id === tpl.id ? null : tpl)}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>{selectedTemplateForView?.id === tpl.id ? 'Fechar' : 'Ver Pastas'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${selectedTemplateForView?.id === tpl.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Visualização Detalhada das Pastas do Template (quando aberto) */}
                {selectedTemplateForView?.id === tpl.id && (
                  <div className="pt-3 space-y-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      Pastas dos Dias e Exercícios deste Modelo:
                    </span>

                    {tpl.groups.map(grp => {
                      const grpMetrics = calculateWorkoutMetrics(grp.exercises);
                      return (
                        <div key={grp.letter} className="p-3 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              Treino {grp.letter}: {grp.title}
                            </span>
                            <span className="text-[10px] font-mono text-alpha-500 font-bold">
                              ~{grpMetrics.estimatedMinutes} min ({grp.exercises.length} ex)
                            </span>
                          </div>

                          <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                            {grp.exercises.map((ex, idx) => (
                              <li key={idx} className="flex items-center justify-between">
                                <span>• {ex.name}</span>
                                <span className="font-mono text-[10px] text-slate-400">{ex.sets}x {ex.reps} ({ex.restSeconds}s)</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL: PRESCREVER NOVO TREINO (DIAGNÓSTICO, TREINO IDEAL & OUTRAS OPÇÕES)
         ========================================================================= */}
      {isNewWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="max-w-2xl w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center border border-orange-200/60 dark:border-orange-500/30">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Prescrever Novo Treino
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Aluno: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.name}</span> • Diagnóstico Fisiológico & Seleção de Ficha
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewWorkoutModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Painel de Especificações do Aluno */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Diagnóstico & Especificações do Aluno:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">OBJETIVO:</span>
                  <span className="font-black text-slate-900 dark:text-white capitalize">{selectedStudent.goal || 'Hipertrofia'}</span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">BIOTIPO:</span>
                  <span className="font-black text-slate-900 dark:text-white capitalize">{selectedStudent.biotype || 'Mesomorfo'}</span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">FREQUÊNCIA:</span>
                  <span className="font-black text-slate-900 dark:text-white">4x / semana</span>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-bold">CUIDADO ARTICULAR:</span>
                  <span className="font-black text-rose-600 dark:text-rose-400 truncate block">
                    {selectedStudent.restrictions?.[0] || 'Nenhuma restrição'}
                  </span>
                </div>
              </div>
            </div>

            {/* SEÇÃO 1: ★ O TREINO IDEAL RECOMENDADO (TOP MATCH DE ESPECIFICAÇÕES) */}
            {idealTemplate && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border-2 border-alpha-500 shadow-md space-y-3.5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-alpha-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Treino Ideal Sugerido (100% Compatível)
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-500">
                    Divisão {idealTemplate.divisionName} • {idealTemplate.frequencyDays}x / semana
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {idealTemplate.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {idealTemplate.description}
                  </p>
                </div>

                {/* Por que este é o treino ideal? */}
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#101522]/90 border border-orange-200/80 dark:border-orange-500/30 text-[11px] space-y-1.5">
                  <span className="font-black text-slate-900 dark:text-white block text-[10px] uppercase tracking-wider text-alpha-600 dark:text-alpha-400">
                    Por que este é o treino ideal para {selectedStudent.name}?
                  </span>
                  <div className="space-y-1 text-slate-700 dark:text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Alinhado com o objetivo principal: <strong>{idealTemplate.goal.toUpperCase()}</strong>.</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Periodização estruturada em <strong>{idealTemplate.groups.length} pastas diárias</strong> com densidade otimizada.</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Protocolo seguro para cuidados biomecânicos: <strong>{idealTemplate.restrictionsSafe?.join(', ') || 'Nenhum'}</strong>.</span>
                    </p>
                  </div>
                </div>

                {/* Resumo das Pastas com tempo estimado */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {idealTemplate.groups.map(g => {
                    const m = calculateWorkoutMetrics(g.exercises);
                    return (
                      <span key={g.letter} className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-1">
                        <span>Treino {g.letter}: {g.exercises.length} ex</span>
                        <span className="text-alpha-500 font-mono font-bold">(~{m.estimatedMinutes}m)</span>
                      </span>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleApplyTemplateToCurrentStudent(idealTemplate.id)}
                  className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-md hover:shadow-alpha-500/25 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar este Treino Ideal para {selectedStudent.name}</span>
                </button>

              </div>
            )}

            {/* SEÇÃO 2: OUTROS TREINOS DA BIBLIOTECA (SE O TREINADOR PREFERIR OUTRO) */}
            {alternativeTemplates.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Ou selecione outra periodização alternativa da biblioteca:
                  </span>
                </div>

                <div className="space-y-2.5">
                  {alternativeTemplates.map((tpl) => (
                    <div 
                      key={tpl.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-900 dark:text-white text-xs">{tpl.name}</h5>
                          <span className="text-[9px] font-bold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md uppercase">
                            {tpl.divisionName} • {tpl.frequencyDays}x/sem
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {tpl.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleApplyTemplateToCurrentStudent(tpl.id)}
                        className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-900 hover:text-white dark:hover:bg-alpha-500 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Selecionar este Treino</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewWorkoutModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Fechar
              </button>

              <span className="text-[11px] text-slate-400">
                O treino selecionado será liberado instantaneamente no app do aluno.
              </span>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ATRIBUIR TREINO DA BIBLIOTECA PARA UM ALUNO
         ========================================================================= */}
      {isAssignModalOpen && templateToAssign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="max-w-md w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">Atribuir Treino da Biblioteca</h4>
                  <span className="text-[10px] text-slate-500">Modelo: {templateToAssign.name}</span>
                </div>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-slate-700 dark:text-slate-300">
              <h5 className="font-black text-slate-900 dark:text-white text-xs">{templateToAssign.name}</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Divisão {templateToAssign.divisionName} • {templateToAssign.frequencyDays} dias/semana • Nível {templateToAssign.level}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Selecione o Aluno para receber esta ficha:
              </label>
              <select
                value={studentToAssignId}
                onChange={(e) => setStudentToAssignId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 font-semibold text-slate-800 dark:text-slate-200 text-xs"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.goal} • {s.unit === 'unidade-1' ? 'Matriz' : 'Expansão'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleExecuteAssign}
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Atribuição</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CRIAR NOVO TREINO BASE PARA A BIBLIOTECA
         ========================================================================= */}
      {isCreateTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form onSubmit={handleCreateTemplate} className="max-w-lg w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">Criar Novo Treino Base</h4>
                  <span className="text-[10px] text-slate-500">Adicionar à Biblioteca Master da Academia</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateTemplateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Treino / Periodização:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hipertrofia Metabólica Avançada (ABCD)..."
                  value={newTplName}
                  onChange={(e) => setNewTplName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Divisão da Semana:</label>
                <select
                  value={newTplDivision}
                  onChange={(e) => setNewTplDivision(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="PPL (Push / Pull / Legs)">PPL (Push / Pull / Legs)</option>
                  <option value="Upper / Lower (Superior / Inferior)">Upper / Lower (Superior / Inferior)</option>
                  <option value="ABCD Estrutural Clássico">ABCD Estrutural Clássico</option>
                  <option value="ABCDE Isolado">ABCDE Isolamento Máximo</option>
                  <option value="Full Body 3x">Full Body 3x (Corpo Inteiro)</option>
                  <option value="7x Semana Completa">7x Semana Completa (Atleta)</option>
                  <option value="Divisão Personalizada">Divisão Personalizada</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descrição / Metodologia:</label>
                <textarea
                  rows={2}
                  placeholder="Explique o foco metabólico, descanso e indicações..."
                  value={newTplDesc}
                  onChange={(e) => setNewTplDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Objetivo:</label>
                  <select
                    value={newTplGoal}
                    onChange={(e) => setNewTplGoal(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="condicionamento">Condicionamento Crossfit</option>
                    <option value="performance_luta">Lutas & Potência</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nível de Aluno:</label>
                  <select
                    value={newTplLevel}
                    onChange={(e) => setNewTplLevel(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Frequência Semanal:</label>
                  <select
                    value={newTplFreq}
                    onChange={(e) => setNewTplFreq(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value={3}>3 dias (ABC)</option>
                    <option value={4}>4 dias (ABCD / Upper-Lower)</option>
                    <option value={5}>5 dias (ABCDE)</option>
                    <option value={6}>6 dias (PPL 2x)</option>
                    <option value={7}>7 dias (Semana Completa)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Biotipo Indicado:</label>
                  <select
                    value={newTplBiotype}
                    onChange={(e) => setNewTplBiotype(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="todos">Todos os Biotipos</option>
                    <option value="ectomorfo">Ectomorfo</option>
                    <option value="mesomorfo">Mesomorfo</option>
                    <option value="endomorfo">Endomorfo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cuidados / Restrições Atendidas:</label>
                <input
                  type="text"
                  placeholder="Ex: Proteção Patelar, Proteção Lombar..."
                  value={newTplRestrictions}
                  onChange={(e) => setNewTplRestrictions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateTemplateModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
              >
                Salvar na Biblioteca
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Modal: Adicionar Exercício Manualmente */}
      {isAddExerciseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form onSubmit={handleAddExercise} className="max-w-md w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-alpha-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase">Adicionar ao Treino {selectedExerciseDay}</h4>
                  <span className="text-[10px] text-slate-500">Aluno: {selectedStudent.name}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nome do Exercício:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Supino Inclinado com Halteres..."
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Grupo Muscular:</label>
                  <select
                    value={newExCategory}
                    onChange={(e) => setNewExCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="peito">Peitoral</option>
                    <option value="costas">Costas / Dorsal</option>
                    <option value="pernas">Pernas / Quadríceps</option>
                    <option value="ombros">Ombros / Deltoides</option>
                    <option value="bracos">Braços (Bíceps/Tríceps)</option>
                    <option value="core">Abdômen / Core</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Séries Planejadas:</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newExSets}
                    onChange={(e) => setNewExSets(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Faixa de Repetições:</label>
                  <input
                    type="text"
                    placeholder="Ex: 8 a 10 ou 12-15"
                    value={newExReps}
                    onChange={(e) => setNewExReps(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descanso (segundos):</label>
                  <select
                    value={newExRest}
                    onChange={(e) => setNewExRest(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value={30}>30 segundos (Alta Densidade)</option>
                    <option value={45}>45 segundos (Queima / HIIT)</option>
                    <option value={60}>60 segundos (Hipertrofia Padrão)</option>
                    <option value={75}>75 segundos (Compostos)</option>
                    <option value={90}>90 segundos (Cargas Médias/Altas)</option>
                    <option value={120}>120 segundos (Força Pura / Terra / Agachamento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Orientações do Coach:</label>
                <input
                  type="text"
                  placeholder="Ex: Pico de contração no topo de 1s..."
                  value={newExNotes}
                  onChange={(e) => setNewExNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddExerciseModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md"
              >
                Salvar Exercício
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
