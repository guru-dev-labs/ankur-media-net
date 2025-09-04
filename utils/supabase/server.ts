import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies(); // <-- await is required now

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value;
        },
        set: (_name: string, _value: string, _options: CookieOptions) => {
          // Not supported in App Router
        },
        remove: (_name: string, _options: CookieOptions) => {
          // Not supported in App Router
        },
      },
    }
  );
};
