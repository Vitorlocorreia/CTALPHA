import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  HeartPulse,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

interface CheckoutViewProps {
  initialPlan?: string;
  initialUnit?: 'unidade-1' | 'unidade-2';
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ 
  initialPlan = 'Plano Alpha VIP',
  initialUnit = 'unidade-1' 
}) => {
  const { setCurrentView, setUserRole, addNewStudent, showNotification } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected Plan & Unit State
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [selectedUnit, setSelectedUnit] = useState<'unidade-1' | 'unidade-2'>(initialUnit);
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('masculino');

  // Step 2: Address & Emergency & Health
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [goal, setGoal] = useState<'hipertrofia' | 'emagrecimento' | 'condicionamento' | 'performance_luta'>('hipertrofia');
  const [hasRestrictions, setHasRestrictions] = useState(false);
  const [restrictionNote, setRestrictionNote] = useState('');

  // Step 3: Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate pricing based on selected plan
  const planDetails: Record<string, { name: string; price: number; badge: string; description: string; modalities: ('musculacao' | 'crossfit' | 'luta')[] }> = {
    'Plano Alpha VIP': {
      name: 'Plano Alpha VIP',
      price: 149.90,
      badge: 'Com o plano Alpha VIP você pode treinar em todas as modalidades e unidades!',
      description: 'Musculação + Box de Crossfit + Tatame de Lutas',
      modalities: ['musculacao', 'crossfit', 'luta']
    },
    'Cross + Musculação': {
      name: 'Plano Cross + Musculação',
      price: 129.90,
      badge: 'Treine no Box de Crossfit oficial e na área de Musculação completa!',
      description: 'Box de Crossfit + Musculação Completa',
      modalities: ['crossfit', 'musculacao']
    },
    'Musculação Prime': {
      name: 'Plano Musculação Prime',
      price: 99.90,
      badge: 'Acesso total à musculação com maquinário biomecânico das 05h às 22h!',
      description: 'Musculação Completa de Alta Performance',
      modalities: ['musculacao']
    }
  };

  const currentPlanInfo = planDetails[selectedPlan] || planDetails['Plano Alpha VIP'];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !phone || !cpf) {
        showNotification('Preencha todos os campos obrigatórios.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinishEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const restrictionsList: string[] = [];
    if (hasRestrictions && restrictionNote) {
      restrictionsList.push(restrictionNote);
    }

    // Persist real student into Supabase Postgres database
    await addNewStudent({
      name: name || 'Novo Aluno CT ALPHA',
      cpf: cpf || '000.000.000-00',
      phone: phone || '(81) 99892-9667',
      email: email || 'aluno@ctalpha.com.br',
      unit: selectedUnit,
      planName: currentPlanInfo.name,
      planValue: currentPlanInfo.price,
      modalities: currentPlanInfo.modalities,
      biotype: 'mesomorfo',
      goal: goal,
    });

    setIsProcessing(false);
    setIsCompleted(true);
    showNotification('Matrícula aprovada! Acesso liberado no sistema.');
  };

  // Success Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6 animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-alpha-500 tracking-wider">Matrícula Concluída</span>
            <h2 className="text-2xl font-black text-slate-900 uppercase">Bem-vindo(a) ao CT ALPHA!</h2>
            <p className="text-xs text-slate-500">
              Sua matrícula no <strong>{currentPlanInfo.name}</strong> está ativa.
            </p>
          </div>

          {/* Digital QR Pass */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-alpha-400 font-bold uppercase block">Passe de Acesso Digital</span>
                <h4 className="text-base font-bold text-white">{name}</h4>
                <p className="text-[11px] text-slate-300">
                  {selectedUnit === 'unidade-1' ? 'Matriz (Rua Marechal Deodoro, 150)' : 'Unidade 2 (Av. Gen. Antônio Coelho, 420)'}
                </p>
              </div>
              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
              <span>Status: Matrícula Ativa & Liberada</span>
              <span>Vencimento: 26/09/2026</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setUserRole('aluno');
                setCurrentView('student_portal');
              }}
              className="flex-1 bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-black uppercase tracking-wider py-3 rounded-full transition-colors shadow-md"
            >
              Acessar App do Aluno
            </button>

            <button
              onClick={() => {
                setUserRole('gestor');
                setCurrentView('students');
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 rounded-full transition-colors"
            >
              Ver no Painel do Gestor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-alpha-500 selection:text-white">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 px-4 sm:px-12 py-4 flex items-center justify-between bg-white sticky top-0 z-30">
        <button
          onClick={() => {
            if (step > 1) setStep((step - 1) as any);
            else setCurrentView('landing');
          }}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 p-1 flex items-center justify-center">
            <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-sm uppercase tracking-wider text-slate-900">
            CT <span className="text-alpha-500">ALPHA</span>
          </span>
        </div>

        <div className="text-[11px] font-bold text-slate-400">
          Etapa {step} de 3
        </div>
      </header>

      {/* Main Split Layout: Left Form (7 cols) + Right Order Summary (5 cols) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Multi-Step Enrollment Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {step === 1 && 'Sua jornada fitness começa agora'}
                {step === 2 && 'Endereço e Perfil de Saúde'}
                {step === 3 && 'Forma de Pagamento Segura'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {step === 1 && 'Preencha seus dados para emitir seu contrato e liberar seu acesso.'}
                {step === 2 && 'Informações necessárias para montagem de treino e segurança física.'}
                {step === 3 && 'Cobrança mensal no cartão ou PIX dinâmico sem prender o limite.'}
              </p>
            </div>

            {/* Step 1: Personal Data */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CPF (apenas números) *</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DDD + Celular (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      placeholder="(81) 99892-9667"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Data de Nascimento *</label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
                  Utilizamos seus dados pessoais para o cadastro em nossa plataforma, geração da ficha de treino e liberação no aplicativo do CT ALPHA. Seus dados estão 100% seguros sob a LGPD.
                </p>

                <button
                  type="submit"
                  className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-full transition-all shadow-md mt-4 text-center block"
                >
                  Continuar cadastro
                </button>
              </form>
            )}

            {/* Step 2: Address, Emergency & Health Profile */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Residencial</label>
                  <input
                    type="text"
                    placeholder="Ex: Rua Marechal Deodoro da Fonseca, Centro - Aliança/PE"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contato de Emergência (Nome + Telefone)</label>
                  <input
                    type="text"
                    placeholder="Ex: Maria Silva (Mãe) - (81) 99123-4567"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Objetivo Principal *</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 font-semibold"
                    >
                      <option value="hipertrofia">Hipertrofia Muscular</option>
                      <option value="emagrecimento">Emagrecimento & Definição</option>
                      <option value="condicionamento">Condicionamento Crossfit</option>
                      <option value="performance_luta">Artes Marciais / Lutas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Possui alguma restrição física/médica?</label>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setHasRestrictions(false)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${!hasRestrictions ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}
                      >
                        Não, estou apto
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasRestrictions(true)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${hasRestrictions ? 'bg-alpha-500 text-white border-alpha-500' : 'bg-white text-slate-700 border-slate-300'}`}
                      >
                        Sim, tenho
                      </button>
                    </div>
                  </div>
                </div>

                {hasRestrictions && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Descreva a restrição (Ex: Joelho, Lombar, etc.):</label>
                    <input
                      type="text"
                      placeholder="Ex: Condromalácia patelar grau 2 no joelho esquerdo"
                      value={restrictionNote}
                      onChange={(e) => setRestrictionNote(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500"
                    />
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  Declaro para os devidos fins que estou em plenas condições de saúde para a prática de atividades físicas no CT ALPHA (Questionário de Prontidão PAR-Q).
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-4 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-full transition-all shadow-md text-center block"
                  >
                    Ir para o Pagamento
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <form onSubmit={handleFinishEnrollment} className="space-y-5">
                {/* Payment Method Tabs */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${
                      paymentMethod === 'cartao'
                        ? 'border-alpha-500 bg-orange-50 text-alpha-600 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão Recorrente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-alpha-500 bg-orange-50 text-alpha-600 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX Instantâneo</span>
                  </button>
                </div>

                {paymentMethod === 'cartao' ? (
                  <div className="space-y-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cartão de Crédito *</label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nome impresso no Cartão *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: CARLOS H BEZERRA"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500 uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Validade (MM/AA) *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Código de Segurança (CVV) *</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-alpha-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Pagamento via PIX Automático</h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      O código PIX dinâmico será gerado no valor de <strong>R$ {currentPlanInfo.price.toFixed(2)}</strong> com liberação imediata no aplicativo e sistema.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-4 rounded-full border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-2/3 bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-full transition-all shadow-lg hover:shadow-alpha-500/25 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Validando no banco...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Finalizar Matrícula</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Badges & Trust Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-700">Ambiente 100% Seguro</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span>Visa</span> • <span>Mastercard</span> • <span>Elo</span> • <span>PIX Instantâneo</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Details Card (Sticky Smart Fit Summary) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-md space-y-5">
              
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Detalhes da compra
              </h3>

              {/* Unit Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 block">
                    {selectedUnit === 'unidade-1' ? 'Unidade 1 - Matriz (Centro)' : 'Unidade 2 - Expansão'}
                  </span>
                  <button
                    onClick={() => setSelectedUnit(selectedUnit === 'unidade-1' ? 'unidade-2' : 'unidade-1')}
                    className="text-alpha-600 hover:text-alpha-700 text-[11px] font-bold"
                  >
                    Trocar unidade
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedUnit === 'unidade-1' 
                    ? 'Rua Marechal Deodoro da Fonseca, 150 — Aliança, Pernambuco' 
                    : 'Av. Gen. Antônio Coelho, 420 — Aliança, Pernambuco'}
                </p>
              </div>

              {/* Plan Card */}
              <div className="p-5 rounded-2xl bg-[#111622] text-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black uppercase text-white tracking-wide">
                    {currentPlanInfo.name}
                  </span>
                  <span className="text-[10px] font-bold text-alpha-400 bg-alpha-500/10 border border-alpha-500/30 px-2 py-0.5 rounded">
                    Recorrente
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/80 text-[11px] text-slate-200 leading-relaxed flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-alpha-400 shrink-0 mt-0.5" />
                  <span>{currentPlanInfo.badge}</span>
                </div>

                {/* Plan Switcher Pills */}
                <div className="pt-2 flex gap-1 text-[10px] font-bold">
                  {Object.keys(planDetails).map((pKey) => (
                    <button
                      key={pKey}
                      onClick={() => setSelectedPlan(pKey)}
                      className={`flex-1 py-1 rounded-md transition-colors ${
                        selectedPlan === pKey ? 'bg-alpha-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pKey.replace('Plano ', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Table */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-200 text-slate-700">
                <div className="flex justify-between font-semibold">
                  <span>1ª Mensalidade:</span>
                  <span className="font-mono font-bold text-slate-900">R$ {currentPlanInfo.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Mensalidades Restantes:</span>
                  <span className="font-mono">R$ {currentPlanInfo.price.toFixed(2)}/mês</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Taxa de Matrícula / Adesão:</span>
                  <span>R$ 0,00 (Grátis)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900">Total a pagar hoje:</span>
                  <span className="text-xl font-black text-alpha-600 font-mono">
                    R$ {currentPlanInfo.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-100 text-[10px] text-slate-500 leading-relaxed">
                Uma cobrança é gerada a cada mês no débito recorrente. Portanto, você treina <strong>sem comprometer o limite total</strong> do seu cartão de crédito com o valor anual.
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
