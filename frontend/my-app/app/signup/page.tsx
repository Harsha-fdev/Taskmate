'use client'

import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/users/signup", { //here i have to add deployed url later
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (res.ok) {
        alert(result.message || "Signup successful")
        window.location.href = "/login" 
      } else {
        alert(result.message || "Signup failed")
      }
    } catch (err) {
      console.error("Signup error:", err)
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
            <Input placeholder="Username" {...register("username", { required: true })} />
            <Input placeholder="Email" type="email" {...register("email", { required: true })} />
            <Input placeholder="Password" type="password" {...register("password", { required: true })} />
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// 'use client';

// import React from 'react';

// export default function SignUpPage() {
//   return <div>Signup Form</div>;
// }
