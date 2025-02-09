import mongoose from 'mongoose';

const SetSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  rpe: {
    type: Number,
    min: 1,
    max: 10,
    required: false,
  }
});

const ExerciseProgressSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [SetSchema],
  notes: String
});

const WorkoutProgressSchema = new mongoose.Schema({
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    type: Number, // in minuti
    required: true
  },
  exercises: [ExerciseProgressSchema],
  notes: String,
  mood: {
    type: String,
    enum: ['ottimo', 'buono', 'normale', 'stanco', 'pessimo'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.WorkoutProgress || mongoose.model('WorkoutProgress', WorkoutProgressSchema); 