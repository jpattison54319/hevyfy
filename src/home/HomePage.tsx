import {
  FlexItem,
  FlexLayout,
  Text,
} from "@salt-ds/core";
import {useEffect, useMemo, useRef, useState} from 'react';
import styles from "./HomePage.module.scss";
import { useUser } from "../context/UserContext";
import XpBar from "../xpbar/XpBar";
import { CalorieCurrencyContainer } from "../calorieResources/calorieCurrencyContainer";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import CaninePet from "../Pets/CaninePet/CaninePet";
import FelinePet from "../Pets/FelinePet/FelinePet";
import { Button } from "@headlessui/react";
import { kittenEvolutionLevels, kittenEvolutionMap, puppyEvolutionLevels, puppyEvolutionMap } from "../types/petEvolution.map";
import { PetStats, User } from "../types/user.types";
import { launchFireworks } from "../confettiFireworks";
import EvolutionAnimation from "../evolutionAnimation/EvolutionAnimation";
import api from "../api/api";


export function canEvolvePet(userData: User | null): boolean {
  if(!userData){
    return false;
  }
  const currentPet = userData.pet.currentPet;
  const currentLevel = userData.pet.level;

  const family = petFamilyMap[currentPet];
  if (!family) return false;

  const nextEvolution = puppyEvolutionMap[currentPet];
  if (!nextEvolution) return false; // already at final evolution

  const requiredLevel = getEvolutionLevels(family)[nextEvolution];
  return currentLevel >= requiredLevel;
}

export function getNextEvolution(pet: string): string | null {
  const family = petFamilyMap[pet];
  if (!family) return null;

  const map = getEvolutionMap(family);
  return map[pet] ?? null;
}

function getEvolutionMap(family: 'canine' | 'feline'): Record<string, string | null> {
  return family === 'canine' ? puppyEvolutionMap : kittenEvolutionMap;
}

function getEvolutionLevels(family: 'canine' | 'feline'): Record<string, number> {
  return family === 'canine' ? puppyEvolutionLevels : kittenEvolutionLevels;
}

export const petFamilyMap: Record<string, 'canine' | 'feline'> = {
  puppy: 'canine',
  fox: 'canine',
  wolf: 'canine',
  werewolf: 'canine',
  cerberus: 'canine',
  kitten: 'feline',
  'egyptian cat': 'feline',
  'astronaut cat': 'feline',
  'pirate cat': 'feline',
  'superhero cat': 'feline',
};

export function getPetArchetype(currentPet: string){
  return petFamilyMap[currentPet];
}



const HomePage = () => {
  const {userData, setUserData} = useUser(); // Assuming you have a UserContext to manage user data
  const [currencyBalance, setCurrencyBalance] = useState<number>(0);
  const [consumedCurrency, setConsumedCurrency] = useState<boolean[]>([]);
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const today = new Date().toLocaleDateString("sv-SE", { timeZone: userTimezone });
const total = userData?.goal?.dailyCurrencyTotal ?? 0;
const used = userData?.goal?.dailyCurrencyUsed?.[today] ?? 0;
const currencyBalance = total - used;
setCurrencyBalance(currencyBalance);
const newConsumedCurrency = Array(total)
    .fill(false)
    .map((_, i) => i >= currencyBalance);

  setConsumedCurrency(newConsumedCurrency);
}, [userData]);

  function handleEvolve(){
    console.log('evolving!!!!');
    setIsEvolving(true);
  }


  console.log('userData', userData); // Debug log to check if it's a cat model
  const petFamily = petFamilyMap[userData?.pet.currentPet ?? ''];

  const RenderedPet = petFamily === 'canine'
  ? <CaninePet currentPet={userData?.pet.currentPet ?? ''} />
  : <FelinePet currentPet={userData?.pet.currentPet ?? ''} />;

  return (
   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 , height: '100%' }}>
    <FlexLayout gap={0.5} style={{flex: 1, display: 'flex',height: '100%', minHeight: '100%'}} justify="center" direction="column">
      <FlexItem align="center" style={{flexShrink: 0}}>
        <Text styleAs="h1" className={styles.homePageTitle}>
          {userData?.pet.name}
        </Text>
      </FlexItem>
      <FlexItem style={{ maxWidth: "100%", padding: 16 }} shrink={1}>
        <CalorieCurrencyContainer userArchetype={petFamily} count={userData?.goal?.dailyCurrencyTotal ?? 0} consumedCurrency={consumedCurrency} />
      </FlexItem>
      <FlexItem grow={1} style={{flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', padding: '16px 16px'}}>
         <div style={{ width: '100%', height: '100%', border: '4px solid #00ffff', imageRendering: 'pixelated', boxShadow: '0 0 2px 2px #00ffff, 0 0 4px 2px #00ffff88, 0 0 8px 2px #00ffff88, 0 0 16px 2px #00ffff88' }}>
         {isEvolving ? (
        <EvolutionAnimation
        nextPet={getNextEvolution(userData?.pet.currentPet ?? '')}
        onComplete={async (stage: string) => {
          if (stage === 'complete') {
            const next = getNextEvolution(userData?.pet.currentPet ?? '');
            if (next && userData?._id) {
              try {
                const { data: updatedUser } = await api.post('/users/update', {
                  _id: userData._id,
                  pet: {
                    ...userData.pet,
                    currentPet: next,
                  },
                });
                setUserData(updatedUser);
      
                // Optionally update context/local state with new user
                // e.g., updateUser(updatedUser);
      
                setIsEvolving(false); // Exit evolution mode
                launchFireworks();    // 🔥 Fireworks
              } catch (err) {
                console.error('Failed to update pet evolution:', err);
                // Optionally show user feedback
              }
            }
        }}}
      />
    ) : (
      RenderedPet
    )}
        </div>
      </FlexItem>
      <FlexItem className={styles.statusSection} style={{flexShrink: 0}}>
        <XpBar currentXp={userData?.pet.xp ?? 0} level={userData?.pet.level ?? 0}></XpBar>
        {canEvolvePet(userData) && (
  <Button className={styles.evolveButton} onClick={handleEvolve}>
    Evolve to {getNextEvolution(userData?.pet.currentPet ?? '')?.toUpperCase()}!
  </Button>
)}
      </FlexItem>
    </FlexLayout>
  </div>
  );
};




export default HomePage;
