import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties - RealWise'
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
