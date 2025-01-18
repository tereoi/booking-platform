// src/types/global.d.ts
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }
  
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string | ArrayBuffer>;
    };
  }

  export interface Appointment {
    id: string;
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    serviceId: string;
    serviceName: string;  // Deze ontbrak en veroorzaakt errors
    duration: number;
    status: 'confirmed' | 'cancelled' | 'completed';
  }