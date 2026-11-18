import { useState } from 'react';
import type { ImgHTMLAttributes, SourceHTMLAttributes } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  source?: SourceHTMLAttributes<HTMLSourceElement>;
};

export function FoodImage({ src, alt, className, source, ...props }: Props) {
  const [failedSource, setFailedSource] = useState<string>();
  if (failedSource === src) {
    return <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`image-unavailable ${className ?? ''}`}>Image unavailable</div>;
  }

  const image = <img {...props} className={className} src={src} alt={alt} onError={() => setFailedSource(src)} />;
  return source ? <picture><source {...source} />{image}</picture> : image;
}
