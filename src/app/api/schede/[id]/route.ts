import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workout from '@/models/WorkoutSchema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const workout = await Workout.findById(params.id).populate('exercises.exercise');
    
    if (!workout) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero della scheda' },
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
    
    const workout = await Workout.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    
    if (!workout) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(workout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento della scheda' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const workout = await Workout.findByIdAndDelete(params.id);
    
    if (!workout) {
      return NextResponse.json(
        { error: 'Scheda non trovata' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Scheda eliminata con successo' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della scheda' },
      { status: 500 }
    );
  }
} 