import React, { createContext, useContext, useState } from 'react'


const AuthContext= createContext()

const AuthProvider = ({children}) => {
const [token, setToken] = useState(localStorage.getItem('token'))
const [user, setUser] = useState((JSON.parse(localStorage.getItem('user'))))

  return (
    <AuthContext.Provider value={{user, setUser, token, setToken}}>
        {children}
    </AuthContext.Provider>
  )
}
export const useAuth = ()=>useContext(AuthContext)
export default AuthProvider