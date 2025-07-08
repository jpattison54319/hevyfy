import {
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Text,
  StackLayout,
  Panel,
  Input,
  Dropdown,
  Option,
  Spinner,
} from "@salt-ds/core";
import { useEffect, useState } from "react";
import RpeSelector, { PetType } from "../RpeSelector/RpeSelector";
import { useUser } from "../context/UserContext";
import { LoggedWorkout } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import api from "../api/api";
import { WorkoutLoggedToast } from "../WorkoutLoggedToast/WorkoutLoggedToast";
import { useToast } from "../context/ToastContext";
import Emoji from "../Emoji/Emoji";
import styles from './WorkoutLogger.module.scss'
import { useSplashScreen } from "../context/SplashScreen";

const RPE_XP_MULTIPLIER: Record<number, number> = {
  1: 0.5,   // very light
  2: 1.0,   // moderate
  3: 1.5,   // hard
  4: 2.2,   // near maximal
};

export const WorkoutLogger = ({ setDrawerView }: { setDrawerView: React.Dispatch<React.SetStateAction<"none" | "logFood" | "logWorkout" | "workoutHist" | "mealHist">> }) => {
  const {userData, setUserData} = useUser();
  const {addToast} = useToast();
  const { showSplash } = useSplashScreen();
  const [loading, setLoading] = useState<boolean>(false);
  const [workoutType, setWorkoutType] = useState<string>('WEIGHTS');
  const [cardioMode, setCardioMode] = useState("DURATION");
  const [distance, setDistance] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");  
  const [rpe, setRpe] = useState(null);
  const [notes, setNotes] = useState("");
  const workoutTypes = ['WEIGHTS', 'CARDIO', 'MOBILITY', 'SPORT'];
  const cardioModes = ['DURATION', 'DISTANCE'];
  const [showToast, setShowToast] = useState<boolean>(false);
const hoursOptions = Array.from({ length: 12 }, (_, i) => i);
const minutesOptions = Array.from({ length: 60 }, (_, i) => i);
const [workoutXp, setWorkoutXp] = useState({
  strength: 0,
  agility: 0,
  pet: 0,
});

console.log(durationHours);
console.log(rpe);

function updateWorkoutXp(){
const totalDuration = (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0);
  console.log('totalDuration ', totalDuration );
   const rpeMultiplier = RPE_XP_MULTIPLIER[rpe ?? 2];
  let totalXp = 0;

  if (totalDuration > 0) {
    totalXp = Math.round(totalDuration * 10 * rpeMultiplier); // 10 XP/min base
  } else if (Number(distance) > 0) {
    totalXp = Math.round(Number(distance) * 125 * rpeMultiplier); // 125 XP/mile base
  }

  console.log('totalXp ', totalXp);


  let strength = 0;
  let agility = 0;

  switch (workoutType) {
    case 'WEIGHTS':
      strength = Math.round(totalXp / 100);
      break;
    case 'CARDIO':
      agility = Math.round(totalXp / 100);
      break;
    case 'MOBILITY':
    case 'SPORT':
      const rawStrength = totalXp / 2 / 100;
  const rawAgility = totalXp / 2 / 100;
  strength = Math.round(rawStrength);
  agility = Math.round(rawAgility);
  break;
  }
  console.log('final ',{strength: strength, agility: agility, pet: totalXp});
  return {strength: strength, agility: agility, pet: totalXp};

}

const isFormValid = workoutTypes.includes(workoutType) && cardioModes.includes(cardioMode)
&& (distance !== '' || (durationHours !== '' || durationMinutes !== '')) && rpe !== null;

function clearForm(){
      setDistance("");
      setDurationHours("");
      setDurationMinutes("");
      setRpe(null);
      setNotes("");
      setWorkoutType("WEIGHTS");
      setCardioMode("DURATION");
}

const handleLogWorkout = async () => {
    const updatedWorkoutXp = updateWorkoutXp();
    setWorkoutXp(updatedWorkoutXp);
    if (!userData || !userData.uid) {
      alert("User not loaded properly.");
      return;
    }

    const durationMinutesTotal =
      cardioMode === "DURATION"
        ? (Number(durationHours) || 0) * 60 + (Number(durationMinutes) || 0)
        : 0;
    

    try {
     const {data} = await api.post(`/users/${userData.uid}/addWorkout`, {
  workoutType,
  cardioMode,
  duration: durationMinutesTotal,
  distance: cardioMode === "DISTANCE" ? Number(distance) || 0 : 0,
  rpe: rpe!,
  notes,
  workoutXp: updatedWorkoutXp,
});

      setUserData(data.updatedUser);
      clearForm();
        addToast({
      content: (
        <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        backgroundColor: "#1c1c1c",
        border: "3px solid #ffa640",
        color: "#FFFDD0",
        fontFamily: "'Press Start 2P', monospace, sans-serif",
        fontSize: 17,
        textTransform: "uppercase",
        boxShadow: "0 0 8px #ffa640",
        borderRadius: 8,
      }}>
        <Emoji size={32} symbol="🏋️‍♂️"/>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 4 }}>WORKOUT LOGGED!</div>
        <div style={{ fontSize: 15, color: "#ccc" }}>
          +{updatedWorkoutXp.pet} PET XP
        </div>
        {(updatedWorkoutXp.strength > 0 && updatedWorkoutXp.agility > 0 ? (
          <>
          <div style={{ fontSize: 15, color: "#ccc" }}>
          +{updatedWorkoutXp.strength} STRENGTH
        </div>
            <div style={{ fontSize: 15, color: "#ccc" }}>
          +{updatedWorkoutXp.agility} AGILITY
        </div>
        </>
      )
      : updatedWorkoutXp.strength > 0 ?
      (
         <div style={{ fontSize: 15, color: "#ccc" }}>
          +{updatedWorkoutXp.strength} STRENGTH
        </div>
        )
      :
      (
        <div style={{ fontSize: 15, color: "#ccc" }}>
          +{updatedWorkoutXp.agility} AGILITY
        </div>
      )
      )}
      </div>
      </div>
      ),
      duration: 5000,
    });

        setDrawerView("none");
  setTimeout(() => {
    if (data.levelUp) {
      showSplash({
        content: (
          <div className={styles.levelUpContainer}>
        <div className={styles.emoji}>🎉✨🎊✨🎉</div>
        <div className={styles.levelText}>LEVEL UP!</div>
        <div className={styles.levelNumber}>LEVEL {data.updatedUser.pet.level}</div>
        <div className={styles.celebration}>Amazing Progress!</div>
    </div>
    ),
        style: {
          background: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, #16213e 50%, #0f0f23 100%),repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.03) 2px,rgba(0,255,0,0.03) 4px)',
             display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',

        },
      });
    }
    }, 5000); // match your drawer closing animation duration

