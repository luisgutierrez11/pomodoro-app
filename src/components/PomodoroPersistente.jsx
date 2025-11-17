import { useState, useEffect, useRef } from "react"

const POMODORO_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export default function Pomodoro() { 

  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const intervalRef = useRef(null)

  // 🔹 Cargar estado desde localStorage al inicio
  useEffect(() => {
    const savedEndTime = localStorage.getItem("pomodoro_end_time")
    const savedIsBreak = localStorage.getItem("pomodoro_is_break") === "true"
    const savedIsRunning = localStorage.getItem("pomodoro_is_running") === "true"
    const now = Date.now()

    if (savedEndTime) {
        const remaining = Math.floor((Number(savedEndTime) - now) / 1000)
        if (remaining > 0) {
        setTimeLeft(remaining)
        setIsRunning(savedIsRunning)
        setIsBreak(savedIsBreak)
        }
    }
  }, [])

  // 🔹 Guardar estado en localStorage cada vez que cambia
  useEffect(() => {
    if (isRunning) {
        const endTime = Date.now() + timeLeft * 1000
        localStorage.setItem("pomodoro_end_time", endTime)
    }
    localStorage.setItem("pomodoro_is_break", isBreak)
    localStorage.setItem("pomodoro_is_running", isRunning)
  }, [timeLeft, isRunning, isBreak])

  // 🔹 Manejar el temporizador
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextIsBreak = !isBreak
            setIsBreak(nextIsBreak)
            setIsRunning(false)
            localStorage.removeItem("pomodoro_end_time") // limpiar
            return nextIsBreak ? BREAK_TIME : POMODORO_TIME
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, isBreak])

  // 🔹 Formato MM:SS
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>{isBreak ? "Descanso" : "Pomodoro"}</h1>
      <h2>{formatTime(timeLeft)}</h2>
      <button onClick={() => setIsRunning((prev) => !prev)}>
        {isRunning ? "Pausar" : "Iniciar"}
      </button>
      <button
        onClick={() => {
          setIsRunning(false);
          setTimeLeft(isBreak ? BREAK_TIME : POMODORO_TIME);
          localStorage.removeItem("pomodoro_end_time");
        }}
      >
        Reiniciar
      </button>
    </div>
  )
}
