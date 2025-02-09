import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workout from '@/models/WorkoutSchema';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const workout = await Workout.create(data);
    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante la creazione della scheda' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const workouts = await Workout.find({}).populate('exercises.exercise');
    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore durante il recupero delle schede' },
      { status: 500 }
    );
  }
} 