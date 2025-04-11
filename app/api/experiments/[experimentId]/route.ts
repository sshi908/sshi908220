import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ experimentId: string }> }
) {
  try {
    const { experimentId } = await params;
    if (!experimentId) {
      return NextResponse.json(
        { error: "Experiment ID is required" },
        { status: 400 }
      );
    }

    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: {
        seedWord: true,
        user: true,
        words: { include: { ratings: true }, orderBy: { createdAt: "asc" } },
      },
    });

    if (!experiment) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        experimentId: experiment.id,
        username: experiment.user.username,
        seedWord: experiment.seedWord.word,
        words: experiment.words.map(
          (word: {
            content: string;
            id: string;
            ratings: {
              relevance: number;
              negativePositive: number;
              timePerspective: number;
              voluntary: number;
            }[];
          }) => ({
            id: word.id,
            word: word.content,
            ratings: word.ratings.map((rating) => ({
              relevance: rating.relevance,
              negativePositive: rating.negativePositive,
              timePerspective: rating.timePerspective,
              voluntary: rating.voluntary,
            })),
          })
        ),
        createdAt: experiment.createdAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching experiment details:", error);
    return NextResponse.json(
      { error: "Error fetching experiment details" },
      { status: 500 }
    );
  }
}
