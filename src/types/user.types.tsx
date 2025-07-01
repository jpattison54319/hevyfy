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

export interface UserSkills {
  [skillName: string]: {
    level: number;
    xp: number;
  };
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
    targetWeight: number; // in lbs
    targetDate: string; // ISO date string
    dailyCalorieGoal: number; // based on TDEE and goal type
    weeklyProgress: {
        week: number;
        weightChange: number; // in lbs
        caloriesBurned: number; // total calories burned this week
    }[];
}

export interface RPGUser {
  uid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  pet: PetStats;
  skills: UserSkills;
  quests: Quest[];
  meals: LoggedMeal[];
  goal: UserGoal;
    bodyStats: UserBodyStats;
}