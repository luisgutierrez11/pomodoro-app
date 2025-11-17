import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    button {
        cursor: pointer;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        transition: 0.2s;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export default GlobalStyle
