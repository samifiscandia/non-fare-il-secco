import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Inserisci il nome dell\'esercizio'],
    unique: true,
  },
  targetMuscle: {
    type: String,
    required: [true, 'Inserisci il muscolo principale'],
  },
  secondaryMuscles: [{
    type: String,
  }],
  equipment: [{
    type: String,
  }],
  description: {
    type: String,
    required: [true, 'Inserisci una descrizione'],
  },
  instructions: {
    type: String,
    required: [true, 'Inserisci le istruzioni'],
  },
  difficulty: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzato'],
    required: [true, 'Inserisci il livello di difficoltà'],
  },
  mediaUrl: {
    type: String,
  },
});

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema); 