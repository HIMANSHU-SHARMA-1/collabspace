// src/utils/theme.js

export const getTheme = () => {
  return localStorage.getItem('theme') || 'dark';
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  // Dispatch custom event to notify components
  window.dispatchEvent(new Event('themechange'));
};

export const initTheme = () => {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
};
