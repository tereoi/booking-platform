// src/components/settings/website/ContentTab.tsx
import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { ContactSection } from './sections/ContactSection';
import { SiteData } from '@/types/business';

interface ContentTabProps {
  data: SiteData;
  setData: (data: SiteData) => void;
  onSave?: () => Promise<void>;
}

export const ContentTab: React.FC<ContentTabProps> = ({ data, setData, onSave }) => {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          Pas hier de inhoud van je website aan. Wijzigingen worden direct zichtbaar in de preview.
        </p>
      </div>
      
      <HeroSection data={data} setData={setData} />
      <AboutSection data={data} setData={setData} />
      <ServicesSection data={data} setData={setData} />
      <ContactSection data={data} setData={setData} />
    </div>
  );
};