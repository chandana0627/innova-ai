import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { ModeToggle } from "./mode-toggle";

export default async function Header() {
  await checkUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-6 pl-7">
          <Image
            src="/logo2.png"
            alt="InnovaAI Logo"
            width={80}
            height={60}
            className="rounded-lg shadow-md transition-transform hover:scale-105"
          />
        </Link>
        

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/resume" className="hover:text-primary transition-colors">
              Resume
            </Link>
            <Link href="/interview" className="hover:text-primary transition-colors">
              Interview
            </Link>
            <Link href="/ai-cover-letter" className="hover:text-primary transition-colors">
              Cover Letter
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
