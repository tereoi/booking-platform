// src/components/settings/website/sections/AboutSection.tsx
import { SiteData } from '@/types/business';
import { UploadButton } from '@/components/ui/UploadButton';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const AboutSection: React.FC<{data: SiteData; setData: (data: SiteData) => void}> = ({
    data,
    setData
  }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Over Ons Sectie</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.site.about.enabled}
              onChange={(e) => {
                setData({
                  ...data,
                  site: {
                    ...data.site,
                    about: {
                      ...data.site.about,
                      enabled: e.target.checked
                    }
                  }
                });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Sectie weergeven</span>
          </label>
        </div>
  
        {data.site.about.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titel</label>
              <input
                type="text"
                value={data.site.about.title}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      about: {
                        ...data.site.about,
                        title: e.target.value
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={data.site.about.content}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      about: {
                        ...data.site.about,
                        content: e.target.value
                      }
                    }
                  });
                }}
                rows={6}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Afbeelding</label>
              <UploadButton
                currentImage={data.site.about.image}
                onUpload={async (file) => {
                  // Upload logic here
                }}
                onRemove={() => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      about: {
                        ...data.site.about,
                        image: undefined
                      }
                    }
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };
  