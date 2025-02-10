import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    trim: true,
  },
  muscleGroup: {
    type: String,
    required: [true, 'Il gruppo muscolare è obbligatorio'],
    trim: true,
  },
  equipment: {
    type: String,
    required: [true, 'L\'attrezzatura è obbligatoria'],
    trim: true,
  },
  secondaryMuscles: {
    type: [String],
    default: [],
    set: (v: string[]) => v.map(m => m.trim()).filter(Boolean)
  },
  videoUrl: {
    type: String,
    default: '',
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true,
  }
}, {
  timestamps: true,
});

// Helper per gestire i valori null/undefined
ExerciseSchema.methods.getSafeValue = function(field: string) {
  return this[field] ?? '';
};

export default mongoose.models.Exercise ?? mongoose.model('Exercise', ExerciseSchema); 