'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Cpu, 
  RefreshCw, 
  Terminal, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Database, 
  ChevronDown, 
  ChevronUp,
  Server,
  Lock,
  ArrowUpRight,
  Info,
  Clock,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';

const PLATFORMS = [
  { name: 'OpenAI Agents' },
  { name: 'Anthropic Agents' },
  { name: 'LangGraph' },
  { name: 'CrewAI' },
  { name: 'n8n' },
  { name: 'Custom SDKs' }
];

// Interactive Timeline Scenario Steps
interface TimelineStep {
  time: string;
  msg: string;
  type: 'info' | 'error' | 'intercept' | 'recovery' | 'success';
}

const SCENARIOS: Record<string, TimelineStep[]> = {
  'RATE LIMIT': [
    { time: '10:43:12', msg: 'Agent starts CRM lead sync task', type: 'info' },
    { time: '10:43:15', msg: 'OpenAI API rate limit encountered (HTTP 429)', type: 'error' },
    { time: '10:43:15', msg: 'Failure signature matched and detected by Resolv', type: 'intercept' },
    { time: '10:43:15', msg: 'Recovery policy: Exp-Backoff activated', type: 'intercept' },
    { time: '10:43:17', msg: 'Retrying payload with calculated 2000ms delay', type: 'recovery' },
    { time: '10:43:19', msg: 'Task completed successfully (HTTP 200 OK)', type: 'success' }
  ],
  'TOOL FAILURE': [
    { time: '14:20:01', msg: 'Agent dispatches contact payload', type: 'info' },
    { time: '14:20:03', msg: 'HubSpot database host connection timeout (HTTP 504)', type: 'error' },
    { time: '14:20:04', msg: 'Timeout exception intercepted by Resolv gateway', type: 'intercept' },
    { time: '14:20:04', msg: 'Applying route migration fallback policy', type: 'recovery' },
    { time: '14:20:05', msg: 'Rerouting payload to backup database mirror host', type: 'recovery' },
    { time: '14:20:07', msg: 'Customer record synchronized via fallback node', type: 'success' }
  ],
  'EXPIRED TOKEN': [
    { time: '08:12:30', msg: 'Agent requests email sequence dispatch', type: 'info' },
    { time: '08:12:32', msg: 'SendGrid returned Expired OAuth Signature (HTTP 401)', type: 'error' },
    { time: '08:12:32', msg: 'Credentials authorization failure isolated by Resolv', type: 'intercept' },
    { time: '08:12:33', msg: 'Requesting fresh token rotation from credentials vault', type: 'recovery' },
    { time: '08:12:34', msg: 'Rotating OAuth2 tokens and patching request headers', type: 'recovery' },
    { time: '08:12:36', msg: 'Sequence dispatched successfully under new signature', type: 'success' }
  ],
  'INFINITE LOOP': [
    { time: '11:05:40', msg: 'Agent invoking slack notification loop', type: 'info' },
    { time: '11:05:42', msg: 'Identical payload threshold exceeded (3 calls in 1.4s)', type: 'error' },
    { time: '11:05:42', msg: 'Circular logic loop intercepted by Resolv Engine', type: 'intercept' },
    { time: '11:05:43', msg: 'Triggering reasoning trace rollback to step L2', type: 'recovery' },
    { time: '11:05:44', msg: 'Injected logical divergence parameter into context', type: 'recovery' },
    { time: '11:05:46', msg: 'Loop broken. Agent stabilized and message sent', type: 'success' }
  ],
  'CONTEXT LOSS': [
    { time: '16:50:10', msg: 'Agent begins long summarization thread', type: 'info' },
    { time: '16:50:14', msg: 'Input tokens exceed 98% of model context capacity', type: 'error' },
    { time: '16:50:14', msg: 'Context buffer overflow warning isolated by Resolv', type: 'intercept' },
    { time: '16:50:15', msg: 'Activating context compression & metadata filter', type: 'recovery' },
    { time: '16:50:16', msg: 'Optimizing memory nodes and truncating duplicate logs', type: 'recovery' },
    { time: '16:50:18', msg: 'Task completed within model context limits', type: 'success' }
  ]
};

