// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import { type NextPage } from 'next'
import { type ReactElement, type ReactNode } from 'react'
import '@/styles/global.css'
import '@/utils/firebase-messaging';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}