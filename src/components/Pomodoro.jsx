import { useState, useEffect, useRef } from "react"
import { Container, Timer, Info, ButtonGroup, Button } from "./styles/PomodoroStyles"

// Constantes de duración de cada fase (en segundos)
const WORK_TIME = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60

const Pomodoro = () => {
  // Estado principal del temporizador
  const [time, setTime] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [cycles, setCycles] = useState(0)

  // Guardamos cuántos pomodoros completos se realizaron (persistente en localStorage)
  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const saved = localStorage.getItem("completedPomodoros")
    return saved ? JSON.parse(saved) : 0
  })

  // Referencia al intervalo (para iniciar / pausar el timer)
  const intervalRef = useRef(null)

  // Limpia el intervalo activo
  const clearTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  // Guarda el número total de pomodoros completados en localStorage
  useEffect(() => {
    localStorage.setItem(
      "completedPomodoros",
      JSON.stringify(completedPomodoros)
    )
  }, [completedPomodoros])

  // Lógica principal del temporizador
  useEffect(() => {
    if (isRunning && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          // Cuando el tiempo llega a 0, cambia la fase
          if (prev <= 1) {
            playSound()
            vibrate()
            setIsRunning(false)

            if (isWorkTime) {
              // Si estaba en trabajo → pasa a descanso
              setCompletedPomodoros((p) => p + 1)
              setCycles((prevCycles) => {
                const newCycles = prevCycles + 1
                setIsWorkTime(false)
                // Cada 4 ciclos se toma un descanso largo
                setTime(newCycles >= 4 ? LONG_BREAK : SHORT_BREAK)
                return newCycles
              })
            } else {
              // Si estaba en descanso → vuelve a trabajo
              setIsWorkTime(true)
              setTime(WORK_TIME)
              setCycles((c) => (c >= 4 ? 0 : c))
            }
            return prev
          }
          // Caso normal: resta un segundo
          return prev - 1
        })
      }, 1000)
    }

    // Limpieza del intervalo al desmontar o detener
    return () => clearTimer()
  }, [isRunning, isWorkTime])

   // Formatea los segundos a mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

   // Reproduce sonido al finalizar un bloque
  const playSound = () => {
    const audio = new Audio("/win.wav")
    audio.play()
  }

  // Vibración breve al cambiar de fase (si el navegador lo permite)
  const vibrate = (pattern = 200) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  // Controladores del temporizador
  const start = () => setIsRunning(true)
  const pause = () => {
    setIsRunning(false)
    clearTimer()
  }
  const reset = () => {
    pause()
    setTime(WORK_TIME)
    setCycles(0)
    setIsWorkTime(true)
    // setCompletedPomodoros(0) // opcional reset total
  }

  // Render principal
  return (
    <Container>
      <Timer>{formatTime(time)}</Timer>
      <h4>
        Bloque de{" "}
        {isWorkTime ? "trabajo" : `descanso ${cycles === 4 ? "largo" : "corto"}`}
      </h4>
      <Info>Bloques de trabajo realizados: {cycles}</Info>
      <Info>Total de bloques completados: {completedPomodoros}</Info>
      <ButtonGroup>        
        <Button onClick={start} disabled={isRunning}>Iniciar</Button>
        <Button onClick={pause} disabled={!isRunning}>Pausar</Button>
        <Button onClick={reset}>Reiniciar</Button>
      </ButtonGroup>
    </Container>
  )
}

export default Pomodoro
