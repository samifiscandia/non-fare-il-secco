'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaPencilAlt, FaTrashAlt, FaClock, FaDumbbell, FaHome } from 'react-icons/fa';

interface Workout {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  frequency: string;
  duration: number;
  exercises: Array<{
    exercise: {
      name: string;
    };
    sets: number;
    reps: string;
  }>;
}

export default function Schede() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa scheda?')) {
      try {
        const response = await fetch(`/api/schede/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchWorkouts();
        }
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">Le Mie Schede</h1>
        </div>
        <Link 
          href="/schede/nuova"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          <FaPlus /> Nuova Scheda
        </Link>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Cerca scheda..."
          className="w-full p-2 pl-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredWorkouts.map((workout) => (
          <div 
            key={workout._id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex justify-between items-start">
              <Link 
                href={`/schede/${workout._id}`}
                className="flex-1 cursor-pointer"
              >
                <div>
                  <h3 className="font-bold text-xl mb-2">{workout.name}</h3>
                  <p className="text-gray-600 mb-2">{workout.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
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
                  <p className="text-sm text-gray-500 mt-2">
                    Frequenza: {workout.frequency}
                  </p>
                </div>
              </Link>
              <div className="flex gap-3 ml-4">
                <Link
                  href={`/schede/modifica/${workout._id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  title="Modifica scheda"
                >
                  <FaPencilAlt size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(workout._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Elimina scheda"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 