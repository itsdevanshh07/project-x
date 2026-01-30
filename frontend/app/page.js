'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoursePreview from '@/components/CoursePreview';
import DashboardPreview from '@/components/DashboardPreview';
import BentoInfo from '@/components/BentoInfo';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <CoursePreview />
      <DashboardPreview />
      <BentoInfo />
      <Footer />
    </main>
  );
}

