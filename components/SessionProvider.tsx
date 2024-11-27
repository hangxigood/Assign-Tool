'use client'

import { SessionProvider as Provider } from 'next-auth/react'
import { Session } from 'next-auth'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  session: Session | null
}

export function SessionProvider({ children, session }: Props) {
  return (
    <Provider session={session}>
      {children}
    </Provider>
  )
}