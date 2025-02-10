'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuovoEsercizio() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscleGroup: '',
    equipment: '',
    secondaryMuscles: '',
    videoUrl: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        secondaryMuscles: formData.secondaryMuscles.split(',').map(m => m.trim()).filter(Boolean)
      };

      const response = await fetch('/api/esercizi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante il salvataggio');
      }

      router.push('/esercizi');
      router.refresh();
    } catch (err) {
      console.error('Errore:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio dell\'esercizio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nuovo Esercizio</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Nome Esercizio</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="muscleGroup" className="block mb-1">Gruppo Muscolare</label>
          <input
            id="muscleGroup"
            type="text"
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="equipment" className="block mb-1">Attrezzatura</label>
          <input
            id="equipment"
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">Descrizione</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="secondaryMuscles" className="block mb-1">Muscoli Secondari</label>
          <input
            id="secondaryMuscles"
            type="text"
            name="secondaryMuscles"
            value={formData.secondaryMuscles}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="videoUrl" className="block mb-1">URL Video (opzionale)</label>
          <input
            id="videoUrl"
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1">URL Immagine (opzionale)</label>
          <input
            id="imageUrl"
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Salvataggio in corso...' : 'Salva Esercizio'}
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