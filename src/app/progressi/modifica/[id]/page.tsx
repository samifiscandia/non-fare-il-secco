'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaTrash, FaInfoCircle, FaCalculator } from 'react-icons/fa';
import React from 'react';

interface Workout {
  _id: string;
  name: string;
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ModificaAllenamento({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress[]>([]);
  const [formData, setFormData] = useState({
    workout: '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    mood: 'normale',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica l'allenamento esistente
        const progressResponse = await fetch(`/api/progressi/${resolvedParams.id}`);
        if (progressResponse.ok) {
          const progress = await progressResponse.json();
          setFormData({
            workout: progress.workout._id,
            date: new Date(progress.date).toISOString().split('T')[0],
            duration: progress.duration,
            mood: progress.mood,
            notes: progress.notes || ''
          });
          setExerciseProgress(progress.exercises.map((ex: any) => ({
            exercise: ex.exercise._id,
            exerciseName: ex.exercise.name,
            sets: ex.sets,
            notes: ex.notes || ''
          })));
        }

        // Carica le schede disponibili
        const workoutsResponse = await fetch('/api/schede');
        if (workoutsResponse.ok) {
          const workoutsData = await workoutsResponse.json();
          setWorkouts(workoutsData);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/progressi/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          exercises: exerciseProgress
        }),
      });

      if (response.ok) {
        router.push(`/progressi/${resolvedParams.id}`);
      }
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modifica Allenamento</h1>
        <Link
          href="/calcolatori/rpe"
          target="_blank"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
        >
          <FaCalculator /> Calcolatore RPE
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">
              Scheda
              <select
                value={formData.workout}
                onChange={(e) => setFormData(prev => ({ ...prev, workout: e.target.value }))}
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
            </label>
          </div>

          <div>
            <label className="block mb-2">
              Data
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </label>
          </div>

          <div>
            <label className="block mb-2">
              Durata (minuti)
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded"
                min="1"
                required
              />
            </label>
          </div>

          <div>
            <label className="block mb-2">
              Umore
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
            </label>
          </div>
        </div>

        {exerciseProgress.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Esercizi</h2>
            
            {exerciseProgress.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="border p-4 rounded">
                <h3 className="font-semibold mb-4">{exercise.exerciseName}</h3>
                
                <div className="space-y-4">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex gap-4 items-center">
                      <div className="w-12 text-gray-500">Set {setIndex + 1}</div>
                      <div>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value))}
                          className="w-24 p-2 border rounded"
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
                          className="w-24 p-2 border rounded"
                          placeholder="Reps"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={set.rpe || ''}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'rpe', parseInt(e.target.value))}
                          className="w-24 p-2 border rounded"
                          placeholder="RPE"
                          min="1"
                          max="10"
                        />
                      </div>
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
          <label className="block mb-2">Note Generali</label>
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
            Salva Modifiche
          </button>
          <Link
            href={`/progressi/${resolvedParams.id}`}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
} 