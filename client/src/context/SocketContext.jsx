import { createContext,useContext,useEffect,useState } from "react"
import { useAuth } from "./AuthContext"
import { io } from "socket.io-client"


const SocketContext = createContext()

const SocketProvider = ({children}) => {

    const {user} = useAuth()
    const [socket,setSocket] = useState(null)

    useEffect(()=>{
        if(!user) return

        const newSocket = io(import.meta.env.VITE_API_URL)
        newSocket.on('connect',()=>{
            newSocket.emit('registerUser',user.id)
        })
        setSocket(newSocket)
        return ()=>{
            newSocket.disconnect()
        }
    },[user])

  return (
   <SocketContext.Provider value={{socket}}>
    {children}
    </SocketContext.Provider>
  )
}

export const useSocket = ()=> useContext(SocketContext)

export default SocketProvider