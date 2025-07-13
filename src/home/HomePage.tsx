import {
  Card,
  FlexItem,
  FlexLayout,
  FlowLayout,
  Link,
  StackLayout,
  Text,
} from "@salt-ds/core";
import blogImage from "../assets/Blog.png";
import communityIndexImage from "../assets/Com index.png";
import saltImage from "../assets/SaltDesignSystem.png";
import uitkImage from "../assets/UITK.png";
import { Box3, Vector3, Object3D, Group, DoubleSide, WebGLRenderer, PerspectiveCamera } from 'three';
import type { OrbitControls as ThreeOrbitControls } from 'three-stdlib';

import {Canvas, useThree} from '@react-three/fiber';
import {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {Bounds, OrbitControls, useGLTF, useTexture} from '@react-three/drei';
import styles from "./HomePage.module.scss";
import { useUser } from "../context/UserContext";
import type { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import XpBar from "../xpbar/XpBar";
import { CalorieCurrencyContainer } from "../calorieResources/calorieCurrencyContainer";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';



const HomePage = () => {
  const {userData, setUserData} = useUser(); // Assuming you have a UserContext to manage user data
  //const [modelPath, setModelPath] = useState<string>('');
  const [currencyBalance, setCurrencyBalance] = useState<number>(0);
  const [consumedCurrency, setConsumedCurrency] = useState<boolean[]>([]);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  //let isModelKitten = false;
  const petTypeMap: Record<string, string> = {
    'puppy': '/puppy/scene.gltf',
    'kitten': '/kitten/scene.gltf',
  }
  const petType = userData?.pet?.currentPet ?? 'puppy';
  const modelPath = useMemo(() => petTypeMap[petType], [petType]);
const isModelKitten = useMemo(() => petType === 'kitten', [petType]);
  // useEffect(() => {
  //   setModelPath(petTypeMap[userData?.pet?.currentPet ?? 'puppy']);
  //   isModelKitten = modelPath?.includes('kitten');
  // }, [userData]);

  useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);
const total = userData?.goal?.dailyCurrencyTotal ?? 0;
const used = userData?.goal?.dailyCurrencyUsed?.[today] ?? 0;
const currencyBalance = total - used;
setCurrencyBalance(currencyBalance);
const newConsumedCurrency = Array(total)
    .fill(false)
    .map((_, i) => i >= currencyBalance);

  setConsumedCurrency(newConsumedCurrency);
}, [userData]);

  //const modelPath = petTypeMap[userData?.pet?.currentPet ?? 'puppy'];
  console.log('Model Path:', modelPath); // Debug log to check the model path
  


  //@ts-ignore
  // function Model({url, scale = 2, position = [0,-2,0]}){
  //   // @ts-ignore
  //   const {scene} = useGLTF(url);
  //   //scene.scale.set(scale,scale,scale);
  //   return (<primitive object={scene}/>);
  // }

  function Model({ url, scale = 2, position = [0, -2, 0], rotation = [0, 0, 0], modelRef }: {
    url: string;
    scale?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    modelRef: React.RefObject<Object3D>;
  }) {
    const gltf = useGLTF(url) as { scene: Object3D };
  
    const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  
    return (
      <primitive
        ref={modelRef as React.Ref<any>}
        object={clonedScene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    );
  }

//   function Model({ url, scale = 1 }) {
//     const ref = useRef<Group>(null);
//     // @ts-ignore
//     const { scene } = useGLTF(url);

//   useEffect(() => {
//     if (!ref.current) return;

//     const box = new Box3().setFromObject(ref.current);
//     const size = new Vector3();
//     const center = new Vector3();

//     box.getSize(size);
//     box.getCenter(center);

//     // Reposition model so it's centered
//     ref.current.position.x = ref.current.position.x - center.x;
//     ref.current.position.y = ref.current.position.y - center.y;
//     ref.current.position.z = ref.current.position.z - center.z;
//   }, [scene]);

//   return (
//     <group ref={ref}>
//       <primitive object={scene} />
//     </group>
//   );
// }


  console.log('userData', userData); // Debug log to check if it's a cat model
  return (
   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 , height: '100%' }}>
    <FlexLayout gap={0.5} style={{flex: 1, display: 'flex',height: '100%', minHeight: '100%'}} justify="center" direction="column">
      <FlexItem align="center" style={{flexShrink: 0}}>
        <Text styleAs="h1" className={styles.homePageTitle}>
          {userData?.pet.name}
        </Text>
      </FlexItem>
      <FlexItem style={{ maxWidth: "100%", padding: 16 }} shrink={1}>
        <CalorieCurrencyContainer userArchetype={userData?.pet.currentPet ?? 'puppy'} count={userData?.goal?.dailyCurrencyTotal ?? 0} consumedCurrency={consumedCurrency} />
      </FlexItem>
      <FlexItem grow={1} style={{flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', padding: '16px 16px'}}>
         <div style={{ width: '100%', height: '100%', border: '4px solid #00ffff', imageRendering: 'pixelated', boxShadow: '0 0 2px 2px #00ffff, 0 0 4px 2px #00ffff88, 0 0 8px 2px #00ffff88, 0 0 16px 2px #00ffff88' }}>
         <Canvas
  resize={{ polyfill: ResizeObserver }}
  camera={{ position: [2, 0, 4], fov: 100 }}
  gl={(canvas) => {
    const gl = new WebGLRenderer({ canvas, alpha: true });
    gl.setClearColor('#87ceeb', 1);
    return gl;
  }}
>
  <ambientLight intensity={0.5} />
  <directionalLight position={[0, 5, 5]} />
  <Scene modelPath={modelPath} isKitten={isModelKitten} />
  <OrbitControls  ref={orbitControlsRef}
  maxPolarAngle={Math.PI / 1.5} // Prevents looking below the ground
  minDistance={3}                // Prevents zooming in too close
  maxDistance={10}  />
</Canvas>
        </div>
      </FlexItem>
      <FlexItem className={styles.statusSection} style={{flexShrink: 0}}>
        <XpBar currentXp={userData?.pet.xp ?? 0} level={userData?.pet.level ?? 0}></XpBar>
        {/* <div className={styles.levelText}>Level {userData?.pet.level}</div>
        <div className={styles.xpBarWrapper}>
          <div className={styles.xpBarFill} style={{ width: '80%' }} />
        </div> */}
      </FlexItem>
    </FlexLayout>
  </div>
  );
};

