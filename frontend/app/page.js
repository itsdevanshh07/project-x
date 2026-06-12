'use client';

import { BookOpen, Monitor, MessageSquare, BarChart, Users, Layers, Target, Phone, MapPin, Mail, Instagram, Facebook, Youtube, Linkedin, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  const features = [
    { icon: <BookOpen className="w-6 h-6 text-accent-highlight" />, title: "Classes 5–12 Academic Support" },
    { icon: <Monitor className="w-6 h-6 text-accent-highlight" />, title: "AI & Computer Education" },
    { icon: <MessageSquare className="w-6 h-6 text-accent-highlight" />, title: "English Communication Programs" },
    { icon: <BarChart className="w-6 h-6 text-accent-highlight" />, title: "Weekly Assessments & Analytics" },
    { icon: <Users className="w-6 h-6 text-accent-highlight" />, title: "Parent Engagement System" },
    { icon: <Layers className="w-6 h-6 text-accent-highlight" />, title: "Hybrid Learning Ecosystem" },
    { icon: <Target className="w-6 h-6 text-accent-highlight" />, title: "Career Guidance & Skill Development" }
  ];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-surface-light font-sans selection:bg-secondary-action/30 overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-secondary-action/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent-highlight/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation / Header */}
      <header className="relative z-10 container mx-auto px-6 py-8 flex justify-center md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-highlight to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <BookOpen className="w-6 h-6 text-primary-bg" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">Divya Gyan Dhara</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 pb-24">
        {/* Hero Section */}
        <section className="pt-12 md:pt-24 pb-20 md:pb-32 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-accent-highlight">
              Launching Soon
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
              Something <span className="text-accent-highlight">Transformative</span> <br className="hidden md:block" /> is Coming Soon
            </h1>
            <h2 className="text-xl md:text-3xl font-display text-white/80 mb-6">
              Reimagining Education for Every Learner
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              We are building an innovative learning platform focused on academic excellence, AI literacy, and future-ready education.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/917454811848" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-accent-highlight text-primary-bg hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us
              </a>
              <button 
                onClick={scrollToAbout}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 active:scale-95"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Brand Positioning Section */}
        <section id="about" className="py-20 border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-display mb-6">About Divya Gyan Dhara</h3>
            <p className="text-lg text-white/70 leading-relaxed">
              Divya Gyan Dhara is an education-focused initiative committed to delivering quality learning experiences through technology, innovation, and value-based education. Our mission is to empower students with knowledge, skills, and digital competencies that prepare them for the future.
            </p>
          </div>
        </section>

        {/* What We Are Building Section */}
        <section className="py-10">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold font-display mb-4">What We Are Building</h3>
            <p className="text-white/60">A comprehensive ecosystem designed for student success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-surface-light/5 backdrop-blur-xl border border-surface-light/10 rounded-2xl p-6 hover:bg-surface-light/10 transition-colors flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-bg border border-white/5 shadow-inner">
                  {feature.icon}
                </div>
                <div className="pt-2">
                  <h4 className="font-semibold text-lg">{feature.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 mt-10 border-t border-white/10">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold font-display mb-6">Get In Touch</h3>
              <p className="text-white/60 mb-8">Have questions? Reach out to us directly while we prepare for our launch.</p>
              
              <div className="space-y-6">
                <a href="tel:+919368448564" className="flex items-center gap-4 text-white/80 hover:text-accent-highlight transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Phone className="w-5 h-5 text-accent-highlight" />
                  </div>
                  <span className="text-lg">+91 9368448564</span>
                </a>
                <a href="https://wa.me/917454811848" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-accent-highlight transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <MessageCircle className="w-5 h-5 text-accent-highlight" />
                  </div>
                  <span className="text-lg">WhatsApp: +91 7454811848</span>
                </a>
                <a href="mailto:gyandharadivya@gmail.com" className="flex items-center gap-4 text-white/80 hover:text-accent-highlight transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Mail className="w-5 h-5 text-accent-highlight" />
                  </div>
                  <span className="text-lg">gyandharadivya@gmail.com</span>
                </a>
                <div className="flex items-center gap-4 text-white/80">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <MapPin className="w-5 h-5 text-accent-highlight" />
                  </div>
                  <span className="text-lg">Sudhowala, Premnagar Dehradun, Uttarakhand</span>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-light/5 border border-surface-light/10 rounded-3xl p-8 backdrop-blur-xl">
              <h4 className="text-2xl font-bold mb-6 font-display">Connect With Us</h4>
              <p className="text-white/60 mb-8">Follow our journey on social media to get the latest updates on our launch.</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/divyagyanadhara?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-highlight hover:border-accent-highlight/50 transition-all shadow-lg hover:-translate-y-1">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-highlight hover:border-accent-highlight/50 transition-all shadow-lg hover:-translate-y-1">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-highlight hover:border-accent-highlight/50 transition-all shadow-lg hover:-translate-y-1">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-white/10 flex items-center justify-center text-white/70 hover:text-accent-highlight hover:border-accent-highlight/50 transition-all shadow-lg hover:-translate-y-1">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">© 2026 Divya Gyan Dhara. All Rights Reserved.</p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
