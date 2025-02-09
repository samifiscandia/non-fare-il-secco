import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/models/ExerciseSchema';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const exercise = await Exercise.create(data);
    return NextResponse.json(exercise, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'esercizio' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const exercises = await Exercise.find({});
    return NextResponse.json(exercises);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero degli esercizi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const exercise = await Exercise.findByIdAndUpdate(
      id,
      updateData,
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

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID non fornito' },
        { status: 400 }
      );
    }

    const exercise = await Exercise.findByIdAndDelete(id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Esercizio non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Esercizio eliminato con successo' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione dell\'esercizio' },
      { status: 500 }
    );
  }
} 