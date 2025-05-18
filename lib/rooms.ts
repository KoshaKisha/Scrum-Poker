export async function createRoom(data: { name: string; description?: string }) {
  const res = await fetch("/api/rooms/create", {
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
