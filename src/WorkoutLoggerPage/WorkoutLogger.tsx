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
  Toast,
} from "@salt-ds/core";
import { useState } from "react";
import RpeSelector, { PetType } from "../RpeSelector/RpeSelector";
import { useUser } from "../context/UserContext";
import { LoggedWorkout } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import api from "../api/api";
import { WorkoutLoggedToast } from "../WorkoutLoggedToast/WorkoutLoggedToast";

export const WorkoutLogger = () => {
  const {userData, setUserData} = useUser();
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
});

      setUserData(data.updatedUser);
      clearForm();
      setShowToast(true);
    } catch (error) {
      console.error(error);
      alert("There was an error logging your workout.");
    }
  };

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

       {cardioMode === "DISTANCE" ? (
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
              value={durationHours}
              onSelectionChange={(event) => setDurationHours((event.target as HTMLSelectElement).value)}
              placeholder="Hours"
            >
               {hoursOptions.map((hour) => (
    <Option key={hour} value={String(hour)}>
      {hour} hr
    </Option>
  ))}
            </Dropdown>
            <Dropdown
              value={durationMinutes}
              onSelectionChange={(event) => setDurationMinutes((event.target as HTMLSelectElement).value)}
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
      <RpeSelector onChange={(e) => setRpe(e)} petType={(userData?.pet.currentPet ?? 'puppy') as PetType} />
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