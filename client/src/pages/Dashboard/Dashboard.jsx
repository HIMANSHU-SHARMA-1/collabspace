import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const Dashboard = () => {

  
  
  const [projects, setProjects] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState()
  const [success,setSuccess] = useState()
  
  
  const getProjects = async()=> {
    setLoading(true)
    setError('')
    try{
      const response = await api.get('/api/project/getAll')
      console.log(response.data.data)
      setProjects(response.data.data)
      setLoading(false)
      setSuccess(true)
    }
    catch(err){
      setError(err.response?.data?.message || err.message || 'Failed to load Projects')
      setLoading(false)
      
    }
  }

  const joinRequest = async(projectId)=>{
   try{
    const joinResponse =  await api.post('/api/joinRequest/send',{projectId})
   console.log(joinResponse.data.data)
   }catch(err){
      alert( err.response?.data?.message || 'Already Applied')
   }
  }
  useEffect(()=>{
    getProjects()
  },[])
  
  return (
    
    <>
      {
     loading?(<p>Loading Projects</p>): error?(<p>{error}</p>): projects.length === 0?(<p>No Projects yet</p>):(
      <div >{projects.map((p)=>(
        <ul  key={p._id} style={{border:'2px solid black'}}>
          <li>Project Name: {p.projectname}</li>
        <li>Description: {p.description}</li>
        <li>Required Skill: {p.requiredSkill.join(', ')}</li>
        <li>Status: {p.status}</li>
        <li>Team Size: {p.teamsize}</li>
        <li>Members: {p.members.length}</li>
        <li>Leader: {p.leader.username}</li>
        <button type='submit' onClick={()=>{joinRequest(p._id)}}>Join</button>
        </ul>
      ))}</div>
     )
    }
    </>
   
  )
}
export default Dashboard