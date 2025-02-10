import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Exercise from '@/models/Exercise';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Log per debug
    console.log('Dati ricevuti:', data);
    
    // Gestione sicura dei campi
    const safeData = {
      name: data.name?.trim() ?? '',
      description: data.description?.trim() ?? '',
      muscleGroup: data.muscleGroup?.trim() ?? '',
      equipment: data.equipment?.trim() ?? '',
      secondaryMuscles: Array.isArray(data.secondaryMuscles) 
        ? data.secondaryMuscles 
        : (data.secondaryMuscles ?? '').split(',').map((m: string) => m.trim()).filter(Boolean),
      videoUrl: data.videoUrl?.trim() ?? '',
      imageUrl: data.imageUrl?.trim() ?? ''
    };
    
    // Log per debug
    console.log('Dati processati:', safeData);

    if (!safeData.name || !safeData.description || !safeData.muscleGroup || !safeData.equipment) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      );
    }
    
    const exercise = await Exercise.create(safeData);
    return NextResponse.json(exercise, { status: 201 });
  } catch (error: any) {
    console.error('Errore dettagliato:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante il salvataggio dell\'esercizio',
        details: error.message || 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const exercises = await Exercise.find({}).lean();
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Errore durante il recupero:', error);
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
    
    // Gestione sicura dei dati
    const safeData = {
      name: updateData.name ?? '',
      description: updateData.description ?? '',
      muscleGroup: updateData.muscleGroup ?? '',
      equipment: updateData.equipment ?? '',
      secondaryMuscles: Array.isArray(updateData.secondaryMuscles) 
        ? updateData.secondaryMuscles 
        : (updateData.secondaryMuscles ?? '').split(',').map((m: string) => m.trim()).filter(Boolean),
      videoUrl: updateData.videoUrl ?? '',
      imageUrl: updateData.imageUrl ?? ''
    };
    
    const exercise = await Exercise.findByIdAndUpdate(
      id,
      safeData,
      { new: true, runValidators: true }
    );
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Esercizio non trovato' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento dell\'esercizio', details: error },
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