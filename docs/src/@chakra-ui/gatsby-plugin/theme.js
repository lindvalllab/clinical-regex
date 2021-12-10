import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react"

const theme = extendTheme(
  {
    colors: {
      brand: baseTheme.colors.messenger,
    },
    fonts: {
      heading: "Poppins, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
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
