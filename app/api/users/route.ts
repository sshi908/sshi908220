import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: { username },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
