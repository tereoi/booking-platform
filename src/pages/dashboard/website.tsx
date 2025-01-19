// src/pages/dashboard/website.tsx
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SiteCustomization from '@/components/settings/SiteCustomization';
import { motion } from 'framer-motion';
import { 
  ArrowTopRightOnSquareIcon, 
  PencilIcon,
  EyeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon, 
} from '@heroicons/react/24/outline';

interface BusinessData {
  customUrl: string;
  name: string;
}

export default function WebsitePage() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const fetchBusinessData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBusinessData({
            customUrl: docSnap.data().customUrl,
            name: docSnap.data().name
          });
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!businessData) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Er is iets misgegaan bij het laden van je gegevens.
        </div>
      </DashboardLayout>
    );
  }

  const siteUrl = `https://${businessData.customUrl}.yourdomain.com`;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Website Instellingen</h1>
              <p className="text-gray-600">
                Pas je booking website aan en bekijk direct het resultaat
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
              >
                <EyeIcon className="w-5 h-5" />
                <span>Bekijk site</span>
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium mb-1">Je website URL</p>
                <a 
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline flex items-center space-x-1"
                >
                  <span>{siteUrl}</span>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
              </div>
              <button className="button-secondary flex items-center space-x-2">
                <PencilIcon className="w-4 h-4" />
                <span>URL aanpassen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                previewMode === 'desktop' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ComputerDesktopIcon className="w-5 h-5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                previewMode === 'mobile' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <DevicePhoneMobileIcon className="w-5 h-5" />
              <span>Mobiel</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Settings Panel */}
          <div className="col-span-7">
            <SiteCustomization />
          </div>

          {/* Preview Panel */}
          <div className="col-span-5">
            <motion.div
              layout
              className={`sticky top-4 bg-white rounded-2xl shadow-sm overflow-hidden transition-all
                ${previewMode === 'mobile' ? 'w-[375px] mx-auto' : 'w-full'}`}
            >
              <div className="bg-gray-100 p-2 flex items-center space-x-2">
                <div className="flex-1 bg-white h-6 rounded" />
                <div className="w-6 h-6 rounded-full bg-white" />
              </div>
              <div className={`aspect-[9/16] bg-white`}>
                <iframe
                  src={siteUrl}
                  className="w-full h-full border-0"
                  title="Website Preview"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}