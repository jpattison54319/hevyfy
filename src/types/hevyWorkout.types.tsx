// types/HevyWorkout.ts

export interface HevySet {
    index: number;
    type: string;
    weightKg: number | null;
    reps: number | null;
    distanceMeters: number | null;
    durationSeconds: number | null;
    rpe: number | null;
    customMetric: number | null;
  }
  
  export interface HevyExercise {
    index: number;
    title: string;
    notes: string;
    exerciseTemplateId: string;
    supersetId: number | null;
    sets: HevySet[];
  }
  
  export interface PetAffects {
    strength: number;
    agility: number;
    pet: number;
    leveledUp: boolean;
  }
  
  export interface HevyWorkout {
    _id?: string; // optional if returned from MongoDB
    userId: string;
    hevyWorkoutId: string;
    logType: 'hevy';
    title: string;
    description: string;
    startTime: string; // or Date if parsed
    endTime: string;
    createdAt: string;
    updatedAt: string;
    exercises: HevyExercise[];
    petAffects: PetAffects;
    notes?: string;
    raw: any; // if you want to keep it untyped
    seen: boolean;
  }
  