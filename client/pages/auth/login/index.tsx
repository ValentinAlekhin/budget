import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, LoginWrapper } from './styled'
import { useState } from 'react'
import { getSession, GetSessionParams, signIn } from 'next-auth/react'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'

export default function Index() {
  const [username, setUsername] = useState<string>('new_12222')
  const [password, setPassword] = useState<string>('Ye01vaoB66s1GkbFVR4p')
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const login = async () => {
    setLoading(true)
    const data = await signIn('credentials', { username, password, redirect: false })
    setLoading(false)

    if (data?.error) {
      enqueueSnackbar('Invalid data', {
        variant: 'error',
        preventDuplicate: true,
      })
    } else {
      await router.push('/')
    }
  }

  return (
    <LoginWrapper>
      <Box component="form" autoComplete="off">
        <TextField disabled={loading} fullWidth required label="Username" margin="dense" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField disabled={loading} fullWidth required label="Password" type="password" margin="dense" value={password} onChange={e => setPassword(e.target.value)} />
        <Button fullWidth loading={loading} variant="contained" mt={1} onClick={login}>Login</Button>
      </Box>
    </LoginWrapper>
  )
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context)

  if (session) return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }

  return { props: {} }
}