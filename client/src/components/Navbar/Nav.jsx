import {Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification/Notification";
import Recommendation from "../../pages/Projects/Recommendation";


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
       <li> <Link to='/my-project'>My Projects</Link></li>
       <li> <Notification/></li>
       <li><Link to='/recommend-projects'>Projects Recommendation</Link></li>
       <li><Link to='/joined-projects'>Joined Projects</Link></li>
       
        <li><p>Welcome {user?.name?.toUpperCase()}</p></li>
        <li>  <button onClick={handleLogout}>Logout</button></li>
            
</nav>
  )
}

export default Nav