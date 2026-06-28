'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Brain, 
  PenTool, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Award,
  Search,
  Users,
  CalendarDays,
  Workflow,
  HeartPulse,
  Compass,
  FileDown,
  Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { dashboardNavigation } from '@/lib/dashboard-navigation';
import { LoadingSpinner } from '@/components/loading-spinner';

const icons = {
  LayoutDashboard,
  Building2,
  Brain,
  PenTool,
  Calendar,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Settings,
  Award,
  Search,
  Users,
  CalendarDays,
  Workflow,
  HeartPulse,
  Compass,
  FileDown,
  Map,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState('');

  useEffect(() => {
    setNavigatingTo('');
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (auth && isFirebaseConfigured) {
      await signOut(auth);
    }
    router.push('/');
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <Sparkles className="h-6 w-6 text-primary mr-2" />
        <span className="text-lg font-bold">MultiMax AI</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {dashboardNavigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (!isActive) setNavigatingTo(item.name);
              }}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-16 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex h-full w-64 flex-col border-r bg-card
      `}>
        <SidebarContent />
      </div>
      {navigatingTo && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="rounded-lg border bg-card px-6 py-5 text-center shadow-lg">
            <LoadingSpinner />
            <p className="mt-3 font-medium">Please wait</p>
            <p className="text-sm text-muted-foreground">Opening {navigatingTo}...</p>
          </div>
        </div>
      )}
    </>
  );
}
