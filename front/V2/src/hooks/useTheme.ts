import type { ThemeMode } from '@/constants/app';

export function applyThemeMode(mode: ThemeMode) {
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}
