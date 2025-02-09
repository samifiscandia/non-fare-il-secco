import mongoose from 'mongoose';

const WorkoutExerciseSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: String,
    required: true // Esempio: "12", "8-12", "Al fallimento"
  },
  rest: {
    type: Number,
    required: true // In secondi
  },
  notes: String
});

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Inserisci il nome della scheda'],
  },
  description: {
    type: String,
    required: [true, 'Inserisci una descrizione'],
  },
  difficulty: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzato'],
    required: true,
  },
  exercises: [WorkoutExerciseSchema],
  frequency: {
    type: String,
    required: true // Esempio: "3 volte a settimana", "A giorni alterni"
  },
  duration: {
    type: Number,
    required: true // Durata stimata in minuti
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Workout || mongoose.model('Workout', WorkoutSchema); 