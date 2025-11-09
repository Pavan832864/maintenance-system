import { type NextRequest, NextResponse } from "next/server"

// In-memory database (for demo - replace with real DB)
const requests: any[] = [
  {
    id: 1,
    title: "Water Leakage in Room 205",
    description: "There is water leaking from the ceiling in room 205. Needs immediate attention.",
    priority: "Critical",
    status: "Open",
    created_by: "Admin",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "HVAC System Maintenance",
    description: "Annual HVAC system maintenance and filter replacement needed.",
    priority: "High",
    status: "In Progress",
    created_by: "Admin",
    created_at: new Date().toISOString(),
  },
]

let nextId = 3

export async function GET() {
  return NextResponse.json(requests)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.title || body.title.length < 3 || body.title.length > 100) {
      return NextResponse.json({ error: "Title must be 3-100 characters" }, { status: 400 })
    }

    if (!body.description || body.description.length < 10 || body.description.length > 500) {
      return NextResponse.json({ error: "Description must be 10-500 characters" }, { status: 400 })
    }

    if (!["Low", "Medium", "High", "Critical"].includes(body.priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 })
    }

    const newRequest = {
      id: nextId++,
      title: body.title,
      description: body.description,
      priority: body.priority,
      status: "Open",
      created_by: body.created_by || "Admin",
      created_at: new Date().toISOString(),
    }

    requests.push(newRequest)
    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
