'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaCalculator, FaInfoCircle } from 'react-icons/fa';

export default function CalcolatoreRPE() {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [maxWeight, setMaxWeight] = useState<string>('');
  const [calculatedRPE, setCalculatedRPE] = useState<number | null>(null);
  const [showMaxCalculator, setShowMaxCalculator] = useState(false);
  const [estimatedMax, setEstimatedMax] = useState<number | null>(null);

  // Calcola l'RPE basato sulla percentuale del massimale e ripetizioni
  const calculateRPE = () => {
    if (!weight || !reps || !maxWeight) return;

    const percentage = (parseFloat(weight) / parseFloat(maxWeight)) * 100;
    const repsNumber = parseInt(reps);

    // Tabella RPE approssimativa basata su % 1RM e ripetizioni
    const rpeTable: { [key: number]: number[] } = {
      100: [10], // 100% 1RM = 1 rep @ RPE 10
      95: [9.5, 10], // 95% 1RM = 2 reps @ RPE 10
      90: [8.5, 9, 9.5, 10], // 90% 1RM = 3-4 reps @ RPE 10
      85: [8, 8.5, 9, 9.5, 10], // 85% 1RM = 5-6 reps @ RPE 10
      80: [7.5, 8, 8.5, 9, 9.5, 10], // ecc.
      75: [7, 7.5, 8, 8.5, 9, 9.5, 10],
      70: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    };

    // Trova la percentuale più vicina
    const nearestPercentage = Object.keys(rpeTable)
      .map(Number)
      .reduce((prev, curr) => {
        return Math.abs(curr - percentage) < Math.abs(prev - percentage) ? curr : prev;
      });

    // Calcola RPE basato sulle ripetizioni
    const rpeArray = rpeTable[nearestPercentage];
    const rpeIndex = Math.min(repsNumber - 1, rpeArray.length - 1);
    setCalculatedRPE(rpeArray[rpeIndex]);
  };

  // Calcola il massimale stimato (1RM) usando la formula di Brzycki
  const calculateEstimatedMax = () => {
    if (!weight || !reps) return;
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const max = w / (1.0278 - 0.0278 * r);
    setEstimatedMax(Math.round(max));
    setMaxWeight(Math.round(max).toString());
    setShowMaxCalculator(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600"
          >
            <FaHome /> Home
          </Link>
          <h1 className="text-2xl font-bold">Calcolatore RPE</h1>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h2 className="font-semibold text-blue-700 mb-2">Cos'è l'RPE?</h2>
        <p className="text-blue-600 mb-2">
          RPE (Rating of Perceived Exertion) è una scala da 1 a 10 che indica quanto è stato intenso lo sforzo:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
          <li>RPE 10: Massimale, non potresti fare altre ripetizioni</li>
          <li>RPE 9: Molto difficile, potresti fare 1 ripetizione in più</li>
          <li>RPE 8: Impegnativo, potresti fare 2 ripetizioni in più</li>
          <li>RPE 7: Moderato, potresti fare 3 ripetizioni in più</li>
          <li>RPE 6: Facile, potresti fare 4+ ripetizioni in più</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">
              Peso Utilizzato (kg)
              <div className="text-sm text-gray-500">Il peso che stai sollevando</div>
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Ripetizioni
              <div className="text-sm text-gray-500">Numero di ripetizioni completate</div>
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Massimale (1RM) in kg
              <div className="text-sm text-gray-500">Il tuo massimale per questo esercizio</div>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.5"
                required
              />
              <button
                type="button"
                onClick={() => setShowMaxCalculator(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
              >
                Calcola 1RM
              </button>
            </div>
          </div>
        </div>

        {showMaxCalculator && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-4">Calcola il tuo massimale (1RM)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Inserisci il peso e le ripetizioni di un set recente per stimare il tuo massimale
            </p>
            <button
              onClick={calculateEstimatedMax}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Calcola Massimale
            </button>
            {estimatedMax && (
              <div className="mt-4">
                <p className="font-medium">Massimale Stimato: {estimatedMax} kg</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={calculateRPE}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Calcola RPE
          </button>

          {calculatedRPE && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-700 mb-2">RPE Stimato</h3>
              <p className="text-2xl font-bold text-purple-600">{calculatedRPE}</p>
              <p className="text-sm text-purple-600 mt-2">
                Questo è un valore stimato basato sul tuo massimale e le ripetizioni eseguite.
                L'RPE effettivo potrebbe variare in base a diversi fattori come recupero, forma fisica del giorno, ecc.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 