// Bestandslocatie: src/components/settings/website/BookingTab.tsx
import { SiteData } from '@/types/business';
import { UploadButton } from '@/components/ui/UploadButton';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const BookingTab: React.FC<{data: SiteData; setData: (data: SiteData) => void}> = ({
    data,
    setData
  }) => {
    const addCustomField = () => {
      const newField = {
        id: `field-${Date.now()}`,
        label: '',
        type: 'text' as const,
        required: false,
        options: []
      };
  
      setData({
        ...data,
        site: {
          ...data.site,
          booking: {
            ...data.site.booking,
            customFields: [...data.site.booking.customFields, newField]
          }
        }
      });
    };
  
    const removeCustomField = (fieldId: string) => {
      setData({
        ...data,
        site: {
          ...data.site,
          booking: {
            ...data.site.booking,
            customFields: data.site.booking.customFields.filter(
              field => field.id !== fieldId
            )
          }
        }
      });
    };
  
    return (
      <div className="space-y-8">
        {/* Algemene instellingen */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-6">Afspraakformulier</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titel</label>
              <input
                type="text"
                value={data.site.booking.title}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        title: e.target.value
                      }
                    }
                  });
                }}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-2">Beschrijving</label>
              <textarea
                value={data.site.booking.description}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        description: e.target.value
                      }
                    }
                  });
                }}
                rows={3}
                className="w-full rounded-lg border-gray-300"
              />
            </div>
          </div>
        </div>
  
        {/* Verplichte velden */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-6">Verplichte Velden</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.site.booking.requiredFields.name}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        requiredFields: {
                          ...data.site.booking.requiredFields,
                          name: e.target.checked
                        }
                      }
                    }
                  });
                }}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium">Naam</span>
            </label>
  
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.site.booking.requiredFields.email}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        requiredFields: {
                          ...data.site.booking.requiredFields,
                          email: e.target.checked
                        }
                      }
                    }
                  });
                }}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium">Email</span>
            </label>
  
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.site.booking.requiredFields.phone}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        requiredFields: {
                          ...data.site.booking.requiredFields,
                          phone: e.target.checked
                        }
                      }
                    }
                  });
                }}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium">Telefoon</span>
            </label>
  
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.site.booking.requiredFields.message}
                onChange={(e) => {
                  setData({
                    ...data,
                    site: {
                      ...data.site,
                      booking: {
                        ...data.site.booking,
                        requiredFields: {
                          ...data.site.booking.requiredFields,
                          message: e.target.checked
                        }
                      }
                    }
                  });
                }}
                className="rounded text-blue-600"
              />
              <span className="text-sm font-medium">Bericht</span>
            </label>
          </div>
        </div>
  
        {/* Custom velden */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Extra Velden</h3>
            <button
              onClick={addCustomField}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Veld toevoegen</span>
            </button>
          </div>
  
          <div className="space-y-6">
            {data.site.booking.customFields.map((field) => (
              <div key={field.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => {
                        setData({
                          ...data,
                          site: {
                            ...data.site,
                            booking: {
                              ...data.site.booking,
                              customFields: data.site.booking.customFields.map(f =>
                                f.id === field.id
                                  ? { ...f, label: e.target.value }
                                  : f
                              )
                            }
                          }
                        });
                      }}
                      placeholder="Veldlabel"
                      className="w-full rounded-lg border-gray-300"
                    />
                  </div>
                  <button
                    onClick={() => removeCustomField(field.id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        setData({
                          ...data,
                          site: {
                            ...data.site,
                            booking: {
                              ...data.site.booking,
                              customFields: data.site.booking.customFields.map(f =>
                                f.id === field.id
                                  ? { ...f, type: e.target.value as any }
                                  : f
                              )
                            }
                          }
                        });
                      }}
                      className="w-full rounded-lg border-gray-300"
                    >
                      <option value="text">Tekst</option>
                      <option value="select">Keuzelijst</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>
  
                  <div>
                    <label className="flex items-center h-full">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          setData({
                            ...data,
                            site: {
                              ...data.site,
                              booking: {
                                ...data.site.booking,
                                customFields: data.site.booking.customFields.map(f =>
                                  f.id === field.id
                                    ? { ...f, required: e.target.checked }
                                    : f
                                )
                              }
                            }
                          });
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="ml-2 text-sm font-medium">Verplicht</span>
                    </label>
                  </div>
                </div>
  
                {field.type === 'select' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Opties</label>
                    <textarea
                      value={field.options?.join('\n')}
                      onChange={(e) => {
                        setData({
                          ...data,
                          site: {
                            ...data.site,
                            booking: {
                              ...data.site.booking,
                              customFields: data.site.booking.customFields.map(f =>
                                f.id === field.id
                                  ? { ...f, options: e.target.value.split('\n') }
                                  : f
                                )
                              }
                            }
                          });
                        }}
                        placeholder="Één optie per regel"
                        rows={3}
                        className="w-full rounded-lg border-gray-300"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
    
          {/* Bevestigingsmail instellingen */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Bevestigingsmail</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.site.booking.confirmationEmail.enabled}
                  onChange={(e) => {
                    setData({
                      ...data,
                      site: {
                        ...data.site,
                        booking: {
                          ...data.site.booking,
                          confirmationEmail: {
                            ...data.site.booking.confirmationEmail,
                            enabled: e.target.checked
                          }
                        }
                      }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
    
            {data.site.booking.confirmationEmail.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Onderwerp</label>
                  <input
                    type="text"
                    value={data.site.booking.confirmationEmail.subject}
                    onChange={(e) => {
                      setData({
                        ...data,
                        site: {
                          ...data.site,
                          booking: {
                            ...data.site.booking,
                            confirmationEmail: {
                              ...data.site.booking.confirmationEmail,
                              subject: e.target.value
                            }
                          }
                        }
                      });
                    }}
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
    
                <div>
                  <label className="block text-sm font-medium mb-2">Email Template</label>
                  <textarea
                    value={data.site.booking.confirmationEmail.template}
                    onChange={(e) => {
                      setData({
                        ...data,
                        site: {
                          ...data.site,
                          booking: {
                            ...data.site.booking,
                            confirmationEmail: {
                              ...data.site.booking.confirmationEmail,
                              template: e.target.value
                            }
                          }
                        }
                      });
                    }}
                    rows={6}
                    className="w-full rounded-lg border-gray-300"
                    placeholder="Gebruik {name}, {date}, {time}, {service} als placeholders"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };