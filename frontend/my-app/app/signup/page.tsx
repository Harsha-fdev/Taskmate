'use client'

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SignUpFormData {
  username: string
  email: string
  password: string
}

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        alert(result.message || "Signup successful")
        router.push("/login")  // client side navigation
      } else {
        alert(result.message || "Signup failed")
      }
    } catch (err) {
      alert("Signup failed. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create an Account</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input 
                placeholder="Username" 
                {...register("username", { required: "Username is required" })} 
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <Input 
                placeholder="Email" 
                type="email" 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })} 
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input 
                placeholder="Password" 
                type="password" 
                {...register("password", { required: "Password is required" })} 
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
