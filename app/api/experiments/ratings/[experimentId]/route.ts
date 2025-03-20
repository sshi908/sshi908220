import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ experimentId: string }> }
) {
  try {
    const { experimentId } = await params;
    const { ratings } = await req.json();

    if (!experimentId || !Array.isArray(ratings) || ratings.length !== 20) {
      return NextResponse.json(
        { error: "Invalid experiment ID or ratings array" },
        { status: 400 }
      );
    }

    // Fetch words associated with the experiment
    const words = await prisma.word.findMany({
      where: { experimentId },
      select: { id: true },
    });

    // Save ratings for each word
    const ratingEntries = words.map((word: { id: string }, index: number) => ({
      experimentId,
      wordId: word.id,
      score: ratings[index],
    }));
    await prisma.rating.createMany({ data: ratingEntries });

    return NextResponse.json(
      { message: "Ratings saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving experiment ratings:", error);
    return NextResponse.json(
      { error: "Error saving experiment ratings" },
      { status: 500 }
    );
  }
}
