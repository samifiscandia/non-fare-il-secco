'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

interface DettaglioEsercizioProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default function DettaglioEsercizio({ params }: DettaglioEsercizioProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/esercizi/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Esercizio non trovato');
        
        const data = await response.json();
        setExercise(data);
      } catch (err) {
        console.error('Errore:', err);
        setError('Errore nel caricamento dell\'esercizio');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare questo esercizio?')) return;

    try {
      const response = await fetch(`/api/esercizi?id=${resolvedParams.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Errore durante l\'eliminazione');

      router.push('/esercizi');
      router.refresh();
    } catch (err) {
      console.error('Errore:', err);
      setError('Errore durante l\'eliminazione dell\'esercizio');
    }
  };

  if (loading) return <div className="p-4">Caricamento...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!exercise) return <div className="p-4">Esercizio non trovato</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/esercizi"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Torna al catalogo
        </Link>
        <div className="flex gap-4">
          <Link
            href={`/esercizi/modifica/${resolvedParams.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaPencilAlt size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{exercise.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Dettagli</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Gruppo Muscolare:</span> {exercise.muscleGroup}</p>
              <p><span className="font-medium">Attrezzatura:</span> {exercise.equipment}</p>
              <p><span className="font-medium">Muscoli Secondari:</span> {Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles.join(', ') : exercise.secondaryMuscles}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Descrizione</h2>
            <p className="whitespace-pre-wrap">{exercise.description}</p>
          </div>
        </div>

        {(exercise.videoUrl || exercise.imageUrl) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Media</h2>
            <div className="space-y-2">
              {exercise.videoUrl && (
                <p>
                  <span className="font-medium">Video:</span>{' '}
                  <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                    Guarda il video
                  </a>
                </p>
              )}
              {exercise.imageUrl && (
                <div>
                  <span className="font-medium">Immagine:</span>
                  <img src={exercise.imageUrl} alt={exercise.name} className="mt-2 max-w-full h-auto rounded" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 