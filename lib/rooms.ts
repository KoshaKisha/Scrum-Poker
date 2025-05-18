export async function createRoom(data: { name: string; description?: string }) {
  const res = await fetch("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to create room")
  }

  return res.json()
}

export async function getUserRooms() {
  const res = await fetch("/api/rooms", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) throw new Error("Failed to fetch user rooms")

  return res.json()
}

export async function getRoom(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to load room")
  }

  return res.json()
}

export async function joinRoom(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}/join`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to join room")
  }

  return res.json()
}

export async function submitVote(roomId: string, vote: string) {
  const res = await fetch(`/api/rooms/${roomId}/vote`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote }),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to submit vote")
  }

  return res.json()
}

export async function revealVotes(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}/reveal`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to reveal votes")
  }

  return res.json()
}

export async function resetVotes(roomId: string) {
  const res = await fetch(`/api/rooms/${roomId}/reset`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || "Failed to reset votes")
  }

  return res.json()
}

export async function deleteRoom(roomId: string): Promise<void> {
  const response = await fetch(`/api/rooms/${roomId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json()
    if (response.status === 403) {
      throw new Error("You don't have permission to delete this room")
    }
    throw new Error(error.message || "Failed to delete room")
  }
}