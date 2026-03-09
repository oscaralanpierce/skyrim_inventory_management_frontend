import { createContext } from 'react'
import { type ProviderProps } from '../types/contexts'
import { YELLOW, type ColorScheme } from '../utils/colorSchemes'

const ColorContext = createContext<ColorScheme>(YELLOW)

interface ColorProviderProps extends ProviderProps {
  colorScheme: ColorScheme
}

const ColorProvider = ({ colorScheme, children }: ColorProviderProps) => (
  <ColorContext value={colorScheme}>{children}</ColorContext>
)

export { ColorProvider, ColorContext }
