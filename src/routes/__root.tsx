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

// Rendered on the server and while the client bundle loads, so the first paint
// is branded instead of a blank white page.
function BootSplash() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FCFAF5",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: "#0B3B2E",
            color: "#FCFAF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          MT
        </div>
        <div
          style={{
            color: "#0B3B2E",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          My Tax Filing
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  shellComponent: RootShell,
  component: () => (
    <ClientOnly fallback={<BootSplash />}>
      <AppClient />
    </ClientOnly>
  ),
  notFoundComponent: () => (
    <ClientOnly fallback={<BootSplash />}>
      <AppClient />
    </ClientOnly>
  ),
});
