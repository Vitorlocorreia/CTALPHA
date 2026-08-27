import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  MessageSquare, 
  Dumbbell, 
  UserPlus, 
  Phone, 
  Calendar,
  X,
  CreditCard,
  QrCode,
  DollarSign,
  MoreVertical,
  Activity,
  History,
  Clock,
  ArrowUpRight,
  ChevronRight,
  FileText,
  ClipboardList,
  Edit3,
  User,
  HeartCrack,
  BedDouble,
  Briefcase,
  Footprints,
  Stethoscope,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Student, Biotype, Goal, StudentAssessment, ExperienceLevel, PainDetail } from '@/types';

export const StudentsView: React.FC = () => {
  const { 
    students, 
    selectedUnit, 
    userRole,
    sendWhatsAppBilling, 
    setCurrentView,
    generateWorkoutForStudent,
    addNewStudent,
    updateStudent,
    studentAssessments,
    getStudentAssessments,
    getLatestStudentAssessment,
    saveStudentAssessment,
    showNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialStudentId = queryParams?.get('student');
  const initialTab = (queryParams?.get('tab') as any) || 'geral';

  const [activeStudentDrawer, setActiveStudentDrawer] = useState<Student | null>(
    initialStudentId ? (students.find(s => s.id === initialStudentId) || null) : null
  );
  const [drawerTab, setDrawerTab] = useState<'geral' | 'cadastral' | 'anamnese' | 'financeiro' | 'treinos' | 'frequencia' | 'comunicacao' | 'historico'>(initialTab);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);

  React.useEffect(() => {
    if (initialStudentId && students.length > 0) {
      const found = students.find(s => s.id === initialStudentId);
      if (found) setActiveStudentDrawer(found);
    }
  }, [initialStudentId, students]);

  // Anamnesis Full Modal / Editor State
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [assessmentModalTab, setAssessmentModalTab] = useState<'dados_metas' | 'experiencia' | 'disponibilidade' | 'dores_limitacoes' | 'estilo_preferencias' | 'historico_observacoes'>('dados_metas');
  const [assessmentForm, setAssessmentForm] = useState<StudentAssessment | null>(null);
  const [selectedHistoricalAssessment, setSelectedHistoricalAssessment] = useState<StudentAssessment | null>(null);

  // New Student Form State
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCPF, setNewStudentCPF] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentUnit, setNewStudentUnit] = useState<'unidade-1' | 'unidade-2'>('unidade-1');
  const [newStudentPlan, setNewStudentPlan] = useState('Plano Alpha VIP Recorrente');
  const [newStudentPlanValue, setNewStudentPlanValue] = useState(149.90);
  const [newStudentModalities, setNewStudentModalities] = useState<('musculacao' | 'crossfit' | 'luta')[]>(['musculacao', 'crossfit']);

  const filteredStudents = students.filter((student) => {
    const matchesUnit = selectedUnit === 'todas' ? true : student.unit === selectedUnit;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.cpf.includes(searchQuery) ||
      student.phone.includes(searchQuery);
    
    const matchesModality = 
      selectedModality === 'todas' 
        ? true 
        : student.modalities.includes(selectedModality as any);

    const matchesStatus = 
      selectedStatus === 'todos' 
        ? true 
        : student.paymentStatus === selectedStatus;

    return matchesUnit && matchesSearch && matchesModality && matchesStatus;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentCPF) return;

    addNewStudent({
      name: newStudentName,
      cpf: newStudentCPF,
      phone: newStudentPhone || '(81) 99892-9667',
      email: newStudentEmail || 'aluno@ctalpha.com.br',
      unit: newStudentUnit,
      planName: newStudentPlan,
      planValue: newStudentPlanValue,
      modalities: newStudentModalities,
      biotype: 'mesomorfo',
      goal: 'hipertrofia',
    });

    setIsNewStudentModalOpen(false);
    setNewStudentName('');
    setNewStudentCPF('');
    setNewStudentPhone('');
  };

  const handleOpenAssessmentModal = (student: Student, existingAssessment?: StudentAssessment) => {
    const base = existingAssessment || getLatestStudentAssessment(student.id) || {
      id: `asm-${student.id}-${Date.now()}`,
      studentId: student.id,
      unit: student.unit,
      assessmentDate: new Date().toISOString().split('T')[0],
      assessorName: 'Coach Diego',
      isCurrent: true,
      heightCm: student.height || 175,
      weightKg: student.weight || 75,
      primaryGoal: student.goal ? (student.goal.charAt(0).toUpperCase() + student.goal.slice(1)) : 'Hipertrofia',
      secondaryGoals: ['Ganho de força'],
      experienceLevel: 'intermediario' as ExperienceLevel,
      trainingYears: 1.5,
      currentlyTraining: true,
      currentFrequencyDays: 4,
      otherSports: ['Futebol', 'Corrida'],
      machineExperience: 'boa',
      freeWeightsExperience: 'boa',
      complexLiftsExperience: 'moderada',
      daysPerWeek: 4,
      sessionDurationMinutes: 60,
      preferredTimeOfDay: 'manha',
      preferredDays: ['Seg', 'Ter', 'Qui', 'Sex'],
      hasPain: false,
      painDetails: {
        hasPain: false,
        location: 'Joelho',
        side: 'direito',
        intensity: 3,
        whenAppears: 'Em flexão profunda',
        triggerMovements: 'Agachamento livre pesado',
        safeMovements: 'Leg Press 45º, Cadeira Extensora',
        notes: 'Desconforto leve após futebol no fim de semana'
      },
      avoidMovements: ['Agachamento profundo com carga máxima'],
      prescriptionAlerts: ['Atenção à amplitude de flexão de joelho direito'],
      medicalClearance: true,
      sleepHoursAvg: 7,
      sleepQuality: 'boa',
      stressLevel: 'moderado',
      workRoutine: 'sentado',
      dailyStepsEstimate: 6000,
      favoriteExercises: ['Supino Reto', 'Puxada Alta', 'Leg Press'],
      dislikedExercises: ['Burpees', 'Afundo livre'],
      preferredEquipment: ['Halteres', 'Polias', 'Máquinas Articuladas'],
      preferenceWeightsVsMachines: 'misto',
      preferenceIntensity: 'moderada_alta',
      workoutPacePreference: 'equilibrado'
    };

    setAssessmentForm(JSON.parse(JSON.stringify(base)));
    setIsAssessmentModalOpen(true);
  };

  const handleSaveAssessment = async () => {
    if (!assessmentForm || !activeStudentDrawer) return;

    await saveStudentAssessment(assessmentForm);
    updateStudent(activeStudentDrawer.id, {
      height: assessmentForm.heightCm,
      weight: assessmentForm.weightKg,
      restrictions: assessmentForm.avoidMovements,
    });

    setIsAssessmentModalOpen(false);
    showNotification('Anamnese do aluno salva com sucesso no banco de dados!');
  };

  // Get active student's latest assessment and full history
  const activeStudentAssessment = activeStudentDrawer ? getLatestStudentAssessment(activeStudentDrawer.id) : undefined;
  const activeStudentAssessmentHistory = activeStudentDrawer ? getStudentAssessments(activeStudentDrawer.id) : [];

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão de Alunos</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Base cadastral ativa, prontuário de anamnese e controle de acesso
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewStudentModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 text-white dark:bg-alpha-500 hover:bg-slate-800 dark:hover:bg-alpha-600 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Cadastrar Aluno</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3 bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-alpha-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-alpha-500"
          >
            <option value="todas">Todas as Modalidades</option>
            <option value="musculacao">Musculação</option>
            <option value="crossfit">Crossfit</option>
            <option value="luta">Lutas (Tatame)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-alpha-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="adimplente">Ativos / Em dia</option>
            <option value="vencendo">Vencendo</option>
            <option value="atrasado">Inadimplentes</option>
          </select>
        </div>
      </div>

      {/* Main Table: Desktop / Cards: Mobile */}
      <div className="bg-white dark:bg-[#101522] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-[#0D121D] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                <th className="px-4 py-3">Aluno</th>
                <th className="px-3 py-3">Unidade</th>
                <th className="px-3 py-3">Plano</th>
                <th className="px-3 py-3">Status Catraca</th>
                <th className="px-3 py-3">Último Acesso</th>
                <th className="px-3 py-3">Vencimento</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => {
                    setActiveStudentDrawer(student);
                    setDrawerTab('geral');
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2.5 flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{student.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{student.cpf}</span>
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300 font-medium">
                    {student.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'}
                  </td>

                  <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200 font-medium">
                    {student.planName}
                  </td>

                  <td className="px-3 py-2.5">
                    {student.paymentStatus === 'adimplente' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                        ● Liberado
                      </span>
                    )}
                    {student.paymentStatus === 'vencendo' && (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">
                        Vence em breve
                      </span>
                    )}
                    {student.paymentStatus === 'atrasado' && (
                      <span className="text-red-700 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded text-[10px]">
                        Bloqueado ({student.daysLate}d)
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    {student.lastCheckIn || 'Hoje 06:45'}
                  </td>

                  <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-[11px]">
                    {student.dueDate}
                  </td>

                  <td className="px-4 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setActiveStudentDrawer(student);
                        setDrawerTab('geral');
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Adaptive Cards */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => {
                setActiveStudentDrawer(student);
                setDrawerTab('geral');
              }}
              className="p-3 rounded-xl bg-slate-50/60 dark:bg-[#0D121D] border border-slate-150 dark:border-slate-800/80 active:scale-[0.99] transition-all space-y-2.5 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                      {student.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {student.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'} • {student.cpf}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    student.paymentStatus === 'adimplente'
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                  }`}>
                    {student.paymentStatus === 'adimplente' ? 'Liberado' : 'Aviso'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Plano</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.planName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Vencimento</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 360º STUDENT PROFILE DRAWER */}
      {/* ========================================================================= */}
      {activeStudentDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0D121D] h-full shadow-2xl flex flex-col justify-between animate-slideLeft border-l border-slate-200 dark:border-slate-800">
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <img
                    src={activeStudentDrawer.avatar}
                    alt={activeStudentDrawer.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {activeStudentDrawer.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">● Ativo</span> • {activeStudentDrawer.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'} • {activeStudentDrawer.modalities.join(' + ').toUpperCase()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStudentDrawer(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 8 Profile Tabs (Visão Geral, Dados Cadastrais, Anamnese, Treinos, Financeiro, Frequência, Comunicação, Histórico) */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 overflow-x-auto text-xs font-semibold text-slate-500 scrollbar-none">
                <button
                  onClick={() => setDrawerTab('geral')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'geral' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setDrawerTab('cadastral')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'cadastral' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Dados Cadastrais
                </button>
                <button
                  onClick={() => setDrawerTab('anamnese')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'anamnese' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Anamnese & Avaliação
                </button>
                <button
                  onClick={() => setDrawerTab('treinos')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'treinos' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Treinamento
                </button>
                {userRole !== 'recepcao' && (
                  <button
                    onClick={() => setDrawerTab('financeiro')}
                    className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'financeiro' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                  >
                    Financeiro
                  </button>
                )}
                <button
                  onClick={() => setDrawerTab('frequencia')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'frequencia' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Frequência
                </button>
                <button
                  onClick={() => setDrawerTab('comunicacao')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'comunicacao' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Comunicação
                </button>
                <button
                  onClick={() => setDrawerTab('historico')}
                  className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-all ${drawerTab === 'historico' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Histórico
                </button>
              </div>
            </div>

            {/* Drawer Body Content according to Tab */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              
              {/* TAB 1: VISÃO GERAL */}
              {drawerTab === 'geral' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Plano Atual</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.planName}</span>
                      {userRole !== 'recepcao' ? (
                        <span className="text-[10px] text-slate-500">R$ {activeStudentDrawer.planValue.toFixed(2)}/mês</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">● Acesso Ativo</span>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Frequência Semanal</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">4,2x / semana</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Alta aderência</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Vencimento do Acesso</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.dueDate}</span>
                      <span className="text-[10px] text-slate-500">Liberação até a data</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Último Acesso</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.lastCheckIn || 'Hoje 06:45'}</span>
                      <span className="text-[10px] text-slate-500">Matriz (Musculação)</span>
                    </div>
                  </div>

                  {/* Anamnesis Quick Card */}
                  <div className="p-3.5 rounded-xl bg-alpha-500/5 dark:bg-alpha-500/10 border border-alpha-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-alpha-500" />
                        <span>Anamnese & Prontuário</span>
                      </span>
                      <button
                        onClick={() => setDrawerTab('anamnese')}
                        className="text-alpha-500 hover:underline font-semibold text-[11px] flex items-center gap-1"
                      >
                        <span>Ver completa</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Meta:</span>
                        <strong>{activeStudentAssessment?.primaryGoal || 'Hipertrofia'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Frequência:</span>
                        <strong>{activeStudentAssessment?.daysPerWeek || 4}x/semana</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Restrições:</span>
                        <strong className="text-amber-600">{activeStudentAssessment?.avoidMovements?.length || 0} movimentos</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Status:</span>
                        <strong className="text-emerald-600">Atualizada</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DADOS CADASTRAIS */}
              {drawerTab === 'cadastral' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/80 pb-2">
                      Informações Pessoais
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Nome Completo:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">CPF:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.cpf}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">WhatsApp / Telefone:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">E-mail:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.email}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Data de Matrícula:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.createdAt || '15/01/2024'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Unidade Principal:</span>
                        <strong className="text-slate-900 dark:text-slate-100">{activeStudentDrawer.unit === 'unidade-1' ? 'Matriz (Centro)' : 'Unidade 2 (Expansão)'}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/80 pb-2">
                      Contato de Emergência & Apoio
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Nome do Contato:</span>
                        <strong className="text-slate-900 dark:text-slate-100">Maria Bezerra (Esposa)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Telefone de Emergência:</span>
                        <strong className="text-slate-900 dark:text-slate-100">(81) 98822-1133</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[10px] block">Observações Administrativas:</span>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                          Aluno liberado para treinar em ambas as unidades pelo plano VIP. Possui atestado médico entregue na recepção.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ANAMNESE & AVALIAÇÃO (FONTE CENTRAL PERMANENTE) */}
              {drawerTab === 'anamnese' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          Prontuário de Anamnese & Avaliação
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Última atualização: <strong>{activeStudentAssessment?.assessmentDate || '26/08/2026'}</strong> por <strong>{activeStudentAssessment?.assessorName || 'Coach Diego'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAssessmentModal(activeStudentDrawer, activeStudentAssessment)}
                        className="px-3 py-1.5 bg-alpha-500 hover:bg-alpha-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Atualizar Avaliação</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Objetivo Principal</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                        {activeStudentAssessment?.primaryGoal || 'Hipertrofia'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Experiência</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block capitalize">
                        {activeStudentAssessment?.experienceLevel || 'Intermediário'} • {activeStudentAssessment?.trainingYears || 2} anos
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Frequência & Tempo</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                        {activeStudentAssessment?.daysPerWeek || 4}x/sem • {activeStudentAssessment?.sessionDurationMinutes || 60}min
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Dados Físicos</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                        {activeStudentAssessment?.weightKg || 80} kg • {(Number(activeStudentAssessment?.heightCm || 175) / 100).toFixed(2)} m
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Preferências de Treino</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                        {activeStudentAssessment?.preferenceWeightsVsMachines === 'maquinas' ? 'Máquinas' : 'Misto (Pesos + Máquinas)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Restrições / Cuidados</span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                        {activeStudentAssessment?.avoidMovements?.length || 0} movimentos declarados
                      </span>
                    </div>
                  </div>

                  {/* Pain & Medical Alerts Box */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h5 className="font-bold text-xs text-amber-900 dark:text-amber-300">
                        Alertas Clínicos & Prescrição
                      </h5>
                    </div>
                    {activeStudentAssessment?.prescriptionAlerts && activeStudentAssessment.prescriptionAlerts.length > 0 ? (
                      <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-1 pl-4 list-disc">
                        {activeStudentAssessment.prescriptionAlerts.map((alert, idx) => (
                          <li key={idx}>{alert}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500">Nenhum alerta de limitação crítica declarado pelo aluno.</p>
                    )}
                  </div>

                  {/* History of Previous Assessments */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Histórico de Versões da Anamnese
                    </h5>
                    <div className="space-y-1.5">
                      {activeStudentAssessmentHistory.map((asm, idx) => (
                        <div
                          key={asm.id}
                          className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${asm.isCurrent ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                              {asm.isCurrent ? '● Atual' : `#${activeStudentAssessmentHistory.length - idx}`}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white text-xs">{asm.assessmentDate}</span>
                            <span className="text-slate-400">• {asm.assessorName}</span>
                          </div>

                          <button
                            onClick={() => handleOpenAssessmentModal(activeStudentDrawer, asm)}
                            className="text-alpha-500 hover:underline font-semibold text-xs flex items-center gap-1"
                          >
                            <span>Inspecionar</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentView('workout_builder')}
                      className="w-full py-2.5 bg-slate-900 text-white dark:bg-slate-800 hover:bg-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <Dumbbell className="w-4 h-4 text-alpha-500" />
                      <span>Abrir Prescrição deste Aluno no Construtor</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: TREINOS */}
              {drawerTab === 'treinos' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Programa Ativo: ABC — Hipertrofia</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ Revisado pelo Treinador</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">4 dias por semana • Foco em deltoides e membros inferiores</p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Treino A: Peitoral, Tríceps & Ombro</span>
                      <span className="text-slate-500">Supino Reto, Crucifixo Polia, Desenvolvimento Militar</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Treino B: Dorsal & Bíceps</span>
                      <span className="text-slate-500">Puxada Alta, Remada Baixa, Rosca Scott</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">Treino C: Pernas & Core</span>
                      <span className="text-slate-500">Agachamento, Leg Press 45º, Cadeira Extensora</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: FINANCEIRO (SOMENTE GESTOR) */}
              {drawerTab === 'financeiro' && userRole !== 'recepcao' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">Extrato de Cobranças</span>
                    <span className="text-[11px] text-slate-500">Recorrência PIX/Cartão</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">Mensalidade 05/08/2026</span>
                        <span className="text-[10px] text-slate-400">Pago via PIX Dinâmico • 05/08 às 08:12</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block">R$ {activeStudentDrawer.planValue.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Liquidado</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">Mensalidade 05/07/2026</span>
                        <span className="text-[10px] text-slate-400">Pago via Cartão Recorrente</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block">R$ {activeStudentDrawer.planValue.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Liquidado</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: FREQUÊNCIA */}
              {drawerTab === 'frequencia' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block">Últimos 5 Check-ins</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span>Hoje, 26/08 às 06:45</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Crossfit Box (Unidade 1)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span>Segunda, 24/08 às 07:10</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Musculação (Unidade 1)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex justify-between">
                      <span>Sábado, 22/08 às 08:30</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Crossfit Box (Unidade 1)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: COMUNICAÇÃO */}
              {drawerTab === 'comunicacao' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block">Histórico de Mensagens WhatsApp</span>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>02/08/2026 às 10:00</span>
                      <span className="text-emerald-600 font-semibold">Entregue</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">"Olá Carlos, seu treino novo foi revisado pelo Coach Diego e está liberado no app!"</p>
                  </div>
                </div>
              )}

              {/* TAB 8: HISTÓRICO */}
              {drawerTab === 'historico' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block">Linha do Tempo</span>
                  <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 space-y-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">26/08/2026</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Anamnese Clínica Atualizada</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">20/08/2026</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Prescrição de Treino Atualizada</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">15/01/2024</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Upgrade para Plano Alpha VIP (Livre)</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Actions Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#101522] flex items-center justify-between">
              <button
                onClick={() => sendWhatsAppBilling(activeStudentDrawer.id)}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enviar WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  generateWorkoutForStudent({
                    studentId: activeStudentDrawer.id,
                    biotype: activeStudentDrawer.biotype || 'mesomorfo',
                    goal: activeStudentDrawer.goal || 'hipertrofia',
                    restrictions: activeStudentDrawer.restrictions || [],
                    daysPerWeek: 4
                  });
                  setCurrentView('workout_builder');
                }}
                className="px-4 py-2 bg-alpha-500 hover:bg-alpha-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Prescrever Treino</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL ANAMNESIS & CLINICAL ASSESSMENT MODAL (6 DETAILED TABS) */}
      {/* ========================================================================= */}
      {isAssessmentModalOpen && assessmentForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white dark:bg-[#0D121D] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp text-xs text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-alpha-500 text-white flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Prontuário de Anamnese & Avaliação do Aluno
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fonte oficial para prescrição inteligente de treinos e acompanhamento
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 6 Assessment Tabs Bar */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-[#0D121D] overflow-x-auto font-semibold text-xs text-slate-500 scrollbar-none">
              <button
                onClick={() => setAssessmentModalTab('dados_metas')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'dados_metas' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                1. Dados Físicos & Metas
              </button>
              <button
                onClick={() => setAssessmentModalTab('experiencia')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'experiencia' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                2. Experiência
              </button>
              <button
                onClick={() => setAssessmentModalTab('disponibilidade')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'disponibilidade' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                3. Disponibilidade
              </button>
              <button
                onClick={() => setAssessmentModalTab('dores_limitacoes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'dores_limitacoes' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                4. Dores & Limitações
              </button>
              <button
                onClick={() => setAssessmentModalTab('estilo_preferencias')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'estilo_preferencias' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                5. Estilo & Preferências
              </button>
              <button
                onClick={() => setAssessmentModalTab('historico_observacoes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-all ${assessmentModalTab === 'historico_observacoes' ? 'border-alpha-500 text-slate-900 dark:text-white font-bold' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                6. Notas do Treinador
              </button>
            </div>

            {/* Assessment Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              
              {/* TAB 1: DADOS FÍSICOS & METAS */}
              {assessmentModalTab === 'dados_metas' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Peso Corporal (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={assessmentForm.weightKg}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, weightKg: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Estatura / Altura (cm):</label>
                    <input
                      type="number"
                      value={assessmentForm.heightCm}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, heightCm: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Objetivo Principal:</label>
                    <select
                      value={assessmentForm.primaryGoal}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, primaryGoal: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value="Hipertrofia">Hipertrofia / Ganho de Massa</option>
                      <option value="Emagrecimento">Emagrecimento / Definição</option>
                      <option value="Forca">Ganho de Força Bruta</option>
                      <option value="Condicionamento">Condicionamento / Crossfit</option>
                      <option value="Saude">Qualidade de Vida & Mobilidade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Avaliador Responsável:</label>
                    <input
                      type="text"
                      value={assessmentForm.assessorName}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, assessorName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EXPERIÊNCIA */}
              {assessmentModalTab === 'experiencia' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Nível de Experiência:</label>
                    <select
                      value={assessmentForm.experienceLevel}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, experienceLevel: e.target.value as any })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value="iniciante">Iniciante (menos de 6 meses)</option>
                      <option value="intermediario">Intermediário (6 meses a 3 anos)</option>
                      <option value="avancado">Avançado (mais de 3 anos de treino sério)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Tempo de Treino Contínuo (Anos):</label>
                    <input
                      type="number"
                      step="0.5"
                      value={assessmentForm.trainingYears || 1.5}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, trainingYears: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: DISPONIBILIDADE */}
              {assessmentModalTab === 'disponibilidade' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Frequência Semanal (Dias):</label>
                    <select
                      value={assessmentForm.daysPerWeek}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, daysPerWeek: parseInt(e.target.value) || 4 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value={2}>2 dias por semana</option>
                      <option value={3}>3 dias por semana (ABC clássico)</option>
                      <option value={4}>4 dias por semana (AB / Upper-Lower)</option>
                      <option value={5}>5 dias por semana (ABCDE / PPL)</option>
                      <option value={6}>6 dias por semana (PPLx2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Duração da Sessão (Minutos):</label>
                    <input
                      type="number"
                      value={assessmentForm.sessionDurationMinutes}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, sessionDurationMinutes: parseInt(e.target.value) || 60 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: DORES & LIMITAÇÕES */}
              {assessmentModalTab === 'dores_limitacoes' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assessmentForm.hasPain}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, hasPain: e.target.checked })}
                        className="w-4 h-4 rounded text-alpha-500"
                      />
                      <span>Aluno relata dor ou limitação articular/muscular</span>
                    </label>

                    {assessmentForm.hasPain && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block font-bold mb-1">Local da Dor:</label>
                          <input
                            type="text"
                            placeholder="Ex: Joelho direito, Lombar, Ombro..."
                            value={assessmentForm.painDetails?.location || ''}
                            onChange={(e) => setAssessmentForm({
                              ...assessmentForm,
                              painDetails: { ...assessmentForm.painDetails, hasPain: true, location: e.target.value }
                            })}
                            className="w-full bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Intensidade (1 a 10):</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={assessmentForm.painDetails?.intensity || 3}
                            onChange={(e) => setAssessmentForm({
                              ...assessmentForm,
                              painDetails: { ...assessmentForm.painDetails, hasPain: true, intensity: parseInt(e.target.value) || 1 }
                            })}
                            className="w-full bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Movimentos e Exercícios a Evitar:</label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Agachamento profundo pesado, Desenvolvimento por trás da nuca..."
                      value={assessmentForm.avoidMovements.join(', ')}
                      onChange={(e) => setAssessmentForm({
                        ...assessmentForm,
                        avoidMovements: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: ESTILO & PREFERÊNCIAS */}
              {assessmentModalTab === 'estilo_preferencias' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">Preferência de Equipamentos:</label>
                    <select
                      value={assessmentForm.preferenceWeightsVsMachines}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, preferenceWeightsVsMachines: e.target.value as any })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold"
                    >
                      <option value="misto">Misto (Máquinas + Halteres + Barras)</option>
                      <option value="maquinas">Predileção por Máquinas Biomecânicas</option>
                      <option value="pesos_livres">Predileção por Pesos Livres / Halteres</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Média de Horas de Sono:</label>
                    <input
                      type="number"
                      value={assessmentForm.sleepHoursAvg || 7}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, sleepHoursAvg: parseInt(e.target.value) || 7 })}
                      className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: HISTÓRICO & NOTAS DO TREINADOR */}
              {assessmentModalTab === 'historico_observacoes' && (
                <div className="space-y-3">
                  <label className="block font-bold">Observações Clínicas e Orientações Profissionais:</label>
                  <textarea
                    rows={4}
                    placeholder="Notas confidenciais do treinador sobre resposta muscular, progressão de carga e recomendações para prescrição..."
                    value={assessmentForm.painDetails?.notes || ''}
                    onChange={(e) => setAssessmentForm({
                      ...assessmentForm,
                      painDetails: { ...assessmentForm.painDetails, hasPain: assessmentForm.hasPain, notes: e.target.value }
                    })}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs leading-relaxed"
                  />
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] flex items-center justify-between">
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold"
              >
                Cancelar
              </button>

              <button
                onClick={handleSaveAssessment}
                className="px-6 py-2.5 bg-alpha-500 hover:bg-alpha-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Nova Avaliação no Banco</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NOVO ALUNO MODAL */}
      {/* ========================================================================= */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0D121D] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cadastrar Novo Aluno</h3>
              <button onClick={() => setIsNewStudentModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 mt-3">
              <div>
                <label className="block font-bold mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ex: João Paulo Silva"
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">CPF:</label>
                  <input
                    type="text"
                    required
                    value={newStudentCPF}
                    onChange={(e) => setNewStudentCPF(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">WhatsApp:</label>
                  <input
                    type="text"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="(81) 99999-9999"
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Unidade:</label>
                  <select
                    value={newStudentUnit}
                    onChange={(e) => setNewStudentUnit(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                  >
                    <option value="unidade-1">Matriz (Centro)</option>
                    <option value="unidade-2">Unidade 2 (Expansão)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Plano:</label>
                  <select
                    value={newStudentPlan}
                    onChange={(e) => setNewStudentPlan(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2"
                  >
                    <option value="Plano Alpha VIP Recorrente">Plano Alpha VIP</option>
                    <option value="Plano Crossfit + Musculação">Crossfit + Musculação</option>
                    <option value="Plano Musculação Tradicional">Musculação Tradicional</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-alpha-500 hover:bg-alpha-600 text-white font-bold rounded-xl mt-2 shadow-md transition-all uppercase tracking-wider text-xs"
              >
                Salvar Matrícula no Banco
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
