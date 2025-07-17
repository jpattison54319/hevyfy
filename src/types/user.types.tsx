export interface PetStats {
    name: string; // pet's name
    currentPet: string; // current pet type
    level: number;
    xp: number;
    strength: number; // weight workouts
    defense: number; // fiber intake
    agility: number; // cardio workouts
    intelligence: number; // fruits and vegetables
    armor: number; // protein intake
    speed: number; // hydration
    happiness: number; // calorie goal
}

export interface Quest {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  rewardXp: number;
}

export interface LoggedMeal {
  id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  currency: number; // calorie currency equivalent
  fluid_intake_ml: number;            // new field
  servings_of_fruits_vegetables: number;
  timestamp: string;
  mealAffects: {
    armorIncrease: number;
    speedIncrease: number;
    intelligenceIncrease: number;
    defenseIncrease: number;
  },
}

export interface WeightLog {
  date: Date;
  weight: number;
}

export interface UserBodyStats {
  weight: number; // in lbs
  weightLogs: WeightLog[];
  height: number; // in inches 
  sex: 'male' | 'female';
  age: number; // in years
  tdee: number; // Total Daily Energy Expenditure
  bmr: number; // Basal Metabolic Rate
}

export interface UserGoal {

    goalType: 'weight_loss' | 'muscle_gain' | 'maintenance';
    dailyCalorieGoal: number; // based on TDEE and goal type
    dailyCurrencyTotal: number,
    dailyCurrencyUsed: {
    [date: string]: number; // e.g., "2025-07-03": 6
  };
    weeklyProgress: {
        week: number;
        weightChange: number; // in lbs
    }[];
}

export type PerformedSet = {
  weight: number;
  reps: number;
};

export type PerformedExercise = {
  name: string;
  sets: PerformedSet[];
  notes?: string;
};

export type WorkoutXp = {
  strength: number;
  agility: number;
  pet: number;
};

export type WorkoutLog = {
  _id: string;
  userId: string;
  logType: 'manual' | 'routine';
  timestamp: string; // ISO string
  notes?: string;
  rpe?: number;
  workoutXp: WorkoutXp;
  workoutType?: 'WEIGHTS' | 'CARDIO' | 'MOBILITY' | 'SPORT';

  // Manual
  cardioMode?: string;
  duration?: number;
  distance?: number;

  // Routine
  routineId?: string;
  routineDay?: string;
  performedExercises?: PerformedExercise[];
};

export type WorkoutLogResponse = {
  message: string;
  workouts: WorkoutLog[];
  total: number;
  offset: number;
  limit: number;
};

export interface User  {
  uid: string;
  _id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  pet: PetStats;
  quests: Quest[];
  goal: UserGoal;
  bodyStats: UserBodyStats;
  settings: {
    showCalories: boolean; // show calorie intake
  }
  hevyKey: string,
  lastLogin: Date; // last login date
  createdAt: Date; // account creation date
}