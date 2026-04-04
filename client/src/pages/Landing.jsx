import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Layers, Database, Code2, Network, MessageSquareShare, ArrowRight, CheckCircle2 } from 'lucide-react';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const features = [
  {
    icon: <Bot className="w-6 h-6 text-blue-500" />,
    title: "AI Intent Refinement",
    description: "Our AI asks clarifying questions to narrow down exactly what you need before building the architecture."
  },
  {
    icon: <Layers className="w-6 h-6 text-indigo-500" />,
    title: "System Architecture",
    description: "Generates optimal microservice or monolithic patterns and recommends the perfect tech stack."
  },
  {
    icon: <Network className="w-6 h-6 text-purple-500" />,
    title: "Automatic Diagrams",
    description: "Visualizes your entire system layout instantly using auto-generated Mermaid.js diagrams."
  },
  {
    icon: <Code2 className="w-6 h-6 text-emerald-500" />,
    title: "API Specifications",
    description: "Builds complete RESTful API schemas with exact request/response JSON payload structures."
  },
  {
    icon: <Database className="w-6 h-6 text-amber-500" />,
    title: "Database Modeling",
    description: "Designs robust structural database models with data types, constraints, and relationships."
  },
  {
    icon: <MessageSquareShare className="w-6 h-6 text-rose-500" />,
    title: "Iterative Chat",
    description: "Not happy with the generation? Just tell the AI what to change, and it auto-updates the entire design."
  }
];

const steps = [
  { step: "01", title: "Describe Idea", text: "Write 1-3 sentences about your app concept. Keep it simple." },
  { step: "02", title: "Consult AI", text: "Answer a few smart questions to hone the technical requirements." },
  { step: "03", title: "Generate Design", text: "Receive a complete, production-ready system architecture in seconds." },
];

export default function Landing() {
  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-64px)] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative background blob */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl relative z-10">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Archon AI Platform 1.0 is Live
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
            Architect complex systems <br className="hidden md:block"/> with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI precision.</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop arguing over whiteboards. Transform your raw product ideas into enterprise-grade system architectures, database schemas, and API documentation in seconds.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-900/20 hover:-translate-y-0.5">
              Start Designing Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5">
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp} 
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Everything you need to build faster</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Archon handles the tedious backend documentation and initial technical decisions so you can focus on coding the business logic.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="bg-[#fafafa] border border-gray-100 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mb-16 md:mb-24 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">How Archon Works</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto md:mx-0">In three simple steps, move from ambiguity to a fully documented technical roadmap.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12 relative"
          >
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 z-0" />

            {steps.map((s, idx) => (
              <motion.div key={idx} variants={fadeUp} className="relative z-10 text-center md:text-left">
                <div className="w-14 h-14 bg-gray-800 border-[3px] border-gray-900 ring-2 ring-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-blue-400 mb-8 shadow-lg shadow-blue-500/10 mx-auto md:mx-0">
                  {s.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed text-[15px]">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 bg-[#fafafa] text-center px-4 relative overflow-hidden">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative max-w-4xl mx-auto bg-white border border-gray-100 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-gray-200/40">
           {/* Subtle gradient inside CTA */}
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-[3rem] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Ready to stop guessing?</h2>
            <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">Join the new wave of developers bringing ideas to production faster with AI-driven architecture.</p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-600/40">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Generates in seconds</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 text-center text-sm font-medium text-gray-400 border-t border-gray-100">
        <p>© {new Date().getFullYear()} Archon AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
