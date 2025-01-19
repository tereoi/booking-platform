// src/pages/business/[businessId]/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Business } from '@/types/business';

export default function BusinessPage() {
  const router = useRouter();
  const { businessId } = router.query;
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!businessId) return;

      try {
        const businessesRef = collection(db, 'businesses');
        const q = query(businessesRef, where('customUrl', '==', businessId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Bedrijf niet gevonden');
          return;
        }

        const businessDoc = querySnapshot.docs[0];
        setBusiness({
          id: businessDoc.id,
          ...businessDoc.data()
        } as Business);
      } catch (error) {
        console.error('Error fetching business:', error);
        setError('Er ging iets mis bij het laden van het bedrijf');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!business) {
    return <div>Bedrijf niet gevonden</div>;
  }

  return (
    <div>
      <h1>{business.name}</h1>
      {/* Rest van je business homepage content */}
    </div>
  );
}