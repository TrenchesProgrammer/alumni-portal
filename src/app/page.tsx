import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted/50 to-muted p-4">
      <div className="text-center space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary drop-shadow-sm">
          Alumni Mentorship
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
          Connect with experienced alumni, find mentors who share your tech stack, and discover exclusive job opportunities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto text-lg px-8 shadow-lg transition-all hover:scale-105 active:scale-95")}>
            Join the Network
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto text-lg px-8 shadow-sm transition-all hover:scale-105 active:scale-95 bg-background")}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
