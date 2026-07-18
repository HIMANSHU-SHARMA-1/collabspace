import React, { useEffect } from 'react'
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
import ProjectDetails from './pages/Projects/ProjectDetails'
import Profile from './pages/Profile/Profile'
import { initTheme } from './utils/theme'
import NetworkBackground from './components/NetworkBackground/NetworkBackground'
import CustomCursor from './components/CustomCursor/CustomCursor'
import IDEShell from './components/Layout/IDEShell'
import NodeWorkspace from './pages/NodeWorkspace/NodeWorkspace'

const App = () => {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <>
      <CustomCursor />
      <NetworkBackground />
      <Routes>
        <Route path='/' element={<PublicRoute><Login/></PublicRoute>}/>
        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
        
        {/* IDE Shell Wrapped Routes */}
        <Route path='/dashboard' element={<ProtectedRoute><IDEShell><Dashboard/></IDEShell></ProtectedRoute>}/>
        <Route path='/create-project' element={<ProtectedRoute><IDEShell><CreateProject/></IDEShell></ProtectedRoute>}/>
        <Route path='/my-project' element={<ProtectedRoute><IDEShell><MyProject/></IDEShell></ProtectedRoute>}/>
        <Route path='/notifications' element={<ProtectedRoute><IDEShell><Notification/></IDEShell></ProtectedRoute>}/>
        <Route path='/recommend-projects' element={<ProtectedRoute><IDEShell><Recommendation/></IDEShell></ProtectedRoute>}/>
        <Route path='/joined-projects' element={<ProtectedRoute><IDEShell><JoinedProjects/></IDEShell></ProtectedRoute>}/>
        <Route path='/project-view/:projectId' element={<ProtectedRoute><IDEShell><ProjectDetails/></IDEShell></ProtectedRoute>}/>
        <Route path='/profile' element={<ProtectedRoute><IDEShell><Profile/></IDEShell></ProtectedRoute>}/>
        <Route path='/node-workspace' element={<ProtectedRoute><IDEShell><NodeWorkspace/></IDEShell></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App