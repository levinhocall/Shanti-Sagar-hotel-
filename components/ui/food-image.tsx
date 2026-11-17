import { useState, type ComponentProps } from 'react'
import { ImageOff } from 'lucide-react'

export function FoodImage({ src, alt, ...props }: ComponentProps<'img'>) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) return <div className="image-error" role="img" aria-label={alt}><ImageOff size={24}/><span>Image unavailable</span></div>
  const responsive = typeof src === 'string' && src.startsWith('/images/') && /\.(webp|jpg)$/.test(src)
  const variant = (width: number) => src?.replace(/\.(webp|jpg)$/, `-${width}.$1`)
  const srcSet = responsive ? `${variant(480)} 480w, ${variant(900)} 900w${src === '/images/feast.webp' ? `, ${variant(1800)} 1800w` : ''}` : undefined
  return <img srcSet={srcSet} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 45vw" decoding="async" {...props} src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} data-loaded={loaded}/>
}
