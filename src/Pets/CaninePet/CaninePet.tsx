import React, { useEffect, useState, useRef, useMemo } from "react";
import SpritePet from "../SpritePet/SpritePet";

type AnimationDefinition = {
  name: string;
  spriteSrc: string;
  startFrame: number;
  frameCount: number;
  fps: number;
  columns: number;
  frameWidth: number;
  frameHeight: number;
};

const canineAnimationsMap: Record<string, AnimationDefinition[]> = {
    puppy: [
        {
          name: "sit",
          spriteSrc: "/assets/sprites/canine/dog/HuskySitting.png",
          startFrame: 0,
          frameCount: 8,
          fps: 5,
          columns: 8,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "run",
          spriteSrc: "/assets/sprites/canine/dog/HuskyRun.png",
          startFrame: 0,
          frameCount: 6,
          fps: 3,
          columns: 6,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "sniff",
          spriteSrc: "/assets/sprites/canine/dog/HuskySniff.png",
          startFrame: 0,
          frameCount: 24,
          fps: 12,
          columns: 24,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "attack",
          spriteSrc: "/assets/sprites/canine/dog/HuskyAttack.png",
          startFrame: 0,
          frameCount: 15,
          fps: 5,
          columns: 15,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "bark",
          spriteSrc: "/assets/sprites/canine/dog/HuskyBark.png",
          startFrame: 0,
          frameCount: 10,
          fps: 5,
          columns: 10,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "die",
          spriteSrc: "/assets/sprites/canine/dog/HuskyDie.png",
          startFrame: 0,
          frameCount: 18,
          fps: 5,
          columns: 18,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "liedown",
          spriteSrc: "/assets/sprites/canine/dog/HuskyLieDown.png",
          startFrame: 0,
          frameCount: 12,
          fps: 4,
          columns: 12,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "sleep",
          spriteSrc: "/assets/sprites/canine/dog/HuskySleep.png",
          startFrame: 0,
          frameCount: 8,
          fps: 4,
          columns: 8,
          frameWidth: 64,
          frameHeight: 64,
        },
        {
          name: "idle",
          spriteSrc: "/assets/sprites/canine/dog/HuskyIdle.png",
          startFrame: 0,
          frameCount: 6,
          fps: 2,
          columns: 6,
          frameWidth: 64,
          frameHeight: 64,
        },
      ],
    fox: [
        {
          name: "attack",
          spriteSrc: "/assets/sprites/canine/fox/FoxAttack.png",
          startFrame: 0,
          frameCount: 8,
          fps: 5,
          columns: 8,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "die",
          spriteSrc: "/assets/sprites/canine/fox/FoxDie.png",
          startFrame: 0,
          frameCount: 5,
          fps: 5,
          columns:5,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "jump",
          spriteSrc: "/assets/sprites/canine/fox/FoxJump.png",
          startFrame: 0,
          frameCount: 10,
          fps: 5,
          columns: 10,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "sitting",
          spriteSrc: "/assets/sprites/canine/fox/FoxSitting.png",
          startFrame: 0,
          frameCount: 2,
          fps: 2,
          columns: 2,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "sleep",
          spriteSrc: "/assets/sprites/canine/fox/FoxSleep.png",
          startFrame: 0,
          frameCount: 4,
          fps: 2,
          columns: 4,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "walking",
          spriteSrc: "/assets/sprites/canine/fox/FixWalking.png",
          startFrame: 0,
          frameCount: 4,
          fps: 2,
          columns: 4,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "idle",
          spriteSrc: "/assets/sprites/canine/fox/FoxIdle.png",
          startFrame: 0,
          frameCount: 4,
          fps: 2,
          columns: 4,
          frameWidth: 32,
          frameHeight: 32,
        },
        {
          name: "idle",
          spriteSrc: "/assets/sprites/canine/fox/FoxIdle.png",
          startFrame: 0,
          frameCount: 4,
          fps: 2,
          columns: 4,
          frameWidth: 32,
          frameHeight: 32,
        },
      ],
    wolf: [
        {
        name: "one",
        spriteSrc: "/assets/sprites/canine/wolf/wolf_4.png",
        startFrame: 0,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 64,
        frameHeight: 64,
      },
      {
        name: "two",
        spriteSrc: "/assets/sprites/canine/wolf/wolf_4.png",
        startFrame: 6,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 64,
        frameHeight: 64,
      },
      {
        name: "three",
        spriteSrc: "/assets/sprites/canine/wolf/wolf_4.png",
        startFrame: 12,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 64,
        frameHeight: 64,
      },
      {
        name: "four",
        spriteSrc: "/assets/sprites/canine/wolf/wolf_4.png",
        startFrame: 18,
        frameCount: 6,
        fps: 3,
        columns: 6,
        frameWidth: 64,
        frameHeight: 64,
      },
    ],
    werewolf: [
        {
            name: "attack",
            spriteSrc: "/assets/sprites/canine/werewolf/ATTACK1.png",
            startFrame: 0,
            frameCount: 7,
            fps: 4,
            columns: 7,
            frameWidth: 158,
            frameHeight: 125,
          },
          {
            name: "attack2",
            spriteSrc: "/assets/sprites/canine/werewolf/ATTACK2.png",
            startFrame: 0,
            frameCount: 6,
            fps: 3,
            columns: 6,
            frameWidth: 158,
            frameHeight: 125,
          },
          {
            name: "death",
            spriteSrc: "/assets/sprites/canine/werewolf/DEATH.png",
            startFrame: 0,
            frameCount: 10,
            fps: 5,
            columns: 10,
            frameWidth: 158,
            frameHeight: 125,
          },
          {
            name: "idle",
            spriteSrc: "/assets/sprites/canine/werewolf/IDLE.png",
            startFrame: 0,
            frameCount: 6,
            fps: 3,
            columns: 6,
            frameWidth: 158,
            frameHeight: 125,
          },
          {
            name: "run",
            spriteSrc: "/assets/sprites/canine/werewolf/RUN.png",
            startFrame: 0,
            frameCount: 6,
            fps: 3,
            columns: 6,
            frameWidth: 158,
            frameHeight: 125,
          },
          {
            name: "run",
            spriteSrc: "/assets/sprites/canine/werewolf/TRANSFORMATION.png",
            startFrame: 0,
            frameCount: 8,
            fps: 4,
            columns: 8,
            frameWidth: 158,
            frameHeight: 125,
          },
    ],
    cerberus: [
        {
            name: "attack",
            spriteSrc: "/assets/sprites/canine/cerberus/ATTACK.png",
            startFrame: 0,
            frameCount: 6,
            fps: 3,
            columns: 6,
            frameWidth: 125,
            frameHeight: 100,
          },
          {
            name: "death",
            spriteSrc: "/assets/sprites/canine/cerberus/DEATH.png",
            startFrame: 0,
            frameCount: 7,
            fps: 4,
            columns: 7,
            frameWidth: 125,
            frameHeight: 100,
          },
          {
            name: "idle",
            spriteSrc: "/assets/sprites/canine/cerberus/IDLE.png",
            startFrame: 0,
            frameCount: 3,
            fps: 3,
            columns: 3,
            frameWidth: 125,
            frameHeight: 100,
          },
          {
            name: "run",
            spriteSrc: "/assets/sprites/canine/cerberus/RUN.png",
            startFrame: 0,
            frameCount: 3,
            fps: 3,
            columns: 3,
            frameWidth: 125,
            frameHeight: 100,
          },
    ],
  };


