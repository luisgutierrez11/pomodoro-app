import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`

export const Timer = styled.h2`
  font-size: 4rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.primary};
`

export const Info = styled.p`
  font-size: 1.2rem;
  margin: 0.3rem 0;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 1rem;
`

export const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.secondary};
  }
`
