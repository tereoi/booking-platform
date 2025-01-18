// src/components/settings/BusinessUrlSettings.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function BusinessUrlSettings() {
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCurrentUrl = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().customUrl) {
          setCurrentUrl(docSnap.data().customUrl);
          setNewUrl(docSnap.data().customUrl);
        }
      } catch (error) {
        console.error('Error fetching current URL:', error);
        toast.error('Kon huidige URL niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUrl();
  }, []);

  const checkAvailability = async (url: string) => {
    setChecking(true);
    setIsAvailable(null);

    try {
      // Check if URL only contains valid characters
      if (!/^[a-z0-9-]+$/.test(url)) {
        toast.error('URL mag alleen kleine letters, cijfers en koppeltekens bevatten');
        setIsAvailable(false);
        return;
      }

      // Check if URL is already in use
      const urlQuery = query(
        collection(db, 'businesses'),
        where('customUrl', '==', url)
      );
      const querySnapshot = await getDocs(urlQuery);
      
      // URL is available if no documents are found, or if it's the current user's URL
      const isUrlAvailable = querySnapshot.empty || (
        querySnapshot.size === 1 && 
        querySnapshot.docs[0].id === auth.currentUser?.uid
      );

      setIsAvailable(isUrlAvailable);
      if (!isUrlAvailable) {
        toast.error('Deze URL is al in gebruik');
      }
    } catch (error) {
      console.error('Error checking URL availability:', error);
      toast.error('Kon URL beschikbaarheid niet controleren');
    } finally {
      setChecking(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setNewUrl(url);
    setIsAvailable(null);
  };

  const handleSave = async () => {
    if (!isAvailable) {
      toast.error('Kies eerst een beschikbare URL');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        customUrl: newUrl
      });
      setCurrentUrl(newUrl);
      toast.success('URL succesvol bijgewerkt');
    } catch (error) {
      console.error('Error saving URL:', error);
      toast.error('Kon URL niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Aanpasbare URL</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Je booking pagina URL
            </label>
            <div className="flex items-center space-x-2">
              <div className="text-gray-500">https://</div>
              <input
                type="text"
                value={newUrl}
                onChange={handleUrlChange}
                className="input-field flex-grow"
                placeholder="jouw-bedrijf"
              />
              <div className="text-gray-500">.yourdomain.com</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Alleen kleine letters, cijfers en koppeltekens toegestaan
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => checkAvailability(newUrl)}
              disabled={checking || !newUrl || newUrl === currentUrl}
              className="button-secondary"
            >
              {checking ? 'Controleren...' : 'Controleer beschikbaarheid'}
            </button>

            {isAvailable !== null && (
              <div className="flex items-center space-x-2">
                {isAvailable ? (
                  <>
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-500">Beschikbaar</span>
                  </>
                ) : (
                  <>
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-500">Niet beschikbaar</span>
                  </>
                )}
              </div>
            )}
          </div>

          {isAvailable && newUrl !== currentUrl && (
            <div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="button-primary"
              >
                {saving ? 'Opslaan...' : 'URL bijwerken'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}