// FAQ Accordion Interfaces
interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'What failures can Resolv recover from?',
    a: 'Resolv actively intercepts and recovers from API rate limits (HTTP 429), server timeouts (503/504), expired auth credentials (401), logical reasoning loops, context window overflows, and hallucinated tool calls.'
  },
  {
    q: 'How does Resolv integrate with existing agent frameworks?',
    a: 'Resolv integrates as a lightweight SDK proxy or API gateway. Simply wrap your agent tool handlers or direct your HTTP transactions through the Resolv secure proxy endpoint.'
  },
  {
    q: 'Can Resolv work with OpenAI and Anthropic models?',
    a: 'Yes. Resolv is completely model-agnostic. It sits at the execution level below LLM layers, working with GPT-4o, Claude, local models like Llama, or custom reasoning agents.'
  },
  {
    q: 'Does Resolv replace observability tools?',
    a: 'No. Observability tools inform you of what broke after the damage is done. Resolv is active reliability infrastructure that intercepts and corrects errors in real time before they impact production.'
  },
  {
    q: 'What happens if recovery fails?',
    a: 'If all automated recovery playbooks are exhausted, Resolv safely suspends the agent state, locks the transaction context, and escalates to the human operator console to prevent corrupt actions.'
  },
  {
    q: 'When will the beta launch?',
    a: 'Our developer beta is currently rolling out. We allocate slots based on agent execution volume and stack compatibility.'
  }
];

