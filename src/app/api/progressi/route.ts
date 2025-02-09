import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import WorkoutProgress from '@/models/ProgressSchema';

export async function GET() {
  try {
    await dbConnect();
    const progress = await WorkoutProgress.find({})
      .populate('workout', 'name')
      .populate('exercises.exercise', 'name')
      .sort({ date: -1 });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero dei progressi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const progress = await WorkoutProgress.create(data);
    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante la creazione del progresso' },
      { status: 500 }
    );
  }
} 