import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  try {
    const experiments = await prisma.experiment.findMany({
      include: { seedWord: true, user: true, words: true },
    });

    return NextResponse.json(
      experiments.map(
        (experiment: {
          id: string;
          user: { username: string };
          seedWord: { word: string };
          words: {
            experimentId: string;
            id: string;
            createdAt: Date;
            content: string;
          }[];
          createdAt: Date;
        }) => ({
          experimentId: experiment.id,
          username: experiment.user.username,
          seedWord: experiment.seedWord.word,
          wordCount: experiment.words.map((word) => word.content).length,
          createdAt: experiment.createdAt,
        })
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching experiments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, seedWordId } = await req.json();

    if (!userId || !seedWordId) {
      return NextResponse.json(
        { error: "User ID and Seed Word ID are required" },
        { status: 400 }
      );
    }

    const newExperiment = await prisma.experiment.create({
      data: { userId, seedWordId },
    });

    return NextResponse.json(newExperiment, { status: 201 });
  } catch (error) {
    console.error("Error creating experiment:", error);
    return NextResponse.json(
      { error: "Error creating experiment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const experimentId = searchParams.get("experimentId");

    if (!experimentId) {
      return NextResponse.json(
        { error: "Experiment ID is required" },
        { status: 400 }
      );
    }

    await prisma.experiment.delete({
      where: { id: experimentId },
    });

    return NextResponse.json(
      { message: "Experiment deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting experiment:", error);
    return NextResponse.json(
      { error: "Error deleting experiment" },
      { status: 500 }
    );
  }
}
