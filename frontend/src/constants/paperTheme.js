import { MD3LightTheme } from 'react-native-paper'
import { COLORS, RADIUS } from './theme'

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.textPrimary,
    secondary: COLORS.textSecondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
  roundness: RADIUS.md,
}