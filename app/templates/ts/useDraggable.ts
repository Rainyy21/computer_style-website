import { useState, useRef, useCallback, useEffect } from 'react'

export function useDraggable(initialPos = { x: 100, y: 100 }) {
  const [pos, setPos] = useState(initialPos)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  // Adjust initial position to be safe on mobile
  useEffect(() => {
    const el = dragRef.current
    if (!el) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const elW = el.offsetWidth
    const elH = el.offsetHeight

    // Center horizontally on small screens, use initialPos on larger
    const safeX = vw < 640
      ? Math.max(0, (vw - elW) / 2)
      : Math.min(initialPos.x, Math.max(0, vw - elW))
    const safeY = Math.min(initialPos.y, Math.max(0, vh - elH))

    setPos({ x: safeX, y: safeY })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clampPos = useCallback((clientX: number, clientY: number) => {
    const el = dragRef.current
    const maxX = el ? window.innerWidth - el.offsetWidth : window.innerWidth
    const maxY = el ? window.innerHeight - el.offsetHeight : window.innerHeight
    return {
      x: Math.min(Math.max(0, clientX - offset.current.x), maxX),
      y: Math.min(Math.max(0, clientY - offset.current.y), maxY),
    }
  }, [])

  // Mouse drag handler
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragging.current) return
      setPos(clampPos(moveEvent.clientX, moveEvent.clientY))
    }

    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos, clampPos])

  // Touch drag handler
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    dragging.current = true
    offset.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y,
    }

    const onMove = (moveEvent: TouchEvent) => {
      if (!dragging.current) return
      moveEvent.preventDefault()
      const t = moveEvent.touches[0]
      setPos(clampPos(t.clientX, t.clientY))
    }

    const onEnd = () => {
      dragging.current = false
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }

    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
  }, [pos, clampPos])

  return { pos, dragRef, onMouseDown, onTouchStart }
}
