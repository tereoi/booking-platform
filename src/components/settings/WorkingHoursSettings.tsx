// src/components/settings/WorkingHoursSettings.tsx
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface DaySchedule {
  isOpen: boolean;
  start: string;
  end: string;
}

interface WorkingHours {
  [key: string]: DaySchedule;
}

const defaultWorkingHours: WorkingHours = {
  monday: { isOpen: true, start: '09:00', end: '17:00' },
  tuesday: { isOpen: true, start: '09:00', end: '17:00' },
  wednesday: { isOpen: true, start: '09:00', end: '17:00' },
  thursday: { isOpen: true, start: '09:00', end: '17:00' },
  friday: { isOpen: true, start: '09:00', end: '17:00' },
  saturday: { isOpen: false, start: '09:00', end: '17:00' },
  sunday: { isOpen: false, start: '09:00', end: '17:00' },
};

const dayNames = {
  monday: 'Maandag',
  tuesday: 'Dinsdag',
  wednesday: 'Woensdag',
  thursday: 'Donderdag',
  friday: 'Vrijdag',
  saturday: 'Zaterdag',
  sunday: 'Zondag',
};

export default function WorkingHoursSettings() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>(defaultWorkingHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const businessDoc = await getDoc(doc(db, 'businesses', user.uid));
        if (businessDoc.exists()) {
          const data = businessDoc.data();
          if (data.settings?.workingHours) {
            setWorkingHours(data.settings.workingHours);
          }
        }
      } catch (error) {
        console.error('Error fetching working hours:', error);
        toast.error('Kon werktijden niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, []);

  const handleToggleDay = (day: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'businesses', user.uid), {
        'settings.workingHours': workingHours,
      });
      toast.success('Werktijden opgeslagen!');
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast.error('Kon werktijden niet opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="space-y-4">
          {Object.entries(workingHours).map(([day, schedule]) => (
            <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-32">
                <span className="font-medium">{dayNames[day as keyof typeof dayNames]}</span>
              </div>
              
              <label className="flex items-center cursor-pointer">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={schedule.isOpen}
                    onChange={() => handleToggleDay(day)}
                    className="hidden"
                  />
                  <div className={`
                    toggle-bg block w-10 h-6 rounded-full transition-all duration-300
                    ${schedule.isOpen ? 'bg-black' : 'bg-gray-300'}
                  `}></div>
                </div>
                <span className="text-sm text-gray-700">
                  {schedule.isOpen ? 'Open' : 'Gesloten'}
                </span>
              </label>

              {schedule.isOpen && (
                <>
                  <input
                    type="time"
                    value={schedule.start}
                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                    className="input-field"
                  />
                  <span>tot</span>
                  <input
                    type="time"
                    value={schedule.end}
                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                    className="input-field"
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="button-primary"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}