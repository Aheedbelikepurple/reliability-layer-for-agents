'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Shield, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  UserCheck, 
  Database, 
  RefreshCw, 
  Cpu, 
  ArrowRight, 
  ChevronRight, 
  AlertCircle, 
  Trash2, 
  Users, 
  Check, 
  X,
  Mail,
  FileText,
  MessageSquare,
  Sparkles,
  Layers,
  Settings,
  HelpCircle,
  TrendingUp,
  Server
} from 'lucide-react';

// Web Audio API Sound Synthesizer for high-fidelity SaaS sound design
class SoundManager {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Pleasant major chord chime (C5 -> E5 -> G5)
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.4);
    });
  }

  playWarning() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Dissolving warning sound (B3 -> Bb3, sawtooth)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.3);
    
    // Lowpass filter to make it sound premium and warm instead of harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.35);
  }

  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Sub-bass sweep + noise filter sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.6);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.6);
  }

  playSuccessWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.45);
  }

  playPulse() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.15);
  }
}

// Scene Definitions
interface Scene {
  id: number;
  title: string;
  duration: number; // in seconds
  start: number; // cumulative start time
}

const SCENES: Scene[] = [
  { id: 1, title: 'The Problem', duration: 7, start: 0 },
  { id: 2, title: 'Today\'s Reality', duration: 7, start: 7 },
  { id: 3, title: 'Introducing Guardian', duration: 6, start: 14 },
  { id: 4, title: 'How It Works', duration: 8, start: 20 },
  { id: 5, title: 'Failure Recovery', duration: 7, start: 28 },
  { id: 6, title: 'Human In The Loop', duration: 7, start: 35 },
  { id: 7, title: 'Operational Memory', duration: 7, start: 42 },
  { id: 8, title: 'The Result', duration: 7, start: 49 },
  { id: 9, title: 'Outro', duration: 6, start: 56 }
];

const TOTAL_DURATION = 62; // Total duration in seconds

