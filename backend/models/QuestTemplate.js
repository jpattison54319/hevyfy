const QuestTemplateSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // e.g. 'complete_5_workouts'
    title: { type: String, required: true },
    description: String,
    goal: { type: Number, required: true }, // e.g. 5 workouts
    type: { type: String, enum: ['workout', 'streak', 'nutrition', 'custom'] }, // optional
    rewards: {
      xp: { type: Number, default: 0 },
      item: { type: String }, // e.g. 'magic_potion'
    }
  });

  export default mongoose.model('QuestTemplate', QuestTemplateSchema);