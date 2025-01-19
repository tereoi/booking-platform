// Bestandslocatie: src/components/settings/website/SEOTab.tsx
import { SiteData } from '@/types/business';
import { UploadButton } from '@/components/ui/UploadButton';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const SEOTab: React.FC<{data: SiteData; setData: (data: SiteData) => void}> = ({
    data,
    setData
  }) => {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-6">SEO Instellingen</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Meta Titel</label>
              <input
                type="text"
                value={data.site.seo.title}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        title: e.target.value
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
              />
              <p className="mt-2 text-sm text-gray-500">
                Aanbevolen lengte: 50-60 karakters
              </p>
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Meta Beschrijving</label>
              <textarea
                value={data.site.seo.description}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        description: e.target.value
                      }
                    }
                  });
                }}
                rows={3}
                className="w-full rounded-lg border-gray-300"
              />
              <p className="mt-2 text-sm text-gray-500">
                Aanbevolen lengte: 150-160 karakters
              </p>
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <input
                type="text"
                value={data.site.seo.keywords.join(', ')}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        keywords: e.target.value.split(',').map(k => k.trim())
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Social Media Afbeelding</label>
              <UploadButton
                currentImage={data.site.seo.ogImage}
                onUpload={async (file) => {
                  // Upload logic here
                }}
                onRemove={() => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        ogImage: undefined
                      }
                    }
                  });
                }}
              />
              <p className="mt-2 text-sm text-gray-500">
                Aanbevolen formaat: 1200 x 630 pixels
              </p>
            </div>
          </div>
        </div>
  
        {/* Social Media Links */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-6">Social Media</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                value={data.site.seo.social.facebook}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        social: {
                          ...data.site.seo.social,
                          facebook: e.target.value
                        }
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
                placeholder="https://facebook.com/jouwpagina"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={data.site.seo.social.instagram}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        social: {
                          ...data.site.seo.social,
                          instagram: e.target.value
                        }
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
                placeholder="https://instagram.com/jouwpagina"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                value={data.site.seo.social.linkedin}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      seo: {
                        ...data.site.seo,
                        social: {
                          ...data.site.seo.social,
                          linkedin: e.target.value
                        }
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
                placeholder="https://linkedin.com/company/jouwbedrijf"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };