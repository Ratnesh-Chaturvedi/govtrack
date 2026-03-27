import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ChevronRight,
  User,
  HardHat,
  Search,
  ArrowUpRight,
  Target,
  Eye,
  Zap,
  CheckCircle2,
  X,
  Building2,
  Lock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onLogin: (role: UserRole, id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { register, login, isLoading, error, clearError } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [role, setRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  // Cleanup when modal closes
  useEffect(() => {
    if (!showLogin) {
      setLocalError('');
      clearError();
      setStep(1);
      setMode('login');
      setRole(null);
      setId('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    }
  }, [showLogin, clearError]);

  const roles: { id: UserRole; title: string; icon: any; desc: string; placeholderId: string }[] = [
    { id: 'citizen', title: 'Citizen', icon: User, desc: 'Monitor projects and file grievances.', placeholderId: 'CIT-XXXXX' },
    { id: 'official', title: 'Govt. Official', icon: ShieldCheck, desc: 'Manage budgets and oversee projects.', placeholderId: 'GOV-XXXXX' },
    { id: 'contractor', title: 'Contractor', icon: HardHat, desc: 'Update progress and manage contracts.', placeholderId: 'CON-XXXXX' },
    { id: 'media', title: 'Media/Audit', icon: Search, desc: 'Investigate and audit public spending.', placeholderId: 'AUD-XXXXX' },
  ];

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    
    if (!role) {
      setLocalError('Please select a role');
      return;
    }
    
    if (!id.trim()) {
      setLocalError('ID is required');
      return;
    }
    
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      if (mode === 'register') {
        if (!email.trim()) {
          setLocalError('Email is required');
          return;
        }
        if (!name.trim()) {
          setLocalError('Name is required');
          return;
        }
        
        await register({
          name,
          email,
          role,
          id,
          password,
          confirmPassword,
        });
      } else {
        await login(id, password, role);
      }
      
      // Reset form on success
      setShowLogin(false);
      setStep(1);
      setMode('login');
      setRole(null);
      setId('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      
      // Call onLogin callback with mock values since auth is handled by context
      onLogin(role, id);
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-gov-saffron/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-lg border-b border-slate-200/50 px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gov-blue to-gov-blue/80 flex items-center justify-center text-white shadow-md shadow-gov-blue/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gov-blue text-sm leading-tight">Civic Integrity AI</h4>
            <p className="text-[10px] text-gov-blue/50 font-semibold">National Platform</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-12 text-xs font-semibold uppercase tracking-wider text-gov-blue/60">
          <a href="#vision" className="hover:text-gov-blue transition-colors duration-300">Vision</a>
          <a href="#mission" className="hover:text-gov-blue transition-colors duration-300">Mission</a>
          <a href="#impact" className="hover:text-gov-blue transition-colors duration-300">Impact</a>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-10 py-3 rounded-lg bg-gov-blue text-white font-semibold hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/25 active:scale-95"
          >
            Access Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-8 overflow-hidden bg-gradient-to-b from-white via-white to-slate-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gov-saffron z-50" />
        <div className="absolute top-1 left-0 w-full h-1 bg-white z-50" />
        <div className="absolute top-2 left-0 w-full h-1 bg-gov-green z-50" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-gov-saffron font-semibold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5" />
                National Integrity Framework
              </div>
              <h1 className="text-6xl md:text-7xl font-display font-bold text-gov-blue leading-[1.05] tracking-tight">
                Redefining <br />
                <span className="text-gov-saffron">Trust</span><span className="text-gov-blue">.</span>
              </h1>
              <p className="text-lg text-gov-blue/65 leading-[1.7] max-w-lg font-medium">
                A unified digital platform for transparent governance, real-time resource tracking, and AI-driven corruption risk mitigation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-10 py-4 rounded-lg bg-gov-blue text-white font-semibold uppercase tracking-wide text-sm hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/30 active:scale-95 flex items-center gap-3"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
              <a href="#vision" className="text-sm font-semibold text-gov-blue/50 hover:text-gov-blue transition-colors duration-300 flex items-center gap-2">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="gov-card p-1 bg-white border-slate-200 shadow-2xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/gov-vision/1200/800" 
                alt="Governance Vision" 
                className="w-full rounded-lg grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gov-blue/30 to-transparent pointer-events-none rounded-lg" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-75">Real-time Monitoring</p>
                <h3 className="text-xl font-display font-bold">Smart Infrastructure Oversight</h3>
              </div>
            </div>
            {/* Floating Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 gov-card p-6 bg-white shadow-2xl border-slate-200 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gov-green/10 flex items-center justify-center text-gov-green shadow-sm">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-gov-blue">₹4.2T+</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gov-blue/50">Funds Tracked</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 bg-gov-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gov-saffron/8 skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="flex items-center gap-3 text-gov-saffron font-semibold text-xs uppercase tracking-wider">
                <Target className="w-5 h-5" />
                Our Vision
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-[1.15]">
                Transparency is not a goal,<br />
                <span className="text-gov-saffron font-bold">it's a foundation.</span>
              </h2>
              <p className="text-lg text-white/70 leading-[1.7] max-w-lg font-medium">
                We envision a nation where every rupee of public money is accounted for, every project is delivered with integrity, and every citizen has the power to oversee their community's development.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center text-gov-saffron backdrop-blur-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">Radical Visibility</h4>
                  <p className="text-sm text-white/60 leading-relaxed">Real-time public access to budget allocations and expenditure data.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center text-gov-green backdrop-blur-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-sm">AI-Driven Integrity</h4>
                  <p className="text-sm text-white/60 leading-relaxed">Predictive algorithms to detect corruption risks before they manifest.</p>
                </motion.div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="aspect-square rounded-full border border-white/20 flex items-center justify-center p-12">
                <div className="aspect-square rounded-full border border-white/15 flex items-center justify-center p-12 w-full">
                  <div className="aspect-square rounded-full bg-white/8 backdrop-blur-sm flex flex-col items-center justify-center text-center p-12 w-full">
                    <ShieldCheck className="w-20 h-20 text-gov-saffron mb-6 drop-shadow-lg" />
                    <h3 className="text-2xl font-display font-bold uppercase tracking-wide">Satyameva <br /> Jayate</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-gov-blue/50">The Mission</p>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-gov-blue">Empowering the Public<span className="text-gov-saffron"> Ecosystem</span></h2>
            <p className="text-lg text-gov-blue/60 max-w-2xl mx-auto font-medium">A tailored experience for every stakeholder in the governance ecosystem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "For Citizens",
                desc: "Direct oversight of local projects, tax utilization reports, and a secure channel for reporting anomalies.",
                icon: User,
                color: "bg-gov-saffron"
              },
              {
                title: "For Officials",
                desc: "Streamlined budget management, contractor performance tracking, and automated compliance auditing.",
                icon: Building2,
                color: "bg-gov-blue"
              },
              {
                title: "For Contractors",
                desc: "Transparent bidding, real-time progress reporting, and a merit-based trust scoring system.",
                icon: HardHat,
                color: "bg-gov-green"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="gov-card p-10 hover:shadow-lg transition-all duration-300 group border-slate-200 hover:border-slate-300"
              >
                <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-300 shadow-md", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold text-gov-blue mb-4">{item.title}</h3>
                <p className="text-gov-blue/65 leading-[1.6] text-sm font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 px-8 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Corruption Risk Reduction", value: "65%", icon: ShieldCheck },
                { label: "Project Delivery Speed", value: "40%", icon: Zap },
                { label: "Citizen Engagement", value: "12X", icon: User },
                { label: "Budget Efficiency", value: "22%", icon: TrendingUp },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="gov-card p-8 bg-white space-y-4 border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <stat.icon className="w-6 h-6 text-gov-blue/30" />
                  <div>
                    <p className="text-3xl font-display font-bold text-gov-blue">{stat.value}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gov-blue/50 mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-10">
            <div className="flex items-center gap-3 text-gov-green font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5" />
              Measurable Impact
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-gov-blue leading-[1.15]">
              Driving Change<br />
              <span className="text-gov-green">Through Data-Led Integrity</span>
            </h2>
            <p className="text-lg text-gov-blue/65 leading-[1.7] font-medium max-w-lg">
              Our platform doesn't just monitor; it transforms. By creating a closed-loop system of accountability, we ensure that every public project serves its intended purpose.
            </p>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-10 py-4 rounded-lg bg-gov-blue text-white font-semibold uppercase tracking-wide text-sm hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/30 active:scale-95 inline-block"
            >
              Join the Movement
            </button>
          </div>
        </div>
      </section>

      {/* Login Portal Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLogin(false);
                setStep(1);
              }}
              className="absolute inset-0 bg-gov-blue/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl gov-card border-slate-200 p-0 shadow-2xl bg-white overflow-hidden"
            >
              {/* Ashoka Chakra Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                  {[...Array(24)].map((_, i) => (
                    <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center p-8 border-b border-slate-200">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gov-blue">
                      {step === 1 ? 'Access Portal' : `${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Portal'}`}
                    </h2>
                    <p className="text-sm text-gov-blue/60 mt-1 font-medium">
                      {step === 1 ? 'Select your role to continue' : (mode === 'login' ? 'Enter your credentials' : 'Complete your registration')}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowLogin(false);
                      setStep(1);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-gov-blue/50 hover:text-gov-blue transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  {step === 1 ? (
                    <div className="space-y-8">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setMode('login')}
                          className={cn(
                            "flex-1 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all",
                            mode === 'login' ? "bg-gov-blue text-white shadow-lg shadow-gov-blue/30" : "bg-slate-100 text-gov-blue/60 hover:bg-slate-200"
                          )}
                        >
                          Secure Login
                        </button>
                        <button 
                          onClick={() => setMode('register')}
                          className={cn(
                            "flex-1 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all",
                            mode === 'register' ? "bg-gov-blue text-white shadow-lg shadow-gov-blue/30" : "bg-slate-100 text-gov-blue/60 hover:bg-slate-200"
                          )}
                        >
                          New Registration
                        </button>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: 'citizen', title: 'Citizen', icon: User, desc: 'Monitor projects and file grievances.' },
                          { id: 'official', title: 'Govt. Official', icon: ShieldCheck, desc: 'Manage budgets and oversee projects.' },
                          { id: 'contractor', title: 'Contractor', icon: HardHat, desc: 'Update progress and manage contracts.' },
                          { id: 'media', title: 'Media/Audit', icon: Search, desc: 'Investigate and audit public spending.' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setRole(r.id as UserRole);
                              setStep(2);
                            }}
                            className="w-full flex items-center gap-5 p-5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gov-blue/10 flex items-center justify-center text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-colors shadow-sm">
                              <r.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gov-blue text-sm">{r.title}</h4>
                              <p className="text-xs text-gov-blue/50 mt-0.5">{r.desc}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gov-blue/20 group-hover:text-gov-blue transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <button 
                        onClick={() => setStep(1)}
                        className="text-sm font-semibold text-gov-blue/50 uppercase tracking-widest flex items-center gap-2 hover:text-gov-blue transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Roles
                      </button>

                      <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Display */}
                        {(localError || error) && (
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-900">{localError || error}</p>
                            </div>
                          </div>
                        )}

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Full Legal Name</label>
                            <input 
                              type="text" 
                              className="gov-input" 
                              placeholder="As per official ID" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required 
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">
                            {role === 'citizen' ? 'Aadhaar / Voter ID' : 
                             role === 'official' ? 'Employee ID' : 
                             role === 'contractor' ? 'Contractor License ID' : 'Audit License ID'}
                          </label>
                          <input 
                            type="text" 
                            className="gov-input" 
                            placeholder={role === 'citizen' ? 'CIT-XXXXX' : role === 'official' ? 'GOV-XXXXX' : role === 'contractor' ? 'CON-XXXXX' : 'AUD-XXXXX'} 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required 
                          />
                        </div>

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Official Email Address</label>
                            <input 
                              type="email" 
                              className="gov-input" 
                              placeholder="name@organization.gov.in" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required 
                            />
                          </div>
                        )}

                        {/* Login uses ID + Password only */}

                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Security PIN / Password</label>
                          <input 
                            type="password" 
                            title="Enter your password" 
                            placeholder="••••••••" 
                            className="gov-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                          />
                        </div>

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Confirm Password</label>
                            <input 
                              type="password" 
                              title="Confirm your password" 
                              placeholder="••••••••" 
                              className="gov-input" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required 
                            />
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full gov-button-primary py-4 text-sm font-semibold shadow-lg shadow-gov-blue/25 flex items-center justify-center gap-2 hover:bg-blue-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                {mode === 'login' ? 'Access Secure Dashboard' : 'Complete Registration'}
                              </>
                            )}
                          </button>
                        </div>
                        
                        <p className="text-xs text-center text-gov-blue/50 leading-relaxed">
                          {mode === 'login' ? 
                            'Unauthorized access is strictly prohibited under the IT Act 2000.' : 
                            'By registering, you agree to the National Data Privacy Policy and the Civic Integrity Code of Conduct.'}
                        </p>

                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => { setMode('register'); setLocalError(''); setEmail(''); setPassword(''); setConfirmPassword(''); }}
                            className="w-full py-3 text-sm font-semibold text-gov-blue hover:bg-gov-blue/5 transition-colors rounded-lg"
                          >
                            Don't have an account? Register here
                          </button>
                        )}

                        {mode === 'register' && (
                          <button
                            type="button"
                            onClick={() => { setMode('login'); setLocalError(''); setEmail(''); setPassword(''); setConfirmPassword(''); setName(''); }}
                            className="w-full py-3 text-sm font-semibold text-gov-blue hover:bg-gov-blue/5 transition-colors rounded-lg"
                          >
                            Already have an account? Login here
                          </button>
                        )}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="bg-gov-blue text-white py-16 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">Civic Integrity AI</h4>
            </div>
            <p className="text-white/60 text-sm leading-[1.7] max-w-sm font-medium">
              An initiative by the Ministry of Digital Governance to ensure transparency, accountability, and integrity in public resource utilization through advanced AI oversight.
            </p>
            <div className="text-xs text-white/40 pt-2">
              © 2026 National Digital Governance Platform. All rights reserved.
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="text-sm font-bold uppercase tracking-widest text-gov-saffron">Resources</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">RTI Portal</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Audit Reports</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Public Ledger</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Grievance Cell</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-sm font-bold uppercase tracking-widest text-gov-saffron">Legal</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Terms of Use</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">IT Act 2000</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Data Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>© 2026 Ministry of Digital Governance • Government of India</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gov-green animate-pulse" />
            System Status: Operational
          </div>
        </div>
      </footer>
    </div>
  );
};
