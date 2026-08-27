import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Dumbbell, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  QrCode, 
  CreditCard, 
  Flame, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Filter,
  X,
  Building2,
  Activity,
  HeartPulse,
  Receipt,
  Plus,
  Play,
  Folder,
  FolderOpen,
  ChevronDown,
  Info,
  RotateCcw,
  Scale,
  ClipboardList,
  HeartCrack,
  Edit3
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';
import { Goal, Biotype, WorkoutRoutine, BioimpedanceData } from '@/types';
import { WorkoutTrackerView } from './WorkoutTrackerView';
import { WorkoutHubView } from './WorkoutHubView';

export const StudentPortalView: React.FC = () => {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isWorkoutHubOpen, setIsWorkoutHubOpen] = useState(false);
  const { 
    setCurrentView, 
    setUserRole, 
    students, 
    activeStudentId, 
    updateStudent,
    workouts,
    generateWorkoutForStudent,
    approveWorkout,
    getLatestStudentAssessment,
    showNotification 
  } = useApp();

  // Active logged-in student (dynamically connected to registration and Supabase)
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0] || {
    id: 'std-default',
    name: 'Aluno CT ALPHA',
    cpf: '000.000.000-00',
    phone: '(81) 99892-9667',
    email: 'aluno@ctalpha.com.br',
    unit: 'unidade-1',
    planName: 'Plano Alpha VIP',
    planValue: 149.90,
    paymentStatus: 'adimplente',
    dueDate: '2026-09-08',
    height: 175,
    weight: 75,
    biotype: 'mesomorfo' as Biotype,
    goal: 'hipertrofia' as Goal,
    restrictions: []
  };

  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialTab = (queryParams?.get('tab') as any) || 'treinos';
  const [activeTab, setActiveTab] = useState<'treinos' | 'agenda' | 'bioimpedancia' | 'financeiro' | 'cadastro'>(initialTab);
  const currentAssessment = getLatestStudentAssessment(currentStudent.id);
  const [isClientAnamnesisModalOpen, setIsClientAnamnesisModalOpen] = useState(false);

  // Form State for Dados Cadastrais (Synced with currentStudent)
  const [name, setName] = useState(currentStudent.name);
  const [cpf, setCpf] = useState(currentStudent.cpf);
  const [email, setEmail] = useState(currentStudent.email || '');
  const [phone, setPhone] = useState(currentStudent.phone);
  const [height, setHeight] = useState(String(currentStudent.height || 175));
  const [weight, setWeight] = useState(String(currentStudent.weight || 75));
  const [goal, setGoal] = useState<Goal>(currentStudent.goal || 'hipertrofia');
  const [restrictions, setRestrictions] = useState<string[]>(currentStudent.restrictions || []);
  const [address, setAddress] = useState('Rua Marechal Deodoro da Fonseca, 150');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [city, setCity] = useState('Aliança');
  const [stateUf, setStateUf] = useState('PE');
  const [cep, setCep] = useState('55890-000');

  // Sync state when active student changes
  useEffect(() => {
    setName(currentStudent.name);
    setCpf(currentStudent.cpf);
    setEmail(currentStudent.email || '');
    setPhone(currentStudent.phone);
    setHeight(String(currentStudent.height || 175));
    setWeight(String(currentStudent.weight || 75));
    setGoal(currentStudent.goal || 'hipertrofia');
    setRestrictions(currentStudent.restrictions || []);
  }, [currentStudent]);

  // Workout state & Generator Modal
  const studentWorkouts = workouts.filter(w => 
    w.studentId === currentStudent.id || 
    w.studentName.toLowerCase().includes(currentStudent.name.toLowerCase())
  );
  const activeWorkout = studentWorkouts[0] || workouts[0];

  const [selectedGroupLetter, setSelectedGroupLetter] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Accordion Sanfona States (Fichas e Pastas dos Dias)
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>('prog-1');
  const [expandedDayLetter, setExpandedDayLetter] = useState<string | null>('A');

  // Generator form parameters
  const [genGoal, setGenGoal] = useState<Goal>(currentStudent.goal || 'hipertrofia');
  const [genDays, setGenDays] = useState(4);
  const [genBiotype, setGenBiotype] = useState<Biotype>(currentStudent.biotype || 'mesomorfo');
  const [genRestriction, setGenRestriction] = useState<string>('nenhuma');
  const [isGenerating, setIsGenerating] = useState(false);

  // Agenda Filter State
  const [agendaPeriod, setAgendaPeriod] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');
  const [agendaUnit, setAgendaUnit] = useState<'unidade-1' | 'unidade-2'>(currentStudent.unit || 'unidade-1');
  const [selectedClassToBook, setSelectedClassToBook] = useState<any | null>(null);
  const [bookedClasses, setBookedClasses] = useState<string[]>(['c-1']);

  const handleSaveCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      name,
      cpf,
      email,
      phone,
      height: Number(height),
      weight: Number(weight),
      goal,
      restrictions
    });
  };

  const toggleExerciseDone = (exerciseId: string) => {
    if (completedExerciseIds.includes(exerciseId)) {
      setCompletedExerciseIds(completedExerciseIds.filter(id => id !== exerciseId));
    } else {
      setCompletedExerciseIds([...completedExerciseIds, exerciseId]);
      showNotification('Série registrada no histórico do treino!');
    }
  };

  const handleGenerateAutomaticWorkout = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const restList = genRestriction !== 'nenhuma' ? [genRestriction] : [];
      generateWorkoutForStudent({
        studentId: currentStudent.id,
        biotype: genBiotype,
        goal: genGoal,
        restrictions: restList,
        daysPerWeek: genDays
      });

      setIsGenerating(false);
      setIsGeneratorOpen(false);
      showNotification(`Nova periodização gerada automaticamente para ${currentStudent.name}!`);
    }, 600);
  };

  const handleBookClass = (classId: string, className: string, time: string) => {
    if (bookedClasses.includes(classId)) {
      setBookedClasses(bookedClasses.filter(c => c !== classId));
      showNotification(`Reserva cancelada para ${className} às ${time}.`);
    } else {
      setBookedClasses([...bookedClasses, classId]);
      showNotification(`Vaga confirmada para ${className} às ${time}!`);
    }
    setSelectedClassToBook(null);
  };

  // Schedule Classes Data
  const scheduleData = [
    {
      date: '26/08',
      dayOfWeek: 'Quarta',
      active: true,
      classes: [
        { id: 'c-1', time: '06:00', title: 'HIIT / CROSSFIT WOD', coach: 'Coach Diego', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-2', time: '06:30', title: 'TREINAMENTO FUNCIONAL', coach: 'Prof. Lucas', color: 'bg-purple-600', period: 'manha' },
        { id: 'c-3', time: '07:00', title: 'RITMOS & FIT DANCE', coach: 'Profª. Camila', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-4', time: '08:00', title: 'CORE & POSTURA', coach: 'Prof. Diego', color: 'bg-teal-600', period: 'manha' },
        { id: 'c-5', time: '08:30', title: 'STEP TRAINING', coach: 'Profª. Amanda', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-6', time: '17:00', title: 'BOX DE CROSSFIT (WOD)', coach: 'Coach Diego', color: 'bg-orange-500', period: 'tarde' },
        { id: 'c-7', time: '18:00', title: 'PILATES SOLO', coach: 'Profª. Camila', color: 'bg-cyan-600', period: 'noite' },
        { id: 'c-8', time: '18:30', title: 'HIIT & QUEIMA', coach: 'Prof. Lucas', color: 'bg-orange-500', period: 'noite' },
        { id: 'c-9', time: '19:30', title: 'MUAY THAI OFICIAL', coach: 'Mestre Silva', color: 'bg-slate-900', period: 'noite' },
      ]
    },
    {
      date: '27/08',
      dayOfWeek: 'Quinta',
      active: false,
      classes: [
        { id: 'c-11', time: '06:00', title: 'GAP & GLÚTEOS', coach: 'Profª. Amanda', color: 'bg-purple-600', period: 'manha' },
        { id: 'c-12', time: '06:30', title: 'MOBILIDADE ARTICULAR', coach: 'Coach Diego', color: 'bg-teal-600', period: 'manha' },
        { id: 'c-13', time: '07:00', title: 'PILATES SOLO', coach: 'Profª. Camila', color: 'bg-teal-600', period: 'manha' },
        { id: 'c-14', time: '08:30', title: 'JIU-JITSU FUNDAMENTOS', coach: 'Mestre Silva', color: 'bg-slate-900', period: 'manha' },
        { id: 'c-15', time: '17:00', title: 'RITMOS', coach: 'Profª. Amanda', color: 'bg-orange-500', period: 'tarde' },
        { id: 'c-16', time: '18:00', title: 'CROSSFIT WOD', coach: 'Coach Diego', color: 'bg-orange-500', period: 'noite' },
        { id: 'c-17', time: '19:00', title: 'FIT DANCE', coach: 'Profª. Camila', color: 'bg-orange-500', period: 'noite' },
        { id: 'c-18', time: '20:00', title: 'JIU-JITSU AVANÇADO', coach: 'Mestre Silva', color: 'bg-slate-900', period: 'noite' },
      ]
    },
    {
      date: '28/08',
      dayOfWeek: 'Sexta',
      active: false,
      classes: [
        { id: 'c-20', time: '06:00', title: 'HIIT / CONDICIONAMENTO', coach: 'Coach Diego', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-21', time: '06:30', title: 'FUNCIONAL INTENSO', coach: 'Prof. Lucas', color: 'bg-purple-600', period: 'manha' },
        { id: 'c-22', time: '07:00', title: 'RITMOS', coach: 'Profª. Camila', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-23', time: '08:00', title: 'CORE & POSTURA', coach: 'Coach Diego', color: 'bg-teal-600', period: 'manha' },
        { id: 'c-24', time: '18:00', title: 'MUAY THAI COMBATE', coach: 'Mestre Silva', color: 'bg-slate-900', period: 'noite' },
        { id: 'c-25', time: '19:00', title: 'CROSSFIT TEAM WOD', coach: 'Coach Diego', color: 'bg-orange-500', period: 'noite' },
      ]
    },
    {
      date: '29/08',
      dayOfWeek: 'Sábado',
      active: false,
      classes: [
        { id: 'c-28', time: '08:00', title: 'AULÃO DE CIRCUITO FUNCIONAL', coach: 'Equipe CT ALPHA', color: 'bg-orange-500', period: 'manha' },
        { id: 'c-29', time: '09:30', title: 'SUPER AULÃO DE RITMOS', coach: 'Equipe CT ALPHA', color: 'bg-orange-500', period: 'manha' },
      ]
    },
    {
      date: '30/08',
      dayOfWeek: 'Domingo',
      active: false,
      classes: []
    }
  ];

  // Dedicated Workout Hub View (Pastas, Rotinas e Treino do Dia)
  if (isWorkoutHubOpen && activeWorkout) {
    return (
      <WorkoutHubView
        routine={activeWorkout}
        studentName={currentStudent.name}
        studentGoal={currentStudent.goal}
        onBack={() => setIsWorkoutHubOpen(false)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />
    );
  }

  // Dedicated Fullscreen Workout Tracker View (MFit / Strong / Hevy style)
  if (isTrackerOpen && activeWorkout) {
    return (
      <WorkoutTrackerView
        routine={activeWorkout}
        initialGroupLetter={selectedGroupLetter}
        onClose={() => setIsTrackerOpen(false)}
        onFinish={(summary) => {
          showNotification(`Treino concluído em ${summary.duration}! Volume total levantado: ${summary.totalVolumeKg.toLocaleString('pt-BR')} kg.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-alpha-500 selection:text-white">
      
      {/* 1. Top Enterprise Premium Navbar */}
      <header className="bg-[#111622] text-white px-4 sm:px-8 py-3 flex items-center justify-between border-b border-slate-800 shadow-md sticky top-0 z-40 backdrop-blur-md">
        
        {/* Brand & Tabs */}
        <div className="flex items-center gap-6 sm:gap-10">
          
          {/* Logo Oficial CT ALPHA */}
          <div 
            onClick={() => setActiveTab('treinos')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1.5 flex items-center justify-center shadow-inner group-hover:border-alpha-500 transition-colors">
              <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="text-sm sm:text-base font-black tracking-wider uppercase font-sans text-white block">
                CT <span className="text-alpha-500">ALPHA</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                Espaço do Aluno
              </span>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('treinos')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'treinos' 
                  ? 'bg-alpha-500 text-white font-black shadow-md shadow-alpha-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Meus Treinos</span>
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'agenda' 
                  ? 'bg-alpha-500 text-white font-black shadow-md shadow-alpha-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Aulas</span>
            </button>

            <button
              onClick={() => setActiveTab('bioimpedancia')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'bioimpedancia' 
                  ? 'bg-alpha-500 text-white font-black shadow-md shadow-alpha-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Bioimpedância & Avaliação</span>
            </button>

            <button
              onClick={() => setActiveTab('financeiro')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'financeiro' 
                  ? 'bg-alpha-500 text-white font-black shadow-md shadow-alpha-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Financeiro</span>
            </button>

            <button
              onClick={() => setActiveTab('cadastro')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'cadastro' 
                  ? 'bg-alpha-500 text-white font-black shadow-md shadow-alpha-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Dados Cadastrais</span>
            </button>
          </nav>
        </div>

        {/* Right User Status & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Student Profile Pill */}
          <div className="flex items-center gap-3 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-alpha-400 uppercase">
                {currentStudent.name.charAt(0)}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" title="Matrícula Ativa" />
            </div>

            <div className="hidden lg:block text-left leading-tight">
              <span className="text-xs font-bold text-white block">{currentStudent.name}</span>
              <span className="text-[10px] text-slate-400 block">
                {currentStudent.unit === 'unidade-1' ? 'Matriz (Centro) - Aliança/PE' : 'Unidade 2 (Expansão)'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              setUserRole('gestor');
              setCurrentView('login');
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/60 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Sair do Portal do Aluno"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden bg-[#111622] border-b border-slate-800 px-3 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar sticky top-14 z-30">
        {[
          { id: 'treinos', label: 'Treinos', icon: Dumbbell },
          { id: 'agenda', label: 'Agenda', icon: Calendar },
          { id: 'bioimpedancia', label: 'Bioimpedância', icon: Scale },
          { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
          { id: 'cadastro', label: 'Cadastro', icon: User },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive ? 'bg-alpha-500 text-white' : 'text-slate-400 hover:text-white bg-slate-900/50'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* =========================================================================
            TAB 1: MEUS TREINOS (DASHBOARD HOME & WORKOUTS INTERCONNECTED)
           ========================================================================= */}
        {activeTab === 'treinos' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Plan Info Card (Dynamic Data from Registration) */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-1">Meu plano</span>
                <p className="text-base font-black text-slate-900 leading-tight">{currentStudent.planName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Recorrência iniciada em {currentStudent.createdAt || '05/07/2026'}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold italic mt-1">
                  PAR-Q & Anamnese validada
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Próxima mensalidade</span>
                <div className="flex items-baseline gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      R$ {currentStudent.planValue ? Number(currentStudent.planValue).toFixed(2) : '149.90'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vencimento</span>
                    <span className="text-sm font-bold text-slate-800">
                      {currentStudent.dueDate || '08/09/2026'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Taxa de matrícula / adesão</span>
                <div className="flex items-baseline gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor</span>
                    <span className="text-base font-black text-emerald-600 font-mono">R$ 0,00</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span className="text-sm font-bold text-emerald-600">Isento (Grátis)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Pastas Sanfona (Accordion) de 'Seus Treinos' */}
            <div className="space-y-4">
              
              {/* Header do Card Seus Treinos */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-alpha-600 border border-orange-200 flex items-center justify-center shrink-0 shadow-xs">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase">
                          Ficha Ativa • {activeWorkout?.divisionName || 'ABCD'}
                        </span>
                        <span className="text-xs text-slate-400">
                          Assinado por {activeWorkout?.coachName || 'Coach Diego'}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Seus Treinos & Rotinas
                      </h3>
                      <p className="text-xs text-slate-500">
                        Clique nas pastas sanfonadas abaixo para abrir a divisão e acessar o treino do dia.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsGeneratorOpen(true)}
                    className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-alpha-500/25 flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nova Periodização</span>
                  </button>
                </div>

                {/* SANFONA NÍVEL 1: FICHA 1 (Treino 1 - Hipertrofia Estrutural ABCD) */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs">
                  
                  {/* Cabeçalho Sanfona Ficha 1 */}
                  <div
                    onClick={() => setExpandedProgramId(expandedProgramId === 'prog-1' ? null : 'prog-1')}
                    className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors ${
                      expandedProgramId === 'prog-1' ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        expandedProgramId === 'prog-1' ? 'bg-alpha-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}>
                        {expandedProgramId === 'prog-1' ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            expandedProgramId === 'prog-1' ? 'text-alpha-400' : 'text-alpha-600'
                          }`}>
                            Treino 1 • Divisão ABCD (Hipertrofia)
                          </span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.2 rounded-full uppercase">
                            Ativa
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-tight">
                          Periodização Hipertrofia & Força (Fase 1)
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs hidden sm:inline font-medium ${
                        expandedProgramId === 'prog-1' ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        4 Pastas dos Dias
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        expandedProgramId === 'prog-1' ? 'rotate-180 text-alpha-400' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>

                  {/* Conteúdo Expandido da Ficha 1: Pastas dos Dias Sanfonadas */}
                  {expandedProgramId === 'prog-1' && (
                    <div className="p-4 sm:p-5 bg-slate-50/50 border-t border-slate-200 space-y-3 animate-fadeIn">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Pastas dos Dias de Treino:
                      </span>

                      {/* --- SANFONA DIA A --- */}
                      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                        <div
                          onClick={() => setExpandedDayLetter(expandedDayLetter === 'A' ? null : 'A')}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-alpha-500 text-white font-black text-xs flex items-center justify-center">
                              A
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                                  Treino A: Peitoral, Deltoides & Tríceps (Push)
                                </h5>
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Hoje
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500">
                                Segunda / Quinta • 6 exercícios (50 min)
                              </span>
                            </div>
                          </div>

                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            expandedDayLetter === 'A' ? 'rotate-180 text-alpha-500' : ''
                          }`} />
                        </div>

                        {/* Conteúdo do Treino do Dia A */}
                        {expandedDayLetter === 'A' && (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                            
                            {/* Músculos Trabalhados */}
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                                Músculos Trabalhados no Dia A:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Peitoral Maior', 'Deltoide Anterior', 'Deltoide Lateral', 'Tríceps Braquial'].map(m => (
                                  <span key={m} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-xs">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Exercícios do Dia A */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Exercícios do Treino:
                              </span>
                              {[
                                { name: 'Supino Reto com Barra', sets: '4x 10-12', rest: '60s', prev: '32.5 kg' },
                                { name: 'Supino Inclinado com Halteres', sets: '4x 10-12', rest: '60s', prev: '24.0 kg' },
                                { name: 'Crossover na Polia Média', sets: '3x 12-15', rest: '45s', prev: '17.5 kg' },
                                { name: 'Desenvolvimento Militar Halteres', sets: '4x 10', rest: '60s', prev: '18.0 kg' },
                                { name: 'Elevação Lateral com Halteres', sets: '4x 12-15', rest: '45s', prev: '10.0 kg' },
                                { name: 'Tríceps Pulley na Corda', sets: '4x 12', rest: '45s', prev: '22.5 kg' },
                              ].map((ex, idx) => (
                                <div key={ex.name} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span className="font-bold text-slate-800">{ex.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[11px]">
                                    <span className="font-mono font-bold text-slate-900">{ex.sets}</span>
                                    <span className="text-slate-400 font-mono">{ex.rest}</span>
                                    <span className="font-mono font-bold text-alpha-600">{ex.prev}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Botão de Iniciar Sessão */}
                            <button
                              onClick={() => {
                                setSelectedGroupLetter('A');
                                setIsTrackerOpen(true);
                              }}
                              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Iniciar Treino A no App (MFit)</span>
                            </button>

                          </div>
                        )}
                      </div>

                      {/* --- SANFONA DIA B --- */}
                      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                        <div
                          onClick={() => setExpandedDayLetter(expandedDayLetter === 'B' ? null : 'B')}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                              B
                            </span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-black text-slate-900">
                                Treino B: Dorsal, Trapézio & Bíceps (Pull)
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                Terça / Sexta • 6 exercícios (50 min)
                              </span>
                            </div>
                          </div>

                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            expandedDayLetter === 'B' ? 'rotate-180 text-alpha-500' : ''
                          }`} />
                        </div>

                        {/* Conteúdo do Treino do Dia B */}
                        {expandedDayLetter === 'B' && (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                                Músculos Trabalhados no Dia B:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Latíssimo do Dorso', 'Romboide', 'Trapézio', 'Bíceps Braquial', 'Antebraço'].map(m => (
                                  <span key={m} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-xs">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {[
                                { name: 'Puxada Frontal na Barra Aberta', sets: '4x 10-12', rest: '60s', prev: '50.0 kg' },
                                { name: 'Remada Curvada com Barra', sets: '4x 10', rest: '60s', prev: '40.0 kg' },
                                { name: 'Remada Baixa no Triângulo', sets: '3x 12', rest: '45s', prev: '45.0 kg' },
                                { name: 'Rosca Direta com Barra W', sets: '4x 10', rest: '60s', prev: '15.0 kg' },
                                { name: 'Rosca Martelo com Halteres', sets: '3x 12', rest: '45s', prev: '14.0 kg' },
                              ].map((ex, idx) => (
                                <div key={ex.name} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span className="font-bold text-slate-800">{ex.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[11px]">
                                    <span className="font-mono font-bold text-slate-900">{ex.sets}</span>
                                    <span className="text-slate-400 font-mono">{ex.rest}</span>
                                    <span className="font-mono font-bold text-alpha-600">{ex.prev}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedGroupLetter('B');
                                setIsTrackerOpen(true);
                              }}
                              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Iniciar Treino B no App (MFit)</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* --- SANFONA DIA C --- */}
                      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                        <div
                          onClick={() => setExpandedDayLetter(expandedDayLetter === 'C' ? null : 'C')}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                              C
                            </span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-black text-slate-900">
                                Treino C: Membros Inferiores Completo (Legs)
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                Quarta / Sábado • 6 exercícios (55 min)
                              </span>
                            </div>
                          </div>

                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            expandedDayLetter === 'C' ? 'rotate-180 text-alpha-500' : ''
                          }`} />
                        </div>

                        {/* Conteúdo do Treino do Dia C */}
                        {expandedDayLetter === 'C' && (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                                Músculos Trabalhados no Dia C:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Quadríceps', 'Isquiotibiais', 'Glúteos', 'Panturrilhas'].map(m => (
                                  <span key={m} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-xs">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {[
                                { name: 'Agachamento Livre com Barra', sets: '4x 8-10', rest: '90s', prev: '60.0 kg' },
                                { name: 'Leg Press 45º Articulado', sets: '4x 12', rest: '90s', prev: '160.0 kg' },
                                { name: 'Cadeira Extensora', sets: '4x 15', rest: '60s', prev: '45.0 kg' },
                                { name: 'Mesa Flexora Deitada', sets: '4x 12', rest: '60s', prev: '40.0 kg' },
                              ].map((ex, idx) => (
                                <div key={ex.name} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span className="font-bold text-slate-800">{ex.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[11px]">
                                    <span className="font-mono font-bold text-slate-900">{ex.sets}</span>
                                    <span className="text-slate-400 font-mono">{ex.rest}</span>
                                    <span className="font-mono font-bold text-alpha-600">{ex.prev}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedGroupLetter('C');
                                setIsTrackerOpen(true);
                              }}
                              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Iniciar Treino C no App (MFit)</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* --- SANFONA DIA D --- */}
                      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                        <div
                          onClick={() => setExpandedDayLetter(expandedDayLetter === 'D' ? null : 'D')}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-orange-50/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                              D
                            </span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-black text-slate-900">
                                Treino D: Ombros Completo, Trapézio & Core
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                Sábado / Especial • 5 exercícios (45 min)
                              </span>
                            </div>
                          </div>

                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            expandedDayLetter === 'D' ? 'rotate-180 text-alpha-500' : ''
                          }`} />
                        </div>

                        {/* Conteúdo do Treino do Dia D */}
                        {expandedDayLetter === 'D' && (
                          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4 animate-fadeIn">
                            <div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                                Músculos Trabalhados no Dia D:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {['Deltoides Completo', 'Trapézio Superior', 'Abdômen Reto & Oblíquos'].map(m => (
                                  <span key={m} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-800 shadow-xs">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {[
                                { name: 'Desenvolvimento Arnold Halteres', sets: '4x 10', rest: '60s', prev: '16.0 kg' },
                                { name: 'Elevação Frontal na Polia', sets: '3x 12', rest: '45s', prev: '12.5 kg' },
                                { name: 'Encolhimento com Barra', sets: '4x 15', rest: '45s', prev: '50.0 kg' },
                                { name: 'Abdominal Supra na Polia', sets: '4x 20', rest: '45s', prev: '30.0 kg' },
                              ].map((ex, idx) => (
                                <div key={ex.name} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span className="font-bold text-slate-800">{ex.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-[11px]">
                                    <span className="font-mono font-bold text-slate-900">{ex.sets}</span>
                                    <span className="text-slate-400 font-mono">{ex.rest}</span>
                                    <span className="font-mono font-bold text-alpha-600">{ex.prev}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedGroupLetter('D');
                                setIsTrackerOpen(true);
                              }}
                              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Iniciar Treino D no App (MFit)</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* SANFONA NÍVEL 1: FICHA 2 (Treino 2 - Rotina Queima Metabólica PPL) */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs">
                  <div
                    onClick={() => setExpandedProgramId(expandedProgramId === 'prog-2' ? null : 'prog-2')}
                    className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors ${
                      expandedProgramId === 'prog-2' ? 'bg-slate-900 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        expandedProgramId === 'prog-2' ? 'bg-alpha-500 text-white' : 'bg-white text-slate-700 border border-slate-200'
                      }`}>
                        {expandedProgramId === 'prog-2' ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            expandedProgramId === 'prog-2' ? 'text-alpha-400' : 'text-slate-500'
                          }`}>
                            Treino 2 • Divisão PPL (Metabólico)
                          </span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.2 rounded-full uppercase">
                            Complementar
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-tight">
                          Rotina de Condicionamento & Queima (Push / Pull / Legs)
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs hidden sm:inline font-medium ${
                        expandedProgramId === 'prog-2' ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        3 Pastas (PPL)
                      </span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        expandedProgramId === 'prog-2' ? 'rotate-180 text-alpha-400' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Banner Verde de Anamnese */}
            <div 
              onClick={() => setActiveTab('cadastro')}
              className="p-4 rounded-2xl bg-[#008000] text-white flex items-center justify-center gap-2 text-center text-xs font-bold shadow-xs cursor-pointer hover:bg-[#007000] transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Sua Anamnese e restrições estão em dia! Clique no card para verificar ou alterar.</span>
            </div>

            {/* Banner de Frequência Ótima */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#179BAE] via-[#20B2AA] to-amber-400 text-white p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 max-w-lg">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white leading-tight">Sua frequência está ótima!</h4>
                  <p className="text-xs text-white/90 mt-1">
                    Parabéns! Em média, você está indo treinar 3x a 5x na semana na Unidade {currentStudent.unit === 'unidade-1' ? 'Matriz' : 'Expansão'}.
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-2xl font-black text-white block">18 Check-ins</span>
                <span className="text-[11px] text-white/80">Este mês (Agosto 2026)</span>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: AGENDA AULAS (GRADE SEMANAL)
           ========================================================================= */}
        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                AGENDA AULAS
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Period Filter Buttons */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                  {(['todos', 'manha', 'tarde', 'noite'] as const).map((per) => (
                    <button
                      key={per}
                      onClick={() => setAgendaPeriod(per)}
                      className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                        agendaPeriod === per ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {per === 'todos' ? 'Todos' : per === 'manha' ? 'Manhã' : per === 'tarde' ? 'Tarde' : 'Noite'}
                    </button>
                  ))}
                </div>

                {/* Unit Select */}
                <select
                  value={agendaUnit}
                  onChange={(e) => setAgendaUnit(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-alpha-500"
                >
                  <option value="unidade-1">PE - Aliança (Matriz - Centro)</option>
                  <option value="unidade-2">PE - Aliança (Unidade 2 - Expansão)</option>
                </select>

                <button
                  onClick={() => {
                    setAgendaPeriod('todos');
                    setAgendaUnit('unidade-1');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                >
                  Limpar filtro
                </button>
              </div>
            </div>

            {/* Weekly Schedule Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 items-start">
              {scheduleData.map((col) => {
                const filteredClasses = col.classes.filter(c => {
                  if (agendaPeriod !== 'todos' && c.period !== agendaPeriod) return false;
                  return true;
                });

                return (
                  <div key={col.date} className="space-y-2.5">
                    
                    <div className={`p-2.5 rounded-xl text-center border shadow-xs ${
                      col.active 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white text-slate-800 border-slate-200'
                    }`}>
                      <span className="text-sm font-black block leading-none">{col.date}</span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{col.dayOfWeek}</span>
                    </div>

                    <div className="space-y-2">
                      {filteredClasses.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-[10px] text-slate-400">
                          Sem aulas programadas
                        </div>
                      ) : (
                        filteredClasses.map((cls) => {
                          const isBooked = bookedClasses.includes(cls.id);
                          return (
                            <div
                              key={cls.id}
                              onClick={() => setSelectedClassToBook(cls)}
                              className={`p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-alpha-500 transition-all cursor-pointer space-y-1.5 text-left group ${
                                isBooked ? 'ring-2 ring-emerald-500 bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-xs ${cls.color} shrink-0`}></span>
                                <span className="text-xs font-black text-slate-900">{cls.time}</span>
                              </div>

                              <div>
                                <span className="text-[11px] font-bold text-slate-800 block leading-tight group-hover:text-alpha-600">
                                  {cls.title}
                                </span>
                                {cls.coach && (
                                  <span className="text-[9px] font-medium text-slate-500 block mt-0.5">
                                    {cls.coach}
                                  </span>
                                )}
                              </div>

                              {isBooked && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  <Check className="w-2.5 h-2.5" /> Vaga Reservada
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Modal de Reserva de Vaga */}
            {selectedClassToBook && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-scaleUp">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-alpha-600 flex items-center justify-center mx-auto border border-orange-200">
                    <Calendar className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-alpha-500 tracking-wider">Agendamento de Turma</span>
                    <h3 className="text-base font-black text-slate-900 uppercase mt-0.5">{selectedClassToBook.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Horário: <strong>{selectedClassToBook.time}</strong> • Unidade Matriz
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    Restam <strong>6 vagas</strong> disponíveis para este horário.
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedClassToBook(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                    >
                      Voltar
                    </button>

                    <button
                      onClick={() => handleBookClass(selectedClassToBook.id, selectedClassToBook.title, selectedClassToBook.time)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase text-white ${
                        bookedClasses.includes(selectedClassToBook.id) 
                          ? 'bg-rose-600 hover:bg-rose-700' 
                          : 'bg-alpha-500 hover:bg-alpha-600'
                      }`}
                    >
                      {bookedClasses.includes(selectedClassToBook.id) ? 'Cancelar Vaga' : 'Confirmar Vaga'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 3: FINANCEIRO / PAGAMENTOS (DYNAMIC INVOICES)
           ========================================================================= */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6 animate-fadeIn">
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              PAGAMENTOS
            </h2>

            {/* Top Plan Info Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-slate-500 font-bold block mb-1">Meu plano</span>
                <p className="text-base font-black text-slate-900 leading-tight">{currentStudent.planName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">(iniciado em {currentStudent.createdAt || '05/07/2026'})</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-slate-700">Débito Recorrente no Cartão</span>
                  <button 
                    onClick={() => showNotification('Modal de troca de cartão aberto!')}
                    className="text-[10px] text-alpha-600 font-bold hover:underline"
                  >
                    Alterar cartão
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Próxima mensalidade</span>
                <div className="flex items-baseline gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      R$ {currentStudent.planValue ? Number(currentStudent.planValue).toFixed(2) : '149.90'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vencimento</span>
                    <span className="text-sm font-bold text-slate-800">{currentStudent.dueDate || '08/09/2026'}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1">Taxa de matrícula</span>
                <div className="flex items-baseline gap-6">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Valor</span>
                    <span className="text-base font-black text-emerald-600 font-mono">R$ 0,00</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status</span>
                    <span className="text-sm font-bold text-emerald-600">Quitado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase">
                      <th className="py-3.5 px-4">Tipo</th>
                      <th className="py-3.5 px-4">Data de vencimento</th>
                      <th className="py-3.5 px-4">Data de pagamento</th>
                      <th className="py-3.5 px-4">Valor</th>
                      <th className="py-3.5 px-4">Meio de pagamento</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    
                    {/* Invoice 1: Próxima Mensalidade */}
                    <tr className="hover:bg-slate-50/50 bg-orange-50/20">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] text-orange-600 font-bold block">Setembro</span>
                        <span className="font-bold text-slate-900">Mensalidade</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{currentStudent.dueDate || '08/09/2026'}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">---</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        R$ {currentStudent.planValue ? Number(currentStudent.planValue).toFixed(2) : '149.90'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">Cartão Recorrente</td>
                      <td className="py-3.5 px-4">
                        <span className="text-amber-600 font-bold">A vencer</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => showNotification('Código PIX gerado para pagamento imediato!')}
                          className="text-alpha-600 font-bold hover:underline"
                        >
                          Pagar com PIX
                        </button>
                      </td>
                    </tr>

                    {/* Invoice 2: Mensalidade Anterior */}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] text-emerald-600 font-bold block">Agosto</span>
                        <span className="font-bold text-slate-900">Mensalidade</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">08/08/2026</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">08/08/2026</td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        R$ {currentStudent.planValue ? Number(currentStudent.planValue).toFixed(2) : '149.90'}
                      </td>
                      <td className="py-3.5 px-4">Cartão Recorrente</td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-600 font-bold">Pago</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => showNotification('Comprovante baixado em PDF!')}
                          className="text-slate-700 hover:text-alpha-600 font-bold inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB: MINHA AVALIAÇÃO FÍSICA & BIOIMPEDÂNCIA (PORTAL DO ALUNO)
           ========================================================================= */}
        {activeTab === 'bioimpedancia' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  MINHA BIOIMPEDÂNCIA & COMPOSIÇÃO CORPORAL
                </h2>
                <p className="text-xs text-slate-500">
                  Acompanhe a evolução do seu % de gordura, ganho de massa muscular e perímetros corporais.
                </p>
              </div>

              <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
                Última Avaliação: <strong className="text-slate-900">{currentStudent.bioimpedance?.lastAssessmentDate || '15/08/2026'}</strong>
              </div>
            </div>

            {/* Grid de Cards de Destaque Bioimpedância */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Peso Atual</span>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {currentStudent.bioimpedance?.weightKg || currentStudent.weight || 75} <span className="text-sm font-bold text-slate-400">kg</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Altura: {currentStudent.bioimpedance?.heightCm || currentStudent.height || 175} cm</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">% Gordura (BF)</span>
                <span className="text-2xl font-black font-mono text-orange-600">
                  {currentStudent.bioimpedance?.bodyFatPercent || 15.0}%
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">Gordura Visceral: Nível {currentStudent.bioimpedance?.visceralFatLevel || 4}</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Massa Muscular</span>
                <span className="text-2xl font-black font-mono text-emerald-600">
                  {currentStudent.bioimpedance?.muscleMassKg || 38.0} <span className="text-sm font-bold text-slate-400">kg</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Massa Gorda: {currentStudent.bioimpedance?.fatMassKg || 12.0} kg</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Taxa Metabólica Basal</span>
                <span className="text-2xl font-black font-mono text-blue-600">
                  {currentStudent.bioimpedance?.bmrKcal || 1800} <span className="text-sm font-bold text-slate-400">kcal</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Idade Metabólica: {currentStudent.bioimpedance?.metabolicAge || 23} anos</span>
              </div>
            </div>

            {/* Perímetros Corporais */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Perímetros e Medidas Corporais (cm)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Tórax</span>
                  <span className="text-base font-black font-mono text-slate-900">{currentStudent.bioimpedance?.chestCm || 104} cm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Cintura</span>
                  <span className="text-base font-black font-mono text-slate-900">{currentStudent.bioimpedance?.waistCm || 82} cm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Quadril</span>
                  <span className="text-base font-black font-mono text-slate-900">{currentStudent.bioimpedance?.hipCm || 99} cm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Braço Direito</span>
                  <span className="text-base font-black font-mono text-slate-900">{currentStudent.bioimpedance?.armRightCm || 39.5} cm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">Coxa Direita</span>
                  <span className="text-base font-black font-mono text-slate-900">{currentStudent.bioimpedance?.thighRightCm || 59.0} cm</span>
                </div>
              </div>

              {currentStudent.bioimpedance?.postureNotes && (
                <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl text-xs text-slate-700">
                  <strong className="text-alpha-700 block text-[11px] mb-0.5">Observação do Avaliador:</strong>
                  {currentStudent.bioimpedance.postureNotes}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: DADOS CADASTRAIS (DYNAMICALLY LINKED TO CURRENT STUDENT)
           ========================================================================= */}
        {activeTab === 'cadastro' && (
          <div className="space-y-6 animate-fadeIn">
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              DADOS CADASTRAIS
            </h2>

            <form onSubmit={handleSaveCadastro} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
              
              {/* Informações pessoais */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Informações pessoais</h3>

                {/* Line 1: Nome, CPF, Altura, Peso */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] text-slate-500 mb-1">Nome completo</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-500 mb-1">CPF</label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-1">Altura (CM)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500 text-center"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-1">Peso (KG)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500 text-center"
                    />
                  </div>
                </div>

                {/* Line 2: E-mail, Celular */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-slate-500 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-slate-500 mb-1">Celular (WhatsApp)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                    />
                  </div>
                </div>

                {/* Highlight Field: Qual o seu objetivo na academia? */}
                <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                  <div className="flex items-center gap-2 text-teal-800 font-bold">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Qual o seu objetivo principal no CT ALPHA?</span>
                  </div>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    className="bg-white border border-teal-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="hipertrofia">Hipertrofia Muscular</option>
                    <option value="emagrecimento">Emagrecimento & Definição</option>
                    <option value="condicionamento">Condicionamento Crossfit</option>
                    <option value="performance_luta">Performance em Artes Marciais</option>
                  </select>
                </div>

              </div>

              {/* Endereço */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">Endereço Residencial</h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-500 mb-1">CEP</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-slate-500 mb-1">Endereço</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-500 mb-1">Cidade / UF</label>
                    <input
                      type="text"
                      value={`${city} - ${stateUf}`}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Seção Permanente: Anamnese e Avaliação do Aluno */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-alpha-500" />
                    <h3 className="text-sm font-bold text-slate-900">Anamnese e Avaliação Física</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsClientAnamnesisModalOpen(true)}
                    className="px-3.5 py-1.5 bg-alpha-500 hover:bg-alpha-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Ver avaliação completa</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Objetivo Principal</span>
                    <strong className="text-slate-900 font-black text-xs block mt-0.5">{currentAssessment?.primaryGoal || 'Hipertrofia'}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Experiência</span>
                    <strong className="text-slate-900 font-black text-xs block mt-0.5 capitalize">{currentAssessment?.experienceLevel || 'Intermediário'} · {currentAssessment?.trainingYears || 2.5} anos</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Frequência Semanal</span>
                    <strong className="text-slate-900 font-black text-xs block mt-0.5">{currentAssessment?.daysPerWeek || 4}x por semana</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Disponibilidade</span>
                    <strong className="text-slate-900 font-black text-xs block mt-0.5">{currentAssessment?.sessionDurationMinutes || 60} min / sessão</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Atenções Clínicas</span>
                    <strong className="text-amber-600 font-black text-xs block mt-0.5">{currentAssessment?.prescriptionAlerts?.length || 1} informação relevante</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Restrições Declaradas</span>
                    <strong className="text-amber-600 font-black text-xs block mt-0.5">{currentAssessment?.avoidMovements?.length || 0} movimentos</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Última atualização: <strong className="text-slate-800">{currentAssessment?.assessmentDate || '26/08/2026'}</strong> por <strong className="text-slate-800">{currentAssessment?.assessorName || 'Coach Diego'}</strong></span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">● Prontuário Ativo</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => showNotification('Contrato de matrícula digital gerado e baixado em PDF!')}
                  className="w-full sm:w-auto bg-[#1EA896] hover:bg-[#199282] text-white font-black uppercase text-xs tracking-wider px-8 py-3 rounded-full transition-colors shadow-xs"
                >
                  BAIXAR CONTRATO (PDF)
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#4B5262] hover:bg-[#3D4350] text-white font-black uppercase text-xs tracking-wider px-10 py-3 rounded-full transition-colors shadow-xs"
                >
                  SALVAR ALTERAÇÕES
                </button>
              </div>

            </form>

          </div>
        )}



      </main>

      {/* Modal: Gerador Automático de Ficha de Treino Baseada em IA / Catálogo */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 border border-slate-200 animate-scaleUp text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-alpha-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">Gerar Ficha Técnica Automática</h4>
                  <span className="text-[10px] text-slate-500">Baseada no catálogo de biomecânica do CT ALPHA</span>
                </div>
              </div>

              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Objetivo do Aluno:</label>
                <select
                  value={genGoal}
                  onChange={(e) => setGenGoal(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                >
                  <option value="hipertrofia">Hipertrofia Muscular (Foco em Massa Magra)</option>
                  <option value="emagrecimento">Emagrecimento & Definição (Alta Densidade)</option>
                  <option value="condicionamento">Condicionamento Crossfit (WOD + Força)</option>
                  <option value="performance_luta">Performance em Lutas (Agilidade & Core)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frequência Semanal:</label>
                  <select
                    value={genDays}
                    onChange={(e) => setGenDays(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                  >
                    <option value={3}>3 dias (Divisão ABC)</option>
                    <option value={4}>4 dias (Divisão ABCD)</option>
                    <option value={5}>5 dias (Divisão ABCDE)</option>
                    <option value={6}>6 dias (Push/Pull/Legs)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Biotipo Físico:</label>
                  <select
                    value={genBiotype}
                    onChange={(e) => setGenBiotype(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                  >
                    <option value="mesomorfo">Mesomorfo</option>
                    <option value="ectomorfo">Ectomorfo</option>
                    <option value="endomorfo">Endomorfo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Restrição Biomecânica / Articular:</label>
                <select
                  value={genRestriction}
                  onChange={(e) => setGenRestriction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:border-alpha-500"
                >
                  <option value="nenhuma">Nenhuma restrição (Treino Completo)</option>
                  <option value="joelho">Joelho sensível (Substituir agachamento profundo)</option>
                  <option value="lombar">Lombar sensível (Evitar levantamento terra livre)</option>
                  <option value="ombro">Manguito / Ombro (Substituir desenvolvimento barra)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-slate-700 leading-relaxed">
                A nova ficha será gerada respeitando o catálogo de exercícios do CT ALPHA e enviada automaticamente para validação do <strong>Coach Diego</strong>.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-slate-700"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateAutomaticWorkout}
                className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isGenerating ? 'Calculando periodização...' : 'Gerar Periodização'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Visualizador Completo de Anamnese do Aluno */}
      {isClientAnamnesisModalOpen && currentAssessment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 border border-slate-200 animate-scaleUp text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-alpha-500 text-white flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Seu Prontuário de Anamnese & Avaliação</h3>
                  <p className="text-[11px] text-slate-500">Última revisão: {currentAssessment.assessmentDate} por {currentAssessment.assessorName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsClientAnamnesisModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 1. Dados Físicos */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-800 tracking-wider">1. Dados Físicos & Objetivo</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div><span className="text-slate-400 block text-[10px]">Altura:</span><strong>{(Number(currentAssessment.heightCm) / 100).toFixed(2)} m ({currentAssessment.heightCm} cm)</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Peso:</span><strong>{currentAssessment.weightKg} kg</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Objetivo:</span><strong className="text-alpha-600">{currentAssessment.primaryGoal}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Nível:</span><strong className="capitalize">{currentAssessment.experienceLevel}</strong></div>
                </div>
              </div>

              {/* 2. Dores e Limitações */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <h4 className="font-bold text-xs uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                  <HeartCrack className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Segurança Articular & Limitações Declaradas</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-400 block text-[10px]">Local / Desconforto:</span><strong>{currentAssessment.painDetails?.location || 'Nenhum'} ({currentAssessment.painDetails?.side || 'bilateral'})</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Quando surge:</span><strong>{currentAssessment.painDetails?.whenAppears || 'Sob carga pesada'}</strong></div>
                  <div className="sm:col-span-2"><span className="text-slate-400 block text-[10px]">Exercícios Tolerados / Seguros:</span><strong className="text-emerald-700">{currentAssessment.painDetails?.safeMovements || 'Exercícios com boa estabilização e controle'}</strong></div>
                </div>
              </div>

              {/* 3. Disponibilidade e Preferências */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-800 tracking-wider">3. Rotina & Preferências de Treinamento</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div><span className="text-slate-400 block text-[10px]">Frequência:</span><strong>{currentAssessment.daysPerWeek} dias / semana</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Duração da Sessão:</span><strong>{currentAssessment.sessionDurationMinutes} minutos</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Estilo Preferido:</span><strong>{currentAssessment.preferenceWeightsVsMachines === 'maquinas' ? 'Máquinas' : 'Misto (Pesos + Máquinas)'}</strong></div>
                  <div className="sm:col-span-3"><span className="text-slate-400 block text-[10px]">Exercícios Favoritos:</span><strong>{currentAssessment.favoriteExercises?.join(', ') || 'Supino Reto, Puxada Alta, Leg Press'}</strong></div>
                </div>
              </div>

              {/* 4. Notas do Treinador */}
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <h4 className="font-bold text-xs uppercase text-emerald-900 tracking-wider">4. Parecer Profissional do Coach</h4>
                <p className="text-emerald-950 text-xs leading-relaxed">
                  {currentAssessment.painDetails?.notes || 'Aluno com ótima resposta para progressão de volume. Programa montado respeitando amplitudes de movimento e periodização científica.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsClientAnamnesisModalOpen(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs"
              >
                Fechar Visualização
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
