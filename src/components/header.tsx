
'use client';

import Link from 'next/link';
import { Landmark, LogOut, User, Loader2, ChevronDown } from 'lucide-react';
import { CongressSelector } from './congress-selector';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, loading, logout, selectedCongress } = useAuth();

  const billsHref = selectedCongress ? `/bill/${selectedCongress}` : '/bills';
  const congressHref = selectedCongress ? `/congress/${selectedCongress}` : '/congress';

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Landmark className="h-6 w-6" />
            <span>eGp Prototype</span>
          </Link>
          <nav>
            <ul className="flex items-center gap-2 md:gap-4">
              <li>
                <CongressSelector />
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      Bills <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`${billsHref}/recent`}>Recent Updates</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`${billsHref}/popular`}>Popular Bills</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`${billsHref}/issues`}>By Issue</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <Link href={congressHref} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Congress
                </Link>
              </li>
               <li>
                <Link href="/support-us" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Support Us
                </Link>
              </li>
              <li className="flex items-center gap-2">
                {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : user ? (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <User className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button size="sm" asChild>
                             <Link href="/signup">Sign Up</Link>
                        </Button>
                    </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
