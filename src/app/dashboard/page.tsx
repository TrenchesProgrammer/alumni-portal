import { createClient } from '@/utils/supabase/server'
import AdminDashboard from '@/components/dashboard/admin-dashboard'
import StudentDashboard from '@/components/dashboard/student-dashboard'
import AlumniDashboard from '@/components/dashboard/alumni-dashboard'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') return <AdminDashboard user={profile} />
  if (profile?.role === 'student') return <StudentDashboard user={profile} />
  if (profile?.role === 'alumni') return <AlumniDashboard user={profile} />

  return <div>Unknown role</div>
}
