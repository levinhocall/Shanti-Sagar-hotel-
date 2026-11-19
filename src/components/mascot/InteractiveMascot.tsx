import { MascotRenderer } from './MascotRenderer';
import { useMascotController } from './use-mascot-controller';
import './mascot.css';

export function InteractiveMascot() {
  const controller = useMascotController();
  return <MascotRenderer {...controller} />;
}
