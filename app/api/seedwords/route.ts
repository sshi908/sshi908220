import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const seedWords = await prisma.seedWord.findMany();
    return NextResponse.json(
      seedWords.map((word: { id: string; word: string }) => ({
        id: word.id,
        word: word.word,
      }))
    );
  } catch (error) {
    console.error("Error fetching seed words:", error);
    return NextResponse.json(
      { error: "Error fetching seed words" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { word } = await req.json();
    const newWord = await prisma.seedWord.create({
      data: { word },
    });
    return NextResponse.json(newWord, { status: 201 });
  } catch (error) {
    console.error("Error saving seed word:", error);
    return NextResponse.json(
      { error: "Error saving seed word" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Seed word ID is required" },
        { status: 400 }
      );
    }

    const deletedWord = await prisma.seedWord.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Seed word deleted", deletedWord },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting seed word:", error);
    return NextResponse.json(
      { error: "Error deleting seed word" },
      { status: 500 }
    );
  }
}
