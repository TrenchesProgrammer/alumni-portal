'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveUser(userId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()
  
  // Verify current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'admin') throw new Error("Unauthorized")

  // Update target user status
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) {
    console.error("Error updating user status:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
