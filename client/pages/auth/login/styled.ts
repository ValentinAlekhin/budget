import styled from '@emotion/styled'
import LoadingButton from '@mui/lab/LoadingButton'
import { spacing } from '@mui/system'

export const LoginWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Button = styled(LoadingButton)(spacing)
