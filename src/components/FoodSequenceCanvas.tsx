import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'motion/react'
import type { FoodStory } from '../data/foodStories'

type Props = {
  sequence: NonNullable<FoodStory['frameSequence']>
  progress: MotionValue<number>
  position: number
}

const MAX_FRAMES = 120

export function FoodSequenceCanvas({ sequence, progress, position }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = canvas.current
    const context = node?.getContext('2d', { alpha: false })
    if (!node || !context || sequence.count < 2) return
    const count = Math.min(MAX_FRAMES, sequence.count)
    const cacheLimit = navigator.hardwareConcurrency <= 4 ? 6 : 10
    const cache = new Map<number, HTMLImageElement>()
    const pending = new Map<number, HTMLImageElement>()
    const failed = new Set<number>()
    let visible = false
    let disposed = false
    let frame = 0
    let wanted = 0
    let shownFrame = -1

    function schedule() {
      if (!disposed && visible && !frame) frame = requestAnimationFrame(draw)
    }

    function load(index: number) {
      if (index < 0 || index >= count || cache.has(index) || pending.has(index) || failed.has(index)) return
      const image = new Image()
      pending.set(index, image)
      image.onload = () => {
        if (disposed) return
        pending.delete(index)
        cache.set(index, image)
        if (cache.size > cacheLimit) {
          const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted))[0]
          cache.delete(farthest)
        }
        schedule()
      }
      image.onerror = () => {
        pending.delete(index)
        failed.add(index)
        schedule()
      }
      image.src = `${sequence.directory}/${String(index + 1).padStart(3, '0')}.webp`
    }

    function draw() {
      frame = 0
      if (!node || !context || disposed || !visible) return
      const previous = wanted
      wanted = Math.round(Math.max(0, Math.min(1, progress.get())) * (count - 1))
      for (const [index, image] of pending) {
        if (Math.abs(index - wanted) <= 3) continue
        image.onload = image.onerror = null
        image.removeAttribute('src')
        pending.delete(index)
      }
      const direction = wanted < previous ? -1 : 1
      const neighborhood = [wanted, wanted + direction, wanted - direction]
      neighborhood.forEach(load)
      if (!pending.size) load(wanted + direction * 2)
      const nearest = neighborhood.find(index => cache.has(index))
      if (nearest === undefined) {
        if (shownFrame !== -1) { shownFrame = -1; setShown(false) }
        return
      }
      const image = cache.get(nearest)
      if (!image || !node.clientWidth || !node.clientHeight) return
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1440 / node.clientWidth)
      const width = Math.round(node.clientWidth * ratio)
      const height = Math.round(node.clientHeight * ratio)
      if (shownFrame === nearest && node.width === width && node.height === height) return
      if (node.width !== width) node.width = width
      if (node.height !== height) node.height = height
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const w = image.naturalWidth * scale
      const h = image.naturalHeight * scale
      context.drawImage(image, (width - w) * position, (height - h) / 2, w, h)
      if (shownFrame === -1) setShown(true)
      shownFrame = nearest
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .12 && !document.hidden
      schedule()
    }, { threshold: .12 })
    const resize = new ResizeObserver(schedule)
    const onVisibility = () => {
      if (document.hidden) { visible = false; return }
      const rect = node.getBoundingClientRect()
      visible = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top) >= rect.height * .12
      schedule()
    }
    intersection.observe(node)
    resize.observe(node)
    document.addEventListener('visibilitychange', onVisibility)
    const stop = progress.on('change', schedule)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      stop()
      resize.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      for (const image of pending.values()) {
        image.onload = image.onerror = null
        image.removeAttribute('src')
      }
      cache.clear()
      pending.clear()
    }
  }, [position, progress, sequence])

  return <canvas className="food-sequence-canvas" ref={canvas} aria-hidden="true" data-showing-frame={shown} />
}
