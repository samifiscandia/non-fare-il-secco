'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaHome, FaCalendar, FaClock, FaDumbbell } from 'react-icons/fa';

interface WorkoutProgress {
  _id: string;
  workout: {
    _id: string;
    name: string;
  };
  date: string;
  duration: number;
  mood: string;
  exercises: Array<{
    exercise: {
      name: string;
    };
    sets: Array<{
      weight: number;
      reps: number;
      rpe?: number;
    }>;
  }>;
}

export default function Progressi() {
  const [progressList, setProgressList] = useState<WorkoutProgress[]>([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progressi');
      if (response.ok) {
        const data = await response.json();
        setProgressList(data);
      }
    } catch (error) {
      console.error('Errore durante il recupero dei progressi:', error);
    }
  };

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
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
          >
            <FaHome /> Home
          </Link>
          <h1 className="text-2xl font-bold">I Miei Progressi</h1>
        </div>
        <Link 
          href="/progressi/nuovo"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          <FaPlus /> Nuovo Allenamento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {progressList.map((progress) => (
          <Link
            key={progress._id}
            href={`/progressi/${progress._id}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-xl">{progress.workout.name}</h3>
                  <span className="text-2xl" title={`Umore: ${progress.mood}`}>
                    {getMoodEmoji(progress.mood)}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaCalendar /> {formatDate(progress.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {progress.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FaDumbbell /> {progress.exercises.length} esercizi
                  </span>
                </div>
                <div className="mt-2">
                  {progress.exercises.map((exercise, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {exercise.exercise.name}: {exercise.sets.length} serie
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {progressList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Non hai ancora registrato nessun allenamento</p>
            <Link 
              href="/progressi/nuovo"
              className="text-blue-500 hover:text-blue-700"
            >
              Registra il tuo primo allenamento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 