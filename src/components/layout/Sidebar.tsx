import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  MessageSquare, 
  Receipt, 
  Database, 
  Building2, 
  Calendar,
  Layers,
  PhoneCall,
  Settings,
  CreditCard,
  History,
  Kanban,
  FileCheck,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  BookOpen,
  Globe,
  LucideIcon
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    selectedUnit, 
    setSelectedUnit,
    userRole,
    setUserRole,
    theme,
    toggleTheme,
    migrationCompleted 
  } = useApp();

  const allGroups: MenuGroup[] = [
    {
      title: 'OPERAÇÃO',
      items: [
        { id: 'dashboard', label: 'Visão Geral & Catraca', icon: LayoutDashboard },
        { id: 'students', label: 'Alunos', icon: Users },
      ]
    },
    {
      title: 'RELACIONAMENTO',
      items: [
        { id: 'commercial', label: 'CRM & Atendimento', icon: Kanban },
      ]
    },
    {
      title: 'TREINAMENTO',
      items: [
        { id: 'workout_builder', label: 'Construtor de Treino', icon: Layers },
        { id: 'exercise_library', label: 'Biblioteca de Exercícios', icon: Dumbbell },
        { id: 'workout_library', label: 'Biblioteca de Fichas Base', icon: BookOpen },
      ]
    },
    {
      title: 'FINANCEIRO',
      items: [
        { id: 'financial', label: 'Receitas & Cobrança', icon: Receipt },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { 
          id: 'migration', 
          label: 'Migração G3', 
          icon: Database,
          badge: migrationCompleted ? 'Integrado' : 'Pendente',
          badgeColor: migrationCompleted 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' 
            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
        },
        { id: 'landing', label: 'Site Oficial (B2C)', icon: Globe },
      ]
    }
  ];

  // Filter menu groups based on role strictly
  const menuGroups = (() => {
    if (userRole === 'recepcao') {
      return [
        {
          title: 'RECEPÇÃO & ATENDIMENTO',
          items: [
            { id: 'students', label: 'Alunos & Cadastros', icon: Users },
            { id: 'dashboard', label: 'Acessos & Catraca', icon: FileCheck },
            { id: 'commercial', label: 'Leads & Visitas', icon: Kanban },
          ]
        },
        {
          title: 'CONSULTA',
          items: [
            { id: 'landing', label: 'Site Oficial (B2C)', icon: Globe },
          ]
        }
      ];
    }
    if (userRole === 'personal') {
      return [
        {
          title: 'SALA DE TREINAMENTO',
          items: [
            { id: 'workout_builder', label: 'Construtor de Treino', icon: Layers },
            { id: 'exercise_library', label: 'Biblioteca de Exercícios', icon: Dumbbell },
            { id: 'workout_library', label: 'Biblioteca de Fichas Base', icon: BookOpen },
            { id: 'students', label: 'Alunos Ativos', icon: Users },
          ]
        }
      ];
    }
    return allGroups;
  })();

  const profileInfo = {
    gestor: { name: 'Abílio Alves', role: 'Diretor Geral', initial: 'A' },
    recepcao: { name: 'Camila Soares', role: 'Recepção / Frente de Caixa', initial: 'C' },
    personal: { name: 'Coach Diego', role: 'Treinador / Musculação', initial: 'D' },
    aluno: { name: 'Carlos Henrique', role: 'Aluno VIP', initial: 'C' },
  }[userRole] || { name: 'Abílio Alves', role: 'Diretor Geral', initial: 'A' };

  return (
    <aside className="w-64 bg-white dark:bg-[#0D121D] border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-colors z-30 select-none">
      
      {/* Top Brand & Unit Switcher */}
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white/10 p-1 flex items-center justify-center border border-slate-800 dark:border-slate-700">
              <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase font-sans">
                CT <span className="text-alpha-500">ALPHA</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Centro de Treinamento</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            title="Alternar Modo Claro/Escuro"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>

        {/* Unit Selector */}
        <div className="px-3 pt-3 pb-1">
          <div className="bg-slate-50 dark:bg-[#101522] p-1 rounded-lg border border-slate-200 dark:border-slate-800/80">
            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase px-1.5 pt-0.5 pb-1 flex items-center justify-between">
              <span>Unidade Ativa</span>
              <Building2 className="w-2.5 h-2.5" />
            </div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as any)}
              aria-label="Selecionar Unidade Ativa"
              className="w-full bg-white dark:bg-[#0D121D] border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-md px-2 py-1 focus:outline-none focus:border-alpha-500 cursor-pointer"
            >
              <option value="todas">Consolidado (Todas)</option>
              <option value="unidade-1">Unidade 1 - Matriz</option>
              <option value="unidade-2">Unidade 2 - Expansão</option>
            </select>
          </div>
        </div>

        {/* Navigation Menu Groups */}
        <div className="px-3 py-2 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 block mb-1">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || (item.id === 'workout_builder' && currentView === 'workouts');

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-alpha-500 dark:text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-alpha-400 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Info with Role Indicator */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-[#101522]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-alpha-500 flex items-center justify-center font-bold text-xs">
              {profileInfo.initial}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">{profileInfo.name}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[9px] text-slate-500 capitalize">{profileInfo.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('login')}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            title="Encerrar Sessão"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};
