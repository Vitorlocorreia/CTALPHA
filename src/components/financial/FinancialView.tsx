import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  QrCode, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Copy,
  Receipt,
  FileCheck,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

export const FinancialView: React.FC = () => {
  const { 
    financial, 
    selectedUnit, 
    students, 
    sendWhatsAppBilling,
    showNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'geral' | 'receber' | 'cobrancas' | 'conciliacao'>('geral');
  const [activeRuleTab, setActiveRuleTab] = useState<'pre' | 'day' | 'late'>('late');

  const filteredStudents = students.filter(s => 
    selectedUnit === 'todas' ? true : s.unit === selectedUnit
  );

  const lateStudents = filteredStudents.filter(s => s.paymentStatus === 'atrasado');
  const warningStudents = filteredStudents.filter(s => s.paymentStatus === 'vencendo');
  const activeStudents = filteredStudents.filter(s => s.paymentStatus === 'adimplente');

  // Real aggregate calculations
  const totalRevenue = filteredStudents.reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);
  const totalReceived = activeStudents.reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);
  const totalWarning = warningStudents.reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);
  const totalLate = lateStudents.reduce((acc, s) => acc + (Number(s.planValue) || 0), 0);

  const receivedPercent = totalRevenue > 0 ? ((totalReceived / totalRevenue) * 100).toFixed(1) : '100.0';
  const latePercent = totalRevenue > 0 ? ((totalLate / totalRevenue) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Gestão Financeira & Conciliação</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agosto 2026 • Controle de contas a receber e faturamento real integrado ao Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            Ambiente de Simulação de Gateway (Sandbox PIX)
          </span>
        </div>
      </div>

      {/* Month Summary Bar (100% Real Agregado) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Receita Total da Carteira</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">{filteredStudents.length} planos contratados</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Recebido (Adimplente)</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-600 mt-1 block">{receivedPercent}% liquidado</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">A Vencer no Mês</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200 block mt-1">
            R$ {totalWarning.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">{warningStudents.length} faturas a vencer</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Inadimplência Real</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 block mt-1">
            R$ {totalLate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">{latePercent}% da base ({lateStudents.length} faturas)</span>
        </div>
      </div>

      {/* Financial Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('geral')}
          className={`py-2.5 px-4 border-b-2 transition-all ${activeTab === 'geral' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Visão Geral & Contas a Receber
        </button>
        <button
          onClick={() => setActiveTab('cobrancas')}
          className={`py-2.5 px-4 border-b-2 transition-all ${activeTab === 'cobrancas' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Régua Automática de Cobrança
        </button>
        <button
          onClick={() => setActiveTab('conciliacao')}
          className={`py-2.5 px-4 border-b-2 transition-all ${activeTab === 'conciliacao' ? 'border-alpha-500 text-slate-900 dark:text-white' : 'border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Conciliação de Gateway & PIX
        </button>
      </div>

      {/* Main Financial Area: Contas a Receber Table */}
      {activeTab === 'geral' && (
        <div className="rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Contas a Receber (Em Aberto & Vencidas)</h3>
              <p className="text-xs text-slate-500">Lista prioritária para conciliação ou disparo de lembrete</p>
            </div>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-[#0D121D] px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
              {lateStudents.length + warningStudents.length} Pendências
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-[#0D121D] text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-3 py-3">Vencimento</th>
                  <th className="px-3 py-3 text-right">Valor</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Método</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lateStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-[#141A29]">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                    <td className="px-3 py-3 text-red-600 dark:text-red-400 font-semibold">{st.dueDate} (Atrasado)</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {st.planValue.toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Atrasado
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500 font-medium">PIX Dinâmico</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => sendWhatsAppBilling(st.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))}

                {warningStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-[#141A29]">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                    <td className="px-3 py-3 text-amber-600 dark:text-amber-400 font-semibold">{st.dueDate} (Vence em breve)</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {st.planValue.toFixed(2)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-semibold">
                        A Vencer
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500 font-medium">Cartão Recorrente</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => showNotification(`Lembrete preventivo agendado para ${st.name}`)}
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-[11px] px-2 py-1"
                      >
                        Lembrete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Régua de Cobrança Tab */}
      {activeTab === 'cobrancas' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Régua Automática de Notificação</h3>
              <p className="text-xs text-slate-500">Comunicação contextual disparada via API oficial do WhatsApp</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0D121D] p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setActiveRuleTab('pre')}
                className={`px-2 py-0.5 rounded ${activeRuleTab === 'pre' ? 'bg-slate-900 text-white dark:bg-alpha-500' : 'text-slate-500'}`}
              >
                Pré-Vencimento (3d)
              </button>
              <button
                onClick={() => setActiveRuleTab('day')}
                className={`px-2 py-0.5 rounded ${activeRuleTab === 'day' ? 'bg-slate-900 text-white dark:bg-alpha-500' : 'text-slate-500'}`}
              >
                No Vencimento
              </button>
              <button
                onClick={() => setActiveRuleTab('late')}
                className={`px-2 py-0.5 rounded ${activeRuleTab === 'late' ? 'bg-slate-900 text-white dark:bg-alpha-500' : 'text-slate-500'}`}
              >
                Em Atraso
              </button>
            </div>
          </div>

          <div className="bg-[#0e161a] rounded-xl p-4 text-slate-100 text-xs leading-relaxed space-y-2 border border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Mensagem enviada por <strong>CT ALPHA Oficial</strong></span>
            </div>

            {activeRuleTab === 'pre' && (
              <p>
                Olá, <strong>Marcos</strong>! Lembramos que a sua mensalidade do <strong>Plano Lutas (CT ALPHA)</strong> vence em <strong>3 dias (28/08)</strong>.<br /><br />
                Para renovação antecipada via PIX com baixa automática, utilize o código abaixo:
              </p>
            )}

            {activeRuleTab === 'day' && (
              <p>
                Olá, <strong>Marcos</strong>! Hoje é a data de vencimento da sua mensalidade no <strong>CT ALPHA</strong>.<br /><br />
                Para manter seu acesso e treinos liberados na recepção, utilize o código PIX:
              </p>
            )}

            {activeRuleTab === 'late' && (
              <p>
                Olá, <strong>Marcos Vinícius</strong>. Constatamos uma pendência na mensalidade do seu plano (vencida em 22/08).<br /><br />
                Para regularizar seu plano e manter seus treinos liberados no aplicativo, efetue o pagamento no PIX abaixo:
              </p>
            )}

            <div className="bg-[#182229] p-2 rounded border border-slate-700 flex items-center justify-between gap-2 mt-2">
              <span className="text-[10px] font-mono text-emerald-400 truncate">
                00020126580014br.gov.bcb.pix0136ctalpha-marcos-2026
              </span>
              <button
                onClick={() => showNotification('Código PIX copiado!')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[10px] font-bold"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conciliação Tab */}
      {activeTab === 'conciliacao' && (
        <div className="p-5 rounded-xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl mx-auto space-y-3 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Status da Conciliação com Gateway Bancário</h3>
          <div className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
            <p>• <strong>Liquidação PIX:</strong> Instantânea (0 segundos de espera na recepção).</p>
            <p>• <strong>Taxa Média:</strong> 0,85% no PIX vs 2,8% em cartões de terceiros.</p>
            <p>• <strong>Sem travar limite:</strong> Cobrança recorrente mensal no cartão sem comprometer o limite total do aluno.</p>
          </div>
        </div>
      )}

    </div>
  );
};
