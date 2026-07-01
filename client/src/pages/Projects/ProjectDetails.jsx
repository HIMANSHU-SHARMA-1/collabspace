import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import Nav from '../../components/Navbar/Nav'

const ProjectDetails = () => {

    
    const {projectId} = useParams()
   
    // console.log(projectId)
    const {user} = useAuth()
    const [loading, setLoading] = useState(false)
    const [project, setProject] = useState({})
    const [error,setError] = useState()


   const fetchProjectDetails = async()=>{
      try{
        setLoading(true)
        const projectDetails = await api.get(`/api/project/By/${projectId}`)
        setProject(projectDetails.data.data)
        // console.log(projectDetails.data.data)
        setLoading(false)


      }catch(err){
        setError(err?.response?.data?.message || err.message || 'project Details Fetching failed')
        setLoading(false)
      }
    }
    useEffect(()=>{
        fetchProjectDetails()
    },[projectId])


  return (
    <>
        <Nav/>
        {
       loading?(<p>Loading Project</p>): error?(<p>{error}</p>):(
        <div >
          <ul style={{border:'2px solid black'}}>
            <li>Project Name: {project.projectname}</li>
          <li>Project Description: {project.description}</li>
          <li>Required Skill: {project.requiredSkill?.join(', ')}</li>
          <li>Github: {project.githubLink}</li>
          <li>Status: {project.status}</li>
          <li>Team Size: {project.teamsize}</li>
          <li>Members: {project.members?.length || 0}</li>
          <li>Leader: {project.leader?.username || 'NA'}</li>
          {
            (project.leader?._id === user.id) && (<button>Edit Details</button>)
          }
          </ul>
        </div>
       )
      }
    
    </>
  )
}

export default ProjectDetails