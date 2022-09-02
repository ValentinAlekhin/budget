import { Component, createSignal, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { login, userState } from '../../../store/user'
import Button from '../../../components/Button'
import { Container, Form } from './styled'
import Input from '../../../components/Input'

const Login: Component = () => {
  const [password, setPassword] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const navigate = useNavigate()

  onMount(() => {
    if (!userState.accessToken) return

    navigate('/', { replace: true })
  })

  const handleLogin = async () => {
    setLoading(true)
    await login({ password: password(), email: email() })
    setLoading(false)

    if (!userState.username) return

    navigate('/', { replace: true })
  }

  return (
    <Container>
      <Form>
        <Input
          type="email"
          disabled={loading()}
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
        />
        <Input
          type="password"
          disabled={loading()}
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
        />

        <Button
          disabled={loading()}
          onClick={handleLogin}
          loading={loading()}
          text="Login"
        />
      </Form>
    </Container>
  )
}

export default Login
