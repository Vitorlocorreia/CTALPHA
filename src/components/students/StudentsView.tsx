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
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Student, Biotype, Goal } from '@/types';

export const StudentsView: React.FC = () => {
  const { 
    students, 
    selectedUnit, 
    sendWhatsAppBilling, 
    setCurrentView,
    generateWorkoutForStudent,
    addNewStudent 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [activeStudentDrawer, setActiveStudentDrawer] = useState<Student | null>(null);
  const [drawerTab, setDrawerTab] = useState<'geral' | 'financeiro' | 'treinos' | 'frequencia' | 'comunicacao' | 'historico'>('geral');
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);

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

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Alunos</h1>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded">
              {filteredStudents.length} matriculados
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Base cadastral, histórico financeiro, fichas de treino e controle de frequência.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewStudentModalOpen(true)}
            className="bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Novo Aluno</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar aluno, CPF, telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-alpha-500"
            />
          </div>

          {/* Modality */}
          <div>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              aria-label="Filtrar por Modalidade"
              className="w-full bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-alpha-500"
            >
              <option value="todas">Todas as Modalidades</option>
              <option value="musculacao">Musculação</option>
              <option value="crossfit">Box de Crossfit</option>
              <option value="luta">Lutas (Muay Thai / Jiu-Jitsu)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filtrar por Status"
              className="w-full bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-alpha-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="adimplente">Ativo (Em Dia)</option>
              <option value="vencendo">Vencendo em breve</option>
              <option value="atrasado">Inadimplente (Bloqueado)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main CRM Students Table & Adaptive Mobile Cards */}
      <div className="rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* Desktop Data Table (hidden on mobile) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#0D121D] text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Aluno</th>
                <th className="px-3 py-3">Unidade</th>
                <th className="px-3 py-3">Plano</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Último Acesso</th>
                <th className="px-3 py-3">Próximo Vencimento</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/80 dark:hover:bg-[#141A29] transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveStudentDrawer(student);
                    setDrawerTab('geral');
                  }}
                >
                  {/* Aluno */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block leading-tight">
                          {student.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {student.cpf} • {student.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Unidade */}
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                    {student.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'}
                  </td>

                  {/* Plano */}
                  <td className="px-3 py-2.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block">{student.planName}</span>
                    <span className="text-[10px] text-slate-400">R$ {student.planValue.toFixed(2)}/mês</span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    {student.paymentStatus === 'adimplente' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                        Ativo
                      </span>
                    )}
                    {student.paymentStatus === 'vencendo' && (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">
                        Vence em breve
                      </span>
                    )}
                    {student.paymentStatus === 'atrasado' && (
                      <span className="text-red-700 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded text-[10px]">
                        Inadimplente ({student.daysLate}d)
                      </span>
                    )}
                  </td>

                  {/* Último acesso */}
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    {student.lastCheckIn || 'Hoje 06:45'}
                  </td>

                  {/* Próximo vencimento */}
                  <td className="px-3 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-[11px]">
                    {student.dueDate}
                  </td>

                  {/* Ação */}
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

        {/* Mobile & Tablet Adaptive Cards (Visible on < 1024px) */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-2">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => {
                setActiveStudentDrawer(student);
                setDrawerTab('geral');
              }}
              className="p-3 rounded-xl bg-slate-50/60 dark:bg-[#0D121D] border border-slate-150 dark:border-slate-800/80 active:scale-[0.99] transition-all space-y-2.5"
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
                  {student.paymentStatus === 'adimplente' && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200 dark:border-emerald-500/20">
                      Ativo
                    </span>
                  )}
                  {student.paymentStatus === 'vencendo' && (
                    <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px] border border-amber-200 dark:border-amber-500/20">
                      Vence em breve
                    </span>
                  )}
                  {student.paymentStatus === 'atrasado' && (
                    <span className="text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-md text-[10px] border border-red-200 dark:border-red-500/20">
                      Inadimplente ({student.daysLate}d)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Plano</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.planName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Próximo Vencimento</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.dueDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[10px] text-slate-400 truncate">
                  Check-in: {student.lastCheckIn || 'Hoje 06:45'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStudentDrawer(student);
                    setDrawerTab('geral');
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-alpha-500 text-white flex items-center gap-1 shadow-2xs shrink-0"
                >
                  <span>Abrir Perfil</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 360 Student Profile Drawer (O Coração do CRM) */}
      {activeStudentDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-[#0D121D] border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft">
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-start gap-3">
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
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Ativo</span> • {activeStudentDrawer.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'} • {activeStudentDrawer.modalities.join(' + ').toUpperCase()}
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

              {/* CRM Tabs */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 overflow-x-auto text-xs font-semibold text-slate-500">
                <button
                  onClick={() => setDrawerTab('geral')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'geral' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setDrawerTab('financeiro')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'financeiro' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Financeiro
                </button>
                <button
                  onClick={() => setDrawerTab('treinos')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'treinos' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Treinos
                </button>
                <button
                  onClick={() => setDrawerTab('frequencia')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'frequencia' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Frequência
                </button>
                <button
                  onClick={() => setDrawerTab('comunicacao')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'comunicacao' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Comunicação
                </button>
                <button
                  onClick={() => setDrawerTab('historico')}
                  className={`py-2.5 px-3 border-b-2 transition-all ${drawerTab === 'historico' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  Histórico
                </button>
              </div>
            </div>

            {/* Drawer Body Content according to Tab */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              
              {/* Tab 1: Visão Geral */}
              {drawerTab === 'geral' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Plano Atual</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.planName}</span>
                      <span className="text-[10px] text-slate-500">R$ {activeStudentDrawer.planValue.toFixed(2)}/mês</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Frequência Semanal</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">4,2x / semana</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Alta aderência</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Próximo Vencimento</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.dueDate}</span>
                      <span className="text-[10px] text-slate-500">Cobrança automática ativa</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 block">Último Acesso</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">{activeStudentDrawer.lastCheckIn || 'Hoje 06:45'}</span>
                      <span className="text-[10px] text-slate-500">Matriz (Musculação)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white block">Dados Cadastrais</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                      <p>CPF: <strong className="text-slate-800 dark:text-slate-200">{activeStudentDrawer.cpf}</strong></p>
                      <p>Telefone: <strong className="text-slate-800 dark:text-slate-200">{activeStudentDrawer.phone}</strong></p>
                      <p>E-mail: <strong className="text-slate-800 dark:text-slate-200">{activeStudentDrawer.email}</strong></p>
                      <p>Desde: <strong className="text-slate-800 dark:text-slate-200">{activeStudentDrawer.createdAt}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Financeiro */}
              {drawerTab === 'financeiro' && (
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

              {/* Tab 3: Treinos */}
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

              {/* Tab 4: Frequência */}
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

              {/* Tab 5: Comunicação */}
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

              {/* Tab 6: Histórico */}
              {drawerTab === 'historico' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block">Linha do Tempo</span>
                  <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 space-y-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">20/08/2026</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Prescrição de Treino Atualizada</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">15/01/2024</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Upgrade para Plano Alpha VIP (Livre)</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">12/03/2023</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Matrícula Inicial (Origem: G3)</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Drawer Actions Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101522] flex items-center justify-between">
              <button
                onClick={() => sendWhatsAppBilling(activeStudentDrawer.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Mensagem WhatsApp
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
                  setActiveStudentDrawer(null);
                  setCurrentView('workouts');
                }}
                className="bg-alpha-500 hover:bg-alpha-600 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Dumbbell className="w-3.5 h-3.5" />
                Prescrever Treino
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal: New Student */}
      {isNewStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xl relative">
            <button
              onClick={() => setIsNewStudentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">Nova Matrícula</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">Cadastro direto no CT ALPHA Hub</p>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome:</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do aluno"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CPF:</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={newStudentCPF}
                    onChange={(e) => setNewStudentCPF(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefone:</label>
                  <input
                    type="text"
                    placeholder="(81) 99000-0000"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unidade:</label>
                  <select
                    value={newStudentUnit}
                    onChange={(e) => setNewStudentUnit(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
                  >
                    <option value="unidade-1">Unidade 1 - Matriz</option>
                    <option value="unidade-2">Unidade 2</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Plano:</label>
                  <select
                    value={newStudentPlan}
                    onChange={(e) => setNewStudentPlan(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
                  >
                    <option value="Plano Alpha VIP Recorrente">Alpha VIP (R$ 149,90)</option>
                    <option value="Plano Crossfit + Musculação">Cross + Musc (R$ 129,90)</option>
                    <option value="Plano Musculação Prime">Musculação (R$ 99,90)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewStudentModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-alpha-500 hover:bg-alpha-600 text-white font-semibold px-4 py-1.5 rounded-lg shadow-xs"
                >
                  Salvar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
