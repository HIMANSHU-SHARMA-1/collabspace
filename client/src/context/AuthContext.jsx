import React, { createContext, useContext, useState } from 'react'


const AuthContext= createContext()

const AuthProvider = ({children}) => {
const [token, setToken] = useState(localStorage.getItem('token'))
const [user, setUser] = useState(() => {
  try {
    const item = localStorage.getItem('user');
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch (error) {
    return null;
  }
});

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }



  return (
    <AuthContext.Provider value={{user, setUser, token, setToken, logout}}>
        {children}
    </AuthContext.Provider>
  )
}
export const useAuth = ()=>useContext(AuthContext)
export default AuthProvider