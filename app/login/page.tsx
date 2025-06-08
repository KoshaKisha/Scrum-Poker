import { Suspense } from "react"
import LoginForm from "@/components/login-page"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка формы входа...</div>}>
      <LoginForm />
    </Suspense>
  )
}
