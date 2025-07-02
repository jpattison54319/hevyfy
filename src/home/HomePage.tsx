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
import { Box3, Vector3, Object3D, Group } from 'three';
import type { OrbitControls as ThreeOrbitControls } from 'three-stdlib';

import {Canvas, useThree} from '@react-three/fiber';
import {Suspense, useEffect, useRef} from 'react';
import {Bounds, OrbitControls, useGLTF} from '@react-three/drei';
import styles from "./HomePage.module.scss";
import { useUser } from "../context/UserContext";
import type { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import XpBar from "../xpbar/XpBar";

const HomePage = () => {



  const {userData, setUserData} = useUser(); // Assuming you have a UserContext to manage user data

  const petTypeMap: Record<string, string | null> = {
    'puppy': '/puppy/scene.gltf',
    'kitten': '/kitten/scene.gltf',
  }

  const modelPath = petTypeMap[userData?.pet?.currentPet ?? 'puppy'];
  const isCatModel = modelPath?.includes('kitten');
  console.log('Model Path:', modelPath); // Debug log to check the model path
  
  const cardsData = [
    {
      name: "Salt design system",
      image: saltImage,
      description:
        "Checkout our website to learn more about the design system.",
      goLink: "go/salt-ds",
    },
    {
      name: "Community Index",
      image: communityIndexImage,
      description: "An index of prior art built with Salt.",
      goLink: "go/community-index",
    },
    {
      name: "UITK Migration Guides",
      image: uitkImage,
      description:
        "Read component-by-component guides if you're migrating from UI Toolkit.",
      goLink: "go/saltds-migration",
    },
    {
      name: "Journey from UITK to Salt",
      image: blogImage,
      description:
        "A personal story around the journey from UI Toolkit to Salt from Mark Tate on Modem.",
      goLink: "go/whysalt",
    },
  ] as const;

  //@ts-ignore
  // function Model({url, scale = 2, position = [0,-2,0]}){
  //   // @ts-ignore
  //   const {scene} = useGLTF(url);
  //   //scene.scale.set(scale,scale,scale);
  //   return (<primitive object={scene}/>);
  // }

   function Model({ url, scale = 2, position = [0, -2, 0], rotation = [0, 0, 0] }) {
  const gltf = useGLTF(url) as { scene: Object3D };
  return <primitive object={gltf.scene} scale={scale} position={position} rotation={rotation} />;
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


function FitCameraToModel({ modelRef }: { modelRef: React.RefObject<Group> }) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!modelRef.current) return;

    const box = new Box3().setFromObject(modelRef.current);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    // Fit camera distance (simple version)
    const maxDim = Math.max(size.x, size.y, size.z);

    // Only proceed if camera is PerspectiveCamera (has fov)
    if ('fov' in camera && typeof camera.fov === 'number') {
      const fov = camera.fov * (Math.PI / 180);
      const distance = maxDim / (2 * Math.tan(fov / 2));
      camera.position.set(center.x, center.y, center.z + distance * 1.5);
      camera.lookAt(center);
    }

    const orbitControls = controls as unknown as ThreeOrbitControls | undefined;
   // const orbitControls = controls as unknown as DreiOrbitControls | undefined;
    if (orbitControls) {
      orbitControls.target.copy(center);
      orbitControls.update();
    }
  }, [modelRef]);

  return null;
}
  console.log('is Cat Model:', isCatModel); // Debug log to check if it's a cat model
  return (
   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 , height: '100%' }}>
    <FlexLayout style={{flex: 1, display: 'flex',height: '100%', minHeight: '100%'}} justify="center" direction="column">
      <FlexItem align="center" style={{flexShrink: 0}}>
        <Text styleAs="h1" className={styles.homePageTitle}>
          {userData?.pet.name}
        </Text>
      </FlexItem>
      <FlexItem grow={1} style={{flex: 1, minHeight: 0, height: '100%', overflow: 'hidden'}}>
         <div style={{ width: '100%', height: '100%' }}>
        <Canvas resize={{ polyfill: ResizeObserver }}  camera={{ position: [5, 4, 5], fov: 50 }}>
          <ambientLight intensity={0.5}/>
          <directionalLight position={[0,5,5]}/>
          <Suspense>
             <Bounds fit clip observe margin={1.2}>
            {/* <group rotation={[0, Math.PI, 0]}> Rotate 180° around Y axis */}
              {/* <Model url={modelPath} /> */}
              <Model
          url={modelPath}
          scale={.8} // Same scale for both models
          position={isCatModel ? [0, -3, 0] : [0, -2, 0]} // Lower cat model
          rotation={isCatModel ? [0, Math.PI, 0] : [0, 0, 0]} // Rotate cat 180° around Y-axis
        />
            {/* </group> */}
            </Bounds>
          </Suspense>
          <OrbitControls />
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

export default HomePage;
