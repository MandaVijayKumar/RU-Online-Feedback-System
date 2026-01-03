import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import AppRoutes from './routes/AppRoutes'

import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  )
}
