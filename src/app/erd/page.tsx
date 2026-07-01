import ERDDiagram from '@/components/erd/diagram';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ERDPage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header className="flex-none p-4 bg-background border-b flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Database Schema (ERD)</h1>
            <p className="text-sm text-muted-foreground">Alumni Portal Architecture</p>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full h-full relative">
        <ERDDiagram />
      </main>
    </div>
  );
}
