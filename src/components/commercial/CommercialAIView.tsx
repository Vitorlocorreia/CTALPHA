import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ChevronRight, 
  UserPlus, 
  ArrowRight,
  TrendingUp,
  Flame,
  Send,
  Sparkles,
  PhoneCall,
  Sliders,
  Filter
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  interest: 'crossfit' | 'luta' | 'musculacao' | 'completo';
  unit: 'unidade-1' | 'unidade-2';
  stage: 'novo' | 'contato' | 'visita' | 'experimental' | 'matriculado';
  intention: 'alta' | 'media' | 'baixa';
  lastActivity: string;
  scheduledFor?: string;
  nextAction: string;
  notes: string;
}

export const CommercialAIView: React.FC = () => {
  const { addLeadFromAI } = useApp();

  const [leadsList, setLeadsList] = useState<LeadItem[]>([
    {
      id: 'lead-1',
      name: 'Mateus Albuquerque',
      phone: '(81) 99892-9667',
      interest: 'crossfit',
      unit: 'unidade-1',
      stage: 'experimental',
      intention: 'alta',
      lastActivity: 'Assistente respondeu às 00:15 • Cliente perguntou sobre horários do Box',
      scheduledFor: '27/08 · 19:00',
      nextAction: 'Confirmar presença na recepção',
      notes: 'Quer treinar no período da noite após as 18h.'
    },
    {
      id: 'lead-2',
      name: 'Camila Rodrigues',
      phone: '(81) 98765-4321',
      interest: 'luta',
      unit: 'unidade-1',
      stage: 'visita',
      intention: 'alta',
      lastActivity: 'Assistente enviou grade de Muay Thai às 18:40',
      scheduledFor: '28/08 · 19:30',
      nextAction: 'Apresentar tatame e professor',
      notes: 'Interesse em Muay Thai feminino.'
    },
    {
      id: 'lead-3',
      name: 'Rodrigo Santana',
      phone: '(81) 99123-4567',
      interest: 'musculacao',
      unit: 'unidade-2',
      stage: 'contato',
      intention: 'media',
      lastActivity: 'Tirou dúvidas sobre Plano VIP Recorrente',
      nextAction: 'Enviar link de matrícula rápida',
      notes: 'Mora próximo à Unidade 2.'
    },
    {
      id: 'lead-4',
      name: 'Juliana Costa',
      phone: '(81) 98888-1122',
      interest: 'crossfit',
      unit: 'unidade-1',
      stage: 'novo',
      intention: 'alta',
      lastActivity: 'Lead recebido via Instagram / Site há 10 min',
      nextAction: 'Iniciar primeiro contato automático',
      notes: 'Procura box com turmas às 06h.'
    },
    {
      id: 'lead-5',
      name: 'Felipe Menezes',
      phone: '(81) 99777-3344',
      interest: 'completo',
      unit: 'unidade-1',
      stage: 'matriculado',
      intention: 'alta',
      lastActivity: 'Matrícula concluída no balcão hoje',
      nextAction: 'Ficha de treino liberada',
      notes: 'Plano Alpha VIP fechado.'
    }
  ]);

  const [selectedLead, setSelectedLead] = useState<LeadItem>(leadsList[0]);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'assistente'>('pipeline');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente de atendimento do CT ALPHA. Como posso ajudar com dúvidas sobre planos, turmas de Crossfit ou agendamento de aula experimental?' }
  ]);

  const pipelineStages = [
    { id: 'novo', title: 'Novo', count: 12 },
    { id: 'contato', title: 'Contato Iniciado', count: 18 },
    { id: 'visita', title: 'Visita Agendada', count: 9 },
    { id: 'experimental', title: 'Experimental', count: 7 },
    { id: 'matriculado', title: 'Matrícula', count: 4 },
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: `Entendido! Nossos horários de Crossfit na Unidade 1 são às 06:00, 07:00, 18:00 e 19:00. Gostaria de agendar sua experimental gratuita amanhã?` 
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Atendimento & CRM Comercial</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pipeline de vendas, qualificação de leads e automações de agendamento de aulas experimentais.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#101522] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'pipeline' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Pipeline de Vendas
          </button>
          <button
            onClick={() => setActiveTab('assistente')}
            className={`px-3 py-1 rounded-md transition-all ${activeTab === 'assistente' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Assistente Comercial (Simulação)
          </button>
        </div>
      </div>

      {/* Top CRM KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total de Leads</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block mt-0.5">128</span>
          <span className="text-[10px] text-slate-400">Últimos 30 dias</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Novos Hoje</span>
          <span className="text-xl font-bold text-alpha-500 block mt-0.5">14</span>
          <span className="text-[10px] text-emerald-600 font-semibold">+4 vs ontem</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Em Negociação</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block mt-0.5">31</span>
          <span className="text-[10px] text-slate-400">Atendimento ativo</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Agendamentos</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white block mt-0.5">8</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Para esta semana</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block">Taxa de Conversão</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">18,4%</span>
          <span className="text-[10px] text-slate-400">Lead → Matrícula</span>
        </div>
      </div>

      {/* Main CRM View: Pipeline Mode */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Pipeline Kanban Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Stage Bar Header / Mobile Scrollable Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
              {pipelineStages.map((st) => (
                <div 
                  key={st.id} 
                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#101522] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 px-2.5 shrink-0 min-w-[120px]"
                >
                  <span className="text-slate-700 dark:text-slate-300 truncate text-xs">{st.title}</span>
                  <span className="text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-1.5 py-0.2 rounded shadow-xs">
                    {st.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Leads List by Stage */}
            <div className="space-y-2.5">
              {leadsList.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-3.5 rounded-xl bg-white dark:bg-[#101522] border transition-all cursor-pointer shadow-xs ${
                    selectedLead.id === lead.id
                      ? 'border-alpha-500 ring-1 ring-alpha-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{lead.name}</h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-[#0D121D] text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.2 rounded border border-slate-200 dark:border-slate-800 uppercase">
                        {lead.interest}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded capitalize">
                      {lead.stage}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">{lead.lastActivity}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Próxima Ação: <strong className="text-slate-700 dark:text-slate-300">{lead.nextAction}</strong></span>
                    {lead.scheduledFor && (
                      <span className="font-bold text-alpha-600 dark:text-alpha-400">
                        {lead.scheduledFor}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Lead Detail Drawer / Card (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ficha do Lead</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedLead.name}</h3>
              <p className="text-xs text-slate-500">
                Interesse: <strong className="capitalize text-slate-700 dark:text-slate-300">{selectedLead.interest}</strong> • Unidade: <strong>{selectedLead.unit === 'unidade-1' ? 'Matriz' : 'Unidade 2'}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Qualificação Comercial</span>
                <p className="text-[11px] text-slate-500">Intenção de Compra: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">Alta</strong></p>
                <p className="text-[11px] text-slate-500">Telefone: <strong className="text-slate-800 dark:text-slate-200">{selectedLead.phone}</strong></p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Linha do Tempo de Atendimento:</span>
                <div className="border-l-2 border-slate-200 dark:border-slate-700 pl-3 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px]">26/08 · 00:15</span>
                    <p className="text-slate-700 dark:text-slate-300">Assistente respondeu sobre turmas do Box de Crossfit.</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">26/08 · 00:18</span>
                    <p className="text-slate-700 dark:text-slate-300 font-semibold text-emerald-600">Aula experimental confirmada para 27/08 às 19:00.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px]">
                <strong className="block mb-0.5">Próximo Passo Recomendado:</strong>
                Recepção deve enviar lembrete via WhatsApp 2 horas antes da aula.
              </div>

              <button
                onClick={() => alert(`Enviando mensagem para ${selectedLead.name}...`)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Confirmar Presença no WhatsApp
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Assistente Simulator View */}
      {activeTab === 'assistente' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Simulador do Assistente Comercial</h3>
            <p className="text-xs text-slate-500">Testar como o assistente responde a dúvidas sobre horários e planos do CT ALPHA.</p>
          </div>

          <div className="h-64 overflow-y-auto space-y-2.5 pr-1">
            {chatLog.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-xs ${
                  m.sender === 'user'
                    ? 'bg-alpha-500 text-white font-semibold'
                    : 'bg-slate-50 dark:bg-[#0D121D] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              placeholder="Digite uma mensagem de teste..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-50 dark:bg-[#0D121D] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-alpha-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-alpha-500 hover:bg-alpha-600 text-white p-2 rounded-lg shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