//     if (data.levelUp) {
//   addToast({
//     content: (
//           <div className={styles.levelUpContainer}>
//         <div className={styles.emoji}>🎉✨🎊✨🎉</div>
//         <div className={styles.levelText}>LEVEL UP!</div>
//         <div className={styles.levelNumber}>LEVEL {data.updatedUser.pet.level}</div>
//         <div className={styles.celebration}>Amazing Progress!</div>
//     </div>
//     ),
//     duration: 8000,
//   });
// }
      //setShowToast(true);
    } catch (error) {
      console.error(error);
      alert("There was an error logging your workout.");
    }
  };

  if(loading){
    
  return (
    <Panel
      style={{
        overflowX: 'hidden',
        margin: "auto",
        padding: 0.
      }}
    >
      <Spinner size='large' aria-label="loading" role="status"></Spinner>
    </Panel>
  );
}
  

  return (
    <Panel
      style={{
        overflowX: 'hidden',
        margin: "auto",
        padding: 0.
      }}
    >
      <WorkoutLoggedToast open={showToast} onClose={() => setShowToast(false)} />

      <Text styleAs="h1" style={{fontSize: '20px',  color: "#ffa640", paddingBottom: 16, fontFamily: "'Press Start 2P', Pixelify Sans", }}>
        LOG YOUR WORKOUT
      </Text>

      <Text style={{ color: "#FFFDD0", paddingBottom: 4, fontSize: '17px', fontFamily: 'Open Sans' }}>WORKOUT TYPE</Text>
      <ToggleButtonGroup
        value={workoutType ?? ''}
        onChange={(event) => setWorkoutType((event.currentTarget as HTMLButtonElement).value)}
          style={{
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    gap: 8,
    marginBottom: 16,
  }}
      >
       {workoutTypes.map((type) => (
        <ToggleButton
          key={type}
          value={type}
          style={{
            fontSize: '14px',
          fontFamily: '"Open Sans", sans-serif',
           flexShrink: 1, // allows it to compress
        whiteSpace: "nowrap", // stops label from breaking liness

        }}
        >
          {type}
          </ToggleButton>
))}
      </ToggleButtonGroup>

      {workoutType === "CARDIO" && (
        <>
          <Text style={{ color: "#FFFDD0", paddingBottom: 4, fontSize: '17px', fontFamily: 'Open Sans' }}>CARDIO MODE</Text>
          <ToggleButtonGroup
            value={cardioMode ?? ''}
            onChange={(event) => {setCardioMode((event.currentTarget as HTMLButtonElement).value); setDistance(''); setDurationHours(''); setDurationMinutes('');}}
            style={{ marginBottom: 16 }}
          >
            {cardioModes.map((mode) => (
  <ToggleButton
    key={mode}
    value={mode}
    appearance={mode === "WEIGHTS" ? "solid" : undefined}
    style={{
       fontSize: '14px',
          fontFamily: '"Open Sans", sans-serif',
    }}
  >
    {mode}
  </ToggleButton>
))}
          </ToggleButtonGroup>
        </>
      )}

       {cardioMode === "DISTANCE" && workoutType === 'CARDIO' ? (
        <div style={{padding: '0 0 16px 0'}}>
          <Text style={{ color: "#fcefcf", marginBottom: 4 }}>Distance (miles)</Text>
          <Input
            style={{padding: '0 4px 8px 4px', fontSize: '17px'}}
            value={distance}
            onChange={(e) => setDistance((e.target as HTMLInputElement).value)}
            placeholder="e.g. 3.2"
          />
        </div>
      ) : (
        <div style={{padding: '0 0 16px 0'}}>
          <Text style={{ color: "#fcefcf", marginBottom: 4 }}>Duration</Text>
          <StackLayout direction="row" gap={2}>
            <Dropdown
              value={durationHours + ' hr(s)'}
              onSelectionChange={(event, newSelected) => setDurationHours(newSelected[0] ?? '')}
              placeholder="Hours"
            >
               {hoursOptions.map((hour) => (
    <Option key={hour} value={String(hour)}>
      {hour} hr
    </Option>
  ))}
            </Dropdown>
            <Dropdown
              value={durationMinutes + ' min(s)'}
              onSelectionChange={(event, newSelected) => setDurationMinutes(newSelected[0] ?? '')}
              placeholder="Minutes"
            >
               {minutesOptions.map((min) => (
    <Option key={min} value={String(min)}>
      {min < 10 ? `0${min}` : min} min
    </Option>
  ))}
            </Dropdown>
          </StackLayout>
        </div>
      )}

      <Text style={{ color: "#FFFDD0", paddingBottom: 4, fontSize: '17px', fontFamily: 'Open Sans' }}>
        HOW HARD WAS IT?
      </Text>
      <div style={{padding: '0 0 16px 0'}}>
      <RpeSelector selectedRpe={rpe} onChange={(e) => setRpe(e)} petType={(userData?.pet.currentPet ?? 'puppy') as PetType} />
      </div>

      <Text style={{ color: "#FFFDD0", paddingBottom: 4, fontSize: '17px', fontFamily: 'Open Sans' }}>OPTIONAL NOTES</Text>
      <div style={{padding: '8px 0 8px 0'}}>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Add notes here..."
         style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid rgb(116, 116, 116)",
            fontSize: "17px",
            fontFamily: "inherit",
            backgroundColor: "var(--salt-container-primary-background)",
            color: "var(--salt-content-primary-foreground)",
            resize: "vertical",
          }}
      />
      </div>

      <Button onClick={handleLogWorkout} disabled={!isFormValid}  style={{opacity: isFormValid ? 1 : 0.4,
    cursor: !isFormValid ? "not-allowed" : "pointer",
    color: !isFormValid ? "#888" : "inherit", fontFamily: "'Press Start 2P', Pixelify Sans", backgroundColor: isFormValid ? "#ff9900" : undefined}} >
        LOG WORKOUT
      </Button>
    </Panel>
  );
};

export default WorkoutLogger;