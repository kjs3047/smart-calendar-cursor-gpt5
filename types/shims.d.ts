declare module '@fullcalendar/react' {
  const FullCalendar: any;
  export default FullCalendar;
}
declare module '@fullcalendar/daygrid' {
  const plugin: any;
  export default plugin;
}
declare module '@fullcalendar/timegrid' {
  const plugin: any;
  export default plugin;
}
declare module '@fullcalendar/interaction' {
  const plugin: any;
  export default plugin;
}

declare module 'react' {
  export function useState<T = any>(initial?: T): [T, (next: T) => void];
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  export const useEffect: any;
  export function useContext<T = any>(ctx: any): T;
  export function createContext<T = any>(defaultValue: T): any;
  export const forwardRef: any;
  export const useRef: any;
  export type ReactNode = any;
  const React: any;
  export default React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