type FitCameraProps = {
  modelRef: React.RefObject<Object3D>;
};

const FitCameraToModel = ({ modelRef }: FitCameraProps) => {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!modelRef.current) return;

    const box = new Box3().setFromObject(modelRef.current);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    if ('fov' in camera) {
      const perspectiveCamera = camera as PerspectiveCamera;
      const fov = (perspectiveCamera.fov * Math.PI) / 180;
      const maxDim = Math.max(size.x, size.y, size.z);
      const rawDistance = maxDim / (2 * Math.tan(fov / 2));
const distance = Math.max(rawDistance * 2, 5); // Zooms out more + minimum distance of 5

perspectiveCamera.position.set(
  center.x + distance * 0.6,
  center.y + distance * 0.6,
  center.z + distance * 0.6
);
      perspectiveCamera.lookAt(center);

      const orbitControls = controls as unknown as OrbitControlsImpl;
      if (orbitControls?.target && typeof orbitControls.update === 'function') {
        orbitControls.target.copy(center);
        orbitControls.update();
      }
    }
  }, [modelRef, camera, controls]);

  return null;
};

function Scene({ modelPath, isKitten }: { modelPath: string; isKitten: boolean }) {
  const [aoMap, colorMap, normalMap, roughnessMap] = useTexture([
    '/assets/grass/AmbientOcclusion.jpg',
    '/assets/grass/Color.jpg',
    '/assets/grass/NormalGL.jpg',
    '/assets/grass/Roughness.jpg',
  ]);
  console.log(isKitten);
  const gltf = useGLTF(modelPath) as { scene: Object3D };
  const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const modelRef = useRef<Object3D>(null);
  return (
    <Suspense fallback={null}>
      {/* <Bounds fit clip observe margin={1.2}> */}
        <primitive
          ref={modelRef as React.Ref<Object3D>}
          object={clonedScene}
          scale={0.8}
          position={[0, -3.5, 0]}
          rotation={isKitten ? [0, Math.PI, 0] : [0, 0, 0]}
        />
        <FitCameraToModel modelRef={modelRef} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            roughnessMap={roughnessMap}
            aoMap={aoMap}
            side={DoubleSide}
          />
        </mesh>
      {/* </Bounds> */}
    </Suspense>
  );
}



export default HomePage;
