import { type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { JSDOM } from 'jsdom'
import { render as originalRender } from '@testing-library/react'
import { LoginContext } from '../contexts/loginContext'
import {
  loadingLoginContextValue,
  loginContextValue,
  unauthenticatedLoginContextValue,
} from './data/contextValues'

export const BASE_APP_URI = 'http://localhost:5173'

const setDom = (url?: string) => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: url || 'http://localhost:5173',
  })

  // jsdom doesn't implement ResizeObserver; mock it so hooks that use
  // @react-hook/resize-observer don't throw during tests.
  dom.window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.window = dom.window as unknown as Window & typeof globalThis
  global.document = dom.window.document
}

/**
 *
 * Test Renderers
 *
 */

export const render = (ui: ReactElement, url?: string) => {
  setDom(url)

  return originalRender(ui)
}

export const renderWithRouter = (ui: ReactElement, url?: string) =>
  render(<BrowserRouter>{ui}</BrowserRouter>, url)

export const renderAuthenticated = (ui: ReactElement, url?: string) =>
  renderWithRouter(
    <LoginContext.Provider value={loginContextValue}>
      {ui}
    </LoginContext.Provider>,
    url
  )

export const renderUnauthenticated = (ui: ReactElement, url?: string) =>
  renderWithRouter(
    <LoginContext.Provider value={unauthenticatedLoginContextValue}>
      {ui}
    </LoginContext.Provider>,
    url
  )

export const renderAuthLoading = (ui: ReactElement, url?: string) =>
  renderWithRouter(
    <LoginContext.Provider value={loadingLoginContextValue}>
      {ui}
    </LoginContext.Provider>,
    url
  )
