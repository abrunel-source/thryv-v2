import { DM_Sans, Fraunces } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})

export const metadata = {
  title: 'Thryv Accountants | Expert Accounting for South African Small Business',
  description: 'Fixed-fee accounting, tax, payroll and advisory services for South African small businesses. SAIPA & SAICA accredited. Based in Cape Town.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  )
}
