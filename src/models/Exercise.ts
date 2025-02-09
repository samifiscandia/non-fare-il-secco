interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  description: string;
  instructions: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzato';
  mediaUrl?: string;
}

export default Exercise; 