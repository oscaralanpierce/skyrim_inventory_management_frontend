import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PageRoutes from './routing/pageRoutes'

const App = () => (
  <Router basename={import.meta.env.PUBLIC_URL as string}>
    <HelmetProvider>
      <PageRoutes />
    </HelmetProvider>
  </Router>
)

export default App
