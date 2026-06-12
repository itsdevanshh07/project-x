'use client';

import { BookOpen, Monitor, MessageSquare, BarChart, Users, Layers, Target, Phone, MapPin, Mail, Instagram, Facebook, Youtube, Linkedin, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  const features = [
    { icon: <BookOpen className="w-6 h-6 text-slate-900" />, title: "Classes 5–12 Academic Support" },
    { icon: <Monitor className="w-6 h-6 text-slate-900" />, title: "AI & Computer Education" },
    { icon: <MessageSquare className="w-6 h-6 text-slate-900" />, title: "English Communication Programs" },
    { icon: <BarChart className="w-6 h-6 text-slate-900" />, title: "Weekly Assessments & Analytics" },
    { icon: <Users className="w-6 h-6 text-slate-900" />, title: "Parent Engagement System" },
    { icon: <Layers className="w-6 h-6 text-slate-900" />, title: "Hybrid Learning Ecosystem" },
    { icon: <Target className="w-6 h-6 text-slate-900" />, title: "Career Guidance & Skill Development" }
  ];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-[#F9C935]/30 overflow-x-hidden">

      {/* Navigation / Header */}
      <header className="relative z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#F9C935] flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">Divya Gyan Dhara</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-700">
            <a href="#" className="hover:text-slate-900">Home</a>
            <a href="#about" className="hover:text-slate-900">About Us</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#contact" className="hover:text-slate-900">Contact Us</a>
          </div>
          <a 
            href="https://wa.me/917454811848" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex bg-[#000000] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 pb-24">
        {/* Hero Section */}
        <section className="pt-16 md:pt-28 pb-20 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#F9C935]/20 text-sm font-bold text-slate-800">
              Launching Soon
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold font-display leading-[1.15] mb-6 text-slate-900">
              Something <br className="hidden md:block" /> Transformative <br className="hidden md:block" /> is Coming
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-600 mb-8 font-medium">
              Reimagining Education for Every Learner
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              We are building an innovative learning platform focused on academic excellence, AI literacy, and future-ready education.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a 
                href="https://wa.me/917454811848" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-[#F9C935] text-slate-900 shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Get in Touch
              </a>
              <button 
                onClick={scrollToAbout}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-colors hover:bg-gray-100 flex items-center justify-center gap-2 bg-white text-slate-900 border border-gray-200"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full max-w-md mx-auto md:max-w-none relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Flat visual replacing the rides image */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10">
                <div className="w-16 h-16 bg-[#F9C935] rounded-[14px] flex items-center justify-center mb-6 shadow-sm">
                    <BookOpen className="w-8 h-8 text-slate-900" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Empowering Students</h3>
                <p className="text-slate-500 mb-6">Join our waitlist to get early access to our personalized learning ecosystem.</p>
                
                <div className="space-y-4">
                    <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-[#F9C935] w-3/4 rounded-full"></div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-[#000000] w-1/2 rounded-full"></div>
                    </div>
                </div>
            </div>
          </motion.div>
        </section>

        {/* Brand Positioning Section */}
        <section id="about" className="py-20 mt-10 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold font-display mb-6 text-slate-900">About Divya Gyan Dhara</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Divya Gyan Dhara is an education-focused initiative committed to delivering quality learning experiences through technology, innovation, and value-based education. Our mission is to empower students with knowledge, skills, and digital competencies that prepare them for the future.
            </p>
          </div>
        </section>

        {/* What We Are Building Section */}
        <section id="features" className="py-10 bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-extrabold font-display mb-4 text-slate-900">What We Are Building</h3>
            <p className="text-slate-500 text-lg">A comprehensive ecosystem designed for student success.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-[#F8F9FA] rounded-2xl p-6 hover:shadow-md transition-shadow flex items-start gap-5 border border-gray-100">
                <div className="p-3 rounded-xl bg-[#F9C935]/20 text-slate-900">
                  {feature.icon}
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-lg text-slate-900">{feature.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 mt-10 border-t border-gray-200">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-extrabold font-display mb-6 text-slate-900">Get In Touch</h3>
              <p className="text-slate-600 mb-10 text-lg">Have questions? Reach out to us directly while we prepare for our launch.</p>
              
              <div className="space-y-8">
                <a href="tel:+919368448564" className="flex items-center gap-5 text-slate-700 hover:text-[#000000] transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-[#F9C935] transition-colors">
                    <Phone className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-xl font-medium">+91 9368448564</span>
                </a>
                <a href="https://wa.me/917454811848" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 text-slate-700 hover:text-[#000000] transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-[#F9C935] transition-colors">
                    <MessageCircle className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-xl font-medium">WhatsApp: +91 7454811848</span>
                </a>
                <a href="mailto:gyandharadivya@gmail.com" className="flex items-center gap-5 text-slate-700 hover:text-[#000000] transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-[#F9C935] transition-colors">
                    <Mail className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-xl font-medium">gyandharadivya@gmail.com</span>
                </a>
                <div className="flex items-center gap-5 text-slate-700">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-xl font-medium">Sudhowala, Premnagar Dehradun, Uttarakhand</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#000000] rounded-3xl p-10 shadow-xl">
              <h4 className="text-3xl font-bold mb-6 font-display text-white">Connect With Us</h4>
              <p className="text-white/70 mb-10 text-lg">Follow our journey on social media to get the latest updates on our launch.</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/divyagyanadhara?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-white hover:bg-[#F9C935] hover:text-slate-900 transition-all">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-white hover:bg-[#F9C935] hover:text-slate-900 transition-all">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-white hover:bg-[#F9C935] hover:text-slate-900 transition-all">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-white hover:bg-[#F9C935] hover:text-slate-900 transition-all">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-10">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 font-medium">© 2026 Divya Gyan Dhara. All Rights Reserved.</p>
          <div className="flex gap-8 font-semibold text-slate-700">
            <a href="#" className="hover:text-[#F9C935] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#F9C935] transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-[#F9C935] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
