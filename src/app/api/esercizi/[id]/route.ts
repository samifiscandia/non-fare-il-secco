import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/models/ExerciseSchema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const exercise = await Exercise.findById(params.id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Esercizio non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'esercizio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const exercise = await Exercise.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    );
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Esercizio non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'esercizio' },
      { status: 500 }
    );
  }
} 