import { useState, useEffect, useRef } from "react"
// import { Container, Timer, Info, ButtonGroup, Button } from "./styles/PomodoroStyles"

// Constantes de tiempos en segundos
const WORK_TIME = 25 * 60     // 25 min
const SHORT_BREAK = 5 * 60    // 5 min
const LONG_BREAK = 15 * 60    // 15 min
const CYCLES_BEFORE_LONG_BREAK = 4

export default function Pomodoro() {
  const [time, setTime] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef(null)

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("pomodoroState"));
    if (savedState) {
      setTime(savedState.time)
      setIsRunning(savedState.isRunning)
      setIsWorkTime(savedState.isWorkTime)
      setCycles(savedState.cycles)
    }
  }, [])

  // Guardar estado en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({ time, isRunning, isWorkTime, cycles })
    )
  }, [time, isRunning, isWorkTime, cycles])

  // Función para limpiar el intervalo
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Sonido y vibración al cambiar de fase
  const notifyChange = () => {
    // Beep
    const audio = new Audio( "/win.wav"
      //"https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    )
    audio.play().catch(() => {})
    // Vibrar si se puede
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
  }

  // Manejo del temporizador
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            // Cambio de bloque cuando se acaba el tiempo
            notifyChange()
            // toggleTimer() // Para que se pause solo entre bloques
            if (isWorkTime) {
              setCycles(prev => {
                const newCycles = prev + 1
                if (newCycles >= CYCLES_BEFORE_LONG_BREAK) {
                  setTime(LONG_BREAK)
                  setIsWorkTime(false)
                  return 0 // reinicia ciclo
                } else {
                  setTime(SHORT_BREAK)
                  setIsWorkTime(false)
                  return newCycles
                }
              })
            } else {
              // Vuelve a trabajo
              setIsWorkTime(true)
              setTime(WORK_TIME)
            }
            return prevTime // evitar que baje de 0
          }
        })
      }, 1000)
    }

    return () => clearTimer()
  }, [isRunning, isWorkTime])

  const toggleTimer = () => {
    setIsRunning(prev => !prev)
  }

  const resetTimer = () => {
    clearTimer()
    setIsRunning(false)
    setIsWorkTime(true)
    setTime(WORK_TIME)
    setCycles(0)
  }

  // Formato mm:ss
  const formatTime = secs => {
    const minutes = String(Math.floor(secs / 60)).padStart(2, "0")
    const seconds = String(secs % 60).padStart(2, "0")
    return `${minutes}:${seconds}`
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Pomodoro</h1>
      <h2>{isWorkTime ? "Trabajo" : "Descanso"}</h2>
      <h1>{formatTime(time)}</h1>
      <button onClick={toggleTimer}>
        {isRunning ? "Pausar" : "Iniciar"}
      </button>
      <button onClick={resetTimer}>Reiniciar</button>
      <p>Ciclos completados: {cycles}</p>
    </div>
  )
}
