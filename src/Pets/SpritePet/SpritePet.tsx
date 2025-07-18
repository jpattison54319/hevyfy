import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

type SpritePetProps = {
  spriteSrc: string;
  backgroundSrc?: string;
  frameWidth: number;
  frameHeight: number;
  frameCount?: number;
  frameIndex?: number;
  fps?: number;
  scale?: number;
  animated?: boolean;
  columns?: number;
  overrideScale?: boolean;
};

export const SpritePet: React.FC<SpritePetProps> = ({
  spriteSrc,
  backgroundSrc,
  frameWidth,
  frameHeight,
  frameCount = 1,
  frameIndex = 0,
  fps = 8,
  scale = 1,
  animated = false,
  columns = 4,
  overrideScale = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 300, height: 300 });
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(frameIndex);
  const [backgroundImage] = useImage(backgroundSrc || "");

  useEffect(() => {
    const img = new Image();
    img.src = spriteSrc;
    img.onload = () => setImage(img);
  }, [spriteSrc]);

  useEffect(() => {
    if (!animated || frameCount <= 1) return;
  
    setCurrentFrame(frameIndex); // Set to startFrame of selected animation
  
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const relative = (prev - frameIndex + 1) % frameCount;
        return frameIndex + relative;
      });
    }, 1000 / fps);
  
    return () => clearInterval(interval);
  }, [animated, frameCount, fps, frameIndex]);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const frame = animated ? currentFrame : frameIndex;
  const sx = (frame % columns) * frameWidth;
  const sy = Math.floor(frame / columns) * frameHeight;

  // Calculate the desired sprite dimensions
  const desiredSpriteWidth = frameWidth * scale;
  const desiredSpriteHeight = frameHeight * scale;

  // Add some padding to prevent the sprite from touching the container edges
  const containerPadding = 20; // Adjust this value as needed
  const availableWidth = containerSize.width - (containerPadding * 2);
  const availableHeight = containerSize.height - (containerPadding * 2);

  // Calculate the actual scale to fit within container bounds (with padding)
  const maxScaleX = availableWidth / frameWidth;
  const maxScaleY = availableHeight / frameHeight;
  const actualScale = overrideScale
  ? scale // use full scale, allow overflow if needed
  : Math.min(scale, maxScaleX, maxScaleY); // original bounded logic

  // Calculate actual sprite dimensions after scaling
  const actualSpriteWidth = frameWidth * actualScale;
  const actualSpriteHeight = frameHeight * actualScale;

  // Center the sprite within the container (accounting for padding)
  const x = (containerSize.width - actualSpriteWidth) / 2;
  const y = (containerSize.height - actualSpriteHeight) / 2;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: "100%", 
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <Stage 
        width={containerSize.width} 
        height={containerSize.height}
        style={{ 
          imageRendering: 'pixelated',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <Layer>
          {backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              x={0}
              y={0}
              width={containerSize.width}
              height={containerSize.height}
              listening={false}
            />
          )}
          {image && (
            <KonvaImage
              image={image}
              crop={{
                x: sx,
                y: sy,
                width: frameWidth,
                height: frameHeight,
              }}
              x={x}
              y={y}
              width={actualSpriteWidth}
              height={actualSpriteHeight}
              perfectDrawEnabled={false}
              listening={false}
              filters={[]}
              shadowForStrokeEnabled={false}
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default SpritePet;