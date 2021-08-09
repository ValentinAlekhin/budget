import styled, {css} from "styled-components"

const sharedStyles = css`
  background: #393E46;
  padding: 10px 20px;
  border-radius: 10px;
  width: 80%;
  text-align: center;
  font-size: 20px;
  height: 45px;
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
  background: #00ADB5;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
`
