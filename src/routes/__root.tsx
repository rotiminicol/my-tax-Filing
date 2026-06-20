import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import * as React from "react";
import appCss from "../styles.css?url";

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Tax Filing</title>
        <HeadContent />
        <link rel="stylesheet" href={appCss} />
      </head>
      <body>
        <div id="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

function AppClient() {
  const [App, setApp] = React.useState<React.ComponentType | null>(null);
  React.useEffect(() => {
    import("../App").then((m) => setApp(() => m.default));
  }, []);
  return App ? <App /> : null;
}

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: () => (
    <>
      <ClientOnly fallback={null}>
        <AppClient />
      </ClientOnly>
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <ClientOnly fallback={null}>
      <AppClient />
    </ClientOnly>
  ),
});
