import { useState, useLayoutEffect, type RefObject } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

const useSize = (target: RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    setSize(target.current?.getBoundingClientRect() || null)
  }, [target])

  useResizeObserver(target, (entry) => setSize(entry.contentRect))

  return size
}

export default useSize
