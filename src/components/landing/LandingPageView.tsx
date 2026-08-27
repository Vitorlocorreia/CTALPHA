import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Dumbbell, 
  Flame, 
  Swords, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Instagram, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  User,
  Calendar,
  Send,
  Building2,
  ChevronRight,
  CreditCard,
  QrCode,
  LogIn,
  Search,
  Check,
  ChevronLeft,
  Smartphone,
  Award,
  Zap,
  Activity,
  HeartPulse,
  Info,
  X
} from 'lucide-react';
import { GYM_INFO } from '@/data/mockData';

export const LandingPageView: React.FC = () => {
  const { setCurrentView, setUserRole, addLeadFromAI, showNotification } = useApp();

  const [selectedUnitFilter, setSelectedUnitFilter] = useState<'unidade-1' | 'unidade-2'>('unidade-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadInterest, setLeadInterest] = useState<'crossfit' | 'luta' | 'musculacao' | 'completo'>('completo');
  const [leadUnit, setLeadUnit] = useState<'unidade-1' | 'unidade-2'>('unidade-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setIsSubmitting(true);
    await addLeadFromAI({
      name: leadName,
      phone: leadPhone,
      interest: leadInterest,
      unit: leadUnit,
      status: 'experimental_agendada',
      notes: `Solicitação de matrícula/aula experimental pelo site oficial.`,
      source: 'Landing Page Oficial (B2C)'
    });

    setIsSubmitting(false);
    setSubmitted(true);
    showNotification('Solicitação recebida! Nossa equipe entrará em contato via WhatsApp.');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-alpha-500 selection:text-white">
      
      {/* 1. Top Navbar (Clean Smart Fit Style) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-10 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 p-1.5 flex items-center justify-center shadow-xs">
            <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-base font-black tracking-wider uppercase font-sans text-slate-900 leading-none block">
              CT <span className="text-alpha-500">ALPHA</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-tight">Centro de Treinamento</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-700">
          <a href="#unidades" className="hover:text-alpha-500 transition-colors">Unidades</a>
          <a href="#planos" className="hover:text-alpha-500 transition-colors">Planos & Preços</a>
          <a href="#experiencia" className="hover:text-alpha-500 transition-colors">Aulas & Treinos</a>
          <button 
            onClick={() => setCurrentView('student_login')} 
            className="hover:text-alpha-500 transition-colors font-bold text-xs"
          >
            Espaço do Aluno
          </button>
          <a 
            href="https://www.instagram.com/academiactalpha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 hover:text-pink-600 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@academiactalpha</span>
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('student_login')}
            className="text-xs font-bold text-slate-700 hover:text-alpha-600 border border-slate-300 hover:border-alpha-500 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 bg-white shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span>Já sou aluno</span>
          </button>

          <button
            onClick={() => setCurrentView('checkout')}
            className="bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-extrabold uppercase px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-alpha-500/25 tracking-wider"
          >
            Matricule-se Já
          </button>

          <button
            onClick={() => {
              setUserRole('gestor');
              setCurrentView('dashboard');
            }}
            className="p-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Acessar Sistema de Gestão / ERP"
          >
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Hero Big Promo Banner (Card Arredondado 80/20 com Fundo Branco Visível) */}
      <section className="px-4 sm:px-8 lg:px-12 pt-4 pb-8 max-w-[1400px] mx-auto">
        <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 min-h-[500px] sm:min-h-[580px] lg:min-h-[620px] flex items-center">
          <img
            src="/promo_hero.jpg"
            alt="Centro de Treinamento CT ALPHA"
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 hover:scale-[1.01] transition-transform duration-1000"
          />
          {/* Subtle dynamic gradient to highlight text while keeping gym photo clear */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

          {/* Banner Promo Content */}
          <div className="relative z-10 p-6 sm:p-12 lg:p-14 max-w-2xl text-white space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-alpha-500 text-white font-black text-xs uppercase px-4 py-1.5 rounded-full tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>O Maior Centro de Treinamento da Região</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight font-sans leading-[0.95] drop-shadow-2xl">
              TRANSFORME <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-alpha-400 via-orange-300 to-amber-300">
                SEU CORPO
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium drop-shadow-md max-w-lg leading-relaxed">
              Musculação de alta performance, Box de Crossfit oficial e Tatame de Lutas. Treine em 2 unidades completas em Aliança/PE com acompanhamento de treinador e treinos personalizados.
            </p>

            {/* Quick feature tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-200">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">✓ 2 Unidades em Aliança</span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">✓ Ficha Digital no App</span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">✓ Aulas Coletivas Inclusas</span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => setCurrentView('checkout')}
                className="bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-full transition-all shadow-xl shadow-alpha-500/40 hover:scale-105"
              >
                MATRICULE-SE JÁ
              </button>

              <button
                onClick={() => setCurrentView('student_login')}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all flex items-center gap-2 hover:border-white"
              >
                <User className="w-4 h-4 text-alpha-400" />
                <span>Espaço do Aluno</span>
              </button>

              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-md border border-amber-300/30">
                /// Vagas Abertas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Encontre a academia mais próxima (Smart Fit Unit Finder) */}
      <section id="unidades" className="py-8 px-4 sm:px-10 max-w-7xl mx-auto space-y-4">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
            Encontre a academia <span className="text-alpha-500">mais próxima</span>
          </h3>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 max-w-4xl mx-auto aspect-[16/7] flex items-center justify-center">
          <img
            src="/facade.jpg"
            alt="Fachada CT ALPHA"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Search Card Overlay */}
          <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 space-y-3 text-center border border-white/40">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 justify-center">
              <Building2 className="w-4 h-4 text-alpha-500" />
              <span>Unidades CT ALPHA em Aliança/PE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setSelectedUnitFilter('unidade-1')}
                className={`py-2 px-3 rounded-xl border transition-all ${
                  selectedUnitFilter === 'unidade-1'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Matriz (Centro)
              </button>
              <button
                onClick={() => setSelectedUnitFilter('unidade-2')}
                className={`py-2 px-3 rounded-xl border transition-all ${
                  selectedUnitFilter === 'unidade-2'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Unidade 2 (Expansão)
              </button>
            </div>

            <p className="text-[11px] text-slate-600">
              {selectedUnitFilter === 'unidade-1' 
                ? 'Rua Marechal Deodoro da Fonseca, 150 • Abre às 05:00'
                : 'Av. Gen. Antônio Coelho, 420 • Abre às 05:30'}
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-alpha-500 hover:bg-alpha-600 text-white text-xs font-bold uppercase py-2.5 rounded-xl transition-colors shadow-xs"
            >
              Ver Detalhes da Unidade
            </button>
          </div>
        </div>
      </section>

      {/* 4. Planos & Preços (Exact Smart Fit 3-Column Plan Cards) */}
      <section id="planos" className="py-14 px-4 sm:px-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Venha treinar no <span className="text-alpha-500">maior centro de treinamento</span> de Pernambuco
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Os melhores planos com livre acesso e sem comprometer o limite do seu cartão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Plano Alpha VIP (Center Highlight - Black Card) */}
            <div className="rounded-3xl bg-[#111622] text-white p-7 flex flex-col justify-between space-y-6 shadow-2xl relative border-2 border-alpha-500 order-first md:order-none">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-alpha-500 text-white font-black text-[10px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                O Mais Completo
              </div>

              <div>
                <span className="text-xs font-bold text-alpha-400 uppercase tracking-wider">Livre Acesso Total</span>
                <h4 className="text-2xl font-black uppercase text-white mt-1">Plano Alpha VIP</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Treine Musculação, Box de Crossfit e Tatame de Lutas nas 2 unidades.
                </p>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400 block">Mensalidade Recorrente</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-white">R$ 149,90</span>
                    <span className="text-xs text-slate-400">/ mês</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold block mt-1">✓ Sem taxa de anuidade</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-6 mt-6 border-t border-slate-800">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-alpha-500 shrink-0" />
                    <span><strong>Livre acesso</strong> a Musculação + Crossfit + Lutas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-alpha-500 shrink-0" />
                    <span>Acesso a todas as <strong>2 unidades</strong> em Aliança</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-alpha-500 shrink-0" />
                    <span>Sem fidelidade presa no limite do cartão</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-alpha-500 shrink-0" />
                    <span>Ficha técnica no <strong>App CT Alpha</strong> inclusa</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full transition-all shadow-lg hover:shadow-alpha-500/30 text-center"
              >
                Contratar Agora
              </button>
            </div>

            {/* Card 2: Crossfit + Musculação */}
            <div className="rounded-3xl bg-white text-slate-900 p-7 flex flex-col justify-between space-y-6 shadow-md border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crossfit & Funcional</span>
                <h4 className="text-2xl font-black uppercase text-slate-900 mt-1">Cross + Musculação</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ideal para quem busca condicionamento de alto impacto e força.
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 block">Mensalidade</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900">R$ 129,90</span>
                    <span className="text-xs text-slate-500">/ mês</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Débito automático ou PIX</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-6 mt-6 border-t border-slate-100">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acesso ao <strong>Box de Crossfit</strong> oficial</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acesso completo à área de Musculação</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Agendamento de WODs no aplicativo</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full transition-all text-center"
              >
                Contratar Agora
              </button>
            </div>

            {/* Card 3: Musculação Prime */}
            <div className="rounded-3xl bg-white text-slate-900 p-7 flex flex-col justify-between space-y-6 shadow-md border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Essencial</span>
                <h4 className="text-2xl font-black uppercase text-slate-900 mt-1">Musculação Prime</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Treino de musculação de alta performance das 05h às 22h.
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 block">Mensalidade</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-900">R$ 99,90</span>
                    <span className="text-xs text-slate-500">/ mês</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">Débito automático ou PIX</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 pt-6 mt-6 border-t border-slate-100">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maquinário biomecânico completo</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ficha de treino digital no App</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acompanhamento com treinador</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full transition-all text-center"
              >
                Contratar Agora
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Experiência CT ALPHA (3 Photo Highlights) */}
      <section id="experiencia" className="py-14 px-4 sm:px-10 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Experiência <span className="text-alpha-500">CT ALPHA</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">Ambiente de treinamento projetado para resultados reais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-3 group bg-white p-3">
            <div className="h-44 rounded-xl overflow-hidden">
              <img src="/hero_bg.jpg" alt="Equipamentos" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Equipamentos de Ponta</h4>
            <p className="text-xs text-slate-500">Biometria, anilhas olímpicas e maquinário moderno.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-3 group bg-white p-3">
            <div className="h-44 rounded-xl overflow-hidden">
              <img src="/promo_hero.jpg" alt="Crossfit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Box de Crossfit Integrado</h4>
            <p className="text-xs text-slate-500">Estrutura de rig e comunidade ativa em Aliança.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-3 group bg-white p-3">
            <div className="h-44 rounded-xl overflow-hidden">
              <img src="/combat_bg.jpg" alt="Tatame Lutas" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Tatame de Lutas Oficial</h4>
            <p className="text-xs text-slate-500">Muay Thai e Jiu-Jitsu com mestres graduados.</p>
          </div>
        </div>
      </section>

      {/* 6. Aulas e Treinos Exclusivos */}
      <section className="py-14 px-4 sm:px-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Aulas e treinos <span className="text-alpha-500">exclusivos</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">Turmas dinâmicas guiadas por especialistas credenciados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-alpha-600 px-3 py-1 rounded-full">
                Alta Intensidade
              </span>
              <h4 className="text-base font-black text-slate-900 uppercase">Crossfit WOD</h4>
              <div className="flex justify-center gap-6 text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-alpha-500" /> 60 min</span>
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-alpha-500" /> Até 800 kcal</span>
              </div>
              <p className="text-xs text-slate-500">Treino funcional com barras, cordas e agachamentos em grupo.</p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-alpha-600 px-3 py-1 rounded-full">
                Combate & Defesa
              </span>
              <h4 className="text-base font-black text-slate-900 uppercase">Muay Thai & Jiu-Jitsu</h4>
              <div className="flex justify-center gap-6 text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-alpha-500" /> 75 min</span>
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-alpha-500" /> Até 900 kcal</span>
              </div>
              <p className="text-xs text-slate-500">Técnicas de combate, postura e queima calórica intensa no tatame.</p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm text-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-alpha-600 px-3 py-1 rounded-full">
                Hipertrofia & Força
              </span>
              <h4 className="text-base font-black text-slate-900 uppercase">Musculação Guiada</h4>
              <div className="flex justify-center gap-6 text-xs text-slate-600 font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-alpha-500" /> 50 min</span>
                <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-alpha-500" /> Foco Muscular</span>
              </div>
              <p className="text-xs text-slate-500">Periodizações divididas em ABC/ABCD adaptadas para seus objetivos.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CT ALPHA App Showcase Banner (Smart Fit App Banner Style) */}
      <section id="app" className="py-12 px-4 sm:px-10 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border border-orange-200 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 max-w-lg">
            <span className="text-xs font-black uppercase tracking-wider text-alpha-600">Tecnologia Exclusiva</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase leading-tight">
              CT ALPHA App: <br />Seu aliado nos treinos!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Acesse sua ficha de treino montada pelo treinador, faça check-in digital por QR Code na recepção e agende suas aulas de Crossfit direto pelo smartphone.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-xs flex items-center justify-center border border-orange-200">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-xs font-bold text-slate-800 space-y-1">
                <p>✓ Disponível para Android e iOS</p>
                <p>✓ Acesso incluso em todos os planos</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-orange-300">
            <img src="/app_banner.jpg" alt="CT ALPHA App Mockup" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* 8. Serviços Adicionais */}
      <section className="py-14 px-4 sm:px-10 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Conheça nossos <span className="text-alpha-500">serviços adicionais</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">Potencialize seus resultados com nossos acompanhamentos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black text-alpha-500 uppercase">CT Alpha Body</span>
            <h4 className="text-base font-bold text-slate-900">Bioimpedância & Avaliação Física</h4>
            <p className="text-xs text-slate-500">Mapeamento preciso de massa magra, % de gordura e hidratação.</p>
            <div className="pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
              R$ 49,90 <span className="text-xs text-slate-400 font-normal">/ sessão</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black text-alpha-500 uppercase">CT Alpha Coach</span>
            <h4 className="text-base font-bold text-slate-900">Personal Trainer Individual</h4>
            <p className="text-xs text-slate-500">Acompanhamento 1 a 1 para foco total em metas específicas.</p>
            <div className="pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
              R$ 199,90 <span className="text-xs text-slate-400 font-normal">/ mês</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <span className="text-xs font-black text-alpha-500 uppercase">CT Alpha Energy</span>
            <h4 className="text-base font-bold text-slate-900">Bebidas & Suplementos</h4>
            <p className="text-xs text-slate-500">Isotônicos, creatina, whey e energéticos gelados no balcão.</p>
            <div className="pt-2 border-t border-slate-100 font-bold text-sm text-slate-900">
              A partir de R$ 6,00
            </div>
          </div>
        </div>
      </section>

      {/* 9. Modal de Matrícula / Aula Experimental Grátis */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-7 shadow-2xl relative animate-scaleUp text-slate-900 border border-slate-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSubmitted(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 text-center">
              <span className="text-[10px] font-black text-alpha-500 uppercase tracking-wider">
                Garantir Vaga • Sem Compromisso
              </span>
              <h3 className="text-xl font-black uppercase text-slate-900 mt-0.5">Matrícula & Aula Grátis</h3>
              <p className="text-xs text-slate-500">Venha treinar no CT ALPHA de Aliança/PE</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Vaga Registrada no Sistema!</h4>
                <p className="text-xs text-emerald-800">
                  Nossa recepção já recebeu seus dados no CT ALPHA Hub e entrará em contato via WhatsApp.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl mt-2"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Henrique Bezerra"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-alpha-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp com DDD:</label>
                  <input
                    type="text"
                    required
                    placeholder="(81) 99892-9667"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-alpha-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Interesse:</label>
                    <select
                      value={leadInterest}
                      onChange={(e) => setLeadInterest(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-alpha-500"
                    >
                      <option value="completo">Plano VIP (Todos)</option>
                      <option value="crossfit">Crossfit Box</option>
                      <option value="musculacao">Musculação</option>
                      <option value="luta">Tatame Lutas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Unidade:</label>
                    <select
                      value={leadUnit}
                      onChange={(e) => setLeadUnit(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-alpha-500"
                    >
                      <option value="unidade-1">Matriz (Centro)</option>
                      <option value="unidade-2">Unidade 2</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-alpha-500 hover:bg-alpha-600 text-white font-black uppercase text-xs tracking-wider py-3.5 rounded-full transition-all shadow-md mt-2"
                >
                  {isSubmitting ? 'Gravando no banco...' : 'Confirmar Solicitação'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 10. Comprehensive Footer (Smart Fit Dark Footer Style) */}
      <footer className="bg-[#0B0E14] text-slate-400 py-12 px-4 sm:px-10 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="CT ALPHA" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-black text-base uppercase">CT ALPHA • Centro de Treinamento</span>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <a href="https://www.instagram.com/academiactalpha" target="_blank" rel="noopener noreferrer" className="hover:text-alpha-400 flex items-center gap-1">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <span>•</span>
              <a href="tel:81998929667" className="hover:text-alpha-400 flex items-center gap-1">
                <Phone className="w-4 h-4" /> (81) 99892-9667
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px]">
            <div>
              <h5 className="font-bold text-white uppercase mb-2">Unidade 1 (Matriz)</h5>
              <p>Rua Marechal Deodoro da Fonseca, 150</p>
              <p>Aliança - PE • CEP 55890-000</p>
              <p className="mt-1">Seg a Sex das 05:00 às 22:00 | Sáb 06:00 às 14:00</p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2">Unidade 2 (Expansão)</h5>
              <p>Av. Gen. Antônio Coelho, 420</p>
              <p>Aliança - PE</p>
              <p className="mt-1">Seg a Sex das 05:30 às 21:30 | Sáb 07:00 às 12:00</p>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2">Modalidades Oficiais</h5>
              <p>• Musculação de Alta Performance</p>
              <p>• Box de Crossfit Oficial</p>
              <p>• Tatame de Muay Thai & Jiu-Jitsu</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
            © 2026 CT ALPHA. Todos os direitos reservados. Aliança - Pernambuco.
          </div>
        </div>
      </footer>

    </div>
  );
};
