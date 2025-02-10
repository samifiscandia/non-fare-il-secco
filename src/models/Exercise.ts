import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
  },
  description: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
  },
  muscleGroup: {
    type: String,
    required: [true, 'Il gruppo muscolare è obbligatorio'],
  },
  equipment: {
    type: String,
    required: [true, 'L\'attrezzatura è obbligatoria'],
  },
  secondaryMuscles: {
    type: [String],
    default: [],
  },
  videoUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

// Helper per gestire i valori null/undefined
ExerciseSchema.methods.getSafeValue = function(field: string) {
  return this[field] ?? '';
};

export default mongoose.models.Exercise ?? mongoose.model('Exercise', ExerciseSchema); 