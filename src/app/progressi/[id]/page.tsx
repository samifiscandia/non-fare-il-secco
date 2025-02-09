'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaCalendar, FaClock, FaDumbbell, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import React from 'react';

interface Set {
  weight: number;
  reps: number;
  rpe?: number;
}

interface ExerciseProgress {
  exercise: {
    _id: string;
    name: string;
  };
  sets: Set[];
  notes?: string;
}

interface WorkoutProgress {
  _id: string;
  workout: {
    _id: string;
    name: string;
  };
  date: string;
  duration: number;
  mood: string;
  exercises: ExerciseProgress[];
  notes?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DettaglioAllenamento({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/progressi/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Errore durante il recupero dell\'allenamento:', error);
      }
    };

    fetchProgress();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo allenamento?')) {
      try {
        const response = await fetch(`/api/progressi/${resolvedParams.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.push('/progressi');
        }
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  if (!progress) {
    return <div className="p-4">Caricamento...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      ottimo: '😄',
      buono: '🙂',
      normale: '😐',
      stanco: '😫',
      pessimo: '😞'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/progressi"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
          >
            <FaHome /> Progressi
          </Link>
          <h1 className="text-2xl font-bold">{progress.workout.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/progressi/modifica/${progress._id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <FaPencilAlt /> Modifica
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600"
          >
            <FaTrashAlt /> Elimina
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-6 text-gray-600 mb-4">
          <span className="flex items-center gap-2">
            <FaCalendar /> {formatDate(progress.date)}
          </span>
          <span className="flex items-center gap-2">
            <FaClock /> {progress.duration} minuti
          </span>
          <span className="flex items-center gap-2">
            <FaDumbbell /> {progress.exercises.length} esercizi
          </span>
          <span className="flex items-center gap-2" title={`Umore: ${progress.mood}`}>
            Umore: {getMoodEmoji(progress.mood)}
          </span>
        </div>

        {progress.notes && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Note Generali</h2>
            <p className="text-gray-700">{progress.notes}</p>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Dettaglio Esercizi</h2>
          {progress.exercises.map((exercise, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-4">{exercise.exercise.name}</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Set</th>
                      <th className="px-4 py-2 text-left">Peso (kg)</th>
                      <th className="px-4 py-2 text-left">Ripetizioni</th>
                      <th className="px-4 py-2 text-left">RPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex} className="border-t">
                        <td className="px-4 py-2">{setIndex + 1}</td>
                        <td className="px-4 py-2">{set.weight}</td>
                        <td className="px-4 py-2">{set.reps}</td>
                        <td className="px-4 py-2">{set.rpe || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {exercise.notes && (
                <div className="mt-4 text-gray-600">
                  <span className="font-medium">Note:</span> {exercise.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 