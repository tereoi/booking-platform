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