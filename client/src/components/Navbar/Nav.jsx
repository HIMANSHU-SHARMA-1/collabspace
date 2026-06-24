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
        <li><Link to='/dashboard'>Dashboard</Link></li>
       <li> <Link to='/create-project'>Create Project</Link></li>
       
        <li><p>Welcome {user?.name?.toUpperCase()}</p></li>
        <li>  <button onClick={handleLogout}>Logout</button></li>
            
</nav>
  )
}

export default Nav