import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PropertyChecklistPage from './pages/PropertyChecklistPage'
import { appRoutes } from './routes'

function App() {
  return (
    <Routes>
      <Route path={appRoutes.home} element={<HomePage />} />
      <Route
        path={appRoutes.propertyChecklist}
        element={<PropertyChecklistPage />}
      />
      <Route path="*" element={<Navigate replace to={appRoutes.home} />} />
    </Routes>
  )
}

export default App