// Preload images
const preloadImages = (sources: string[]): Promise<void> => {
  return Promise.all(
    sources.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Handle errors gracefully
      });
    })
  ).then(() => {});
};

interface CaninePetProps {
    currentPet: string;
  }

  const CaninePet: React.FC<CaninePetProps> = ({ currentPet }) => {
    const animations = useMemo(() => canineAnimationsMap[currentPet] ?? canineAnimationsMap['puppy'], [currentPet]);
    const [currentAnim, setCurrentAnim] = useState<AnimationDefinition>(animations[0]);
  const [isLoaded, setIsLoaded] = useState(false);


  // Preload all images on mount
  useEffect(() => {
    const sources = Array.from(new Set(animations.map((anim) => anim.spriteSrc)));
    preloadImages(sources).then(() => {
      setIsLoaded(true);
    });
  }, []);

  // Dynamic interval for animation switching
  useEffect(() => {
    if (!isLoaded) return;
  
    let timeoutId: NodeJS.Timeout;
  
    const runAnimationLoop = () => {
      const random = animations[Math.floor(Math.random() * animations.length)];
      setCurrentAnim(random);
  
      const duration = (random.frameCount / random.fps) * 1000 * 2; // Play twice
  
      timeoutId = setTimeout(runAnimationLoop, duration);
    };
  
    runAnimationLoop();
  
    return () => clearTimeout(timeoutId);
  }, [isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optional loading state
  }

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
      scale={4}
      animated={true}
    />
  );
};

export default CaninePet;