'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaClock, FaDumbbell } from 'react-icons/fa';
import { use } from 'react';

interface Exercise {
  exercise: {
    _id: string;
    name: string;
  };
  sets: number;
  reps: string;
  rest: number;
  notes: string;
}

interface Workout {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  frequency: string;
  duration: number;
  exercises: Exercise[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DettaglioScheda({ params }: PageProps) {
  const resolvedParams = use(params);
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/schede/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkout(data);
        }
      } catch (error) {
        console.error('Errore durante il recupero della scheda:', error);
      }
    };

    fetchWorkout();
  }, [resolvedParams.id]);

  if (!workout) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaClock /> {workout.duration} min
            </span>
            <span className="flex items-center gap-1">
              <FaDumbbell /> {workout.exercises.length} esercizi
            </span>
            <span className="capitalize">
              Livello: {workout.difficulty}
            </span>
          </div>
        </div>
        <Link
          href={`/schede/modifica/${workout._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPencilAlt /> Modifica
        </Link>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Descrizione</h2>
        <p className="text-gray-700">{workout.description}</p>
        <p className="text-gray-600 mt-2">Frequenza: {workout.frequency}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Esercizi</h2>
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <h3 className="font-bold text-lg mb-2">{exercise.exercise.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
              <div>
                <span className="font-semibold">Serie:</span> {exercise.sets}
              </div>
              <div>
                <span className="font-semibold">Ripetizioni:</span> {exercise.reps}
              </div>
              <div>
                <span className="font-semibold">Recupero:</span> {exercise.rest} sec
              </div>
            </div>
            {exercise.notes && (
              <div className="mt-2 text-gray-600">
                <span className="font-semibold">Note:</span> {exercise.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/schede"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Torna alle schede
        </Link>
      </div>
    </div>
  );
} 