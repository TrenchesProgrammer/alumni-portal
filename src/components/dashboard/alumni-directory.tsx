import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { requestMentorship } from '@/app/dashboard/mentorship-actions'

export default async function AlumniDirectory({ currentUserId, userTechIds }: { currentUserId: string, userTechIds: string[] }) {
  const supabase = await createClient()

  // 1. Fetch all approved alumni profiles
  const { data: alumniProfiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'alumni')
    .eq('status', 'approved')

  if (!alumniProfiles || alumniProfiles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          No alumni available at the moment.
        </CardContent>
      </Card>
    )
  }

  // 2. Fetch tech stacks for these alumni
  const alumniIds = alumniProfiles.map(a => a.id)
  const { data: alumniTechStacks } = await supabase
    .from('user_tech_stacks')
    .select('user_id, tech_stacks(id, name)')
    .in('user_id', alumniIds)

  // 3. Fetch existing requests to disable button
  const { data: existingRequests } = await supabase
    .from('mentorship_requests')
    .select('alumni_id')
    .eq('student_id', currentUserId)
  
  const requestedAlumniIds = existingRequests?.map(r => r.alumni_id) || []

  // 4. Calculate Match Score
  const scoredAlumni = alumniProfiles.map(alumnus => {
    const alumnusTechs = alumniTechStacks
      ?.filter(t => t.user_id === alumnus.id)
      .map(t => t.tech_stacks as unknown as {id: string, name: string}) || []

    const overlapCount = alumnusTechs.filter(tech => userTechIds.includes(tech.id)).length
    const score = userTechIds.length > 0 ? Math.round((overlapCount / userTechIds.length) * 100) : 0

    return {
      ...alumnus,
      techs: alumnusTechs,
      score
    }
  }).sort((a, b) => b.score - a.score)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scoredAlumni.map(alumnus => (
        <Card key={alumnus.id} className="flex flex-col border-primary/20 shadow-md">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={alumnus.avatar_url || ''} />
              <AvatarFallback>{alumnus.full_name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{alumnus.full_name}</CardTitle>
              <CardDescription className="text-xs">
                Match Score: <span className="font-semibold text-primary">{alumnus.score}%</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {alumnus.bio || 'No bio provided.'}
            </p>
            <div className="flex flex-wrap gap-1">
              {alumnus.techs.map((tech: any) => (
                <Badge key={tech.id} variant={userTechIds.includes(tech.id) ? 'default' : 'secondary'} className="text-[10px]">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form action={requestMentorship.bind(null, alumnus.id)} className="w-full">
              <Button type="submit" className="w-full" disabled={requestedAlumniIds.includes(alumnus.id)}>
                {requestedAlumniIds.includes(alumnus.id) ? 'Request Sent' : 'Request Mentorship'}
              </Button>
            </form>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
