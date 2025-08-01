
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="bg-background flex flex-col items-center justify-center pt-16 pb-8">
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <header className="mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
            Welcome to eGp Prototype
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced Technology Amplifying Voter Intent
          </p>
        </header>

        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
      <footer className="text-center py-6 text-sm text-muted-foreground w-full">
        <p>Data provided by the <a href="https://www.congress.gov/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">U.S. Congress</a> via <a href="https://api.congress.gov/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">api.congress.gov</a>.</p>
      </footer>
    </div>
  );
}
