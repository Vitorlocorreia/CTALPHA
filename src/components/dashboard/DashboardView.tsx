import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Building2, 
  ArrowUpRight,
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Dumbbell,
  Swords,
  UserPlus,
  QrCode,
  FileCheck,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GYM_INFO } from '@/data/mockData';

export const DashboardView: React.FC = () => {
  const { 
    selectedUnit, 
    setSelectedUnit,
    setCurrentView, 
    userRole,
    students, 
    checkIns, 
    financial, 
    migrationCompleted,
    performCheckIn 
  } = useApp();

  const filteredStudents = students.filter(s => 
    selectedUnit === 'todas' ? true : s.unit === selectedUnit
  );

  const totalStudents = filteredStudents.length;
  const activeCount = filteredStudents.filter(s => s.paymentStatus !== 'atrasado').length;
  const lateCount = filteredStudents.filter(s => s.paymentStatus === 'atrasado').length;
  const warningCount = filteredStudents.filter(s => s.paymentStatus === 'vencendo').length;

  // Real aggregate calculations from live database records (Only for Gestor)
  const realMonthlyRevenue = filteredStudents
    .filter(s => s.paymentStatus !== 'atrasado')
    .reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);

  const realLateAmount = filteredStudents
    .filter(s => s.paymentStatus === 'atrasado')
    .reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);

  const realInadimplenciaPercent = totalStudents > 0 
    ? ((lateCount / totalStudents) * 100).toFixed(1) 
    : '0.0';

  const unitCheckIns = checkIns.filter(c => 
    selectedUnit === 'todas' ? true : c.unit === selectedUnit
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Fast Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {userRole === 'recepcao' ? 'Recepção & Controle de Acessos' : 'Visão Geral'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hoje, 26 de agosto de 2026 • Operação CT ALPHA
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#101522] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setSelectedUnit('todas')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedUnit === 'todas'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Consolidado
          </button>
          <button
            onClick={() => setSelectedUnit('unidade-1')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedUnit === 'unidade-1'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Matriz
          </button>
          <button
            onClick={() => setSelectedUnit('unidade-2')}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedUnit === 'unidade-2'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Unidade 2
          </button>
        </div>
      </div>

      {/* Linha 1 — KPIs (Isolamento estrito: Recepção não vê valores financeiros) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Alunos Cadastrados */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Alunos Cadastrados</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalStudents}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{activeCount} com matrícula ativa</span>
          </div>
        </div>

        {/* KPI 2: Check-ins e Frequência */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Check-ins & Presença Hoje</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {unitCheckIns.length}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Presenças confirmadas na recepção</span>
          </div>
        </div>

        {/* KPIs 3 e 4: Diferenciados por Role */}
        {userRole !== 'recepcao' ? (
          <>
            {/* KPI 3 (Gestor): Receita Recorrente Ativa */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Receita Recorrente Ativa</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                R$ {realMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>{activeCount} planos ativos</span>
                <span className="text-slate-400 font-normal ml-1">no banco</span>
              </div>
            </div>

            {/* KPI 4 (Gestor): Inadimplência */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Inadimplência</span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                R$ {realLateAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <span>{realInadimplenciaPercent}% da base</span>
                <span className="text-slate-400 font-normal ml-1">({lateCount} alunos atrasados)</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* KPI 3 (Recepção): Alunos a Renovar */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Avisos de Matrícula / Renovação</span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {warningCount + lateCount}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <span>Alunos para orientar na recepção</span>
              </div>
            </div>

            {/* KPI 4 (Recepção): Novas Matrículas no Mês */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Novas Matrículas no Mês</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                34
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Novos alunos cadastrados</span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Main Section: Gráfico de Faturamento para Gestor OU Painel Operacional para Recepção */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {userRole !== 'recepcao' ? (
          /* Big Revenue Chart (8 cols) - Somente Gestor */
          <div className="lg:col-span-8 p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Evolução da Receita Recorrente (MRR)</h3>
                <p className="text-xs text-slate-500">Histórico dos últimos 7 meses (Fev — Ago 2026)</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                R$ 54.980 no mês atual
              </span>
            </div>

            {/* SVG Line Chart */}
            <div className="h-60 w-full pt-2 flex flex-col justify-between">
              <svg viewBox="0 0 600 200" className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5500" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#FF5500" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="20" x2="590" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="40" y1="70" x2="590" y2="70" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="40" y1="120" x2="590" y2="120" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
                <line x1="40" y1="170" x2="590" y2="170" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

                {/* Y Axis Labels */}
                <text x="5" y="24" className="text-[10px] fill-slate-400 font-mono">60k</text>
                <text x="5" y="74" className="text-[10px] fill-slate-400 font-mono">45k</text>
                <text x="5" y="124" className="text-[10px] fill-slate-400 font-mono">30k</text>
                <text x="5" y="174" className="text-[10px] fill-slate-400 font-mono">15k</text>

                {/* Area Fill */}
                <path
                  d="M 60 140 Q 140 120 220 95 T 380 65 T 500 45 L 570 30 L 570 170 L 60 170 Z"
                  fill="url(#revenueGrad)"
                />

                {/* Main Line */}
                <path
                  d="M 60 140 Q 140 120 220 95 T 380 65 T 500 45 L 570 30"
                  fill="none"
                  stroke="#FF5500"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Data points */}
                <circle cx="60" cy="140" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="145" cy="120" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="230" cy="95" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="315" cy="80" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="400" cy="65" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="485" cy="45" r="4" className="fill-white stroke-alpha-500" strokeWidth="2" />
                <circle cx="570" cy="30" r="5" className="fill-alpha-500 stroke-white" strokeWidth="2" />
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between pl-8 pr-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Fev (32k)</span>
                <span>Mar (36k)</span>
                <span>Abr (41k)</span>
                <span>Mai (44k)</span>
                <span>Jun (48k)</span>
                <span>Jul (51k)</span>
                <span className="font-bold text-slate-900 dark:text-white">Ago (54.9k)</span>
              </div>
            </div>

            {/* Operational Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Ticket Médio</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">R$ 131,53</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Taxa de Renovação</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">96,2%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Novas Matrículas (Mês)</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">+34 alunos</span>
              </div>
            </div>
          </div>
        ) : (
          /* Painel Operacional de Ações Rápidas (8 cols) - Recepção */
          <div className="lg:col-span-8 p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ações Rápidas da Recepção</h3>
              <p className="text-xs text-slate-500">Atendimento rápido ao aluno e controle de presença</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setCurrentView('students')}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 hover:border-alpha-500 transition-all text-left space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-alpha-500/10 text-alpha-600 flex items-center justify-center group-hover:bg-alpha-500 group-hover:text-white transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Cadastrar Novo Aluno</h4>
                <p className="text-[11px] text-slate-500">Inserir novos dados, CPF e foto no sistema.</p>
              </button>

              <button
                onClick={() => setCurrentView('students')}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 hover:border-alpha-500 transition-all text-left space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Consultar Aluno / CPF</h4>
                <p className="text-[11px] text-slate-500">Buscar matrícula e situação cadastral.</p>
              </button>

              <button
                onClick={() => setCurrentView('commercial')}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 hover:border-alpha-500 transition-all text-left space-y-2 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Aulas Experimentais</h4>
                <p className="text-[11px] text-slate-500">Recepcionar visitantes agendados hoje.</p>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-300">Recepção & Check-ins Ativos</h5>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400">Identificação de alunos e frequência em tempo real.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">● 100% Online</span>
            </div>
          </div>
        )}

        {/* Operação Hoje: Horários de Pico & Lotação (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Operação Hoje</h3>
              <p className="text-xs text-slate-500">{unitCheckIns.length} acessos registrados hoje</p>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>06:00 — 08:30 (Pico Manhã)</span>
                  <span className="font-bold">48 alunos</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full w-[80%]"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>12:00 — 14:00 (Almoço)</span>
                  <span className="font-bold">27 alunos</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full w-[45%]"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>18:00 — 20:00 (Pico Noite)</span>
                  <span className="font-bold text-alpha-500">67 alunos</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-alpha-500 h-full rounded-full w-[95%]"></div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>20:00 — 22:00 (Tatame/Turmas)</span>
                  <span className="font-bold">42 alunos</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-slate-800 dark:bg-slate-300 h-full rounded-full w-[70%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Lotação média hoje:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">68% da capacidade</span>
          </div>
        </div>

      </div>

      {/* Registro Recente de Check-ins (Presença dos alunos) */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registro Recente de Acessos</h3>
            <p className="text-xs text-slate-500">Últimos alunos identificados na recepção</p>
          </div>
          <button 
            onClick={() => setCurrentView('students')}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
          >
            <span>Ver todos os alunos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Aluno</th>
                <th className="py-2.5 px-3">Unidade</th>
                <th className="py-2.5 px-3">Modalidade</th>
                <th className="py-2.5 px-3">Horário</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {unitCheckIns.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {log.studentName.charAt(0)}
                    </div>
                    <span>{log.studentName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 capitalize">
                    {log.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'}
                  </td>
                  <td className="py-3 px-3 uppercase text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {log.modality}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'liberado' || log.status === 'autorizado'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    }`}>
                      {log.status === 'liberado' || log.status === 'autorizado' ? 'Liberado' : 'Vencendo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
