'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignupForm({ error }: { error?: string }) {
  const [role, setRole] = useState('student')

  return (
    <form action={signup}>
      <div className="space-y-4">
        {error && <div className="text-sm font-medium text-destructive p-3 bg-destructive/10 rounded-md">{error}</div>}
        
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" name="full_name" placeholder="John Doe" required className="bg-background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">I am a...</Label>
          <select 
            name="role" 
            id="role" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="matric_number">Matric Number</Label>
          <Input 
            id="matric_number" 
            name="matric_number" 
            placeholder="123456" 
            required 
            pattern="\d{6}"
            title="Matric Number must be exactly 6 digits"
            className="bg-background" 
          />
        </div>

        {role === 'alumni' && (
          <div className="space-y-2">
            <Label htmlFor="graduation_year">Graduation Year</Label>
            <Input 
              id="graduation_year" 
              name="graduation_year" 
              type="number" 
              placeholder="e.g. 2020" 
              required 
              min="1948"
              max="2024"
              className="bg-background" 
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required className="bg-background" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="bg-background" />
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-6">
        <Button type="submit" className="w-full text-lg shadow-md transition-transform active:scale-[0.98]">Create account</Button>
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </form>
  )
}
