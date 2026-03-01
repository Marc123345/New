import { HookAct } from './about/HookAct';
import { PhilosophyAct } from './about/PhilosophyAct';
import { OrbitalAct } from './about/OrbitalAct';

export function AboutStory() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: '#030303' }}
    >
      <HookAct />
      <PhilosophyAct />
      <OrbitalAct />
    </section>
  );
}
