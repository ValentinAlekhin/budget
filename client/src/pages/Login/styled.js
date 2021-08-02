import styled, {css} from "styled-components"
import {rgba} from 'polished'

const sharedStyles = css`
  background: ${rgba('#fff', 0.8)};
  padding: 10px 20px;
  border-radius: 10px;
  width: 80%;
  text-align: center;
  font-size: 20px;
`

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
`

export const IdInput = styled.input`
  ${sharedStyles};
  margin-bottom: 20px;
`

export const SubmitButton = styled.button`
  ${sharedStyles};
  border: none;
`
