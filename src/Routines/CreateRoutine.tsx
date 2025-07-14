import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Button
  } from '@headlessui/react';
  import { useState } from 'react';
  import { ChevronDown } from 'lucide-react';
  import api from '../api/api';
  import { useUser } from '../context/UserContext';
  import styles from './Routines.module.scss';
import Loading from '../Loading/Loading';
import { useToast } from '../context/ToastContext';
import Emoji from '../Emoji/Emoji';
  
  const petCoaches = [
    { name: 'Fenrir', color: '#3B6FFF' },
    { name: 'Durgas Tiger', color: '#FF8C00' },
    { name: 'Phoenix', color: '#D62828' },
    { name: 'Leviathan', color: '#00B7EB' },
    { name: 'Elder Dragon', color: '#00FF7F' },
    { name: 'Primordial Tyrant', color: '#C71585' },
  ];
  
  const equipmentOptions = [
    'None',
    'Full Gym',
    'Dumbbells',
    'Barbell',
    'Smith Machine',
    'Resistance Bands',
  ];
  
  export default function CreateRoutine() {
    const { userData } = useUser();
  
    const [goal, setGoal] = useState('Max Muscle');
    const [sport, setSport] = useState('');
    const [experience, setExperience] = useState('beginner');
    const [days, setDays] = useState(3);
    const [equipment, setEquipment] = useState<string[]>([]);
    const [include, setInclude] = useState('');
    const [exclude, setExclude] = useState('');
    const [considerations, setConsiderations] = useState('');
    const [selectedPetCoach, setSelectedPetCoach] = useState<string>('');
    const [sessionDuration, setSessionDuration] = useState<number>(15);
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [routineCreated, setRoutineCreated] = useState(false);
    const {addToast} = useToast();
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setisLoading(true);
      const payload = {
        goal,
        sport: goal === 'Sport Specific' ? sport : null,
        experience,
        days,
        equipment: equipment.join(', '),
        include,
        exclude,
        considerations,
        sessionDurationMinutes: sessionDuration,
        petCoach: selectedPetCoach,
        userId: userData?.uid
      };
  
      api.post('/workout/routine/createRoutine', payload, { timeout: 50000 })
        .then((res) => {
          console.log('Routine Created:', res.data);
          setRoutineCreated(true);
          setTimeout(() => {
            setRoutineCreated(false);
          }, 3000);
        //   addToast({
        //     content: (
        //       <div style={{
        //       display: "flex",
        //       alignItems: "center",
        //       gap: 12,
        //       padding: 16,
        //       backgroundColor: "#1c1c1c",
        //       border: "3px solid #ffa640",
        //       color: "#FFFDD0",
        //       fontFamily: "'Press Start 2P', monospace, sans-serif",
        //       fontSize: 17,
        //       textTransform: "uppercase",
        //       boxShadow: "0 0 8px #ffa640",
        //       borderRadius: 8,
        //     }}>
        //       <Emoji size={32} symbol="❚█══█❚"/>
        //       <div className={styles.routineCreatedText}>Routine Created!</div>
        //     </div>
        //     )
        //   });
         })
        .catch(err => {
          console.error(err);
        }).finally(() => setisLoading(false));
    };

    if(routineCreated){
        return (
            <div style={{ position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0, padding: '0 12px', display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',}}>
                <div style={{
              display: "flex",
              flexDirection: 'column',
              alignItems: "center",
              gap: 22,
              textAlign: 'center',
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
              <Emoji size={32} symbol="❚█══█❚"/>
              <div className={styles.routineCreatedText}>Routine Created!</div>
              <div className={styles.routineCreatedText}>Check it out in "My Routines"!</div>
            </div>
                </div>
        );
    }

    if(isLoading){
            return (
            <div style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'
            }}>
                <Loading scale={2}/>
            </div>
            );
          }
  
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="Max Muscle">Max Muscle</option>
            <option value="Max Strength">Max Strength</option>
            <option value="Max Cardio">Max Cardio</option>
            <option value="Sport Specific">Sport Specific</option>
          </select>
        </label>

        {goal === 'Sport Specific' && (
          <label>
            What sport?
            <input
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="e.g. Basketball"
            />
          </label>
        )}

        <label>
          Experience Level
          <select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label>
Days per Week
<select value={days} onChange={(e) => setDays(Number(e.target.value))}>
{[...Array(7)].map((_, i) => (
<option key={i + 1} value={i + 1}>
  {i + 1} {i === 0 ? 'day' : 'days'}
</option>
))}
</select>
</label>

<label>
Max Session Duration
<select value={sessionDuration} onChange={(e) => setSessionDuration(Number(e.target.value))}>
{[...Array(12)].map((_, i) => {
const minutes = (i + 1) * 15;
const hours = Math.floor(minutes / 60);
const mins = minutes % 60;
const label = hours > 0
  ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
  : `${mins} minutes`;
return (
  <option key={minutes} value={minutes}>
    {label}
  </option>
);
})}
</select>
</label>

<div className={styles.equipmentSection}>
<label>Equipment Available</label>
<div className={styles.equipmentList}>
{equipmentOptions.map((item) => (
<Button
  key={item}
  type="button"
  onClick={() =>
    setEquipment((prev) =>
      prev.includes(item)
        ? prev.filter((e) => e !== item)
        : [...prev, item]
    )
  }
  className={`${styles.equipment} ${equipment.includes(item) ? styles.selected : ''}`}
>
  {item}
</Button>
))}
</div>
</div>

        <label>
          Exercises to Include
          <input
            type="text"
            value={include}
            onChange={(e) => setInclude(e.target.value)}
            placeholder="e.g. Squats, Pushups"
          />
        </label>

        <label>
          Exercises to Exclude
          <input
            type="text"
            value={exclude}
            onChange={(e) => setExclude(e.target.value)}
            placeholder="e.g. Deadlifts"
          />
        </label>

        <label>
          Physical Considerations
          <input
            type="text"
            value={considerations}
            onChange={(e) => setConsiderations(e.target.value)}
            placeholder="e.g. Bad knees"
          />
        </label>

        <Disclosure>
{({ open }) => (
<div className={styles.heroSection}>
<DisclosureButton className={styles.disclosureButton}>
  Let one of our XPets train you!
  <ChevronDown className={`${styles.chevron} ${open ? styles.rotate : ''}`}
    aria-hidden="true"/>
</DisclosureButton>

<DisclosurePanel className={styles.heroList}>
  {petCoaches.map((pet) => (
    <Button
      type="button"
      key={pet.name}
      onClick={() => setSelectedPetCoach(pet.name)}
      className={`${styles.hero} ${selectedPetCoach === pet.name ? styles.selected : ''}`}
      style={{
        borderColor: typeof pet.color === 'string' && pet.color.includes('linear') ? undefined : pet.color,
        borderImage: pet.color.includes('linear') ? pet.color : undefined,
        borderWidth: '3px',
        borderStyle: 'solid'
      }}
    >
      {pet.name}
    </Button>
  ))}
</DisclosurePanel>
</div>
)}
</Disclosure>

        <Button type="submit">Generate Routine</Button>
      </form>
    );
  }