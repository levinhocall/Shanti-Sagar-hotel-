import { useCallback, useEffect, useRef, useState } from 'react'
import { dishes, photography } from '../data'
export type Panel = { kind: 'dish' | 'gallery'; id: string }
function readPanel(): Panel | null {
  const search = new URLSearchParams(location.search)
  const dish = search.get('dish'); const gallery = search.get('gallery')
  if (dish && dishes.some(item => item.id === dish)) return { kind: 'dish', id: dish }
  if (gallery && photography.some(item => item.id === gallery)) return { kind: 'gallery', id: gallery }
  return null
}
export function useExplorer() {
  const [panel, setPanel] = useState<Panel | null>(readPanel)
  const trigger = useRef<HTMLElement | null>(null)
  const scroll = useRef(0)
  const restoreFrame = useRef<number | null>(null)
  useEffect(() => {
    const onPop = () => setPanel(readPanel())
    window.addEventListener('popstate', onPop)
    return () => { window.removeEventListener('popstate', onPop); if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current) }
  }, [])
  const open = useCallback((next: Panel, element: HTMLElement) => {
    trigger.current = element; scroll.current = window.scrollY
    const url = new URL(location.href)
    url.searchParams.delete('dish'); url.searchParams.delete('gallery'); url.searchParams.set(next.kind, next.id)
    history.pushState({ ...history.state, shantiPanel: true }, '', url)
    setPanel(next)
  }, [])
  const close = useCallback(() => {
    if (history.state?.shantiPanel) { history.back(); return }
    const url = new URL(location.href)
    url.searchParams.delete('dish'); url.searchParams.delete('gallery')
    history.replaceState(history.state, '', url); setPanel(null)
  }, [])
  const change = useCallback((next: Panel) => {
    const url = new URL(location.href); url.searchParams.set(next.kind, next.id)
    history.replaceState(history.state, '', url); setPanel(next)
  }, [])
  const restore = useCallback(() => {
    if (!trigger.current) return
    if (restoreFrame.current !== null) cancelAnimationFrame(restoreFrame.current)
    // Native fragment-history navigation can move focus after popstate. Wait
    // until that work and the native dialog close have settled before restoring.
    restoreFrame.current = requestAnimationFrame(() => {
      restoreFrame.current = requestAnimationFrame(() => {
        window.scrollTo({ top: scroll.current, behavior: 'instant' })
        trigger.current?.focus({ preventScroll: true })
        restoreFrame.current = null
      })
    })
  }, [])
  return { panel, open, close, change, restore }
}
