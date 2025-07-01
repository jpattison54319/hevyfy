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

import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';
import {OrbitControls, useGLTF} from '@react-three/drei';
import styles from "./HomePage.module.scss";

const HomePage = () => {
  
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

  // @ts-ignore
  function Model({url, scale = 2, position = [0,-2,0]}){
    // @ts-ignore
    const {scene} = useGLTF(url);
    scene.scale.set(scale,scale,scale);
    return (<group scale={[scale,scale,scale]} position={position}><primitive object={scene}/></group>);
  }

  return (
   <div style={{height: '100%', minHeight: '100%'}}>
    <FlexLayout style={{height: '100%', minHeight: '100%'}} justify="center" direction="column">
      <FlexItem align="center" style={{flexShrink: 0}}>
        <Text styleAs="h1" className={styles.homePageTitle}>
          Your Pet!
        </Text>
      </FlexItem>
      <FlexItem style={{flex: 1, minHeight: 0}}>
        <Canvas camera={{ position: [5, 4, 5], fov: 50 }}>
          <ambientLight intensity={0.5}/>
          <directionalLight position={[0,5,5]}/>
          <Suspense>
            <group rotation={[0, Math.PI, 0]}> {/* Rotate 180° around Y axis */}
              <Model url="/dog/scene.gltf" />
            </group>
          </Suspense>
          <OrbitControls />
        </Canvas>
      </FlexItem>
      <FlexItem className={styles.statusSection} style={{flexShrink: 0}}>
        <div className={styles.levelText}>Level 2</div>
        <div className={styles.xpBarWrapper}>
          <div className={styles.xpBarFill} style={{ width: '80%' }} />
        </div>
      </FlexItem>
    </FlexLayout>
  </div>
  );
};

export default HomePage;
