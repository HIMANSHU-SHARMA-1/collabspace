import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import Nav from '../../components/Navbar/Nav'
import {useNavigate } from 'react-router-dom'
const Dashboard = () => {

  
  
  const [projects, setProjects] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState()
  const [success,setSuccess] = useState()
  const {user} = useAuth()
  const navigate = useNavigate()
  
  
  const getProjects = async()=> {
    setLoading(true)
    setError('')
    try{
      const response = await api.get('/api/project/getAll')
      //console.log(response.data.data)
      setProjects(response.data.data)
      setLoading(false)
      setSuccess(true)
    }
    catch(err){
      setError(err.response?.data?.message || err.message || 'Failed to load Projects')
      setLoading(false)
      
    }
  }

  const joinRequest = async(project)=>{
   try{
      //check for already a member or leader of the project 
      if(user.id === project.leader._id){
        return alert('You are the already the leader of the project')
      }
      if(project.members.some(m=>m._id=== user.id)){
        return alert('You are already the member of this project')
      }

    const joinResponse =  await api.post('/api/joinRequest/send',{projectId:project._id})
  //  console.log(joinResponse.data.data)
  alert('Join request sent')
   }catch(err){
      alert( err.response?.data?.message || 'Already Applied')
   }
  }

  const viewProjectDetaisl =(projectId)=>{
    navigate(`/project-view/${projectId}`)
  }
  useEffect(()=>{
    getProjects()
  },[])
  
  return (
    
    <>
    <Nav/>
      {
     loading?(<p>Loading Projects</p>): error?(<p>{error}</p>): projects.length === 0?(<p>No Projects yet</p>):(
      <div >{projects.map((p)=>(
        <ul  key={p._id} style={{border:'2px solid black'}}>
          <li>{p.projectname}</li>
        <li>{p.description}</li>
        <li>{p.requiredSkill.join(', ')}</li>
        {/* <li>Status: {p.status}</li> */}
        {/* <li>Team Size: {p.teamsize}</li> */}
        {/* <li>Members: {p.members.length}</li> */}
        {/* <li>Leader: {p.leader.username}</li> */}
        <button type='submit' onClick={()=>{joinRequest(p)}}>Join</button>
        <button onClick={()=>{viewProjectDetaisl(p._id)}}>View Project</button>
        </ul>
      ))}</div>
     )
    }
    </>
   
  )
}
export default Dashboard