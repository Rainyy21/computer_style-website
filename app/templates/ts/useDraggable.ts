import { useState, useRef, useCallback } from 'react'

export function useDraggable(initialPos = { x: 100, y: 100 }) {
  const [pos, setPos] = useState(initialPos)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return
      const el = dragRef.current
      const maxX = el ? window.innerWidth - el.offsetWidth : window.innerWidth
      const maxY = el ? window.innerHeight - el.offsetHeight : window.innerHeight
      
      setPos({
        x: Math.min(Math.max(0, moveEvent.clientX - offset.current.x), maxX),
        y: Math.min(Math.max(0, moveEvent.clientY - offset.current.y), maxY),
      })
    }

    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos])

  return { pos, dragRef, onMouseDown }
}
