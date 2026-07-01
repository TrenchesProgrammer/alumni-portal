import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { approveUser } from '@/app/dashboard/actions'

export default async function AdminDashboard({ user }: { user: any }) {
  const supabase = await createClient()

  // Fetch users pending approval
  const { data: pendingUsers } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  let usersWithEmail = pendingUsers || []
  
  if (usersWithEmail.length > 0) {
    try {
      const adminClient = createAdminClient()
      usersWithEmail = await Promise.all(
        usersWithEmail.map(async (profile) => {
          const { data: authUser } = await adminClient.auth.admin.getUserById(profile.id)
          return { ...profile, email: authUser.user?.email || 'N/A' }
        })
      )
    } catch (e) {
      console.error("Failed to fetch emails for admin dashboard", e)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Review and approve new students and alumni joining the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          {usersWithEmail && usersWithEmail.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Matric No.</TableHead>
                  <TableHead>Grad Year</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithEmail.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.full_name}</TableCell>
                    <TableCell>
                      <Badge variant={profile.role === 'alumni' ? 'default' : 'secondary'} className="capitalize">
                        {profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{profile.email}</TableCell>
                    <TableCell className="text-muted-foreground">{profile.matric_number || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{profile.graduation_year || '-'}</TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <form action={approveUser.bind(null, profile.id, 'approved')} className="inline">
                        <Button type="submit" size="sm" variant="default">Approve</Button>
                      </form>
                      <form action={approveUser.bind(null, profile.id, 'rejected')} className="inline">
                        <Button type="submit" size="sm" variant="destructive">Reject</Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              No pending approvals at this time.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
