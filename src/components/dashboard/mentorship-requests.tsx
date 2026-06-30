import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { updateMentorshipRequest } from '@/app/dashboard/mentorship-actions'

export default async function MentorshipRequests({ currentUserId, role }: { currentUserId: string, role: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('mentorship_requests')
    .select(`
      id, 
      status, 
      created_at,
      student:student_id(id, full_name, role, bio, github_url, linkedin_url),
      alumni:alumni_id(id, full_name, role, bio, github_url, linkedin_url)
    `)
    .order('created_at', { ascending: false })

  if (role === 'student') {
    query = query.eq('student_id', currentUserId)
  } else {
    query = query.eq('alumni_id', currentUserId)
  }

  const { data: requests } = await query

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          No mentorship requests found.
        </CardContent>
      </Card>
    )
  }

  const otherPersonIds = requests.map((r: any) => role === 'student' ? r.alumni?.id : r.student?.id).filter(Boolean)
  
  const { data: userTechStacks } = await supabase
    .from('user_tech_stacks')
    .select('user_id, tech_stacks(id, name)')
    .in('user_id', otherPersonIds)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request: any) => {
        const otherPerson = role === 'student' ? request.alumni : request.student
        const personTechs = userTechStacks
          ?.filter(t => t.user_id === otherPerson.id)
          .map(t => t.tech_stacks as unknown as {id: string, name: string}) || []

        return (
          <Card key={request.id} className="flex flex-col border-primary/20 shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback>{otherPerson?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{otherPerson?.full_name}</CardTitle>
                <CardDescription className="text-xs capitalize">
                  {otherPerson?.role}
                </CardDescription>
              </div>
              <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'accepted' ? 'default' : 'destructive'} className="capitalize">
                {request.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {otherPerson?.bio || 'No bio provided.'}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {personTechs.map((tech: any) => (
                  <Badge key={tech.id} variant="secondary" className="text-[10px]">
                    {tech.name}
                  </Badge>
                ))}
              </div>

              {(otherPerson?.github_url || otherPerson?.linkedin_url) && (
                <div className="flex gap-2 text-xs">
                  {otherPerson.github_url && <a href={otherPerson.github_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">GitHub</a>}
                  {otherPerson.linkedin_url && <a href={otherPerson.linkedin_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">LinkedIn</a>}
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-2 border-t">
                Sent: {new Date(request.created_at).toLocaleDateString()}
              </div>
            </CardContent>
            {role === 'alumni' && request.status === 'pending' && (
              <CardFooter className="flex gap-2">
                <form action={updateMentorshipRequest.bind(null, request.id, 'accepted')} className="flex-1">
                  <Button type="submit" className="w-full" variant="default">Accept</Button>
                </form>
                <form action={updateMentorshipRequest.bind(null, request.id, 'rejected')} className="flex-1">
                  <Button type="submit" className="w-full" variant="destructive">Reject</Button>
                </form>
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}
