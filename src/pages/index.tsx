// src/pages/index.tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Hero3D from '@/components/3d/Hero3D';
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  BellAlertIcon,
  SwatchIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: "Slim Plannen",
    description: "Intelligent boekingssysteem dat zich aanpast aan jouw bedrijf",
    icon: CalendarDaysIcon
  },
  {
    title: "Klantbeheer",
    description: "Houd je klanten en hun voorkeuren eenvoudig bij",
    icon: UserGroupIcon
  },
  {
    title: "Automatische Meldingen",
    description: "Automatische herinneringen voor afspraken",
    icon: BellAlertIcon
  },
  {
    title: "Eigen Styling",
    description: "Pas je boekingspagina aan naar jouw huisstijl",
    icon: SwatchIcon
  },
  {
    title: "Inzichten & Analytics",
    description: "Krijg waardevolle inzichten in je bedrijfsprestaties",
    icon: ChartBarIcon
  },
  {
    title: "Integraties",
    description: "Verbind naadloos met je favoriete tools",
    icon: ArrowPathIcon
  }
];

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <MainLayout>
      <div ref={targetRef}>
        {/* Hero Section */}
        <motion.div 
          className="h-screen flex items-center justify-center relative overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="absolute inset-0 z-0">
            <Hero3D />
          </div>
          
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <motion.h1 
              className="heading-1 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Afspraken Maken in Stijl
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Transformeer je bedrijf met ons elegante boekingssysteem. 
              Ontworpen voor professionals die geven om de ervaring van hun klanten.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/register">
                <button className="button-primary">
                  Start Gratis Trial
                </button>
              </Link>
              <button className="button-secondary">
                Bekijk Demo
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-2 mb-4">Alles wat je nodig hebt</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Krachtige features om je bedrijf moeiteloos te beheren
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-panel p-6 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-gray-900 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-2 mb-4">Klaar om te beginnen?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Start vandaag nog met het professionaliseren van je afsprakenplanning
              </p>
              <Link href="/register">
                <button className="button-primary">
                  Start Gratis Trial
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}