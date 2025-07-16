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
    name: "box",
    spriteSrc: "/assets/sprites/feline/cat/Box2.png",
    startFrame: 0,
    frameCount: 12,
    fps: 2,
    columns: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "excited",
    spriteSrc: "/assets/sprites/feline/cat/Excited.png",
    startFrame: 0,
    frameCount: 12,
    fps: 6,
    columns: 12,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "dance",
    spriteSrc: "/assets/sprites/feline/cat/Dance.png",
    startFrame: 0,
    frameCount: 4,
    fps: 2,
    columns: 4,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "eating",
    spriteSrc: "/assets/sprites/feline/cat/Eating.png",
    startFrame: 0,
    frameCount: 15,
    fps: 5,
    columns: 15,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "sleepy",
    spriteSrc: "/assets/sprites/feline/cat/Sleepy.png",
    startFrame: 0,
    frameCount: 8,
    fps: 2,
    columns: 8,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "idle",
    spriteSrc: "/assets/sprites/feline/cat/Idle.png",
    startFrame: 0,
    frameCount: 10,
    fps: 8,
    columns: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "idle",
    spriteSrc: "/assets/sprites/feline/cat/Idle.png",
    startFrame: 0,
    frameCount: 10,
    fps: 1,
    columns: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "idle",
    spriteSrc: "/assets/sprites/feline/cat/Idle.png",
    startFrame: 0,
    frameCount: 10,
    fps: 8,
    columns: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "idle",
    spriteSrc: "/assets/sprites/feline/cat/Idle.png",
    startFrame: 0,
    frameCount: 10,
    fps: 8,
    columns: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
  {
    name: "idle",
    spriteSrc: "/assets/sprites/feline/cat/Idle.png",
    startFrame: 0,
    frameCount: 10,
    fps: 8,
    columns: 10,
    frameWidth: 32,
    frameHeight: 32,
  },
];

const INTERVAL = 10000; // 10 seconds

const FelinePet: React.FC = () => {
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

export default FelinePet;
