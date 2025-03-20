import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { experimentId, word } = await req.json();

    if (!experimentId || !word) {
      return NextResponse.json(
        { error: "Experiment ID and word are required" },
        { status: 400 }
      );
    }

    const newWord = await prisma.word.create({
      data: { experimentId, content: word },
    });

    return NextResponse.json(newWord, { status: 201 });
  } catch (error) {
    console.error("Error adding word to experiment:", error);
    return NextResponse.json(
      { error: "Error adding word to experiment" },
      { status: 500 }
    );
  }
}
