import { Component, JSX } from 'solid-js'
import { Inp } from './styled'

interface InputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  value: string
  error?: boolean
  success?: boolean
  loading?: boolean
  display?: 'block' | 'inline'
  type?: string
  disabled?: boolean
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>
}

const Input: Component<InputProps> = (props) => {
  return (
    <Inp
      type={props.type}
      value={props.value}
      onInput={props.onInput}
      disabled={props.disabled}
    />
  )
}

export default Input
