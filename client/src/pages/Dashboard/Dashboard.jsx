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
      const response = await api.get('/api/project/getAll',{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
      // console.log(response.data.data)
      setProjects(response.data.data)
      setLoading(false)
      setSuccess(true)
    }
    catch(err){
      setError(err.response?.data?.message || err.message || 'Failed to load Projects')
      setLoading(false)
      
    }
  }
  useEffect(()=>{
    getProjects()
  },[])
  
  return (
    
    <>
      {
     // loading?(<p>Loading Projects</p>): error?(<p>{error}</p>): projects.length === 0?(<p>No Projects yet</p>):
    }
    </>
   
  )
}
export default Dashboard