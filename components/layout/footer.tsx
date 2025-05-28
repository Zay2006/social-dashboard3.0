"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <Link
            href="https://github.com/Zay2006"
            target="_blank"
            className="font-medium underline underline-offset-4"
          >
            Zay2006
          </Link>
          . The source code is available on{" "}
          <Link
            href="https://github.com/Zay2006/social-dashboard3.0"
            target="_blank"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} Social Media Dashboard 3.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
