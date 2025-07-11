import mongoose from 'mongoose';


// const WorkoutSchema = new mongoose.Schema({
//   userId: { type: String, ref: 'User', required: true },
//   workoutType: String,
//   cardioMode: String,
//   duration: Number,
//   distance: Number,
//   rpe: Number,
//   notes: String,
//   workoutXp: {
//     strength: { type: Number, default: 0 },
//     agility: { type: Number, default: 0 },
//     pet: { type: Number, default: 0 },
//   },
//   timestamp: { type: Date, default: Date.now }
// });

const WorkoutLogSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },

  logType: {
    type: String,
    enum: ['manual', 'routine'],
    required: true
  },

   // Shared fields
  timestamp: { type: Date, default: Date.now },
  notes: String,
  rpe: Number,
   workoutXp: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    pet: { type: Number, default: 0 },
  },
  workoutType: {
  type: String,
  enum: ['WEIGHTS', 'CARDIO', 'MOBILITY', 'SPORT']
},

  // Manual log fields
  cardioMode: String,
  duration: Number,
  distance: Number,

  // Routine log fields
  routineId: String, // from the user's routine.routineId
  routineDay: String, // e.g., "Day 1" or "Monday"
  performedExercises: [{
    name: String,
    sets: [{
      weight: Number,
      reps: Number
    }],
    notes: String // per exercise
  }]

});

export default mongoose.model('Workout', WorkoutLogSchema);