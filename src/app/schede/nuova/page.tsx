'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface Exercise {
  _id: string;
  name: string;
}

interface WorkoutExercise {
  exercise: string;
  exerciseName?: string;
  sets: number;
  reps: string;
  rest: number;
  notes: string;
}

export default function NuovaScheda() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'principiante',
    frequency: '',
    duration: 60,
  });
  
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    // Carica la lista degli esercizi disponibili
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/esercizi');
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        }
      } catch (error) {
        console.error('Errore durante il recupero degli esercizi:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addExercise = () => {
    setWorkoutExercises(prev => [...prev, {
      exercise: '',
      sets: 3,
      reps: '12',
      rest: 90,
      notes: ''
    }]);
  };

  const removeExercise = (index: number) => {
    setWorkoutExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    setWorkoutExercises(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
        exerciseName: field === 'exercise' 
          ? exercises.find(e => e._id === value)?.name 
          : updated[index].exerciseName
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/schede', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          exercises: workoutExercises.map(({ exerciseName, ...exercise }) => exercise)
        }),
      });

      if (response.ok) {
        router.push('/schede');
      }
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Crea Nuova Scheda</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nome Scheda</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Difficoltà</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzato">Avanzato</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Descrizione</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Frequenza</label>
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="es: 3 volte a settimana"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Durata (minuti)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Esercizi</h2>
            <button
              type="button"
              onClick={addExercise}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
            >
              <FaPlus /> Aggiungi Esercizio
            </button>
          </div>

          {workoutExercises.map((exercise, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">Esercizio {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Seleziona Esercizio</label>
                  <select
                    value={exercise.exercise}
                    onChange={(e) => updateExercise(index, 'exercise', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Seleziona un esercizio</option>
                    {exercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Serie</label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Ripetizioni</label>
                  <input
                    type="text"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="es: 12 o 8-12"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Recupero (secondi)</label>
                  <input
                    type="number"
                    value={exercise.rest}
                    onChange={(e) => updateExercise(index, 'rest', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1">Note</label>
                  <input
                    type="text"
                    value={exercise.notes}
                    onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Note opzionali"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Salva Scheda
          </button>
          <Link
            href="/schede"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
} 