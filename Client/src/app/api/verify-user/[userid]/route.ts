import { NextResponse } from "next/server"

// Simulated database
const users = ["user1", "user2", "user3"]

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId

  const userExists = users.includes(userId)

  return NextResponse.json({ userExists })
}

