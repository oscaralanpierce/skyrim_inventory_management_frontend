import { useState, useRef, useEffect } from 'react'

const useComponentVisible = () => {
  const [isComponentVisible, setIsComponentVisible] = useState(false)
  const componentRef = useRef<any>(null)
  const triggerRef = useRef<any>(null)

  const componentRefContains = (element: Node) =>
    componentRef.current?.contains(element)
  const triggerRefContains = (element: Node) =>
    triggerRef.current?.contains(element)

  const handleHideComponent = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsComponentVisible(false)
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node

    if (!componentRefContains(target) && !triggerRefContains(target)) {
      setIsComponentVisible(false)
    } else if (triggerRefContains(target)) {
      setIsComponentVisible(!isComponentVisible)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleHideComponent, true)
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('keydown', handleHideComponent, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { componentRef, triggerRef, isComponentVisible, setIsComponentVisible }
}

export default useComponentVisible
