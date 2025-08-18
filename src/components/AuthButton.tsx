'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

type SupaUser = User;

export function AuthButton() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: User | null } }) => {
        if (!mounted) return;
        setUser((data?.user as any) ?? null);
        setLoading(false);
      });
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser((session?.user as any) ?? null);
      }
    );
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <div className="h-8 w-24 rounded-md bg-slate-700 animate-pulse" />;
  }

  if (user) {
    const name = user.user_metadata?.name || user.email || 'User';
    const image = (user.user_metadata as any)?.picture as string | undefined;
    return (
      <div className="flex items-center space-x-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-8 w-8 rounded-full" />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-slate-400" />
        )}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            // Optional: hard refresh to update server-rendered UI
            window.location.reload();
          }}
          className="flex items-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-500"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        const origin = window.location.origin;
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: `${origin}/` },
        });
      }}
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
    >
      Sign In with Google
    </button>
  );
}
