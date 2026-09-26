import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site";
import { JoinConfettiLayer } from "@/components/join-confetti";
import { TiltLayer } from "@/components/premium-interactions";
import { PageLoadingBar, ScrollTopButton } from "@/components/site-extras";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden bg-background px-5 pt-20">
      <div className="mx-auto grid w-full max-w-7xl gap-12 py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">404 · Sayfa bulunamadı</p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl leading-none sm:text-8xl">Bu sayfa henüz keşfedilmedi.</h1>
          <p className="mt-7 max-w-lg leading-7 text-muted-foreground">Bu sayfayı henüz birlikte şekillendirmedik. Belki taşındı, belki hiç var olmadı — ana sayfadan yeniden başlayabilirsin.</p>
          <div className="mt-8"><Link to="/" className="inline-flex h-12 items-center bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover">Ana sayfaya dön</Link></div>
        </div>
        <div aria-hidden="true" className="relative mx-auto h-72 w-72">
          <div className="absolute inset-0 rotate-3 border border-foreground bg-poster shadow-[10px_10px_0_var(--brand-light)]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-9xl text-primary-foreground">404</span>
          <span className="absolute -left-4 top-6 -rotate-6 bg-brand-pale px-3 py-1 text-xs font-bold uppercase text-accent-foreground">Rota yok</span>
          <span className="absolute -right-3 bottom-8 rotate-6 bg-background px-3 py-1 text-xs font-bold uppercase text-foreground border border-foreground">Kayıp · 01</span>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YZT — Kırıkkale Üniversitesi Yapay Zeka Topluluğu" },
      { name: "description", content: "Kırıkkale Üniversitesi Yapay Zeka Topluluğu resmi web sitesi." },
      { name: "author", content: "YZT" },
      { property: "og:title", content: "YZT — Yapay Zeka Topluluğu" },
      { property: "og:description", content: "Kırıkkale Üniversitesi Yapay Zeka Topluluğu" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#faf8f5" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <PageLoadingBar />
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
      <JoinConfettiLayer />
      <TiltLayer />
      <ScrollTopButton />
    </QueryClientProvider>
  );
}
