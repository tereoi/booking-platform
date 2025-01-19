// src/components/settings/website/StylingTab.tsx
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SiteData } from '@/types/business';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface StylingTabProps {
  data: SiteData;
  setData: (data: SiteData) => void;
}

export const StylingTab: React.FC<StylingTabProps> = ({ data, setData }) => {
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);

    try {
      const storageRef = ref(storage, `businesses/${data.customUrl}/logo-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const updatedData = {
        ...data,
        site: {
          ...data.site,
          styling: {
            ...data.site.styling,
            logo: url
          }
        }
      };
      setData(updatedData);
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateStyling = (updates: Partial<SiteData['site']['styling']>) => {
    const updatedData = {
      ...data,
      site: {
        ...data.site,
        styling: {
          ...data.site.styling,
          ...updates
        }
      }
    };
    setData(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h3 className="text-lg font-medium mb-4">Kleuren</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Primaire Kleur
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={data.site.styling.primaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateStyling({ primaryColor: e.target.value })
                }
                className="h-10 w-full rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Secundaire Kleur
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={data.site.styling.secondaryColor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateStyling({ secondaryColor: e.target.value })
                }
                className="h-10 w-full rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg font-medium mb-4">Typografie</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Font Familie
            </label>
            <select 
              value={data.site.styling.fontFamily}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateStyling({ fontFamily: e.target.value })
              }
              className="w-full rounded-lg border-gray-300"
            >
              <option value="system-ui">System Default</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Font Grootte
            </label>
            <select 
              value={data.site.styling.fontSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateStyling({ fontSize: e.target.value as 'small' | 'medium' | 'large' })
              }
              className="w-full rounded-lg border-gray-300"
            >
              <option value="small">Klein</option>
              <option value="medium">Medium</option>
              <option value="large">Groot</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <h3 className="text-lg font-medium mb-4">Logo</h3>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                handleLogoUpload(file);
              }
            }}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {data.site.styling.logo && (
            <div className="relative w-40 h-40">
              <img 
                src={data.site.styling.logo}
                alt="Logo preview"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => updateStyling({ logo: undefined })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div>
        <h3 className="text-lg font-medium mb-4">Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Breedte
            </label>
            <select 
              value={data.site.styling.maxWidth}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateStyling({ maxWidth: e.target.value as 'narrow' | 'medium' | 'wide' })
              }
              className="w-full rounded-lg border-gray-300"
            >
              <option value="narrow">Smal</option>
              <option value="medium">Medium</option>
              <option value="wide">Breed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Spacing
            </label>
            <select 
              value={data.site.styling.spacing}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateStyling({ spacing: e.target.value as 'compact' | 'comfortable' | 'spacious' })
              }
              className="w-full rounded-lg border-gray-300"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortabel</option>
              <option value="spacious">Ruim</option>
            </select>
          </div>
        </div>
      </div>

      {/* Effects */}
      <div>
        <h3 className="text-lg font-medium mb-4">Effecten</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.site.styling.enableAnimations}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateStyling({ enableAnimations: e.target.checked })
              }
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium">Animaties inschakelen</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.site.styling.glassmorphism}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateStyling({ glassmorphism: e.target.checked })
              }
              className="rounded text-blue-600"
            />
            <span className="text-sm font-medium">Glassmorphism effect</span>
          </label>
        </div>
      </div>
    </div>
  );
};