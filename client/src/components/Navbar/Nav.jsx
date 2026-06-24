import {Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Nav = () => {
const {user,setUser,setToken} = useAuth()
const navigate = useNavigate()

const handleLogout =()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    navigate('/')


}

  return (
    <nav>
        <Link to='/dashboard'>Dashboard</Link>
        <Link to='create-project'>Create Project</Link>
        <p>Welcome {user?.name?.toUpperCase()}</p>
        <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Nav