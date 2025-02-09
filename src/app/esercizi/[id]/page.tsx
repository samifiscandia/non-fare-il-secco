'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPencilAlt, FaDumbbell, FaListUl } from 'react-icons/fa';
import { use } from 'react';

interface Exercise {
  _id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  description: string;
  instructions: string;
  difficulty: string;
  mediaUrl?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DettaglioEsercizio({ params }: PageProps) {
  const resolvedParams = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/esercizi/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setExercise(data);
        }
      } catch (error) {
        console.error('Errore durante il recupero dell\'esercizio:', error);
      }
    };

    fetchExercise();
  }, [resolvedParams.id]);

  if (!exercise) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{exercise.name}</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaDumbbell /> {exercise.targetMuscle}
            </span>
            <span className="capitalize">
              Livello: {exercise.difficulty}
            </span>
          </div>
        </div>
        <Link
          href={`/esercizi/modifica/${exercise._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FaPencilAlt /> Modifica
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <FaDumbbell className="text-gray-600" /> 
            Dettagli Muscolari
          </h2>
          <div className="space-y-2">
            <p><span className="font-medium">Muscolo Principale:</span> {exercise.targetMuscle}</p>
            {exercise.secondaryMuscles.length > 0 && (
              <p><span className="font-medium">Muscoli Secondari:</span> {exercise.secondaryMuscles.join(', ')}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <FaListUl className="text-gray-600" />
            Attrezzatura
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {exercise.equipment.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Descrizione</h2>
          <p className="text-gray-700 whitespace-pre-line">{exercise.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Istruzioni</h2>
          <div className="bg-white p-4 rounded-lg border">
            <ol className="list-decimal list-inside space-y-2">
              {exercise.instructions.split('\n').map((instruction, index) => (
                <li key={index} className="text-gray-700">{instruction.trim()}</li>
              ))}
            </ol>
          </div>
        </div>

        {exercise.mediaUrl && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Media</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={exercise.mediaUrl} 
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/esercizi"
          className="text-blue-500 hover:text-blue-700"
        >
          ← Torna al catalogo
        </Link>
      </div>
    </div>
  );
} 