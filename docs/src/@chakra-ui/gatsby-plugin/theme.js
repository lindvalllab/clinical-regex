import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react"

const theme = extendTheme(
  {
    colors: {
      // based off of logo from Kai-ou
      brand: {
        50: "#E8EFFD",
        100: "#BED1F9",
        200: "#94B4F5",
        300: "#6A96F1",
        400: "#4079ED",
        500: "#165CE9",
        600: "#1249BA",
        700: "#0D378C",
        800: "#09255D",
        900: "#04122F",
      },
      // same as brand
      blue: {
        50: "#E8EFFD",
        100: "#BED1F9",
        200: "#94B4F5",
        300: "#6A96F1",
        400: "#4079ED",
        500: "#165CE9",
        600: "#1249BA",
        700: "#0D378C",
        800: "#09255D",
        900: "#04122F",
      },
      yellow: {
        50: "#FFFEE5",
        100: "#FFFDB8",
        200: "#FFFB8A",
        300: "#FFFA5C",
        400: "#FFF82E",
        500: "#FFF700",
        600: "#CCC600",
        700: "#999400",
        800: "#666300",
        900: "#333100",
      },
    },
    fonts: {
      heading: "IBM Plex Sans, system-ui, sans-serif",
      body: "IBM Plex Sans, system-ui, sans-serif",
      mono: "IBM Plex Mono, monospace",
    },
    components: {
      Link: {
        baseStyle: {
          color: "brand.600",
          fontWeight: "bold",
        },
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Button"],
  })
)

export default theme
