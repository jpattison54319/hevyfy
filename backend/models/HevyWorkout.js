import mongoose from 'mongoose';

const SetSchema = new mongoose.Schema({
    index: Number,
    type: String,
    weightKg: Number,
    reps: Number,
    distanceMeters: Number,
    durationSeconds: Number,
    rpe: Number,
    customMetric: Number,
  }, { _id: false });
  
  const ExerciseSchema = new mongoose.Schema({
    index: Number,
    title: String,
    notes: String,
    exerciseTemplateId: String,
    supersetId: mongoose.Schema.Types.Mixed, // Can be null or a number
    sets: [SetSchema],
  }, { _id: false });
  
  const HevyWorkoutSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    hevyWorkoutId: { type: String, required: true },
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
    createdAt: Date,
    updatedAt: Date,
    exercises: [ExerciseSchema],
    petAffects: {
      strength: Number,
      agility: Number,
      pet: Number,
      leveledUp: Boolean
    },
    raw: mongoose.Schema.Types.Mixed,
    seen: { type: Boolean, default: false }
  });

  export default mongoose.model('HevyWorkout', HevyWorkoutSchema);