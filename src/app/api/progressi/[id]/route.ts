import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WorkoutProgress from '@/models/ProgressSchema';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const progress = await WorkoutProgress.findById(params.id)
      .populate('workout', 'name')
      .populate('exercises.exercise', 'name');
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Allenamento non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'allenamento' },
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
    const progress = await WorkoutProgress.findByIdAndDelete(params.id);
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Allenamento non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Allenamento eliminato con successo' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione dell\'allenamento' },
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
    
    const progress = await WorkoutProgress.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    ).populate('workout', 'name').populate('exercises.exercise', 'name');
    
    if (!progress) {
      return NextResponse.json(
        { error: 'Allenamento non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'allenamento' },
      { status: 500 }
    );
  }
}