// context/ThemeContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import * as SecureStore from 'expo-secure-store'
import { Colors } from '../constants/colors'
import { StatusBar } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  toggleTheme: () => void
  colors: typeof Colors.light // Adjust this type based on your Colors structure
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

const THEME_KEY = 'appTheme' // Key to store the theme in SecureStore

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light')

  // Function to load the theme from SecureStore
  const loadTheme = async () => {
    const storedTheme = await SecureStore.getItemAsync(THEME_KEY)
    if (storedTheme) {
      setTheme(storedTheme as Theme)
    }
  }

  // Function to toggle and store the theme
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    await SecureStore.setItemAsync(THEME_KEY, newTheme) // Persist the theme in SecureStore
  }

  // Load the theme on mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Update the StatusBar color based on the theme
  useEffect(() => {
    StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content')
  }, [theme])

  const colors = Colors[theme] // Dynamically select colors based on theme

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
