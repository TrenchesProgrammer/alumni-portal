'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const role = formData.get('role') as string || 'student'
  const fullName = formData.get('full_name') as string || ''
  const matricNumber = formData.get('matric_number') as string || ''
  const graduationYear = formData.get('graduation_year') ? parseInt(formData.get('graduation_year') as string) : null
  
  console.log("Signup attempt with Role:", role, "Name:", fullName)

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: fullName,
        role: role,
        matric_number: matricNumber,
        graduation_year: graduationYear
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup Error:", error)
    const errorMessage = error.message || (typeof error === 'string' ? error : JSON.stringify(error))
    redirect('/signup?error=' + encodeURIComponent(errorMessage))
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
