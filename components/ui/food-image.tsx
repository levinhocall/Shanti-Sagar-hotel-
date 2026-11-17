import { useState, type ComponentProps } from 'react'
import { ImageOff } from 'lucide-react'

export function FoodImage({ src, alt, ...props }: ComponentProps<'img'>) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) return <div className="image-error" role="img" aria-label={alt}><ImageOff size={24}/><span>Image unavailable</span></div>
  const responsive = typeof src === 'string' && src.startsWith('/images/') && src.endsWith('.jpg')
  return <img srcSet={responsive ? `${src.replace('.jpg', '-480.jpg')} 480w, ${src.replace('.jpg', '-900.jpg')} 900w` : undefined} sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 45vw" {...props} src={src} alt={alt} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} data-loaded={loaded} />
}
