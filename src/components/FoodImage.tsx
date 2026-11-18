import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

export function FoodImage({ src, alt, className, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  return failedSource === src
    ? <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`image-unavailable ${className ?? ''}`}>Image unavailable</div>
    : <img {...props} className={className} src={src} alt={alt} onError={() => setFailedSource(src)} />;
}
