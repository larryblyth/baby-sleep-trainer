import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Baby Sleep Trainer 🌙',
  description: 'A playful app to help with baby sleep training',
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

