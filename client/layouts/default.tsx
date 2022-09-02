import { Footer } from '../components/Footer'
import { Container } from '@mui/material'
import { useSession } from 'next-auth/react'

interface Props {
  children: any
}

export default function Layout({ children }: Props) {
  const { data: session } = useSession()

   return (
    <>
      <Container maxWidth='sm'>
        <main style={{ height: '100%' }}>{children}</main>
      </Container>
      { session ? <Footer /> : null }
    </>
  )
}
