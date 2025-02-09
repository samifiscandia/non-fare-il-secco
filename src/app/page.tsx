'use client';
import Link from 'next/link';
import { FaDumbbell, FaClipboardList, FaChartLine, FaCalculator } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Non Fare il Secco</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/esercizi"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaDumbbell className="text-2xl text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Catalogo Esercizi</h2>
                <p className="text-gray-600">
                  Esplora la nostra raccolta completa di esercizi con descrizioni dettagliate
                </p>
              </div>
            </div>
          </Link>

          <Link 
            href="/schede"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaClipboardList className="text-2xl text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Le Mie Schede</h2>
                <p className="text-gray-600">
                  Gestisci le tue schede di allenamento personalizzate
                </p>
              </div>
            </div>
          </Link>

          <Link 
            href="/progressi"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaChartLine className="text-2xl text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Traccia i Progressi</h2>
                <p className="text-gray-600">
                  Registra i tuoi allenamenti e monitora i tuoi progressi
                </p>
              </div>
            </div>
          </Link>

          <Link 
            href="/calcolatori/rpe"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <FaCalculator className="text-2xl text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Calcolatore RPE</h2>
                <p className="text-gray-600">
                  Calcola l'intensità percepita del tuo allenamento
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}