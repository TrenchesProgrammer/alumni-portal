'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'

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

  // Use Admin Client to bypass RLS when updating other users
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) {
    console.error("Error updating user status:", error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
