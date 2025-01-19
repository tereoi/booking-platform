// src/components/settings/website/sections/ContactSection.tsx
import { SiteData } from '@/types/business';
import { UploadButton } from '@/components/ui/UploadButton';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const ContactSection: React.FC<{data: SiteData; setData: (data: SiteData) => void}> = ({
    data,
    setData
  }) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Contact Sectie</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.site.contact.enabled}
              onChange={(e) => {
                setData({
                  ...data,
                  site: {
                    ...data.site,
                    contact: {
                      ...data.site.contact,
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
  
        {data.site.contact.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titel</label>
              <input
                type="text"
                value={data.site.contact.title}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      contact: {
                        ...data.site.contact,
                        title: e.target.value
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.site.contact.showEmail}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        contact: {
                          ...data.site.contact,
                          showEmail: e.target.checked
                        }
                      }
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium">Email weergeven</span>
              </label>
  
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.site.contact.showPhone}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        contact: {
                          ...data.site.contact,
                          showPhone: e.target.checked
                        }
                      }
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium">Telefoon weergeven</span>
              </label>
  
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.site.contact.showAddress}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        contact: {
                          ...data.site.contact,
                          showAddress: e.target.checked
                        }
                      }
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium">Adres weergeven</span>
              </label>
  
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.site.contact.showMap}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        contact: {
                          ...data.site.contact,
                          showMap: e.target.checked
                        }
                      }
                    });
                  }}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium">Google Maps weergeven</span>
              </label>
            </div>
  
            {data.site.contact.showMap && (
              <div>
                <label className="block text-sm font-medium mb-2">Google Maps URL</label>
                <input
                  type="text"
                  value={data.site.contact.googleMapsUrl || ''}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        contact: {
                          ...data.site.contact,
                          googleMapsUrl: e.target.value
                        }
                      }
                    });
                  }}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full rounded-lg border-gray-300"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Voeg hier de embed URL van Google Maps toe
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };