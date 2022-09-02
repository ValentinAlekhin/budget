import { Component } from 'solid-js'
import { Btn } from './styled'

interface ButtonProps {
  text: string
  error?: boolean
  success?: boolean
  disabled?: boolean
  loading?: boolean
  display?: 'block' | 'inline'
  onClick(): void | Promise<void>
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <Btn onClick={props.onClick} disabled={props.disabled}>
      {props.loading ? 'Loading' : props.text}
    </Btn>
  )
}

export default Button
