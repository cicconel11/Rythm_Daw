#!/usr/bin/env bash
# Move misplaced Next.js pages into the real server package
# and create a root redirect to /landing.
set -euo pipefail

SRC="infra/rhythm-hub-compose-main-2/server/app/(public)"
DEST="server/app/(public)"

[[ -d "$SRC" ]] || { echo "❌  $SRC not found"; exit 1; }

echo "🔄  Moving Next.js (public) pages into server/app …"
/bin/mkdir -p server/app
rsync -a --delete "$SRC/" "$DEST/"

echo "🧹  Removing empty source folder"
rm -rf infra/rhythm-hub-compose-main-2

# ------------------------------------------------------------------
# Add root layout + redirect if they don't exist
# ------------------------------------------------------------------
ROOT_LAYOUT="server/app/layout.tsx"
ROOT_PAGE="server/app/page.tsx"

if [[ ! -f $ROOT_LAYOUT ]]; then
cat > $ROOT_LAYOUT <<'TSX'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-br from-[#0D1126] to-[#141B33] text-white">
        {children}
      </body>
    </html>
  );
}
TSX
echo "➕  Added server/app/layout.tsx"
fi

if [[ ! -f $ROOT_PAGE ]]; then
cat > $ROOT_PAGE <<'TSX'
export async function generateMetadata() {
  return { redirect: { destination: '/landing', permanent: false } };
}
export default function Index() {
  return null; // Immediately redirects
}
TSX
echo "➕  Added server/app/page.tsx (redirect to /landing)"
fi

echo "✅  Done.  Run: pnpm install && pnpm --filter server dev"
