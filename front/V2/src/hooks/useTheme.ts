import { THEME_PRESETS, type ThemeMode, type ThemePreset } from '@/constants/app';

export function applyThemeMode(mode: ThemeMode) {
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export function applyThemePreset(preset: ThemePreset) {
  const theme = THEME_PRESETS[preset] || THEME_PRESETS.default;
  document.documentElement.dataset.themePreset = preset;
  document.documentElement.style.setProperty('--el-color-primary', theme.color);
  document.documentElement.style.setProperty('--el-color-primary-dark-2', theme.dark2);
  document.documentElement.style.setProperty('--el-color-primary-light-3', theme.light3);
  document.documentElement.style.setProperty('--el-color-primary-light-5', theme.light5);
  document.documentElement.style.setProperty('--el-color-primary-light-7', theme.light7);
  document.documentElement.style.setProperty('--el-color-primary-light-8', theme.light8);
  document.documentElement.style.setProperty('--el-color-primary-light-9', theme.light9);
}

export function applyGrayMode(enabled: boolean) {
  document.documentElement.classList.toggle('app-gray-mode', enabled);
}

export function applyColorWeakMode(enabled: boolean) {
  document.documentElement.classList.toggle('app-color-weak-mode', enabled);
}
