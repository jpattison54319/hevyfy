import React, { useState, useEffect } from 'react';
import { Button, Option, FormField, Input, Text, H1, StackLayout, FlexLayout, FlexItem, Stepper, Slider, FormFieldLabel, InteractableCard, Step, Dropdown } from '@salt-ds/core';
import api from '../api/api';
import Emoji from '../Emoji/Emoji';
import { useUser } from '../context/UserContext';
import { User, UserBodyStats, UserGoal, PetStats } from '../types/user.types';

const OnboardingPage: React.FC = () => {
  const { userData, setUserData } = useUser();
  if(!userData) {
    return <Text>Loading...</Text>; // Handle loading state
  }
  const [currentStep, setCurrentStep] = useState(0);
  const [userDataStaging, setUserDataStaging] = useState<User>(userData);
  const [weightLossRate, setWeightLossRate] = useState<number>(1); // Default to -0.5 lbs/week
  const [workActivityLevel, setWorkActivityLevel] = useState<number>(1.2); // Default to Sedentary
  const [exerciseActivityLevel, setExerciseActivityLevel] = useState<number>(0); // Default to Sedentary
  const [heightFeet, setHeightFeet] = useState(Math.floor(userDataStaging.bodyStats!.height / 12));
  const [heightInches, setHeightInches] = useState(userDataStaging.bodyStats!.height % 12);

  if (!userData || !userDataStaging) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
  const totalInches = heightFeet * 12 + heightInches;
  console.log('total inches : ', totalInches);
  setUserDataStaging((prev) => ({
    ...prev,
    bodyStats: {
      ...prev.bodyStats!,
      height: totalInches,
    },
  }));
}, [heightFeet, heightInches]);

  const calculateBMR = (bodyStats: UserBodyStats): number => {
    const { weight, height, age, sex } = bodyStats;
    // Mifflin-St Jeor Equation
    if (sex === 'male') {
      return 10 * (weight / 2.205) + 6.25 * (height * 2.54) - 5 * age + 5;
    } else {
      return 10 * (weight / 2.205) + 6.25 * (height * 2.54) - 5 * age - 161;
    }
  };

  const calculateTDEE = (bmr: number): number => {
    const totalMultiplier = workActivityLevel + exerciseActivityLevel;
    return bmr * totalMultiplier;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  const newWeight = userDataStaging.bodyStats!.weight;

  // Add a new weight log entry here
  const newWeightLog = { userId: userData.uid, date: new Date(), weight: newWeight };

    const bmr = calculateBMR(userDataStaging.bodyStats!);
    const tdee = calculateTDEE(bmr);
      const calorieGoal =
    userDataStaging.goal!.goalType === 'weight_loss'
      ? tdee - (weightLossRate * 3500) / 7
      : userDataStaging.goal!.goalType === 'muscle_gain'
      ? tdee + 300
      : tdee;

      const dailyCurrencyTotal = Math.round(calorieGoal / 100);
    const updatedUserData = {
      ...userDataStaging,
      bodyStats: {
      ...userDataStaging.bodyStats!,
      bmr: bmr,
      tdee: tdee,
      weight: newWeight,
    },
      goal: {
      ...userDataStaging.goal!,
      dailyCalorieGoal: calorieGoal,
      dailyCurrencyTotal,
      dailyCurrencyUsed: {}, // Start fresh on submit/setup
    },
    };
    console.log('Submitted User Data:', updatedUserData);
    try {
      const { data } = await api.post('/users/update', { ...updatedUserData });
      setUserData(data);
    } catch (error) {
      console.error('Error updating user data:', error);
    }

    try{
  await api.post('/weightLogs/addWeightLog', newWeightLog);
}catch(err){
  console.error(err);
}
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof User,
    field: keyof UserBodyStats | keyof PetStats | keyof UserGoal
  ) => {
    const { name, value } = e.target;
    setUserDataStaging({
      ...userDataStaging,
      [section]: {
        ...userDataStaging[section]! as Object,
        [field || name]: value,
      },
    });
  };

  const handleCardSelection = (
    section: keyof User,
    field: keyof UserBodyStats | keyof PetStats | keyof UserGoal,
    value: string
  ) => {
    setUserDataStaging({
      ...userDataStaging,
      [section]: {
        ...userDataStaging[section]! as Object,
        [field]: value,
      },
    });
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      // Body Stats: Ensure weight, height, age, and sex are set
      const { weight, height, age, sex } = userDataStaging.bodyStats!;
      return weight > 0 && height > 0 && age > 0 && ['male', 'female'].includes(sex);
    }
    if (currentStep === 1) {
      // Goals: Ensure goalType is set
      return ['weight_loss', 'muscle_gain', 'maintenance'].includes(userDataStaging.goal!.goalType);
    }
    if (currentStep === 2) {
      // Pet: Ensure name and currentPet are set
      const { name, currentPet } = userDataStaging.pet!;
      return name.trim() !== '' && ['puppy', 'kitten', 'bird'].includes(currentPet);
    }
    return true;
  };

  const steps = ['Body Stats', 'Fitness Goals', 'Virtual Pet'];
  return (
    //<div style={{display: 'flex', height: '100%', width: '100%' }}>
    <FlexLayout direction="column" align="stretch" style={{display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden', padding: '14px' }}>
      <FlexItem grow={1}>
        <StackLayout align='stretch' gap={3} style={{ display: 'flex', minHeight: '100%', width: '100%'}}>
            <FlexItem >
          <Text styleAs='h1'>Welcome to Your Journey</Text>
          </FlexItem>
          <FlexItem >
          <Stepper >
            {steps.map((step, index) => (
              <Step
                key={index}
                label={step}
                stage={currentStep === index ? 'active' : index < currentStep ? 'completed' : 'pending'}
            
              />
            ))}
          </Stepper>
          </FlexItem>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Body Stats */}
            {currentStep === 0 && (
              <StackLayout align='stretch' gap={2}>
                <Text styleAs="h2">Body Stats</Text>
                <FormField>
                  <FormFieldLabel>Weight (lbs)</FormFieldLabel>
                  <Input
                    value={userDataStaging.bodyStats!.weight}
                    onChange={(e) => handleInputChange(e, 'bodyStats', 'weight')}
                  />
                </FormField>
               <FormField>
  <FormFieldLabel>Height</FormFieldLabel>
  <div style={{ display: "flex", gap: "1rem" }}>
    <Dropdown
      value={heightFeet.toString() + ' ft'}
      onSelectionChange={(_, value) => setHeightFeet(Number(value))}
    >
      {[2, 3, 4, 5, 6, 7, 8, 9].map((ft) => (
        <Option value={ft.toString()} key={ft}>
          {ft} ft
        </Option>
      ))}
    </Dropdown>

    <Dropdown
      value={heightInches.toString() + ' in'}
      onSelectionChange={(_, value) => setHeightInches(Number(value))}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <Option value={i.toString()} key={i}>
          {i} in
        </Option>
      ))}
    </Dropdown>
  </div>
</FormField>
                <FormField>
                  <FormFieldLabel>Sex</FormFieldLabel>
                  <FlexLayout direction="row" gap={2}>
                    <FlexItem grow={1}>
                    <InteractableCard
                      onClick={() => handleCardSelection('bodyStats', 'sex', 'male')}
                      aria-label="Male"
                      style={{
          backgroundColor: 'var(--salt-palette-neutral-selection)',
          borderRadius: '12px',
          border: userDataStaging.bodyStats!.sex === 'male' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
        }}
                    >
                      <FlexLayout direction="column" align="center" gap={1}>
                        <Emoji symbol="🙎🏻‍♂️" size={32} />
                        <Text>Male</Text>
                      </FlexLayout>
                    </InteractableCard>
                    </FlexItem>
                    <FlexItem grow={1}>
                    <InteractableCard
                      onClick={() => handleCardSelection('bodyStats', 'sex', 'female')}
                      aria-label="Female"
                      style={{
                                  borderRadius: '12px',
          backgroundColor: 'var(--salt-palette-neutral-selection)',
          border: userDataStaging.bodyStats!.sex === 'female' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
        }}
                    >
                      <FlexLayout direction="column" align="center" gap={1}>
                        <Emoji symbol="🙎🏻‍♀️" size={32} />
                        <Text>Female</Text>
                      </FlexLayout>
                    </InteractableCard>
                    </FlexItem>
                  </FlexLayout>
                </FormField>
                <FormField>
                  <FormFieldLabel>Age (years)</FormFieldLabel>
                  <Input
                    value={userDataStaging.bodyStats!.age}
                    onChange={(e) => handleInputChange(e, 'bodyStats', 'age')}
                  />
                </FormField>
              </StackLayout>
            )}

            {/* Step 2: Fitness Goals */}
          {currentStep === 1 && (
  <StackLayout gap={2}>
    <Text styleAs="h3">Fitness Goals</Text>
    <FlexLayout direction="row" gap={2}>
      <FlexItem grow={1}>
        <InteractableCard
          onClick={() => handleCardSelection('goal', 'goalType', 'weight_loss')}
          aria-label="Weight Loss"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '12px',
            border: userDataStaging.goal!.goalType === 'weight_loss' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
          }}
        >
          <FlexLayout direction="column" align="center" gap={1}>
            <FlexItem style={{minHeight: '72px', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: '4px'}}>
              <Emoji symbol={'🔥'} size={24} />
              <Text>Weight Loss</Text>
            </FlexItem>
          </FlexLayout>
        </InteractableCard>
      </FlexItem>
      <FlexItem grow={1}>
        <InteractableCard
          onClick={() => handleCardSelection('goal', 'goalType', 'muscle_gain')}
          aria-label="Muscle Gain"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '12px',
            border: userDataStaging.goal!.goalType === 'muscle_gain' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
          }}
        >
          <FlexLayout direction="column" align="center" gap={1}>
            <FlexItem style={{minHeight: '72px', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',gap: '4px'}}>
              <Emoji symbol={userDataStaging.bodyStats.sex === 'male' ? '🏋️‍♂️' : '🏋🏽‍♀️'} size={24} />
              <Text>Muscle Gain</Text>
            </FlexItem>
          </FlexLayout>
        </InteractableCard>
      </FlexItem>
      <FlexItem grow={1}>
        <InteractableCard
          onClick={() => handleCardSelection('goal', 'goalType', 'maintenance')}
          aria-label="Maintenance"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '12px',
            border: userDataStaging.goal!.goalType === 'maintenance' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
          }}
        >
          <FlexLayout direction="column" align="center" gap={1}>
            <FlexItem style={{minHeight: '72px', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',gap: '4px'}}>
              <Emoji symbol={'🛠️'} size={24} />
              <Text>Maintenance</Text>
            </FlexItem>
          </FlexLayout>
        </InteractableCard>
      </FlexItem>
    </FlexLayout>
    
    {userDataStaging.goal!.goalType === 'weight_loss' && (
      <FormField>
        <Text styleAs='h3'>Weekly Weight Loss (lbs)</Text>
        <Slider
          max={2}
          min={0.5}
          step={0.25}
          value={weightLossRate}
          onChange={(event: Event, value: number) => setWeightLossRate(value)}
          minLabel='0.5'
          maxLabel='2'
          aria-label="Weekly weight loss slider"
        />
      </FormField>
    )}

    {/* Job Activity Level */}
    <StackLayout gap={1}>
      <Text styleAs="h3">Job Activity Level</Text>
      <Text styleAs="h4" style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
        Select the option that best describes your daily work activity
      </Text>
      <FlexLayout direction="column" gap={1}>
        <InteractableCard
          onClick={() => setWorkActivityLevel(1.2)}
          aria-label="Sedentary - Desk Job"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: workActivityLevel === 1.2 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'💻'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Sedentary - Desk Job</Text>
              <Text  style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Mostly sitting, minimal physical activity
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setWorkActivityLevel(1.375)}
          aria-label="Lightly Active - Teacher"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: workActivityLevel === 1.375 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'👩‍🏫'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Lightly Active - Teacher</Text>
              <Text  style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Some standing and walking throughout the day
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setWorkActivityLevel(1.55)}
          aria-label="Moderately Active - Nurse/Waitress"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: workActivityLevel === 1.55 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'👩‍⚕️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Moderately Active - Nurse/Waitress</Text>
              <Text style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Frequent walking, standing, and physical tasks
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setWorkActivityLevel(1.75)}
          aria-label="Very Active - Construction Worker"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: workActivityLevel === 1.75 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'👷‍♂️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Very Active - Construction Worker</Text>
              <Text  style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Heavy physical labor and constant movement
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
      </FlexLayout>
    </StackLayout>

    {/* Workout Activity Level */}
    <StackLayout gap={1}>
      <Text styleAs="h3">Workout Activity Level</Text>
      <Text styleAs="h4" style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
        How often do you exercise per week?
      </Text>
      <FlexLayout direction="column" gap={1}>
        <InteractableCard
          onClick={() => setExerciseActivityLevel(0)}
          aria-label="Sedentary - No Exercise"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: exerciseActivityLevel === 0 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'🛋️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Sedentary</Text>
              <Text  style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Little to no exercise
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setExerciseActivityLevel(0.05)}
          aria-label="Lightly Active - 1-3 days per week"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: exerciseActivityLevel === 0.05 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'🚶‍♀️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Lightly Active</Text>
              <Text style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Light exercise 1-3 days per week
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setExerciseActivityLevel(0.1)}
          aria-label="Moderately Active - 3-5 days per week"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: exerciseActivityLevel === 0.1 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'🏃‍♂️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Moderately Active</Text>
              <Text style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Moderate exercise 3-5 days per week
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setExerciseActivityLevel(0.15)}
          aria-label="Very Active - 6-7 days per week"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: exerciseActivityLevel === 0.15 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'🏋️‍♀️'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Very Active</Text>
              <Text  style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Hard exercise 6-7 days per week
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
        
        <InteractableCard
          onClick={() => setExerciseActivityLevel(0.2)}
          aria-label="Extremely Active - 2x per day or intense training"
          style={{
            backgroundColor: 'var(--salt-palette-neutral-selection)',
            borderRadius: '8px',
            border: exerciseActivityLevel === 0.2 ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)',
            padding: '12px'
          }}
        >
          <FlexLayout direction="row" align="center" gap={2}>
            <Emoji symbol={'💪'} size={30} />
            <StackLayout gap={0}>
              <Text styleAs='h2'>Extremely Active</Text>
              <Text style={{color: 'var(--salt-palette-neutral-secondary-foreground)'}}>
                Very hard exercise 2x/day or intense training
              </Text>
            </StackLayout>
          </FlexLayout>
        </InteractableCard>
      </FlexLayout>
    </StackLayout>
  </StackLayout>
)}

            {/* Step 3: Virtual Pet */}
            {currentStep === 2 && (
              <StackLayout gap={2}>
                <Text styleAs="h2">Your Virtual Pet</Text>
                <FormField>
                  <FormFieldLabel>Pet Name</FormFieldLabel>
                  <Input
                    value={userDataStaging.pet!.name}
                    onChange={(e) => handleInputChange(e, 'pet', 'name')}
                  />
                </FormField>
                <FormField>
                  <FormFieldLabel>Pet Type</FormFieldLabel>
                  <FlexLayout direction="row" gap={2}>
                    <FlexItem grow={1}>
                    <InteractableCard
                      onClick={() => handleCardSelection('pet', 'currentPet', 'puppy')}
                      aria-label="Dog"
                      style={{
          backgroundColor: 'var(--salt-palette-neutral-selection)',
          borderRadius: '12px',
          border: userDataStaging.pet!.currentPet === 'puppy' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
        }}
                    >
                      <FlexLayout direction="column" align="center" gap={1}>
                        <FlexItem  style={{minHeight: '72px', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',gap: '4px'}}>
                        <Emoji symbol={'🐶'} size={24} />
                        <Text>Dog</Text>
                        </FlexItem>
                      </FlexLayout>
                    </InteractableCard>
                    </FlexItem>
                    <FlexItem grow={1}>
                    <InteractableCard
                      onClick={() => handleCardSelection('pet', 'currentPet', 'kitten')}
                      style={{
          backgroundColor: 'var(--salt-palette-neutral-selection)',
          borderRadius: '12px',
          border: userDataStaging.pet!.currentPet === 'kitten' ? '2px solid var(--salt-palette-measured-foreground-active)' : '2px solid var(--salt-palette-neutral-primary-border)'
        }}
                      aria-label="Cat"
                    >
                      <FlexLayout direction="column" align="center" gap={1}>
                        <FlexItem  style={{minHeight: '72px', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center',gap: '4px'}}>
                        <Emoji symbol={'🐱'} size={24} />
                        <Text>Cat</Text>
                        </FlexItem>
                      </FlexLayout>
                    </InteractableCard>
                    </FlexItem>
                    {/* <InteractableCard
                      onClick={() => handleCardSelection('pet', 'currentPet', 'bird')}
                      aria-label="Bird"
                    
                    >
                      <FlexLayout direction="column" align="center" gap={1}>
                        {/* <Emoji symbol="bird" size={24} /> */}
                        {/* <Text>Bird</Text>
                      </FlexLayout>
                    </InteractableCard>  */}
                  </FlexLayout>
                </FormField>
              </StackLayout>
            )}

            {/* Navigation Buttons */}
            <FlexItem style={{ paddingTop: '20px',}}>
            <FlexLayout direction="row" gap={2} justify="center" className="mt-6">
              {currentStep > 0 && (
                <Button
                  sentiment="neutral"
                appearance="solid"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  sentiment="accented"
                   appearance="solid"
                  disabled={!isStepValid()}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="submit"
                  sentiment="accented"
                  appearance="solid"
                  disabled={!isStepValid()}
                  onClick={handleSubmit}
                >
                  Start Your Adventure!
                </Button>
              )}
            </FlexLayout>
            </FlexItem>
          </form>
        </StackLayout>
        </FlexItem>
    </FlexLayout>
    //</div>
  );
};

export default OnboardingPage;

// import React, { useState } from 'react';
// import { Button, FormField, Input, Dropdown, Text, H1, H2, Option, StackLayout, FormFieldLabel, FlexLayout, FlexItem } from '@salt-ds/core';
// import { User, UserBodyStats, UserGoal, PetStats } from '../types/user.types'; // Assuming types are in a separate file
// import api from '../api/api';
// import { useUser } from '../context/UserContext';

// const OnboardingPage: React.FC = () => {
//   const { userData, setUserData } = useUser();
//   if (!userData) {
//     return <Text>Loading...</Text>; // Handle loading state
//     }
//   const [userDataStaging, setUserDataStaging] = useState<User>(userData);

//   const calculateBMR = (bodyStats: UserBodyStats): number => {
//     const { weight, height, age, sex } = bodyStats;
//     // Mifflin-St Jeor Equation
//     if (sex === 'male') {
//       return 10 * (weight / 2.205) + 6.25 * (height * 2.54) - 5 * age + 5;
//     } else {
//       return 10 * (weight / 2.205) + 6.25 * (height * 2.54) - 5 * age - 161;
//     }
//   };

//   const calculateTDEE = (bmr: number): number => {
//     // Assuming moderate activity level (1.55 multiplier)
//     return bmr * 1.55;
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const bmr = calculateBMR(userDataStaging.bodyStats!);
//     const tdee = calculateTDEE(bmr);
//     const updatedUserData = {
//       ...userDataStaging,
//       bodyStats: { ...userDataStaging.bodyStats!, bmr, tdee },
//       goal: {
//         ...userDataStaging.goal!,
//         dailyCalorieGoal:
//           userDataStaging.goal!.goalType === 'weight_loss'
//             ? tdee - 500
//             : userData.goal!.goalType === 'muscle_gain'
//             ? tdee + 300
//             : tdee,
//       },
//     };
//     console.log('Submitted User Data:', updatedUserData);
//     // TODO: Save userData to backend or state management
//     const { data } = await api.post('/users/update', { ...updatedUserData });
//     setUserData(data);
//   };

// const handleInputChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } },
//   section: keyof User,
//   field?: keyof UserBodyStats | keyof PetStats | keyof UserGoal
// ) => {
//     const { name, value } = e.target;
//     if (section === 'bodyStats' || section === 'pet' || section === 'goal') {
//       setUserDataStaging({
//         ...userDataStaging,
//         [section]: {
//           ...userDataStaging[section]!,
//           [field || name]: value,
//         },
//       });
//     } else if (section === 'settings') {
//       setUserDataStaging({
//         ...userDataStaging,
//         settings: {
//           ...userDataStaging.settings!,
//           [field || name]: value === 'true',
//         },
//       });
//     } else {
//       setUserDataStaging({ ...userDataStaging, [name]: value });
//     }
//   };

//   return (
//     <FlexLayout direction={'column'}>
//         <FlexItem padding={1}>
//       <StackLayout gap={3} className="w-full max-w-2xl bg-salt-neutral-0 p-6 rounded-lg shadow-salt-shadow-md">
//         <H1>Welcome to Your Fitness Journey</H1>
//         <Text>Let's set up your profile to get started!</Text>

//         <form onSubmit={handleSubmit}>
//           {/* Body Stats */}
//           <StackLayout gap={2} >
//             <Text styleAs='h2'>Body Stats</Text>
//             <FormField >
//                 <FormFieldLabel>Weight (lbs)</FormFieldLabel>
//               <Input
//                 defaultValue="weight"
//                 value={userDataStaging.bodyStats!.weight}
//                 onChange={(e) => handleInputChange( {target: {name: 'weight', value: e.target.value}}, 'bodyStats', 'weight')}
//               />
//             </FormField>
//             <FormField >
//                 <FormFieldLabel>Height (inches)</FormFieldLabel>
//               <Input
//                 defaultValue="height"
//                 value={userDataStaging.bodyStats!.height}
//                 onChange={(e) => handleInputChange(
//       {target: {name: 'height', value: e.target.value}}, 
//       'bodyStats', 
//       'height'
//     )}
//               />
//             </FormField>
//             <FormField >
//                 <FormFieldLabel>Sex</FormFieldLabel>
//               <Dropdown
//                 name="sex"
//                 value={userDataStaging.bodyStats!.sex}
//                 onSelectionChange={(event, selectedItem: string | string[]) => {
//     const value = Array.isArray(selectedItem) ? selectedItem[0] : selectedItem;
//     handleInputChange({ target: { name: 'sex', value } }, 'bodyStats', 'sex');
//   }}
//               >
//                 <Option value="male">Male</Option>
//                 <Option value="female">Female</Option>
//               </Dropdown>
//             </FormField>
//             <FormField >
//                 <FormFieldLabel>Age (years)</FormFieldLabel>
//               <Input
//                 defaultValue="age"
//                 value={userDataStaging.bodyStats!.age}
//                 onChange={(e) => handleInputChange({ target: { name: 'age', value: e.target.value } }, 'bodyStats', 'age')}
//               />
//             </FormField>
//           </StackLayout>

//           {/* Goals */}
//           <StackLayout gap={2} className="mt-6">
//             <H2>Fitness Goals</H2>
//             <FormField >
//                 <FormFieldLabel>Goal Type</FormFieldLabel>
//               <Dropdown
//                 name="goalType"
//                 value={userDataStaging.goal!.goalType}
//                 onSelectionChange={(event, selectedItem: string | string[]) => {
//     const value = Array.isArray(selectedItem) ? selectedItem[0] : selectedItem;
//     handleInputChange({ target: { name: 'sex', value } }, 'goal', 'goalType');
//   }}
//               >
//                 <Option value="weight_loss">Weight Loss</Option>
//                 <Option value="muscle_gain">Muscle Gain</Option>
//                 <Option value="maintenance">Maintenance</Option>
//               </Dropdown>
//             </FormField>
//           </StackLayout>

//           {/* Pet Information */}
//           <StackLayout gap={2} className="mt-6">
//             <H2>Your Virtual Pet</H2>
//             <FormField >
//                 <FormFieldLabel>Pet Name</FormFieldLabel>
//               <Input
//                 defaultValue="name"
//                 value={userDataStaging.pet!.name}
//                 onChange={(e) => handleInputChange({ target: { name: 'age', value: e.target.value } }, 'pet', 'name')}
//               />
//             </FormField>
//             <FormField >
//                 <FormFieldLabel>Pet Type</FormFieldLabel>
//               <Dropdown
//                 name="currentPet"
//                 value={userDataStaging.pet!.currentPet}
//                 onSelectionChange={(event, selectedItem: string | string[]) => {
//     const value = Array.isArray(selectedItem) ? selectedItem[0] : selectedItem;
//     handleInputChange({ target: { name: 'sex', value } }, 'pet', 'currentPet');
//   }}
//               >
//                 <Option value="dog">Dog</Option>
//                 <Option value="cat">Cat</Option>
//                 <Option value="bird">Bird</Option>
//               </Dropdown>
//             </FormField>
//           </StackLayout>
//             <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
//           <Button onClick={handleSubmit} type="submit" sentiment='accented' appearance='solid' className="mt-6">
//             Complete Onboarding
//           </Button>
//           </div>
//         </form>
//       </StackLayout>
//       </FlexItem>
//     </FlexLayout>
//   );
// };

// export default OnboardingPage;
