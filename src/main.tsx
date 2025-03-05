import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Popup from './components/popup'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
  <StrictMode>
    <Popup />
  </StrictMode>
  </MantineProvider>
  ,
)
