import React, { useEffect, useMemo, useState } from "react";
import SpritePet from "../../Pets/SpritePet/SpritePet";

interface AnimationDefinition {
  name: string;
  spriteSrc: string;
  startFrame: number;
  frameCount: number;
  fps: number;
  columns: number;
  frameWidth: number;
  frameHeight: number;
  scale: number;
}

interface AnimatedBossProps {
  bossKey: string; // kebab-case like "dwarf-warrior"
  animations: Record<string, AnimationDefinition[]>;
  isDead?: boolean;
}

const preloadImages = (sources: string[]): Promise<void> => {
  return Promise.all(
    sources.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // ignore errors for now
      });
    })
  ).then(() => {});
};

const AnimatedBoss: React.FC<AnimatedBossProps> = ({ bossKey, animations, isDead }) => {
  const bossAnimations = useMemo(() => animations[bossKey] ?? [], [bossKey, animations]);
  const [currentAnim, setCurrentAnim] = useState<AnimationDefinition | null>(bossAnimations[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sources = Array.from(new Set(bossAnimations.map((anim) => anim.spriteSrc)));
    preloadImages(sources).then(() => setIsLoaded(true));
  }, [bossAnimations]);

  useEffect(() => {
    if (!isLoaded || bossAnimations.length === 0) return;

    if (isDead) {
        const deathAnim = bossAnimations.find((a) => a.name === 'death');
        if (deathAnim) {
          setCurrentAnim(deathAnim);
        }
        return; // 🔒 prevent loop from running
      }

    let timeoutId: NodeJS.Timeout;

    const loop = () => {
        const filtered = bossAnimations.filter(a => a.name !== 'death'); // skip death
        const random = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentAnim(random);
      timeoutId = setTimeout(loop, (random.frameCount / random.fps) * 1000 * 2);
    };

    loop();
    return () => clearTimeout(timeoutId);
  }, [isLoaded, bossAnimations, isDead]);

  if (!isLoaded || !currentAnim) return <div>Loading boss...</div>;

  return (
    <SpritePet
      spriteSrc={currentAnim.spriteSrc}
      backgroundSrc="/assets/backgrounds/grass.png"
      frameWidth={currentAnim.frameWidth}
      frameHeight={currentAnim.frameHeight}
      frameCount={currentAnim.frameCount}
      frameIndex={currentAnim.startFrame}
      fps={currentAnim.fps}
      columns={currentAnim.columns}
      scale={currentAnim.scale}
      animated={currentAnim.fps > 0}
      overrideScale
    />
  );
};

export default AnimatedBoss;
