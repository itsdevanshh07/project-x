'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CoursePreview from '@/components/CoursePreview';
import KeyHighlights from '@/components/KeyHighlights';
import BentoInfo from '@/components/BentoInfo';
import FounderMessage from '@/components/FounderMessage';
import SocialFollow from '@/components/SocialFollow';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-bg overflow-x-hidden">
      <Navbar />
      <Hero />
      <CoursePreview />
      <KeyHighlights />
      <BentoInfo />
      <FounderMessage />
      <SocialFollow />
      <Footer />
    </main>
  );
}

