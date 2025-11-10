/**
 * Admin Dashboard - Frontend JavaScript
 * Handles admin statistics, filtering, and request management
 */

const API_BASE_URL = "/api"
let allRequests = []

// DOM Elements
const totalRequestsEl = document.getElementById("totalRequests")
const pendingRequestsEl = document.getElementById("pendingRequests")
const inProgressRequestsEl = document.getElementById("inProgressRequests")
const resolvedRequestsEl = document.getElementById("resolvedRequests")
const closedRequestsEl = document.getElementById("closedRequests")
const criticalRequestsEl = document.getElementById("criticalRequests")

const priorityCriticalEl = document.getElementById("priorityCritical")
const priorityHighEl = document.getElementById("priorityHigh")
const priorityMediumEl = document.getElementById("priorityMedium")
const priorityLowEl = document.getElementById("priorityLow")

const adminRequestsList = document.getElementById("adminRequestsList")
const adminRefreshBtn = document.getElementById("adminRefreshBtn")
const adminSearchInput = document.getElementById("adminSearchInput")
const adminStatusFilter = document.getElementById("adminStatusFilter")
const adminPriorityFilter = document.getElementById("adminPriorityFilter")
const editModal = document.getElementById("editModal")
const editForm = document.getElementById("editForm")
const editMessage = document.getElementById("editMessage")
const closeBtn = document.querySelector(".close")
const cancelBtn = document.getElementById("cancelBtn")

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadAdminData()
  adminRefreshBtn.addEventListener("click", loadAdminData)
  adminSearchInput.addEventListener("input", filterAdminRequests)
  adminStatusFilter.addEventListener("change", filterAdminRequests)
  adminPriorityFilter.addEventListener("change", filterAdminRequests)
  editForm.addEventListener("submit", handleUpdateRequest)
  closeBtn.addEventListener("click", closeModal)
  cancelBtn.addEventListener("click", closeModal)
  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeModal()
  })
})

/**
 * Load admin data - statistics and requests
 */
async function loadAdminData() {
  try {
    await loadStatistics()
    await loadRequests()
  } catch (error) {
    console.error("Error loading admin data:", error)
  }
}

/**
 * Load statistics from API
 */
async function loadStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const stats = await response.json()

    // Update status statistics
    totalRequestsEl.textContent = stats.total
    pendingRequestsEl.textContent = stats.pending
    inProgressRequestsEl.textContent = stats.in_progress
    resolvedRequestsEl.textContent = stats.resolved
    closedRequestsEl.textContent = stats.closed
    criticalRequestsEl.textContent = stats.critical

    // Update priority statistics
    priorityCriticalEl.textContent = stats.critical
    priorityHighEl.textContent = stats.high
    priorityMediumEl.textContent = stats.medium
    priorityLowEl.textContent = stats.low
  } catch (error) {
    console.error("Error loading statistics:", error)
  }
}

/**
 * Load all requests
 */
async function loadRequests() {
  try {
    const response = await fetch(`${API_BASE_URL}/requests`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    allRequests = await response.json()
    displayAdminRequests(allRequests)
  } catch (error) {
    console.error("Error loading requests:", error)
  }
}

/**
 * Display requests in admin view
 */
function displayAdminRequests(requests) {
  if (requests.length === 0) {
    adminRequestsList.innerHTML = `
            <div class="empty-state">
                <h3>No maintenance requests found</h3>
                <p>All requests have been resolved or no requests exist yet</p>
            </div>
        `
    return
  }

  adminRequestsList.innerHTML = requests
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
                    <small>Created: ${formatDate(req.created_at)}</small><br>
                    <small>Updated: ${formatDate(req.updated_at)}</small>
                </div>
                <div class="request-actions">
                    <button class="btn btn-primary btn-small" onclick="openEditModal('${req.id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteRequest('${req.id}')">Delete</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

/**
 * Filter admin requests
 */
function filterAdminRequests() {
  const searchTerm = adminSearchInput.value.toLowerCase()
  const statusTerm = adminStatusFilter.value
  const priorityTerm = adminPriorityFilter.value

  const filtered = allRequests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm) || req.description.toLowerCase().includes(searchTerm)
    const matchesStatus = !statusTerm || req.status === statusTerm
    const matchesPriority = !priorityTerm || req.priority === priorityTerm
    return matchesSearch && matchesStatus && matchesPriority
  })

  displayAdminRequests(filtered)
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
 * Handle update request
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
      loadAdminData()
    }, 1000)
  } catch (error) {
    console.error("Error updating request:", error)
    showMessage(editMessage, error.message, "error")
  }
}

/**
 * Delete request
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

    alert("Request deleted successfully!")
    loadAdminData()
  } catch (error) {
    console.error("Error deleting request:", error)
    alert(error.message)
  }
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
