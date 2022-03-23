import { useColorModeValue } from '@chakra-ui/react';
import { Context, Dispatch, createContext, useEffect, useReducer } from 'react';
import { LabelEntity } from '../types';
import { getUnique } from '../utils';

type ColorPaletteName = 'rainbow' | 'bright';
type ColorPaletteColors = string[];
type ColorPalette = {
  name: ColorPaletteName;
  base: ColorPaletteColors;
  light: ColorPaletteColors;
  dark: ColorPaletteColors;
};
export type ColorPaletteFromLabels = Record<string, string>;

const RAINBOW: ColorPalette = {
  name: 'rainbow',
  base: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
  light: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
  dark: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'],
};

const BRIGHT: ColorPalette = {
  name: 'bright',
  base: ['#ffbe0b', '#3a86ff', '#ff006e', '#79b831', '#8338ec', '#fb5607'],
  light: ['#ffd35b', '#6ea6ff', '#ff89bc', '#9cd858', '#b88df5', '#ff8e59'],
  dark: ['#86660c', '#274b85', '#9c1c53', '#46691d', '#5d3a8f', '#aa4618'],
};

const DEFAULT = BRIGHT;

interface ColorPaletteContextType {
  dispatch: Dispatch<ColorPaletteName>;
  paletteFromLabels: (labels: LabelEntity[]) => ColorPaletteFromLabels;
  paletteAsList: ColorPaletteColors;
}

const colorPaletteReducer = (state: ColorPalette, name?: ColorPaletteName) => {
  switch (name) {
    case 'rainbow':
      return RAINBOW;
    case 'bright':
      return BRIGHT;
    default:
      return DEFAULT;
  }
};

const ColorPaletteContext: Context<ColorPaletteContextType> = createContext(
  {} as ColorPaletteContextType
);

const storageKey = 'clinical-regex-color-palette';

const initialState =
  JSON.parse(localStorage.getItem(storageKey) as string) || DEFAULT;

const ColorPaletteProvider: React.FC = ({ children }) => {
  const [palette, dispatch] = useReducer(colorPaletteReducer, initialState);
  const isDark = useColorModeValue(false, true);

  /** Create a (label name, hex value) map given a set of labels */
  const paletteFromLabels = (labels: LabelEntity[]) => {
    const unique = getUnique(
      labels.sort((label) => label.id).map((label) => label.label)
    );

    const paletteForMode = isDark ? palette.dark : palette.light;

    return Object.fromEntries(
      unique.map((label, index) => [
        label,
        paletteForMode[index % paletteForMode.length],
      ])
    );
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(palette));
  }, [palette]);

  return (
    <ColorPaletteContext.Provider
      value={{
        paletteFromLabels: paletteFromLabels,
        paletteAsList: isDark ? palette.dark : palette.light,
        dispatch,
      }}
    >
      {children}
    </ColorPaletteContext.Provider>
  );
};

export { ColorPaletteProvider, ColorPaletteContext };
