"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, Settings, Home, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock authentication state
  
  const handleLogout = () => {
    // Mock logout functionality
    setIsLoggedIn(false);
    // In a real app, you would clear authentication tokens/cookies here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <span className="hidden sm:inline-block">Social Media Dashboard 3.0</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link 
            href="/" 
            className={`flex items-center gap-1 text-sm hover:text-primary ${pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </Link>
          
          <Link 
            href="/settings" 
            className={`flex items-center gap-1 text-sm hover:text-primary ${pathname === '/settings' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline-block">Settings</span>
          </Link>
          
          <Link 
            href="https://github.com/Zay2006/social-dashboard3.0" 
            target="_blank"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline-block">GitHub</span>
          </Link>
          
          <ThemeToggle />
          
          {isLoggedIn ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </Button>
          ) : (
            <Link href="/signin">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-sm"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline-block">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
