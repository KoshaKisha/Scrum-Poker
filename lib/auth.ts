export async function login(data: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })

  if (!res.ok) {
    const result = await res.json()
    throw new Error(result?.error || "Login failed")
  }

  return res.json()
}

export async function getCurrentUser() {
  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
    })

    if (!res.ok) {
      console.warn("⚠️ /api/auth/me →", res.status)
      return null
    }

    const data = await res.json()
    console.log("✅ user from /api/auth/me →", data)
    return data.user
  } catch (e) {
    console.error("❌ Ошибка в getCurrentUser:", e)
    return null
  }
}


export async function register(data: {
  name?: string
  email: string
  password: string
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body?.error || "Registration failed")
  return body
}