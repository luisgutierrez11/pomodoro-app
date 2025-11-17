import Pomodoro from "./components/Pomodoro"
import { ThemeProvider } from "styled-components"
import GlobalStyle from "./components/styles/GlobalStyles"
import { theme } from "./theme"

// Componente principal de la aplicación.
// Envuelve toda la app con ThemeProvider para pasar el tema a los styled-components.
const App = () => {
  
  return (
    // ThemeProvider permite acceder a las variables del tema (colores, etc.)
    <ThemeProvider theme={theme}>

      {/* GlobalStyle aplica estilos globales (reset básico y tipografía) */}
      <GlobalStyle />

      {/* Título principal */}
      <h1 style={{ textAlign: "center" }}>Pomodoro Time!!!</h1>
      
      {/* Renderizamos el componente principal Pomodoro */}
      <Pomodoro />
    </ThemeProvider>
  )
}

export default App
