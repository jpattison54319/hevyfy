const UserQuestSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  questTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestTemplate', required: true },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  progress: { type: Number, default: 0 },
  completedAt: Date,
}, { timestamps: true });

export default mongoose.model('UserQuest', UserQuestSchema);