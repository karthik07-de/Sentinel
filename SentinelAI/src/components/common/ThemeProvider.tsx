// next-themes causes localStorage SSR crash on Node.js v22+.
// This app is always dark, so we just pass children through.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
