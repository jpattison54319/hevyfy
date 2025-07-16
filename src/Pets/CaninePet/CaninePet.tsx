// CanineSpritePet.tsx
import React, { useEffect, useState } from "react";
import SpritePet from "../SpritePet/SpritePet"; // Assumes SpritePet is default export

// Define the animations with frame metadata
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

const animations: AnimationDefinition[] = [
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
    name: "sit",
    spriteSrc: "/assets/sprites/canine/dog/HuskySitting.png",
    startFrame: 0,
    frameCount: 8,
    fps: 4,
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
];

const INTERVAL = 10000; // 10 seconds

const CaninePet: React.FC = () => {
  const [currentAnim, setCurrentAnim] = useState<AnimationDefinition>(animations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = animations[Math.floor(Math.random() * animations.length)];
      setCurrentAnim(random);
    }, INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <SpritePet
      spriteSrc={currentAnim.spriteSrc}
      backgroundSrc="/assets/backgrounds/grass.png"
      frameWidth={currentAnim.frameWidth}
      frameHeight={currentAnim.frameHeight}
      frameCount={currentAnim.frameCount}
      fps={currentAnim.fps}
      animated={true}
      columns={currentAnim.columns}
      scale={4}
    />
  );
};

export default CaninePet;
