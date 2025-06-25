import {
  Card,
  FlexItem,
  FlowLayout,
  Link,
  StackLayout,
  Text,
} from "@salt-ds/core";
import blogImage from "../assets/Blog.png";
import communityIndexImage from "../assets/Com index.png";
import saltImage from "../assets/SaltDesignSystem.png";
import uitkImage from "../assets/UITK.png";

import "./HomePage.css";
import {Canvas} from '@react-three/fiber';
import {Suspense} from 'react';
import {OrbitControls, useGLTF} from '@react-three/drei';

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
  function Model({url, scale = 5, position = [0,2,0]}){
    // @ts-ignore
    const {scene} = useGLTF(url);
    scene.scale.set(scale,scale,scale);
    return (<group scale={[scale,scale,scale]} position={position}><primitive object={scene}/></group>);
  }

  return (
    <FlowLayout className="home-page" justify="center">
      <Canvas >
        <ambientLight intensity={0.5}/>
        <directionalLight position={[0,5,5]}/>
        <Suspense>
          <Model url={'/Char/scene.gltf'} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </FlowLayout>
  );
};

export default HomePage;
