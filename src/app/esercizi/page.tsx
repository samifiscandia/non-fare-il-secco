'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaPencilAlt, FaTrashAlt, FaHome } from 'react-icons/fa';

interface Exercise {
  _id: string;
  name: string;
  targetMuscle: string;
  difficulty: string;
}

export default function Esercizi() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo esercizio?')) {
      try {
        const response = await fetch(`/api/esercizi/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchExercises();
        }
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold">Catalogo Esercizi</h1>
        </div>
        <Link 
          href="/esercizi/nuovo"
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
        >
          <FaPlus /> Nuovo Esercizio
        </Link>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Cerca esercizio..."
          className="w-full p-2 pl-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map((exercise) => (
          <div 
            key={exercise._id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
          >
            <Link href={`/esercizi/${exercise._id}`} className="block">
              <div className="flex-1">
                <h3 className="font-bold text-lg hover:text-blue-600">
                  {exercise.name}
                </h3>
                <p className="text-gray-600">Muscolo: {exercise.targetMuscle}</p>
                <p className="text-sm text-gray-500 capitalize">
                  Livello: {exercise.difficulty}
                </p>
              </div>
            </Link>
            <div className="flex gap-3 mt-4 border-t pt-4">
              <Link
                href={`/esercizi/modifica/${exercise._id}`}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Modifica esercizio"
              >
                <FaPencilAlt size={18} />
              </Link>
              <button
                onClick={() => handleDelete(exercise._id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Elimina esercizio"
              >
                <FaTrashAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 