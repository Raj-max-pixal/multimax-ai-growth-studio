'use client';

import { Bell, Search, User, Moon, Sun, ArrowRight, Loader2 } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';
import { dashboardNavigation } from '@/lib/dashboard-navigation';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return dashboardNavigation.slice(0, 6);

    return dashboardNavigation
      .map((item) => {
        const haystack = [item.name, item.href, ...item.keywords].join(' ').toLowerCase();
        const exactName = item.name.toLowerCase().includes(value) ? 3 : 0;
        const keywordMatch = item.keywords.some((keyword) => keyword.toLowerCase().includes(value)) ? 2 : 0;
        const routeMatch = item.href.toLowerCase().includes(value) ? 1 : 0;
        return { item, score: exactName + keywordMatch + routeMatch + (haystack.includes(value) ? 1 : 0) };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
      .slice(0, 7)
      .map((result) => result.item);
  }, [query]);

  const goTo = (href: string) => {
    setOpen(false);
    setQuery('');
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) {
                event.preventDefault();
                goTo(results[0].href);
              }
              if (event.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder="Search pages, tools, reports..."
            className="w-64 pl-10"
          />
          {open && (
            <div className="absolute left-0 top-12 z-50 w-80 overflow-hidden rounded-lg border bg-card shadow-lg">
              <div className="border-b px-3 py-2 text-xs text-muted-foreground">
                {query ? `Search results for "${query}"` : 'Quick navigation'}
              </div>
              <div className="max-h-80 overflow-y-auto p-1">
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => goTo(item.href)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      <span>
                        <span className="block font-medium">{item.name}</span>
                        <span className="block text-xs text-muted-foreground">{item.keywords.slice(0, 4).join(', ')}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No matching page found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isPending && (
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <Loader2 className="h-4 w-4 animate-spin" />
            Please wait...
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
