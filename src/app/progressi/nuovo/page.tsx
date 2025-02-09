'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaTrash, FaInfoCircle, FaCalculator } from 'react-icons/fa';

interface Workout {
  _id: string;
  name: string;
  exercises: Array<{
    exercise: {
      _id: string;
      name: string;
    };
  }>;
}

interface ExerciseProgress {
  exercise: string;
  exerciseName?: string;
  sets: Array<{
    weight: number;
    reps: number;
    rpe?: number;
  }>;
  notes: string;
}

export default function NuovoAllenamento() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    mood: 'normale',
    notes: ''
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('/api/schede');
        if (response.ok) {
          const data = await response.json();
          setWorkouts(data);
        }
      } catch (error) {
        console.error('Errore durante il recupero delle schede:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleWorkoutChange = (workoutId: string) => {
    setSelectedWorkout(workoutId);
    const workout = workouts.find(w => w._id === workoutId);
    if (workout) {
      const initialExercises = workout.exercises.map(e => ({
        exercise: e.exercise._id,
        exerciseName: e.exercise.name,
        sets: [{
          weight: 0,
          reps: 0,
          rpe: 7
        }],
        notes: ''
      }));
      setExerciseProgress(initialExercises);
    }
  };

  const addSet = (exerciseIndex: number) => {
    setExerciseProgress(prev => {
      const updated = [...prev];
      const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
      updated[exerciseIndex].sets.push({
        weight: lastSet.weight,
        reps: lastSet.reps,
        rpe: lastSet.rpe
      });
      return updated;
    });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExerciseProgress(prev => {
      const updated = [...prev];
      updated[exerciseIndex].sets.splice(setIndex, 1);
      return updated;
    });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: number) => {
    setExerciseProgress(prev => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return updated;
    });
  };

  const updateExerciseNotes = (exerciseIndex: number, notes: string) => {
    setExerciseProgress(prev => {
      const updated = [...prev];
      updated[exerciseIndex].notes = notes;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/progressi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workout: selectedWorkout,
          ...formData,
          exercises: exerciseProgress.map(({ exerciseName, ...rest }) => rest)
        }),
      });

      if (response.ok) {
        router.push('/progressi');
      }
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  };

  const tooltips = {
    weight: "Il peso utilizzato per questo set (in kg)",
    reps: "Numero di ripetizioni completate in questo set",
    rpe: "Rating of Perceived Exertion (RPE): scala da 1 a 10 che indica l'intensità percepita dello sforzo\n\n" +
         "RPE 6: Facile, potresti fare 4+ ripetizioni in più\n" +
         "RPE 7: Moderato, potresti fare 3 ripetizioni in più\n" +
         "RPE 8: Impegnativo, potresti fare 2 ripetizioni in più\n" +
         "RPE 9: Molto difficile, potresti fare 1 ripetizione in più\n" +
         "RPE 10: Massimale, non potresti fare altre ripetizioni"
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Registra Nuovo Allenamento</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Seleziona Scheda</label>
            <select
              value={selectedWorkout}
              onChange={(e) => handleWorkoutChange(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleziona una scheda</option>
              {workouts.map((workout) => (
                <option key={workout._id} value={workout._id}>
                  {workout.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Durata (minuti)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Umore</label>
            <select
              value={formData.mood}
              onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
              className="w-full p-2 border rounded"
              required
            >
              <option value="ottimo">Ottimo 😄</option>
              <option value="buono">Buono 🙂</option>
              <option value="normale">Normale 😐</option>
              <option value="stanco">Stanco 😫</option>
              <option value="pessimo">Pessimo 😞</option>
            </select>
          </div>
        </div>

        {selectedWorkout && exerciseProgress.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Esercizi</h2>
              <Link
                href="/calcolatori/rpe"
                target="_blank"
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <FaCalculator /> Calcolatore RPE
              </Link>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="font-semibold text-blue-700 mb-2">Come registrare i tuoi set</h3>
              <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                <li>Per ogni esercizio puoi registrare più set (serie)</li>
                <li>Ogni set include: peso utilizzato, numero di ripetizioni e intensità percepita (RPE)</li>
                <li>Puoi aggiungere più set cliccando su "Aggiungi Set"</li>
                <li>Usa le note per registrare dettagli specifici dell'esercizio</li>
              </ul>
            </div>
            
            {exerciseProgress.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="border p-4 rounded">
                <h3 className="font-semibold mb-4">{exercise.exerciseName}</h3>
                
                <div className="grid grid-cols-4 gap-4 mb-2 text-sm text-gray-600">
                  <div>Set</div>
                  <div className="flex items-center gap-1">
                    Peso (kg)
                    <div className="group relative">
                      <FaInfoCircle className="text-gray-400 cursor-help" />
                      <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -top-2 left-6">
                        {tooltips.weight}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    Ripetizioni
                    <div className="group relative">
                      <FaInfoCircle className="text-gray-400 cursor-help" />
                      <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -top-2 left-6">
                        {tooltips.reps}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    RPE
                    <div className="group relative">
                      <FaInfoCircle className="text-gray-400 cursor-help" />
                      <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg -top-2 left-6 whitespace-pre-line">
                        {tooltips.rpe}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-4 gap-4 items-center">
                      <div className="text-gray-500">Set {setIndex + 1}</div>
                      <div>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value))}
                          className="w-full p-2 border rounded"
                          placeholder="Kg"
                          min="0"
                          step="0.5"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                          placeholder="Reps"
                          min="0"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={set.rpe}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'rpe', parseInt(e.target.value))}
                          className="w-full p-2 border rounded"
                          placeholder="RPE"
                          min="1"
                          max="10"
                        />
                        {exercise.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => addSet(exerciseIndex)}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> Aggiungi Set
                  </button>
                  <input
                    type="text"
                    value={exercise.notes}
                    onChange={(e) => updateExerciseNotes(exerciseIndex, e.target.value)}
                    className="flex-1 ml-4 p-2 border rounded"
                    placeholder="Note per questo esercizio"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block mb-1">Note Generali</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Note opzionali sull'allenamento"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Salva Allenamento
          </button>
          <Link
            href="/progressi"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
} 