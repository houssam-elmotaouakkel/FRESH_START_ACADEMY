import { describe, test, expect, beforeEach } from 'vitest';
import { act } from 'react';
import useThemeStore from '../store/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useThemeStore.setState({ theme: 'light' });
    });
    document.documentElement.classList.remove('dark');
  });

  test('initial theme is light', () => {
    expect(useThemeStore.getState().theme).toBe('light');
  });

  test('setTheme changes theme value', () => {
    act(() => {
      useThemeStore.getState().setTheme('dark');
    });
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  test('setTheme("dark") adds .dark class to documentElement', () => {
    act(() => {
      useThemeStore.getState().setTheme('dark');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('setTheme("light") removes .dark class', () => {
    document.documentElement.classList.add('dark');
    act(() => {
      useThemeStore.getState().setTheme('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('toggleTheme switches light to dark', () => {
    act(() => {
      useThemeStore.getState().toggleTheme();
    });
    expect(useThemeStore.getState().theme).toBe('dark');
  });
});
