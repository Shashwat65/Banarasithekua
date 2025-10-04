// Frontend shims for minimal CI environments without @types installed
declare module 'react';
declare module 'react/jsx-runtime' {
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
  export function jsxDEV(...args: any[]): any;
}
declare module 'sonner';
declare module 'lucide-react';

// Minimal React type stubs for JSX and common React types used in the app
declare namespace React {
  interface Attributes {}
  interface HTMLAttributes<T> extends Attributes {
    children?: any;
    className?: string;
  }
  interface DetailedHTMLProps<E, T> extends HTMLAttributes<T> {}
  type ReactNode = any;
  type ChangeEvent<T = any> = any;
  type DragEvent<T = any> = any;
  type FormEvent<T = any> = any;
  function useState<T>(initial?: T): [T, (v: T) => void];
  function useEffect(fn: () => void | (() => void), deps?: any[]): void;
  function useMemo<T>(fn: () => T, deps?: any[]): T;
}

declare global {
  namespace JSX {
    type Element = any;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