export default function LandingPage() {
  const [activeScenario, setActiveScenario] = useState<string>('RATE LIMIT');
  const [visibleStepCount, setVisibleStepCount] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    stack: '',
    runs: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Trigger Step-by-Step Simulation on scenario swap
  useEffect(() => {
    setVisibleStepCount(0);
    const steps = SCENARIOS[activeScenario].length;
    let current = 0;
    
    const interval = setInterval(() => {
      current += 1;
      setVisibleStepCount(current);
      if (current >= steps) {
        clearInterval(interval);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [activeScenario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.company && formData.email && formData.stack && formData.runs) {
      setIsSubmitted(true);
      setFormData({ name: '', company: '', email: '', stack: '', runs: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-none relative z-10 grid-blueprint pb-16">
      
      {/* 1. GRID HEADER */}
      <header className="border-b border-[#BAC5D4] grid grid-cols-2 md:grid-cols-6 items-stretch w-full text-[10px] font-geist-mono text-[#002FA7] bg-[#F6F5F2]/40 backdrop-blur-md sticky top-0 z-50">
        
        {/* Col 1: Logo */}
        <div className="border-r border-[#BAC5D4] p-5 flex flex-col justify-center select-none shrink-0 min-w-[150px]">
          <span className="font-monument-bold text-lg sm:text-xl leading-[0.9] tracking-tighter text-[#002FA7]">
            RESOLV<br/>SYSTEM
          </span>
        </div>

        {/* Col 2: Docs */}
        <a href="#narrative" className="border-r border-[#BAC5D4] hover:bg-[#002FA7]/5 flex items-center justify-center font-geist-mono tracking-widest py-5 md:py-0 transition-colors">
          DIAGNOSTICS
        </a>

        {/* Col 3: Playbooks */}
        <a href="#recovery" className="border-r border-[#BAC5D4] hover:bg-[#002FA7]/5 flex items-center justify-center font-geist-mono tracking-widest py-5 md:py-0 transition-colors">
          PLAYBOOKS
        </a>

        {/* Col 4: Architecture */}
        <a href="#architecture" className="border-r border-[#BAC5D4] hover:bg-[#002FA7]/5 flex items-center justify-center font-geist-mono tracking-widest py-5 md:py-0 transition-colors">
          ARCHITECTURE
        </a>

        {/* Col 5: Waitlist */}
        <a href="#early-access" className="border-r border-[#BAC5D4] hover:bg-[#002FA7]/5 flex items-center justify-center font-geist-mono tracking-widest py-5 md:py-0 transition-colors">
          WAITLIST
        </a>

        {/* Col 6: Icons */}
        <div className="flex items-center justify-center gap-4 py-5 md:py-0">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#002FA7] text-zinc-650 transition-colors">
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#002FA7] text-zinc-650 transition-colors">
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
            </svg>
          </a>
        </div>

      </header>

      {/* SECTION 01 — HERO */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center border-b border-[#BAC5D4] w-full">
        
        {/* Background faint blueprint graphic */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <svg width="800" height="400" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#002FA7]">
            <circle cx="400" cy="200" r="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="200" r="100" stroke="currentColor" strokeWidth="1" />
            <line x1="200" y1="200" x2="600" y2="200" stroke="currentColor" strokeWidth="1" />
            <line x1="400" y1="50" x2="400" y2="350" stroke="currentColor" strokeWidth="1" />
            <rect x="250" y="100" width="300" height="200" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
            <circle cx="250" cy="100" r="6" fill="currentColor" />
            <circle cx="550" cy="100" r="6" fill="currentColor" />
            <circle cx="250" cy="300" r="6" fill="currentColor" />
            <circle cx="550" cy="300" r="6" fill="currentColor" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#002FA7]/30 bg-[#002FA7]/5 rounded-sm text-[9px] font-geist-mono-medium text-[#002FA7] tracking-widest mb-8">
          <Zap className="h-3 w-3 animate-pulse" />
          <span>AEROSYSTEM RELIABILITY SPECIFICATION // V2</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-monument-black text-[#002FA7] leading-[0.98] tracking-tight">
          THE SYSTEM THAT<br/>RECOVERS AI.
        </h1>
        
        <p className="font-canela-text text-zinc-650 mt-8 leading-relaxed max-w-2xl">
          When agents fail, loop endlessly, lose context, hit rate limits, or break workflows, Resolv automatically detects the issue and restores execution.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10 w-full sm:w-auto">
          <a href="#early-access" className="w-full sm:w-auto px-10 py-4 bg-[#002FA7] hover:bg-[#002380] text-white font-geist-mono-medium text-[10px] rounded-sm transition-all text-center">
            JOIN EARLY ACCESS
          </a>
          <a href="#demo" className="w-full sm:w-auto px-10 py-4 border border-[#BAC5D4] bg-white hover:bg-zinc-50 text-[#1A1C1E] font-geist-mono-medium text-[10px] rounded-sm transition-all text-center">
            WATCH RECOVERY DEMO
          </a>
        </div>

      </section>

      {/* SECTION 02 — AGENTS FAIL MORE THAN YOU THINK */}
      <section id="narrative" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 01 // PRODUCTION ANOMALIES</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">AGENTS FAIL MORE THAN YOU THINK.</h2>
          <p className="font-canela-text text-zinc-655 mt-4">
            AI agents are powerful. Reliable agents are rare. Modern production workflows hit non-deterministic bottlenecks that observability tools cannot repair.
          </p>
        </div>

        {/* 6 Grid Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 text-left border-t border-l border-[#BAC5D4]">
          
          <div className="border-r border-b border-[#BAC5D4] p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_01</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">INFINITE LOOPS</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">Agents repeatedly execute the same tool call with identical parameters without reaching completion.</p>
          </div>

          <div className="border-r border-b border-[#BAC5D4] p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_02</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">CONTEXT CORRUPTION</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">Agents lose track of objective states and begin making incorrect or hallucinated execution decisions.</p>
          </div>

          <div className="border-b border-[#BAC5D4] md:border-r p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_03</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">RATE LIMIT FAILURES</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">Model providers reject execution requests during peak traffic, throwing unhandled exceptions.</p>
          </div>

          <div className="border-r border-b md:border-b-0 border-[#BAC5D4] p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_04</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">TOOL FAILURES</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">External APIs return server errors (HTTP 500/504) or become completely unavailable mid-task.</p>
          </div>

          <div className="border-r border-[#BAC5D4] p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_05</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">SESSION EXPIRATION</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">API tokens, cookies, or credentials expire during multi-hour autonomous execution chains.</p>
          </div>

          <div className="border-[#BAC5D4] p-8 min-h-[160px] bg-white/20">
            <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">FAIL_06</span>
            <h4 className="font-canela-sc text-sm text-[#002FA7] mt-1.5">HALLUCINATED ACTIONS</h4>
            <p className="font-canela-regular text-zinc-650 text-xs mt-2.5">Agents attempt to invoke non-existent tool names or invalid schemas based on incorrect reasoning paths.</p>
          </div>

        </div>

        <div className="mt-8 text-center text-[9.5px] font-geist-mono-medium text-[#002FA7] uppercase tracking-wider">
          // Resolv sits between your agents and production systems to detect and recover these failures automatically.
        </div>

      </section>

      {/* SECTION 03 — WATCH RECOVERY IN ACTION */}
      <section id="demo" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 02 // INTERACTIVE RECOVERY TIMELINE</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">WATCH RECOVERY IN ACTION.</h2>
          <p className="font-canela-text text-zinc-650 mt-4">
            Select a common production anomaly. Watch Resolv intercept the error and restore the agent execution thread step-by-step.
          </p>
        </div>

        {/* Tab Scenario Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 w-full">
          {Object.keys(SCENARIOS).map((scenarioName) => (
            <button 
              key={scenarioName}
              onClick={() => setActiveScenario(scenarioName)}
              className={`px-4 py-2 text-[9px] font-geist-mono border rounded-sm transition-all cursor-pointer ${
                activeScenario === scenarioName
                  ? 'border-[#002FA7] bg-[#002FA7] text-white font-bold'
                  : 'border-[#BAC5D4] bg-white text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {scenarioName}
            </button>
          ))}
        </div>

        {/* Step-by-Step Timeline Animation Display */}
        <div className="w-full max-w-lg mx-auto bg-white border border-[#BAC5D4] p-8 rounded-sm relative shadow-sm min-h-[380px] flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,47,167,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,47,167,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="space-y-5 relative z-10">
            {SCENARIOS[activeScenario].map((step, idx) => {
              const isVisible = idx < visibleStepCount;
              
              let typeColor = 'border-zinc-350 bg-zinc-100 text-zinc-650';
              if (step.type === 'error') typeColor = 'border-red-300 bg-red-50 text-red-600';
              else if (step.type === 'intercept') typeColor = 'border-[#002FA7]/30 bg-[#002FA7]/5 text-[#002FA7]';
              else if (step.type === 'recovery') typeColor = 'border-[#D97706]/35 bg-[#D97706]/5 text-[#D97706]';
              else if (step.type === 'success') typeColor = 'border-emerald-300 bg-emerald-50 text-emerald-600';

              return (
                <div 
                  key={idx} 
                  className={`flex gap-4 items-start transition-all duration-500 transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="text-[9px] font-geist-mono text-zinc-400 mt-1">
                    {step.time}
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    step.type === 'success' ? 'bg-emerald-500' :
                    step.type === 'error' ? 'bg-red-500 animate-ping' :
                    step.type === 'intercept' ? 'bg-[#002FA7]' :
                    step.type === 'recovery' ? 'bg-[#D97706]' : 'bg-zinc-400'
                  }`} />
                  <div className={`flex-1 border p-2.5 rounded-sm text-[9.5px] font-geist-mono ${typeColor}`}>
                    {step.msg}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#BAC5D4] pt-4 mt-6 flex justify-between items-center text-[9px] font-geist-mono text-zinc-400">
            <span>RESOLV RELIABILITY SIMULATION</span>
            <span className="text-[#002FA7] font-bold">{visibleStepCount < SCENARIOS[activeScenario].length ? 'STABILIZING...' : 'RESTORED'}</span>
          </div>

        </div>

      </section>

      {/* SECTION 04 — RECOVERY PLAYBOOKS */}
      <section id="recovery" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 03 // RESOLV PLAYBOOKS</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">HOW RESOLV RESPONDS.</h2>
          <p className="font-canela-text text-zinc-650 mt-4">
            Resolv automatically matches isolated anomalies with specialized infrastructure recovery playbooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Card 01 */}
          <div className="bg-white border border-[#BAC5D4] p-5 rounded-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">PLAYBOOK_01</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">OPENAI RATE LIMIT</h4>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-geist-mono text-zinc-550 border-t border-zinc-100 pt-3 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Detected</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Wait</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Retry</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Continue</span></div>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white border border-[#BAC5D4] p-5 rounded-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">PLAYBOOK_02</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">EXPIRED TOKEN</h4>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-geist-mono text-zinc-550 border-t border-zinc-100 pt-3 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Detected</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Refresh credentials</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Resume execution</span></div>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-white border border-[#BAC5D4] p-5 rounded-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">PLAYBOOK_03</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">INFINITE TOOL LOOP</h4>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-geist-mono text-zinc-550 border-t border-zinc-100 pt-3 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Detected</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Interrupt execution</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>Escalate for review</span></div>
            </div>
          </div>

          {/* Card 04 */}
          <div className="bg-white border border-[#BAC5D4] p-5 rounded-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">PLAYBOOK_04</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">INVALID RESPONSE</h4>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-geist-mono text-zinc-550 border-t border-zinc-100 pt-3 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Detected</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Fallback provider</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Workflow continues</span></div>
            </div>
          </div>

          {/* Card 05 */}
          <div className="bg-white border border-[#BAC5D4] p-5 rounded-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">PLAYBOOK_05</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">LOW CONFIDENCE</h4>
            </div>
            
            <div className="flex flex-col gap-1.5 text-[9px] font-geist-mono text-zinc-550 border-t border-zinc-100 pt-3 mt-4">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Detected</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-400" /><span>Human approval</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>Execution paused</span></div>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 05 — ARCHITECTURE */}
      <section id="architecture" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 04 // ECOSYSTEM INTEGRATION</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">ONE RELIABILITY LAYER. EVERY AGENT.</h2>
          <p className="font-canela-text text-zinc-650 mt-4">
            Resolv acts as a centralized reliability backbone, protecting every model and framework in your stack.
          </p>
        </div>

        {/* Visual architecture diagram */}
        <div className="w-full max-w-3xl mx-auto bg-white border border-[#BAC5D4] p-8 rounded-sm relative flex flex-col gap-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,47,167,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,47,167,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Top Layer */}
          <div className="border border-[#BAC5D4] p-4 rounded-sm bg-[#F6F5F2]/40 relative z-10">
            <span className="text-[8px] font-geist-mono text-zinc-400 font-bold block mb-3">AGENT / MODEL FRAMEWORKS</span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[9.5px] font-geist-mono text-zinc-805">
              <span className="px-3 py-1 border border-zinc-250 bg-white">OpenAI Agents</span>
              <span className="px-3 py-1 border border-zinc-250 bg-white">Anthropic Agents</span>
              <span className="px-3 py-1 border border-zinc-250 bg-white">LangGraph</span>
              <span className="px-3 py-1 border border-zinc-250 bg-white">CrewAI</span>
              <span className="px-3 py-1 border border-zinc-250 bg-white">n8n</span>
              <span className="px-3 py-1 border border-zinc-250 bg-white">Custom Agents</span>
            </div>
          </div>

          {/* Down Arrow 1 */}
          <div className="flex justify-center text-[#002FA7] relative z-10">
            <div className="h-6 w-[1px] bg-[#002FA7]" />
          </div>

          {/* Center Layer */}
          <div className="border-2 border-[#002FA7] p-5 rounded-sm bg-[#002FA7]/5 relative z-10 max-w-md mx-auto w-full">
            <Shield className="h-6 w-6 text-[#002FA7] mx-auto mb-2" />
            <span className="font-monument-medium text-sm text-[#002FA7] tracking-wider font-black">RESOLV BACKBONE</span>
            <span className="text-[8px] font-geist-mono text-zinc-550 block mt-1">CENTRAL INTEGRATED PROXY SDK GATEWAY</span>
          </div>

          {/* Down Arrow 2 */}
          <div className="flex justify-center text-[#002FA7] relative z-10">
            <div className="h-6 w-[1px] bg-[#002FA7]" />
          </div>

          {/* Bottom Layer */}
          <div className="border border-[#BAC5D4] p-4 rounded-sm bg-[#F6F5F2]/40 relative z-10">
            <span className="text-[8px] font-geist-mono text-zinc-400 font-bold block mb-3">RECOVERY MODULES</span>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] font-geist-mono text-zinc-650">
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">Failure Detection</span>
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">Recovery Engine</span>
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">Escalation Gate</span>
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">State Repair</span>
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">Observability</span>
              <span className="px-3 py-1 border border-[#BAC5D4] bg-white">Analytics</span>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-xs font-canela-book text-zinc-500">
          Integrate once. Protect every agent in your stack.
        </div>

      </section>

      {/* SECTION 06 — WHY RESOLV EXISTS */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 05 // INFRASTRUCTURE ANALYSIS</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">WHY MODEL PROVIDERS CAN'T SOLVE THIS ALONE.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
          
          {/* Col 1 */}
          <div className="border border-[#BAC5D4] bg-white p-6 rounded-sm flex flex-col justify-between">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">CAPABILITY_01</span>
              <h4 className="font-monument-medium text-sm text-zinc-800 mt-1 pb-3 border-b border-zinc-150">MODEL PROVIDERS</h4>
              
              <ul className="text-xs font-canela-regular text-zinc-550 mt-4 space-y-3">
                <li className="flex items-center gap-2"><span>•</span><span>Optimize intelligence & reasoning.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Generate non-deterministic outputs.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Execute prompts.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Improve benchmark capabilities.</span></li>
              </ul>
            </div>
          </div>

          {/* Col 2 */}
          <div className="border border-[#002FA7] bg-[#002FA7]/5 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <span className="text-[8px] font-geist-mono-medium text-[#002FA7]">CAPABILITY_02</span>
              <h4 className="font-monument-medium text-sm text-[#002FA7] mt-1 pb-3 border-b border-[#002FA7]/30">RESOLV GATEWAY</h4>
              
              <ul className="text-xs font-canela-regular text-zinc-700 mt-4 space-y-3 font-medium">
                <li className="flex items-center gap-2"><span>•</span><span>Enforces 99.98% production reliability.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Intercepts loops and timeout failures.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Executes key rotation & backoff policies.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Restores execution state & registers logs.</span></li>
                <li className="flex items-center gap-2"><span>•</span><span>Escalates critical tasks to human gate.</span></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-8 text-center text-xs font-canela-book text-zinc-500 max-w-md mx-auto">
          Model providers focus on making agents smarter. Resolv focuses on making them dependable.
        </div>

      </section>

      {/* SECTION 07 — WHO IT'S FOR */}
      <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 06 // USER TARGET MATRIX</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">BUILT FOR TEAMS DEPLOYING AGENTS.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white border border-[#BAC5D4] p-6 rounded-sm flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">SEGMENT_01</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">AI STARTUPS</h4>
            </div>
            <p className="font-canela-regular text-zinc-650 text-xs mt-3">Launch autonomous production agents safely and scale token limits without logic loop crashes.</p>
          </div>

          <div className="bg-white border border-[#BAC5D4] p-6 rounded-sm flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">SEGMENT_02</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">AUTOMATION AGENCIES</h4>
            </div>
            <p className="font-canela-regular text-zinc-650 text-xs mt-3">Protect client CRM workflows, n8n databases, and email automations against API rate timeouts.</p>
          </div>

          <div className="bg-white border border-[#BAC5D4] p-6 rounded-sm flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">SEGMENT_03</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">INTERNAL AI TEAMS</h4>
            </div>
            <p className="font-canela-regular text-zinc-650 text-xs mt-3">Reduce manual developer monitoring and loops. Let Resolv handle expired credentials silently.</p>
          </div>

          <div className="bg-white border border-[#BAC5D4] p-6 rounded-sm flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[8px] font-geist-mono text-zinc-400">SEGMENT_04</span>
              <h4 className="font-canela-sc text-[#002FA7] mt-1">ENTERPRISE SYSTEMS</h4>
            </div>
            <p className="font-canela-regular text-zinc-650 text-xs mt-3">Add standardized compliance and security recovery infrastructure across multiple federated agents.</p>
          </div>

        </div>

      </section>

      {/* SECTION 08 — EARLY ACCESS WAITING LIST PROGRAM */}
      <section id="early-access" className="py-24 px-6 lg:px-16 max-w-4xl mx-auto border-b border-[#BAC5D4] w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <div className="md:col-span-5">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 07 // WAITLIST APPLICATION</span>
          <h2 className="text-2xl sm:text-3xl font-monument-medium text-[#1A1C1E] mt-3">EARLY ACCESS PROGRAM.</h2>
          <p className="font-canela-text text-zinc-650 mt-4 leading-relaxed">
            Help shape the future of agent reliability. Join the first wave of teams testing Resolv.
          </p>
          
          <div className="mt-8 border-t border-zinc-150 pt-4 text-[9.5px] font-geist-mono text-zinc-500 space-y-2.5">
            <span className="block font-bold text-[#002FA7] font-geist-mono-medium">WE ARE ACTIVELY RECRUITING:</span>
            <div className="flex items-center gap-2"><span>•</span><span>AI Startups & builders</span></div>
            <div className="flex items-center gap-2"><span>•</span><span>LangGraph & CrewAI developers</span></div>
            <div className="flex items-center gap-2"><span>•</span><span>n8n agent workflow creators</span></div>
            <div className="flex items-center gap-2"><span>•</span><span>Enterprise AI team engineers</span></div>
          </div>
        </div>

        {/* Waitlist Detailed Form */}
        <div className="md:col-span-7 bg-white border border-[#BAC5D4] p-6 sm:p-8 rounded-sm">
          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-8 rounded-sm text-center flex flex-col items-center gap-2 animate-scale-up">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <span className="text-xs font-geist-mono-medium font-bold text-[#1A1C1E]">WAITLIST APPLICATION RECEIVED</span>
              <span className="text-xs font-canela-book text-zinc-550">Thank you. Our engineering team will review your stack parameters and contact you.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-geist-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-geist-mono text-zinc-400">YOUR NAME</label>
                  <input 
                    type="text" 
                    required
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#F6F5F2] border border-[#BAC5D4] focus:border-[#002FA7] px-3.5 py-2.5 rounded-sm outline-none transition-colors placeholder:text-zinc-350"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-geist-mono text-zinc-400">COMPANY / FIRM</label>
                  <input 
                    type="text" 
                    required
                    name="company"
                    placeholder="e.g. Acme AI"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full bg-[#F6F5F2] border border-[#BAC5D4] focus:border-[#002FA7] px-3.5 py-2.5 rounded-sm outline-none transition-colors placeholder:text-zinc-350"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-geist-mono text-zinc-400">WORK EMAIL</label>
                <input 
                  type="email" 
                  required
                  name="email"
                  placeholder="e.g. john@acme.ai"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#F6F5F2] border border-[#BAC5D4] focus:border-[#002FA7] px-3.5 py-2.5 rounded-sm outline-none transition-colors placeholder:text-zinc-350"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-geist-mono text-zinc-400">CURRENT AGENT STACK</label>
                <input 
                  type="text" 
                  required
                  name="stack"
                  placeholder="e.g. OpenAI Assistants, LangGraph, custom python scripts"
                  value={formData.stack}
                  onChange={handleInputChange}
                  className="w-full bg-[#F6F5F2] border border-[#BAC5D4] focus:border-[#002FA7] px-3.5 py-2.5 rounded-sm outline-none transition-colors placeholder:text-zinc-350"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-geist-mono text-zinc-400">EXPECTED MONTHLY RUNS</label>
                <select 
                  required
                  name="runs"
                  value={formData.runs}
                  onChange={handleInputChange}
                  className="w-full bg-[#F6F5F2] border border-[#BAC5D4] focus:border-[#002FA7] px-3.5 py-2.5 rounded-sm outline-none transition-colors placeholder:text-zinc-400"
                >
                  <option value="">Select range...</option>
                  <option value="1">Under 10k runs / month</option>
                  <option value="2">10k - 100k runs / month</option>
                  <option value="3">100k - 1M runs / month</option>
                  <option value="4">Over 1M runs / month</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 py-3.5 bg-[#002FA7] hover:bg-[#002380] text-white font-geist-mono-medium rounded-sm transition-all cursor-pointer text-center"
              >
                REQUEST EARLY ACCESS
              </button>
            </form>
          )}
        </div>

      </section>

      {/* SECTION 09 — FAQ */}
      <section className="py-24 px-6 lg:px-16 max-w-4xl mx-auto border-b border-[#BAC5D4] w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] font-geist-mono-medium text-[#002FA7]">SECTION 08 // GENERAL QUESTIONS</span>
          <h2 className="text-3xl font-monument-medium text-[#1A1C1E] mt-3">ANSWERS & SPECIFICATIONS.</h2>
        </div>

        {/* FAQ list */}
        <div className="border-t border-[#BAC5D4] divide-y divide-[#BAC5D4]">
          {FAQ_DATA.map((faq, idx) => {
            const isFaqOpen = activeFaq === idx;
            return (
              <div key={idx} className="py-4.5 bg-white/20">
                <button 
                  onClick={() => setActiveFaq(isFaqOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-geist-mono text-xs font-bold text-zinc-850 hover:text-[#002FA7] transition-colors cursor-pointer py-1.5"
                >
                  <span>{faq.q}</span>
                  {isFaqOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  isFaqOpen ? 'max-h-[200px] mt-3 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                  <p className="font-canela-book text-zinc-650 text-[13px] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 lg:px-16 max-w-3xl mx-auto text-center w-full">
        
        <span className="text-[9px] font-geist-mono-medium text-[#002FA7] font-bold">STABILIZATION SECURED</span>
        <h2 className="text-3xl lg:text-4xl font-monument-black text-[#1A1C1E] mt-3 leading-[1.15]">
          READY TO DEPLOY AGENTS<br/>WITH CONFIDENCE?
        </h2>
        <p className="font-canela-text text-zinc-550 max-w-md mx-auto mt-4 leading-relaxed mb-10">
          Detect failures. Recover automatically. Keep autonomous systems operational.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center max-w-md mx-auto w-full">
          <a href="#early-access" className="w-full sm:w-auto px-10 py-3.5 bg-[#002FA7] hover:bg-[#002380] text-white font-geist-mono-medium text-[10px] rounded-sm transition-all text-center">
            JOIN EARLY ACCESS
          </a>
          <a href="mailto:contact@resolv.ai" className="w-full sm:w-auto px-10 py-3.5 border border-[#BAC5D4] bg-white hover:bg-zinc-50 text-[#1A1C1E] font-geist-mono-medium text-[10px] rounded-sm transition-all text-center">
            SCHEDULE A CONVERSATION
          </a>
        </div>

        <div className="mt-10 text-[8px] font-geist-mono-medium text-zinc-400 tracking-wider">
          RESOLV SYSTEMS CORPORATION &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#BAC5D4] bg-[#EDEDE8]/20 grid grid-cols-1 md:grid-cols-3 items-stretch w-full text-[9px] font-monument-footer text-[#002FA7] max-w-7xl mx-auto rounded-sm mt-12">
        <div className="border-b md:border-b-0 md:border-r border-[#BAC5D4] p-5 flex items-center justify-center md:justify-start">
          <span>RESOLV SYSTEM v0.2.0</span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-[#BAC5D4] p-5 flex items-center justify-center text-zinc-650 hover:text-[#002FA7] transition-colors">
          <a href="https://nousresearch.com" target="_blank" rel="noreferrer">ENTERPRISE INFRASTRUCTURE ↗</a>
        </div>
        <div className="p-5 flex items-center justify-center md:justify-end text-zinc-650 font-geist-mono-medium">
          <span>MIT LICENSE • 2026</span>
        </div>
      </footer>

    </div>
  );
}
