"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface Request {
  id: number
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Completed" | "Closed"
  created_by: string
  created_at: string
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    created_by: "Admin",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("All")

  // Fetch all requests
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/requests")
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create new request
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({ title: "", description: "", priority: "Medium", created_by: "Admin" })
        setShowForm(false)
        fetchRequests()
      }
    } catch (error) {
      console.error("Error creating request:", error)
    }
  }

  // Update request
  const handleUpdate = async (id: number, updates: Partial<Request>) => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  // Delete request
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this request?")) return

    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Error deleting request:", error)
    }
  }

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "All" || req.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "Closed":
        return <CheckCircle className="w-5 h-5 text-gray-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Maintenance Requests</h1>
              <p className="text-slate-600 mt-1">Manage and track all maintenance requests</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              New Request
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Request</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                maxLength={500}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Create Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-900 px-6 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Priorities</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 mt-4">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex-1">{request.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(request.priority)}`}
                    >
                      {request.priority}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{request.description}</p>

                  {/* Status and Date */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                    {getStatusIcon(request.status)}
                    <span>{request.status}</span>
                    <span className="ml-auto">{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Status Selector */}
                  <select
                    value={request.status}
                    onChange={(e) => handleUpdate(request.id, { status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Closed</option>
                  </select>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
            <p className="text-slate-600 text-sm">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
            <p className="text-slate-600 text-sm">Open</p>
            <p className="text-2xl font-bold text-red-600">{requests.filter((r) => r.status === "Open").length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
            <p className="text-slate-600 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {requests.filter((r) => r.status === "In Progress").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
            <p className="text-slate-600 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "Completed").length}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
