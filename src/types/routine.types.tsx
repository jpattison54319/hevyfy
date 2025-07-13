interface Exercise {
    exercise: string;
    repRange: string;
    sets: string;
    howToPerform: string;
  }
  
  interface WeeklyScheduleDay {
    dayName: string;
    exercises: Exercise[];
  }
  
  interface Routine {
    _id?: string;
    userId: string;
    communityRoutine: boolean;
    routineName: string;
    experienceLevel: string;
    goal: string;
    sport?: string | null;
    physicalConsiderations?: string | null;
    petCoachAffects?: string;
    daysPerWeek: number;
    weeklySchedule: WeeklyScheduleDay[];
    timestamp?: Date;
  }
  
  export type { Routine, WeeklyScheduleDay, Exercise };