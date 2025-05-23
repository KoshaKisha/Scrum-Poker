
export async function updatePassword(data: { currentPassword: string; newPassword: string }) {
  const res = await fetch("/api/settings/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const result = await res.json()
    throw new Error(result.error || "Failed to update password")
  }
}