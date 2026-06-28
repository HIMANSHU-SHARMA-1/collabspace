import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import PublicRoute from './components/PublicRoute/PublicRoute'
import CreateProject from './pages/Projects/CreateProject'
import MyProject from './pages/Projects/MyProject'
import Notification from './components/Notification/Notification'
import Recommendation from './pages/Projects/Recommendation'
import JoinedProjects from './pages/Projects/JoinedProjects'
const App = () => {
  return (
    <>
         <Routes>
  <Route path='/' element={<PublicRoute><Login/></PublicRoute>}/>
  <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
  <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
  <Route path='/create-project' element={<ProtectedRoute><CreateProject/></ProtectedRoute>}/>
  <Route path='/my-project' element={<ProtectedRoute><MyProject/></ProtectedRoute>}/>
  <Route path='/notifications' element={<ProtectedRoute><Notification/></ProtectedRoute>}/>
  <Route path='/recommend-projects' element={<ProtectedRoute><Recommendation/></ProtectedRoute>}/>
  <Route path='/joined-projects' element={<ProtectedRoute><JoinedProjects/></ProtectedRoute>}/>

</Routes>
    </>
  )
}

export default App