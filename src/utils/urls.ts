// src/utils/urls.ts
export const getBusinessUrl = (customUrl: string): string => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      // Lokale ontwikkeling
      return `http://${customUrl}.localhost:3000`;
    }
    // Productie
    return `https://www.${customUrl}.appointweb.nl`;
  };