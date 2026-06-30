import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { signout } from '@/app/auth/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div className="p-8 text-center">Loading profile...</div>
  }

  if (profile.status === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="max-w-md text-center space-y-4 bg-background p-8 rounded-xl border shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Account Pending</h1>
          <p className="text-muted-foreground">
            Your account is currently pending manual approval by an administrator. Please check back later.
          </p>
          <form action={signout}>
            <Button type="submit" variant="outline" className="mt-4">Sign out</Button>
          </form>
        </div>
      </div>
    )
  }
  
  if (profile.status === 'rejected') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <div className="max-w-md text-center space-y-4 bg-background p-8 rounded-xl border shadow-sm border-destructive">
          <h1 className="text-2xl font-bold text-destructive">Account Rejected</h1>
          <p className="text-muted-foreground">
            Unfortunately, your account application was rejected. Contact support for more information.
          </p>
          <form action={signout}>
            <Button type="submit" variant="outline" className="mt-4">Sign out</Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
          <User className="h-6 w-6" />
          Alumni Portal
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium capitalize">{profile.full_name} <span className="text-muted-foreground">({profile.role})</span></span>
          <form action={signout}>
            <Button type="submit" variant="ghost" size="icon" title="Sign Out">
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Button>
          </form>
        </div>
      </header>
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
