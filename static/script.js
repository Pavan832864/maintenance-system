/**
 * Maintenance Request Management System - Frontend JavaScript
 * Handles all CRUD operations and UI interactions
 */

const API_BASE_URL = "/api"
let allRequests = []

// DOM Elements
const createForm = document.getElementById("createForm")
const createMessage = document.getElementById("createMessage")
const requestsList = document.getElementById("requestsList")
const refreshBtn = document.getElementById("refreshBtn")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")
const editModal = document.getElementById("editModal")
const editForm = document.getElementById("editForm")
const editMessage = document.getElementById("editMessage")
const closeBtn = document.querySelector(".close")
const cancelBtn = document.getElementById("cancelBtn")

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadRequests()
  createForm.addEventListener("submit", handleCreateRequest)
  refreshBtn.addEventListener("click", loadRequests)
  searchInput.addEventListener("input", filterRequests)
  statusFilter.addEventListener("change", filterRequests)
  editForm.addEventListener("submit", handleUpdateRequest)
  closeBtn.addEventListener("click", closeModal)
  cancelBtn.addEventListener("click", closeModal)
  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal()
  })
})

/**
 * Load all maintenance requests from API
 */
async function loadRequests() {
  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/requests`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    allRequests = await response.json()
    displayRequests(allRequests)
  } catch (error) {
    console.error("Error loading requests:", error)
    showError("Failed to load requests. Please try again.")
  }
}

/**
 * Display requests in the UI
 */
function displayRequests(requests) {
  if (requests.length === 0) {
    requestsList.innerHTML = `
            <div class="empty-state">
                <h3>No maintenance requests found</h3>
                <p>Submit a new request to get started</p>
            </div>
        `
    return
  }

  requestsList.innerHTML = requests
    .map(
      (req) => `
        <div class="request-card">
            <div class="request-header">
                <h3 class="request-title">${escapeHtml(req.title)}</h3>
            </div>
            <div class="request-meta">
                <span class="badge badge-status ${req.status.toLowerCase().replace(" ", "-")}">
                    ${escapeHtml(req.status)}
                </span>
                <span class="badge badge-priority ${req.priority.toLowerCase()}">
                    ${escapeHtml(req.priority)} Priority
                </span>
            </div>
            <p class="request-description">${escapeHtml(req.description)}</p>
            <div class="request-footer">
                <div>
                    <small>Created by: ${escapeHtml(req.created_by)}</small><br>
                    <small>Created: ${formatDate(req.created_at)}</small>
                </div>
                <div class="request-actions">
                    <button class="btn btn-primary btn-small" onclick="openEditModal(${req.id})">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteRequest(${req.id})">Delete</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

/**
 * Handle create request form submission
 */
async function handleCreateRequest(e) {
  e.preventDefault()

  const title = document.getElementById("title").value.trim()
  const description = document.getElementById("description").value.trim()
  const priority = document.getElementById("priority").value
  const createdBy = document.getElementById("createdBy").value.trim() || "User"

  // Validation
  if (!title || !description) {
    showMessage(createMessage, "Please fill in all required fields", "error")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        created_by: createdBy,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create request")
    }

    showMessage(createMessage, "Request created successfully!", "success")
    createForm.reset()
    loadRequests()
  } catch (error) {
    console.error("Error creating request:", error)
    showMessage(createMessage, error.message, "error")
  }
}

/**
 * Open edit modal for a request
 */
async function openEditModal(requestId) {
  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch request")
    }

    const request = await response.json()

    document.getElementById("editId").value = request.id
    document.getElementById("editTitle").value = request.title
    document.getElementById("editDescription").value = request.description
    document.getElementById("editStatus").value = request.status
    document.getElementById("editPriority").value = request.priority

    editMessage.innerHTML = ""
    editModal.classList.add("show")
  } catch (error) {
    console.error("Error opening edit modal:", error)
    alert("Failed to load request details")
  }
}

/**
 * Close edit modal
 */
function closeModal() {
  editModal.classList.remove("show")
  editForm.reset()
  editMessage.innerHTML = ""
}

/**
 * Handle update request form submission
 */
async function handleUpdateRequest(e) {
  e.preventDefault()

  const requestId = document.getElementById("editId").value
  const title = document.getElementById("editTitle").value.trim()
  const description = document.getElementById("editDescription").value.trim()
  const status = document.getElementById("editStatus").value
  const priority = document.getElementById("editPriority").value

  const updateData = {}
  if (title) updateData.title = title
  if (description) updateData.description = description
  if (status) updateData.status = status
  if (priority) updateData.priority = priority

  if (Object.keys(updateData).length === 0) {
    showMessage(editMessage, "No changes to save", "error")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update request")
    }

    showMessage(editMessage, "Request updated successfully!", "success")
    setTimeout(() => {
      closeModal()
      loadRequests()
    }, 1000)
  } catch (error) {
    console.error("Error updating request:", error)
    showMessage(editMessage, error.message, "error")
  }
}

/**
 * Delete a maintenance request
 */
async function deleteRequest(requestId) {
  if (!confirm("Are you sure you want to delete this request?")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete request")
    }

    showMessage(createMessage, "Request deleted successfully!", "success")
    loadRequests()
  } catch (error) {
    console.error("Error deleting request:", error)
    showMessage(createMessage, error.message, "error")
  }
}

/**
 * Filter requests based on search and status
 */
function filterRequests() {
  const searchTerm = searchInput.value.toLowerCase()
  const statusTerm = statusFilter.value

  const filtered = allRequests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm) || req.description.toLowerCase().includes(searchTerm)
    const matchesStatus = !statusTerm || req.status === statusTerm
    return matchesSearch && matchesStatus
  })

  displayRequests(filtered)
}

/**
 * Show loading state
 */
function showLoading() {
  requestsList.innerHTML = '<p class="loading">Loading requests...</p>'
}

/**
 * Show message in a container
 */
function showMessage(container, message, type) {
  container.textContent = message
  container.className = `message ${type}`

  if (type === "success") {
    setTimeout(() => {
      container.className = "message"
      container.textContent = ""
    }, 3000)
  }
}

/**
 * Show error message
 */
function showError(message) {
  showMessage(createMessage, message, "error")
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
