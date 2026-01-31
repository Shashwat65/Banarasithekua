// Project-level ambient declarations to help the editor and TypeScript resolve
// path aliases and Vite import.meta.env during development.

declare module "@/*" {
  const anyExport: any;
  export * from "*";
  export default anyExport;
}

declare module "@/components/*" {
  const comp: any;
  export * from "*";
  export default comp;
}

declare module "@/components/ui/*" {
  const comp: any;
  export * from "*";
  export default comp;
}

declare module "@/hooks/*" {
  const hook: any;
  export * from "*";
  export default hook;
}

declare module "@/services/*" {
  const svc: any;
  export * from "*";
  export default svc;
}

declare module "@/lib/*" {
  const lib: any;
  export * from "*";
  export default lib;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
