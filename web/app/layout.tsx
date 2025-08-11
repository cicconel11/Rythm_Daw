export const metadata = {
  title: 'Rythm DAW',
  description: 'A modern digital audio workstation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
