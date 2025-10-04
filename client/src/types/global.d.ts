// Project-level ambient declarations to help the editor and TypeScript resolve
// path aliases and Vite import.meta.env during development.

declare module "@/*" {
  const anyExport: any;
  export default anyExport;
}

declare module "@/components/*" {
  const comp: any;
  export default comp;
}

declare module "@/components/ui/*" {
  const comp: any;
  export default comp;
}

declare module "@/hooks/*" {
  const hook: any;
  export default hook;
}

declare module "@/services/*" {
  const svc: any;
  export default svc;
}

declare module "@/lib/*" {
  const lib: any;
  export default lib;
}

declare module "axios" {
  const axios: any;
  export default axios;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_PROXY?: string;
  // add other VITE_ env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
