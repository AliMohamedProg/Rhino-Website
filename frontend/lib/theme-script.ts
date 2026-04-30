/**
 * Inline script run before first paint to prevent theme flash.
 * Reads localStorage then system preference and applies class to <html>.
 */
export const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (stored === 'light' || stored === 'dark') ? stored : (systemDark ? 'dark' : 'light');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (e) {}
})();
`;
