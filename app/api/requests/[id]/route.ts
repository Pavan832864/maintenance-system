import { type NextRequest, NextResponse } from "next/server"

// In-memory database reference (same as route.ts)
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const req = requests.find((r) => r.id === id)

  if (!req) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  return NextResponse.json(req)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const index = requests.findIndex((r) => r.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Validation for updates
    if (body.title && (body.title.length < 3 || body.title.length > 100)) {
      return NextResponse.json({ error: "Title must be 3-100 characters" }, { status: 400 })
    }

    if (body.description && (body.description.length < 10 || body.description.length > 500)) {
      return NextResponse.json({ error: "Description must be 10-500 characters" }, { status: 400 })
    }

    if (body.priority && !["Low", "Medium", "High", "Critical"].includes(body.priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 })
    }

    if (body.status && !["Open", "In Progress", "Completed", "Closed"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    requests[index] = { ...requests[index], ...body }
    return NextResponse.json(requests[index])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  const index = requests.findIndex((r) => r.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 })
  }

  const deleted = requests.splice(index, 1)
  return NextResponse.json(deleted[0])
}
