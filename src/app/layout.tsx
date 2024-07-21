

export const metadata = {
  title: 'SEND IT BRO',
  description: 'SEND IT HIGHER',
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
