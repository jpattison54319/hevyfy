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
  timestamp: string;
}

export interface UserBodyStats {
 weight: number; // in lbs
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

export interface User  {
  uid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  pet: PetStats;
  quests: Quest[];
  meals: LoggedMeal[];
  goal: UserGoal;
    bodyStats: UserBodyStats;
    settings: {
        showCalories: boolean; // show calorie intake
    }
    lastLogin: Date; // last login date
    createdAt: Date; // account creation date
}