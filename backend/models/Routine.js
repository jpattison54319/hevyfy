import mongoose from 'mongoose';

const RoutineSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  routineName: { type: String, required: true },
  communityRoutine: {type: Boolean, required: false, default: false},
  experienceLevel: { type: String, required: true },
  goal: { type: String, required: true },
  sport: { type: String, default: null },
  physicalConsiderations: { type: String, default: null },
  petCoachAffects: { type: String },
  daysPerWeek: { type: Number, required: true },

  weeklySchedule: [
    {
      dayName: { type: String, required: true },
      exercises: [
        {
          exercise: { type: String, required: true },
          repRange: { type: String, required: true },
          sets: { type: String, required: true },
          howToPerform: { type: String, required: true },
        },
      ],
    },
  ],

  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Routine', RoutineSchema);