export default function ProductAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeScene, setActiveScene] = useState<Scene>(SCENES[0]);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const soundManagerRef = useRef<SoundManager | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Initialize Sound Manager in browser
  useEffect(() => {
    soundManagerRef.current = new SoundManager();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Sync mute setting
  useEffect(() => {
    if (soundManagerRef.current) {
      soundManagerRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Audio trigger maps based on scene progression
  const triggerAudioForTime = useCallback((time: number, prevTime: number) => {
    const sound = soundManagerRef.current;
    if (!sound) return;

    // Detect transitions or specific visual milestones
    const checkMilestone = (milestone: number) => {
      return prevTime < milestone && time >= milestone;
    };

    // Scene transition sweeps
    SCENES.forEach(s => {
      if (s.id > 1 && checkMilestone(s.start)) {
        sound.playWhoosh();
      }
    });

    // Scene 1 Milestones
    if (checkMilestone(1.5) || checkMilestone(3.0)) {
      sound.playTick();
    }
    if (checkMilestone(4.2)) {
      sound.playWarning();
    }

    // Scene 2 Milestones
    if (checkMilestone(8.0) || checkMilestone(9.5) || checkMilestone(11.0)) {
      sound.playWarning();
    }

    // Scene 3 Milestones
    if (checkMilestone(14.8)) {
      sound.playSuccessWhoosh();
    }

    // Scene 4 Milestones
    if (checkMilestone(21.0) || checkMilestone(22.0) || checkMilestone(23.0) || checkMilestone(24.0) || checkMilestone(25.0)) {
      sound.playTick();
    }

    // Scene 5 Milestones
    if (checkMilestone(29.0)) {
      sound.playWarning(); // 429 error
    }
    if (checkMilestone(31.5)) {
      sound.playChime(); // successful retry
    }

    // Scene 6 Milestones
    if (checkMilestone(35.8)) {
      sound.playWarning(); // risk warning
    }
    if (checkMilestone(37.5)) {
      sound.playPulse(); // operator notification
    }
    if (checkMilestone(39.0)) {
      sound.playChime(); // approved click
    }

    // Scene 7 Milestones
    if (checkMilestone(43.0) || checkMilestone(44.2) || checkMilestone(45.4)) {
      sound.playTick();
    }

    // Scene 8 Milestones
    if (checkMilestone(50.0) || checkMilestone(51.0) || checkMilestone(52.0)) {
      sound.playChime();
    }

    // Outro chimes
    if (checkMilestone(58.0)) {
      sound.playSuccessWhoosh();
    }
  }, []);

  // Update logic using requestAnimationFrame for sub-second precision
  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setCurrentTime((prev) => {
        let nextTime = prev + delta;
        if (nextTime >= TOTAL_DURATION) {
          nextTime = 0; // loop
        }
        triggerAudioForTime(nextTime, prev);
        return nextTime;
      });
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPlaying, triggerAudioForTime]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [animate]);

  // Sync active scene based on currentTime
  useEffect(() => {
    const scene = SCENES.reduce((acc, s) => {
      if (currentTime >= s.start) return s;
      return acc;
    }, SCENES[0]);
    setActiveScene(scene);

    // Reset approval status on entering scene 6
    if (currentTime < 35 || currentTime > 41) {
      setApprovalStatus('pending');
    }
    if (currentTime >= 39.1 && approvalStatus === 'pending') {
      setApprovalStatus('approved');
    }
  }, [currentTime, approvalStatus]);

  const togglePlay = () => {
    if (soundManagerRef.current) soundManagerRef.current.playTick();
    setIsPlaying(!isPlaying);
    lastTimeRef.current = null;
  };

  const restartVideo = () => {
    if (soundManagerRef.current) soundManagerRef.current.playWhoosh();
    setCurrentTime(0);
    setApprovalStatus('pending');
    lastTimeRef.current = null;
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    lastTimeRef.current = null;
  };

  const jumpToScene = (scene: Scene) => {
    if (soundManagerRef.current) soundManagerRef.current.playWhoosh();
    setCurrentTime(scene.start + 0.05);
    lastTimeRef.current = null;
  };

  // Sound testing chime
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && soundManagerRef.current) {
      setTimeout(() => soundManagerRef.current?.playTick(), 50);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans select-none overflow-hidden relative grid-mesh">
      {/* Background radial glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-brand/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="w-full px-8 py-5 border-b border-border flex justify-between items-center bg-black/60 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-brand flex items-center justify-center shadow-lg shadow-orange-brand/20">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-lg">Guardian</span>
            <span className="text-gray-500 text-xs block -mt-1 font-mono">Reliability System Demo</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-panel px-3 py-1.5 rounded-full border border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-300 text-xs font-mono">STAGE: CINEMATIC ANIMATION</span>
          </div>
          <button 
            onClick={toggleMute}
            className="text-gray-400 hover:text-white p-2 bg-panel hover:bg-border/60 rounded-full border border-border transition-all"
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-brand" />}
          </button>
        </div>
      </header>

      {/* Main Screen Container - Cinema Aspect Ratio */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 z-10 relative">
        <div className="w-full max-w-5xl aspect-video bg-surface rounded-2xl border border-border shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden relative">
          
          {/* Cinema grid scan lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.005)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

          {/* Scene Stage */}
          <div className="flex-1 w-full relative flex flex-col items-center justify-center p-8">
            
            {/* ========================================================
                SCENE 1: THE PROBLEM
                ======================================================== */}
            {activeScene.id === 1 && (
              <div className="w-full max-w-2xl flex flex-col items-center text-center animate-fade-in">
                {currentTime < 4 ? (
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8 animate-pulse">
                    AI Agents Work Great In Demos.
                  </h2>
                ) : (
                  <h2 className="text-3xl font-extrabold text-red-500 tracking-tight mb-8">
                    Production Is Different.
                  </h2>
                )}

                <div className="relative flex items-center justify-center w-full mt-6 space-x-12 py-10 bg-panel/30 border border-border/40 rounded-xl backdrop-blur-sm">
                  {/* Email Node */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                      currentTime < 4.2 ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-red-950/20 border-red-950 shadow-none'
                    }`}>
                      <Mail className={`w-6 h-6 ${currentTime < 4.2 ? 'text-emerald-400' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-xs font-mono text-gray-500 mt-2">Email</span>
                  </div>

                  {/* Flow Arrow 1 */}
                  <div className="flex-1 relative flex items-center">
                    <div className={`h-[2px] w-full transition-all duration-500 ${
                      currentTime < 4.2 ? 'bg-emerald-500/30' : 'bg-red-500/20'
                    }`} />
                    {currentTime >= 1.5 && currentTime < 4.2 && (
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 animate-flow-right" />
                    )}
                  </div>

                  {/* AI Agent Node */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                      currentTime < 4.2 
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105 animate-pulse' 
                        : 'bg-red-950/30 border-red-500/50 shadow-lg shadow-red-500/20 scale-100 animate-wiggle'
                    }`}>
                      {currentTime < 4.2 ? (
                        <Cpu className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-400 mt-2 tracking-wide font-mono">AI Agent</span>
                  </div>

                  {/* Flow Arrow 2 */}
                  <div className="flex-1 relative flex items-center">
                    <div className={`h-[2px] w-full transition-all duration-500 ${
                      currentTime < 4.2 ? 'bg-emerald-500/30' : 'bg-red-500/20'
                    }`} />
                    {currentTime >= 3.0 && currentTime < 4.2 && (
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 animate-flow-right-delay" />
                    )}
                  </div>

                  {/* Notion Node */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-500 ${
                      currentTime < 4.2 
                        ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                        : 'bg-red-950/20 border-red-950'
                    }`}>
                      <FileText className={`w-6 h-6 ${currentTime < 4.2 ? 'text-emerald-400' : 'text-gray-600'}`} />
                    </div>
                    <span className="text-xs font-mono text-gray-500 mt-2">Notion</span>
                  </div>

                  {/* Green Checkmarks or Red Crash Overlay */}
                  {currentTime >= 3.5 && currentTime < 4.2 && (
                    <div className="absolute inset-0 bg-emerald-950/10 rounded-xl flex items-center justify-center backdrop-blur-[1px] animate-fade-in">
                      <div className="flex items-center space-x-2 bg-emerald-900/80 px-4 py-2 rounded-full border border-emerald-500 shadow-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-mono text-white">Execution Success (200 OK)</span>
                      </div>
                    </div>
                  )}

                  {currentTime >= 4.2 && (
                    <div className="absolute inset-0 bg-red-950/20 rounded-xl flex flex-col items-center justify-center backdrop-blur-[2px] border border-red-500/40 animate-flash-red">
                      <div className="flex flex-col space-y-2 max-w-[280px]">
                        <div className="flex items-center space-x-2 bg-red-900/90 px-3 py-1.5 rounded-lg border border-red-500 shadow-md animate-scale-up">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-xs font-mono text-white text-left font-bold">API Error: Timeout (504)</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-900/90 px-3 py-1.5 rounded-lg border border-red-500 shadow-md animate-scale-up [animation-delay:0.3s]">
                          <AlertTriangle className="w-4 h-4 text-orange-400" />
                          <span className="text-xs font-mono text-white text-left font-bold">Rate Limit Triggered (429)</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-900/90 px-3 py-1.5 rounded-lg border border-red-500 shadow-md animate-scale-up [animation-delay:0.6s]">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-xs font-mono text-white text-left font-bold">Authentication Failure (401)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 2: WHAT HAPPENS TODAY
                ======================================================== */}
            {activeScene.id === 2 && (
              <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-400 text-center tracking-tight mb-6">
                  {currentTime < 11.5 ? (
                    <span>Most Agents Can Think. <span className="text-red-500 font-extrabold block md:inline">Very Few Can Survive Failure.</span></span>
                  ) : (
                    <span className="text-white">Continuous Production Failures halt operations.</span>
                  )}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
                  {/* Support Agent Card */}
                  <div className={`p-5 rounded-xl border bg-panel/40 backdrop-blur-sm flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-500 ${
                    currentTime >= 8.0 ? 'border-red-500/40 bg-red-950/10 shadow-lg shadow-red-500/5' : 'border-border'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono text-gray-500">AGENT_01</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${currentTime >= 8.0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      </div>
                      <h3 className="font-bold text-white flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-orange-brand" />
                        <span>Support Agent</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 font-mono">Syncing client status to Notion...</p>
                    </div>

                    {currentTime >= 8.0 && (
                      <div className="mt-2 bg-red-950/80 border border-red-500/50 rounded p-2 flex items-center space-x-2 animate-scale-up">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-[10px] font-mono text-red-300 font-bold">429 Rate Limit - Stopped</span>
                      </div>
                    )}
                  </div>

                  {/* Sales Agent Card */}
                  <div className={`p-5 rounded-xl border bg-panel/40 backdrop-blur-sm flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-500 ${
                    currentTime >= 9.5 ? 'border-red-500/40 bg-red-950/10 shadow-lg shadow-red-500/5' : 'border-border'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono text-gray-500">AGENT_02</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${currentTime >= 9.5 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      </div>
                      <h3 className="font-bold text-white flex items-center space-x-2">
                        <Users className="w-4 h-4 text-orange-brand" />
                        <span>Sales Agent</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 font-mono">Adding lead to HubSpot CRM...</p>
                    </div>

                    {currentTime >= 9.5 && (
                      <div className="mt-2 bg-red-950/80 border border-red-500/50 rounded p-2 flex items-center space-x-2 animate-scale-up">
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-[10px] font-mono text-red-300 font-bold">401 Unauthorized - Failed</span>
                      </div>
                    )}
                  </div>

                  {/* Operations Agent Card */}
                  <div className={`p-5 rounded-xl border bg-panel/40 backdrop-blur-sm flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-500 ${
                    currentTime >= 11.0 ? 'border-red-500/40 bg-red-950/10 shadow-lg shadow-red-500/5' : 'border-border'
                  }`}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono text-gray-500">AGENT_03</span>
                        <div className={`w-2.5 h-2.5 rounded-full ${currentTime >= 11.0 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      </div>
                      <h3 className="font-bold text-white flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-orange-brand" />
                        <span>Operations Agent</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 font-mono">Processing payload database...</p>
                    </div>

                    {currentTime >= 11.0 && (
                      <div className="mt-2 bg-red-950/80 border border-red-500/50 rounded p-2 flex items-center space-x-2 animate-scale-up">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-[10px] font-mono text-red-300 font-bold">Duplicate Records - Interrupted</span>
                      </div>
                    )}
                  </div>
                </div>

                {currentTime >= 12.0 && (
                  <div className="mt-6 flex items-center space-x-2 text-red-400 font-bold text-sm bg-red-950/30 px-4 py-2 rounded-full border border-red-500/30 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Fatal Error: Critical workflow crash. Human intervention required.</span>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
                SCENE 3: INTRODUCING GUARDIAN
                ======================================================== */}
            {activeScene.id === 3 && (
              <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center animate-fade-in">
                
                {/* Visual Representation of Reliability Layer */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between mt-4 mb-12 max-w-xl relative">
                  
                  {/* Left: Agents Box */}
                  <div className="w-28 py-4 px-3 bg-panel border border-border rounded-xl flex flex-col items-center space-y-2 shadow-lg z-10">
                    <Cpu className="w-6 h-6 text-gray-400" />
                    <span className="text-xs font-bold text-white">AI Agents</span>
                  </div>

                  {/* Flow line 1 */}
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-700 to-orange-brand min-w-[40px]" />

                  {/* Middle: Guardian (The Shield Layer) */}
                  <div className="mx-4 w-36 py-6 px-4 bg-gradient-to-br from-orange-brand/20 to-orange-brand/5 border-2 border-orange-brand rounded-2xl flex flex-col items-center space-y-2 shadow-2xl shadow-orange-brand/20 animate-scale-up z-10 relative">
                    <div className="absolute -inset-0.5 bg-orange-brand/20 rounded-2xl blur-md -z-10 animate-pulse" />
                    <Shield className="w-8 h-8 text-orange-brand animate-bounce" />
                    <span className="text-sm font-black text-white tracking-wider">GUARDIAN</span>
                    <span className="text-[9px] font-mono text-orange-brand uppercase tracking-widest font-black">Reliability Layer</span>
                  </div>

                  {/* Flow line 2 */}
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-orange-brand to-gray-700 min-w-[40px]" />

                  {/* Right: Tools Box */}
                  <div className="w-28 py-4 px-3 bg-panel border border-border rounded-xl flex flex-col items-center space-y-2 shadow-lg z-10">
                    <Database className="w-6 h-6 text-gray-400" />
                    <span className="text-xs font-bold text-white">Tools & APIs</span>
                  </div>

                </div>

                {/* Typography reveal */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Guardian
                  </h1>
                  <p className="text-lg md:text-xl text-orange-brand font-medium tracking-wide">
                    The Reliability Layer For AI Agents
                  </p>
                  <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed pt-2">
                    A self-healing gateway protecting your workflows from production anomalies, rate limits, and failure loops.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 4: HOW IT WORKS
                ======================================================== */}
            {activeScene.id === 4 && (
              <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-8">
                  Every Action Is Evaluated Before Execution.
                </h2>

                {/* Diagram Structure */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 bg-panel/30 border border-border/40 rounded-2xl backdrop-blur-sm relative">
                  
                  {/* Left: Input */}
                  <div className="flex flex-col items-center space-y-1">
                    <div className="bg-panel border border-border px-4 py-3 rounded-lg flex items-center space-x-2 text-xs font-mono">
                      <Mail className="w-4 h-4 text-orange-brand" />
                      <span className="text-gray-300 font-bold">Email Received</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 rotate-90 md:rotate-0" />
                    <div className="bg-panel border border-orange-brand/50 px-4 py-3 rounded-lg flex items-center space-x-2 text-xs font-mono shadow-md">
                      <Cpu className="w-4 h-4 text-orange-brand" />
                      <span className="text-white font-bold">AI Agent Request</span>
                    </div>
                  </div>

                  {/* Flow Arrow to modules */}
                  <div className="hidden md:flex items-center text-orange-brand animate-pulse">
                    <ArrowRight className="w-5 h-5" />
                  </div>

                  {/* Guardian Expansion Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                    {/* Failure Detection */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 ${
                      currentTime >= 21.0 
                        ? 'border-rose-500/60 bg-rose-950/20 text-rose-300 shadow-md shadow-rose-500/5 scale-105' 
                        : 'border-border bg-panel/20 text-gray-500'
                    }`}>
                      <AlertCircle className={`w-5 h-5 ${currentTime >= 21.0 ? 'text-rose-400' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-bold tracking-tight">Failure Detection</span>
                    </div>

                    {/* Confidence Engine */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 ${
                      currentTime >= 22.0 
                        ? 'border-cyan-500/60 bg-cyan-950/20 text-cyan-300 shadow-md shadow-cyan-500/5 scale-105' 
                        : 'border-border bg-panel/20 text-gray-500'
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${currentTime >= 22.0 ? 'text-cyan-400' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-bold tracking-tight">Confidence Engine</span>
                    </div>

                    {/* Recovery Engine */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 ${
                      currentTime >= 23.0 
                        ? 'border-amber-500/60 bg-amber-950/20 text-amber-300 shadow-md shadow-amber-500/5 scale-105' 
                        : 'border-border bg-panel/20 text-gray-500'
                    }`}>
                      <RefreshCw className={`w-5 h-5 ${currentTime >= 23.0 ? 'text-amber-400 animate-spin-slow' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-bold tracking-tight">Recovery Engine</span>
                    </div>

                    {/* Human Escalation */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 ${
                      currentTime >= 24.0 
                        ? 'border-purple-500/60 bg-purple-950/20 text-purple-300 shadow-md shadow-purple-500/5 scale-105' 
                        : 'border-border bg-panel/20 text-gray-500'
                    }`}>
                      <Users className={`w-5 h-5 ${currentTime >= 24.0 ? 'text-purple-400' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-bold tracking-tight">Human Escalation</span>
                    </div>

                    {/* Operational Memory */}
                    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 ${
                      currentTime >= 25.0 
                        ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300 shadow-md shadow-emerald-500/5 scale-105' 
                        : 'border-border bg-panel/20 text-gray-500'
                    }`}>
                      <Database className={`w-5 h-5 ${currentTime >= 25.0 ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span className="text-[10px] font-bold tracking-tight">Operational Memory</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center text-xs font-mono text-gray-500 bg-black/40 border border-border px-4 py-2 rounded-lg">
                  <span className="animate-pulse">Analyzing outbound tools payload via policy validation modules...</span>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 5: REAL FAILURE RECOVERY
                ======================================================== */}
            {activeScene.id === 5 && (
              <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-8">
                  Failures Are Detected. Recovered. And Logged.
                </h2>

                <div className="w-full max-w-2xl bg-panel/30 border border-border rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-border/60">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-brand animate-pulse" />
                      <span className="text-xs font-mono text-gray-400">ACTIVE WORKFLOW: UPDATE CUSTOMER RECORD</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">PROVIDER: NOTION API</span>
                  </div>

                  {/* Steps of the workflow execution */}
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                        <div>
                          <p className="text-sm font-bold text-white">Update Customer Record</p>
                          <p className="text-xs text-gray-500 font-mono">Payload: {"{ id: 'usr-9281', plan: 'Enterprise' }"}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-400 bg-panel px-2 py-0.5 rounded border border-border">POST /pages</span>
                    </div>

                    {/* Step 2: Failed Notion Response */}
                    {currentTime >= 29.0 && (
                      <div className="flex items-start justify-between p-3 rounded-lg bg-red-950/20 border border-red-500/30 animate-scale-up">
                        <div className="flex items-center space-x-3">
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-red-400">429 Too Many Requests</p>
                            <p className="text-xs text-red-300 font-mono">Rate limit exceeded. Reset in 2.0s</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-900">NOTION_ERROR</span>
                      </div>
                    )}

                    {/* Step 3: Guardian Interception */}
                    {currentTime >= 29.5 && (
                      <div className="flex items-start justify-between p-3 rounded-lg bg-orange-950/20 border border-orange-500/30 animate-scale-up">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-orange-brand shrink-0 animate-pulse" />
                          <div>
                            <p className="text-sm font-bold text-orange-300">Guardian: Rate Limit Detected</p>
                            <p className="text-xs text-orange-200 font-mono">
                              {currentTime < 31.5 ? 'Applying Retry Strategy (Exponential Backoff: 2s)...' : 'Retry Strategy completed successfully.'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-orange-300 font-bold bg-orange-950 px-2 py-0.5 rounded border border-orange-900">INTERCEPTED</span>
                      </div>
                    )}

                    {/* Step 4: Success on Retry */}
                    {currentTime >= 31.5 && (
                      <div className="flex items-start justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 animate-scale-up">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-emerald-400">Retry Success (Attempt #2)</p>
                            <p className="text-xs text-emerald-300 font-mono">Notion Response: 200 OK. Transaction logged in Operational Memory.</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">SUCCESS</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 6: HUMAN IN THE LOOP
                ======================================================== */}
            {activeScene.id === 6 && (
              <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-6">
                  When Uncertainty Is High, Humans Stay In Control.
                </h2>

                <div className="w-full max-w-xl bg-panel/40 border border-border rounded-2xl overflow-hidden backdrop-blur-sm relative shadow-2xl">
                  {/* Top bar */}
                  <div className="bg-panel px-5 py-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-white">INTERCEPTION QUEUE (PENDING)</span>
                    </div>
                    <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                      Risk Level: HIGH
                    </span>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-border/60">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 block">PROPOSED WORKFLOW ACTION</span>
                        <span className="text-sm font-bold text-white flex items-center space-x-1.5 mt-0.5">
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span>Delete Customer Data</span>
                        </span>
                        <span className="text-xs font-mono text-gray-400 block mt-1">Target: user_id: 'usr-81992'</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block">CONFIDENCE SCORE</span>
                        <span className="text-xl font-mono font-extrabold text-red-400">34%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-950/10 border border-purple-500/20 rounded-lg flex items-start space-x-2.5">
                      <AlertCircle className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-purple-300 leading-relaxed">
                        <strong>Reason:</strong> Action contains destructive parameters with poor agent confidence. Safety policy requires explicit human validation.
                      </p>
                    </div>

                    {/* Interactive Action buttons */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button 
                        disabled
                        className="flex-1 py-3 px-4 rounded-xl border border-border bg-panel text-gray-500 text-sm font-bold opacity-50 flex items-center justify-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                      
                      <button 
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 border transition-all duration-300 relative ${
                          approvalStatus === 'approved' 
                            ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400' 
                            : 'bg-orange-brand border-orange-brand text-white shadow-lg shadow-orange-brand/20 hover:scale-[1.02]'
                        }`}
                      >
                        {approvalStatus === 'approved' ? (
                          <>
                            <Check className="w-4 h-4 animate-scale-up" />
                            <span>Action Approved</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Approve Action</span>
                          </>
                        )}
                        
                        {/* Auto-click Cursor Simulating Action */}
                        {currentTime >= 37.8 && currentTime < 39.0 && (
                          <div className="absolute -bottom-2 right-4 w-6 h-6 rounded-full bg-white/20 border border-white flex items-center justify-center animate-click-cursor z-50">
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                          </div>
                        )}
                      </button>
                    </div>

                    {approvalStatus === 'approved' && (
                      <div className="text-center text-xs font-mono text-emerald-400 animate-fade-in pt-1">
                        ✓ Operator approved. Resuming workflow with safety override code.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 7: OPERATIONAL MEMORY
                ======================================================== */}
            {activeScene.id === 7 && (
              <div className="w-full max-w-3xl flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-8">
                  Guardian Learns From Operational History.
                  <span className="block text-gray-500 text-sm font-mono font-normal mt-2">Not Conversations. Real Outcomes.</span>
                </h2>

                <div className="w-full max-w-2xl bg-panel/30 border border-border rounded-2xl p-6 backdrop-blur-sm relative">
                  
                  {/* Glowing Memory Node */}
                  <div className="absolute top-1/2 left-6 -translate-y-1/2 w-16 h-16 rounded-full bg-orange-brand/10 border-2 border-orange-brand flex items-center justify-center shadow-lg shadow-orange-brand/20 animate-pulse z-10">
                    <Database className="w-8 h-8 text-orange-brand" />
                  </div>

                  {/* Connecting lines */}
                  <div className="absolute top-1/2 left-22 right-6 h-[2px] bg-gradient-to-r from-orange-brand/50 to-border/30 -translate-y-1/2 z-0" />

                  {/* Event Timeline Cards */}
                  <div className="ml-24 space-y-4 relative z-10">
                    
                    {/* Event 1 */}
                    <div className={`p-3.5 rounded-xl border bg-panel/80 flex items-center justify-between transition-all duration-500 ${
                      currentTime >= 43.0 ? 'border-orange-brand/40 translate-x-2 opacity-100 shadow-md' : 'border-border/30 opacity-40'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-4.5 h-4.5 text-rose-400" />
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block">ANOMALY DETECTED</span>
                          <span className="text-xs font-bold text-white">HubSpot API 502 Bad Gateway</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block">RECOVERY PATH</span>
                        <span className="text-[10px] font-mono text-orange-brand font-bold bg-orange-950/40 border border-orange-500/20 px-2 py-0.5 rounded">Retry & Route Switch</span>
                      </div>
                    </div>

                    {/* Event 2 */}
                    <div className={`p-3.5 rounded-xl border bg-panel/80 flex items-center justify-between transition-all duration-500 ${
                      currentTime >= 44.2 ? 'border-orange-brand/40 translate-x-2 opacity-100 shadow-md' : 'border-border/30 opacity-40'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-4.5 h-4.5 text-rose-400" />
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block">ANOMALY DETECTED</span>
                          <span className="text-xs font-bold text-white">Expired Access Credentials (401)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block">RECOVERY PATH</span>
                        <span className="text-[10px] font-mono text-orange-brand font-bold bg-orange-950/40 border border-orange-500/20 px-2 py-0.5 rounded">Auto Token Refresh</span>
                      </div>
                    </div>

                    {/* Event 3 */}
                    <div className={`p-3.5 rounded-xl border bg-panel/80 flex items-center justify-between transition-all duration-500 ${
                      currentTime >= 45.4 ? 'border-orange-brand/40 translate-x-2 opacity-100 shadow-md' : 'border-border/30 opacity-40'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 block">HIGH RISK DETECTED</span>
                          <span className="text-xs font-bold text-white">Bulk Record Insertion Request</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-gray-500 block">RECOVERY PATH</span>
                        <span className="text-[10px] font-mono text-orange-brand font-bold bg-orange-950/40 border border-orange-500/20 px-2 py-0.5 rounded">Human Escalation Gate</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 8: THE RESULT
                ======================================================== */}
            {activeScene.id === 8 && (
              <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 animate-fade-in">
                
                {/* Left side: Flow of Successful Agents */}
                <div className="flex-1 space-y-3 w-full">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Self-Healing Production Flow</h3>
                  
                  {/* Support Agent Row */}
                  <div className="p-3 bg-panel/50 border border-emerald-500/20 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">Support Agent</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 border border-border px-1.5 py-0.5 rounded">Notion API</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">✓ RECOVERED (429)</span>
                  </div>

                  {/* Sales Agent Row */}
                  <div className="p-3 bg-panel/50 border border-emerald-500/20 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">Sales Agent</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 border border-border px-1.5 py-0.5 rounded">HubSpot</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">✓ STABLE</span>
                  </div>

                  {/* Operations Agent Row */}
                  <div className="p-3 bg-panel/50 border border-emerald-500/20 rounded-xl flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">Operations Agent</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 border border-border px-1.5 py-0.5 rounded">Gmail API</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">✓ RECOVERED (DUP)</span>
                  </div>
                </div>

                {/* Right side: Dashboard Telemetry Scorecard */}
                <div className="w-full md:w-80 bg-panel/30 border border-border rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4 font-mono">Live Telemetry</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Health Card */}
                    <div className="p-3 bg-black/40 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500">WORKFLOW HEALTH</span>
                      <span className="text-2xl font-bold text-emerald-400 mt-1 font-mono">99.2%</span>
                    </div>

                    {/* Recovered Card */}
                    <div className="p-3 bg-black/40 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500">RECOVERED FAILS</span>
                      <span className="text-2xl font-bold text-orange-brand mt-1 font-mono">48</span>
                    </div>

                    {/* Escalations Card */}
                    <div className="p-3 bg-black/40 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500">HUMAN ESCALATIONS</span>
                      <span className="text-2xl font-bold text-purple-400 mt-1 font-mono">2</span>
                    </div>

                    {/* Critical Fails Card */}
                    <div className="p-3 bg-black/40 border border-border rounded-xl flex flex-col">
                      <span className="text-[10px] font-mono text-gray-500">CRITICAL FAILS</span>
                      <span className="text-2xl font-bold text-gray-400 mt-1 font-mono">0</span>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 bg-emerald-950/10 border border-emerald-500/20 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="text-[10px] font-mono text-emerald-300">All gateway systems operating within nominal limits.</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                SCENE 9: FINAL OUTRO
                ======================================================== */}
            {activeScene.id === 9 && (
              <div className="w-full max-w-2xl flex flex-col items-center text-center justify-center space-y-6 animate-fade-in relative py-6">
                
                {/* Centered Glowing Logo */}
                <div className="w-20 h-20 rounded-2xl bg-orange-brand flex items-center justify-center shadow-2xl shadow-orange-brand/30 animate-bounce">
                  <Shield className="w-11 h-11 text-white stroke-[2.5]" />
                </div>

                <div className="space-y-3">
                  <p className="text-lg md:text-xl text-orange-brand font-black uppercase tracking-wider font-mono">
                    AGENTS NEED MORE THAN INTELLIGENCE.
                  </p>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                    They Need Reliability.
                  </h1>
                </div>

                <div className="w-full max-w-md bg-panel/30 border border-border p-4 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-gray-300 font-bold">
                    Guardian
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    The Missing Production Layer For AI Agents.
                  </p>
                </div>

                {/* Restart Trigger */}
                <button
                  onClick={restartVideo}
                  className="mt-4 py-2 px-5 bg-panel hover:bg-border text-xs font-bold font-mono text-white border border-border rounded-full flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Animation</span>
                </button>
              </div>
            )}

          </div>

          {/* Timeline and Controls (Video Player UI) */}
          <div className="bg-black border-t border-border px-6 py-4 flex flex-col space-y-3 z-20">
            {/* Scrubber slider bar */}
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono text-gray-500 w-10 text-right">
                {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
              </span>
              <input
                type="range"
                min="0"
                max={TOTAL_DURATION}
                step="0.05"
                value={currentTime}
                onChange={handleScrub}
                className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-brand focus:outline-none"
              />
              <span className="text-[10px] font-mono text-gray-500 w-10 text-left">
                {Math.floor(TOTAL_DURATION / 60)}:{(TOTAL_DURATION % 60).toString().padStart(2, '0')}
              </span>
            </div>

            {/* Controller row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-orange-brand hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-brand/10 transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                </button>
                <button
                  onClick={restartVideo}
                  className="p-2 text-gray-400 hover:text-white rounded-full bg-panel border border-border/80 hover:bg-border/60 transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Displaying Current Scene Text */}
              <div className="text-center">
                <span className="text-[10px] font-mono text-orange-brand uppercase tracking-widest font-black block">SCENE {activeScene.id} / {SCENES.length}</span>
                <span className="text-xs font-bold text-white block mt-0.5">{activeScene.title}</span>
              </div>

              {/* Jump to specific scenes dropdown/buttons */}
              <div className="hidden lg:flex items-center space-x-1">
                {SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => jumpToScene(scene)}
                    className={`px-2.5 py-1.5 rounded-md text-[10px] font-mono font-bold border transition-all ${
                      activeScene.id === scene.id
                        ? 'bg-orange-brand border-orange-brand text-white shadow shadow-orange-brand/20'
                        : 'bg-panel border-border/60 text-gray-400 hover:text-white hover:bg-border/40'
                    }`}
                  >
                    S{scene.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Back Link to Dashboard */}
        <div className="mt-8">
          <a 
            href="/"
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-orange-brand transition-colors font-mono"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Return to Guardian Operational Dashboard</span>
          </a>
        </div>
      </main>

      {/* Embedded CSS for fluid animations */}
      <style jsx global>{`
        @keyframes flow-right {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes click-cursor {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes flash-red {
          0% { background-color: rgba(239, 68, 68, 0); }
          50% { background-color: rgba(239, 68, 68, 0.05); }
          100% { background-color: rgba(239, 68, 68, 0); }
        }
        @keyframes scale-up {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .animate-flow-right {
          position: absolute;
          animation: flow-right 2s infinite linear;
        }
        .animate-flow-right-delay {
          position: absolute;
          animation: flow-right 2s infinite linear;
          animation-delay: 1s;
        }
        .animate-click-cursor {
          animation: click-cursor 1.2s infinite ease-in-out;
        }
        .animate-flash-red {
          animation: flash-red 1.5s infinite ease-in-out;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-wiggle {
          animation: wiggle 0.4s ease-in-out 3;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        .animate-fade-in {
          animation: scale-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
