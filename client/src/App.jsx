import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import AuthPage from './Pages/AuthPage'
import SettingPage from './Pages/SettingPAge'
import ProfilPage from './Pages/ProfilPage'
import { useAuthStore } from './store/useAuthStore'

import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast"
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme} =  useThemeStore();
  console.log(onlineUsers)

  useEffect(() => {
    checkAuth();
  }, [])
  useEffect(() => {
    // Get the <html> element and set the data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isCheckingAuth & !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme} className="h-[100%]" >
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        <Route path='/setting' element={<SettingPage />} />
        <Route path='/profile' element={authUser ? <ProfilPage /> : <Navigate to="/auth" />} />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>

  )
}

export default App