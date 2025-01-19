//src/pages/dashboard/test-urls.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function TestURLs() {
  const [businessData, setBusinessData] = useState({
    name: '',
    customUrl: '',
  });
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUrlAvailability = async (url: string) => {
    setIsChecking(true);
    setError('');
    
    try {
      // Eerst valideren we de URL structuur
      if (!/^[a-z0-9-]+$/.test(url)) {
        setError('URL mag alleen kleine letters, cijfers en koppeltekens bevatten');
        setIsAvailable(false);
        return;
      }

      // Check minimale lengte
      if (url.length < 3) {
        setError('URL moet minimaal 3 karakters lang zijn');
        setIsAvailable(false);
        return;
      }

      // Check of URL al in gebruik is
      const urlQuery = query(
        collection(db, 'businesses'),
        where('customUrl', '==', url)
      );
      
      const querySnapshot = await getDocs(urlQuery);
      const isUrlAvailable = querySnapshot.empty;

      setIsAvailable(isUrlAvailable);
      if (!isUrlAvailable) {
        setError('Deze URL is al in gebruik');
      }
    } catch (error) {
      console.error('Error checking URL:', error);
      setError('Er ging iets mis bij het controleren van de URL');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAvailable) {
      setError('Kies eerst een beschikbare URL');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Je moet ingelogd zijn');
        return;
      }

      // Basis business document
      const businessDoc = {
        name: businessData.name,
        customUrl: businessData.customUrl,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'active',
        site: {
          hero: {
            enabled: true,
            title: `Welkom bij ${businessData.name}`,
            subtitle: 'Plan direct een afspraak',
            showBookingButton: true,
            bookingButtonText: 'Maak een afspraak'
          },
          styling: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            accentColor: '#2563eb',
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui',
            fontSize: 'medium',
            enableAnimations: true,
            glassmorphism: false,
            maxWidth: 'wide',
            spacing: 'comfortable'
          }
        }
      };

      // Voeg business toe aan Firestore
      const docRef = await addDoc(collection(db, 'businesses'), businessDoc);
      
      alert('Business succesvol aangemaakt! URL: ' + businessData.customUrl);
      
      // Reset form
      setBusinessData({
        name: '',
        customUrl: ''
      });
      setIsAvailable(null);
      
    } catch (error) {
      console.error('Error creating business:', error);
      setError('Er ging iets mis bij het aanmaken van het bedrijf');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Test Business URLs</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bedrijfsnaam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={businessData.name}
              onChange={(e) => setBusinessData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="w-full rounded-lg border-gray-300"
              required
            />
          </div>

          {/* Custom URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom URL
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-500">https://</span>
                  <input
                    type="text"
                    value={businessData.customUrl}
                    onChange={(e) => {
                      const url = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setBusinessData(prev => ({
                        ...prev,
                        customUrl: url
                      }));
                      setIsAvailable(null);
                    }}
                    className="flex-1 rounded-lg border-gray-300"
                    required
                  />
                  <span className="text-gray-500">.yourdomain.com</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => checkUrlAvailability(businessData.customUrl)}
                disabled={isChecking || !businessData.customUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isChecking ? 'Controleren...' : 'Controleer URL'}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {isAvailable && !error && (
              <p className="mt-2 text-sm text-green-600">Deze URL is beschikbaar!</p>
            )}
          </div>

          {/* Submit knop */}
          <button
            type="submit"
            disabled={!isAvailable || isChecking}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            Maak Business Aan
          </button>
        </form>

        {/* Preview */}
        {businessData.customUrl && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Website URL: </span>
                https://{businessData.customUrl}.yourdomain.com
              </p>
              <p>
                <span className="font-medium">Dashboard URL: </span>
                https://{businessData.customUrl}.yourdomain.com/dashboard
              </p>
              <p>
                <span className="font-medium">Booking URL: </span>
                https://{businessData.customUrl}.yourdomain.com/book
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}