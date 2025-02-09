'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function ModificaEsercizio({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetMuscle: '',
    secondaryMuscles: '',
    equipment: '',
    description: '',
    instructions: '',
    difficulty: '',
    mediaUrl: ''
  });

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/esercizi/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setExercise(data);
          setFormData({
            name: data.name,
            targetMuscle: data.targetMuscle,
            secondaryMuscles: data.secondaryMuscles.join(', '),
            equipment: data.equipment.join(', '),
            description: data.description,
            instructions: data.instructions,
            difficulty: data.difficulty,
            mediaUrl: data.mediaUrl || ''
          });
        }
      } catch (error) {
        console.error('Errore durante il recupero dell\'esercizio:', error);
      }
    };

    fetchExercise();
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/esercizi/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          secondaryMuscles: formData.secondaryMuscles.split(',').map(m => m.trim()),
          equipment: formData.equipment.split(',').map(e => e.trim()),
        }),
      });

      if (response.ok) {
        router.push('/esercizi');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!exercise) {
    return <div className="p-4">Caricamento...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Modifica Esercizio</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome Esercizio</label>
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
          <label className="block mb-1">Muscolo Principale</label>
          <input
            type="text"
            name="targetMuscle"
            value={formData.targetMuscle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Muscoli Secondari (separati da virgola)</label>
          <input
            type="text"
            name="secondaryMuscles"
            value={formData.secondaryMuscles}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Attrezzatura Necessaria (separata da virgola)</label>
          <input
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
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

        <div>
          <label className="block mb-1">Istruzioni</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
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

        <div>
          <label className="block mb-1">URL Media (opzionale)</label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Salva Modifiche
          </button>
          <Link
            href="/esercizi"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
} 