import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
  TrendingUp,
  Globe,
  CheckCircle,
  Sparkles,
  Award,
  Code,
  PenTool,
  MonitorPlay
} from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/lib/mock-data";
import { useRef, useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const stats = [
  { label: "Active Freelancers", value: "12K+", icon: Users },
  { label: "Jobs Completed", value: "45K+", icon: CheckCircle },
  { label: "Total Earnings Paid", value: "$28M+", icon: TrendingUp },
  { label: "Countries", value: "90+", icon: Globe },
];

const features = [
  {
    icon: Briefcase,
    title: "Smart Bidding",
    description:
      "Place competitive bids with proposal messages and delivery timelines. Our system highlights the best offers.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Escrow-protected payments ensure freelancers get paid and clients get quality work delivered.",
  },
  {
    icon: Zap,
    title: "Real-time Chat",
    description:
      "Communicate directly with clients and freelancers through our built-in messaging system.",
  },
  {
    icon: Star,
    title: "Rating System",
    description:
      "Build your reputation with verified reviews and ratings after each completed project.",
  },
];

const topTalent = [
  { name: "Sarah Jenkins", role: "Senior UX Designer", skills: ["Figma", "UI/UX", "Prototyping"], rating: "4.9", jobs: 124, img: "https://i.pravatar.cc/150?u=sarah" },
  { name: "David Chen", role: "Full Stack Developer", skills: ["React", "Node.js", "TypeScript"], rating: "5.0", jobs: 89, img: "https://i.pravatar.cc/150?u=david" },
  { name: "Elena Rodriguez", role: "Brand Strategist", skills: ["Marketing", "Branding", "SEO"], rating: "4.8", jobs: 210, img: "https://i.pravatar.cc/150?u=elena" },
];

const categories = [
  { name: "Development & IT", icon: Code, count: "12,450", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
  { name: "Design & Creative", icon: PenTool, count: "8,200", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80" },
  { name: "Sales & Marketing", icon: TrendingUp, count: "4,600", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" },
  { name: "Video & Animation", icon: MonitorPlay, count: "3,150", img: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=600&q=80" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Hide the intro after a delay
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // Wait 4.5s then slide out
    return () => clearTimeout(timer);
  }, [onComplete]);

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 }
    },
    exit: {
      y: "-100%", // Slide up smoothly
      opacity: 0,
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }
    }
  };

  const letterAnim = {
    hidden: { opacity: 0, y: 80, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }
  };

  const wordAnim = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-center items-center gap-2 sm:gap-6 md:gap-8 lg:gap-12 relative z-10 px-2 w-full">
        {[
          { letter: "E", word: "Earn" },
          { letter: "R", word: "Reach" },
          { letter: "U", word: "Unlock" },
          { letter: "K", word: "Kickstart" },
          { letter: "A", word: "Ambition" },
        ].map((item, i) => (
          <motion.div key={i} variants={letterAnim} className="flex flex-col items-center">
            <div className="text-[3.5rem] sm:text-7xl md:text-9xl lg:text-[11rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-primary to-purple-500 leading-none tracking-tighter drop-shadow-2xl mb-3 sm:mb-6">
              {item.letter}
            </div>
            <motion.div variants={wordAnim} className="text-[0.65rem] sm:text-sm md:text-xl lg:text-2xl font-bold tracking-widest uppercase text-slate-300">
              {item.word}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-20 text-center px-6 max-w-3xl"
      >
        <p className="text-base sm:text-lg md:text-xl text-slate-400 font-light tracking-wide leading-relaxed">
          Helping people <span className="text-white font-medium">earn</span>, <span className="text-white font-medium">reach</span> clients, <span className="text-white font-medium">unlock</span> opportunities, and <span className="text-white font-medium">kickstart</span> their <span className="text-white font-medium">ambitions</span>.
        </p>
      </motion.div>
    </motion.div>
  );
}

function Index() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const featuredJobs = mockJobs.filter((j) => j.status === "open").slice(0, 3);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Lock scroll while intro is showing
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showIntro]);

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="overflow-hidden bg-background">
        {/* HERO SECTION */}
        <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
          {/* Animated Background Elements */}
          <motion.div style={{ y: yBg, opacity: opacityBg }} className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </motion.div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Hero Content */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <motion.div variants={fadeUp}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">The Future of Freelancing</span>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeUp} className="space-y-4">
                  <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
                    Build great <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">
                      products faster
                    </span>
                  </h1>
                  <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                    Connect with world-class talent, manage projects seamlessly, and pay securely. 
                    Your next big idea deserves the best team.
                  </p>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-semibold shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] transition-shadow duration-300 rounded-full"
                    onClick={() => navigate({ to: "/post-job" })}
                  >
                    Hire Top Talent
                  </Button>

                  <Link to="/jobs">
                    <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-full border-border bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                      Find Work
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="flex items-center gap-6 pt-6 border-t border-border/50">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <img key={i} className="w-10 h-10 rounded-full border-2 border-background" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-sm font-medium mt-1">Trusted by 10k+ businesses</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative block perspective-1000 w-full max-w-lg mx-auto mt-12 lg:mt-0 mb-8 lg:mb-0"
              >
                {/* Base Hero Image */}
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" 
                    alt="Professional Freelancer" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent mix-blend-overlay" />
                </div>
                
                {/* Floating Glass Card (Escrow Contract) */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute -bottom-6 left-2 right-2 sm:left-auto sm:right-12 sm:-bottom-8 sm:-left-8 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 shadow-2xl overflow-hidden p-4 sm:p-6 z-20"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Award className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white">Escrow Contract</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">In Progress • Milestone 2</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 shadow-sm border-none">Secured</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="mt-6 flex justify-between items-end">
                      <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Budget</div>
                        <div className="text-2xl font-extrabold text-slate-800 dark:text-white">$4,500</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shadow-sm">
                        <CheckCircle className="text-green-600 dark:text-green-400 w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Notification */}
                  <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-4 top-1/4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Shield className="text-green-600 w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white whitespace-nowrap">Payment Released</div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="relative z-20 border-y border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 divide-x divide-border/50">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center px-4"
                >
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-extrabold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-24 mx-auto max-w-7xl px-4 sm:px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-blue-50 to-transparent opacity-50 rounded-bl-[100px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Workflow</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to hire the perfect match for your next project.</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Post a Job", desc: "Describe your project, set your budget, and publish it to our talent pool." },
              { step: "02", title: "Review Bids", desc: "Get proposals from verified freelancers and review their portfolios." },
              { step: "03", title: "Hire & Work", desc: "Choose the best fit, fund the escrow, and start collaborating." }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10"
              >
                <div className="group h-full bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TOP CATEGORIES */}
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="max-w-xl"
              >
                <h2 className="text-3xl font-bold sm:text-4xl mb-4">Browse talent by category</h2>
                <p className="text-muted-foreground text-lg">Find exactly what you need from our extensive directory of professional freelancers.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Button variant="outline" className="rounded-full group">
                  All Categories 
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 hover:shadow-xl transition-all cursor-pointer h-72"
                >
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-primary/90 transition-colors">
                      <cat.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white mb-1">{cat.name}</h3>
                    <p className="text-sm text-slate-300 font-medium">{cat.count} professionals</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TOP FREELANCERS */}
        <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">Meet our top talent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Work with the highest-rated professionals who have proven track records of delivering excellence.</p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topTalent.map((talent, i) => (
              <motion.div
                key={talent.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative bg-card rounded-3xl border border-border/50 p-6 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <img src={talent.img} alt={talent.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md" />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{talent.name}</h3>
                    <p className="text-sm text-primary font-medium mb-1">{talent.role}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-700">{talent.rating}</span>
                      <span>({talent.jobs} jobs)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {talent.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-slate-100 hover:bg-slate-200">{skill}</Badge>
                  ))}
                </div>

                <Button className="w-full rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  View Profile
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY CHOOSE US */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold sm:text-4xl mb-4">Why businesses trust ERUKA</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">We provide the tools, security, and talent network you need to succeed in the freelance economy.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Poster Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[600px] border border-white/10 shadow-2xl group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Team collaborating" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-800" src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="avatar" />
                      ))}
                    </div>
                    <div className="text-sm font-semibold">Join 50k+ Teams</div>
                  </div>
                  <p className="text-slate-300 text-sm mt-2 font-medium">"ERUKA transformed how we hire talent. The process is seamless and the quality is unmatched."</p>
                </div>
              </motion.div>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <div className="mb-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED JOBS */}
        <motion.section
          className="py-24 mx-auto max-w-7xl px-4 sm:px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl mb-3">Featured Jobs</h2>
              <p className="text-muted-foreground text-lg">Latest opportunities waiting for your expertise.</p>
            </div>
            <Link to="/jobs">
              <Button variant="ghost" className="group text-primary hover:text-primary hover:bg-primary/5 rounded-full">
                Explore All Jobs <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <section className="relative py-32 overflow-hidden mt-12 rounded-t-[3rem]">
          {/* Poster Background Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-fixed" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-primary/80 to-purple-900/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6 leading-tight">
                Ready to elevate your workflow?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of businesses and freelancers building the future together on ERUKA.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-slate-100 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow">
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/post-job">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-transparent border-white text-black hover:bg-white/10 hover:text-white rounded-full">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
