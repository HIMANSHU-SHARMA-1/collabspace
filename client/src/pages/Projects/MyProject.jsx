import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import Nav from '../../components/Navbar/Nav'




const MyProject = () => {

    const [projects, setProjects] = useState([])
    const[error,setError] = useState()
    const [loading, setLoading] = useState(false)

    const myProjects = async()=>{
        setLoading(true)
       try{
        const myProjectData = await api.get('/api/project/myProjects')
        // console.log(myProjectData.data.data)
        setProjects(myProjectData.data.data)
        setLoading(false)
       }
       catch(err){
        setError(err?.response?.data?.message||err.message||'Project fetching failed')
        setLoading(false)
       }
    }

    useEffect(()=>{
        myProjects()
    },[])

    return (
    <>
    <Nav/>
        {
            loading?(<p>Loading Projects...</p>):error?(<p>{error}</p>): projects.length === 0?(<p>No projects yet</p>):(

                projects && projects.map((project,index)=>(
                <ul key={index} style={{border: '2px solid black'}}>
                <li>Project Name: {project.projectname}</li>
                <li>Project Description: {project.description}</li>
                <li>Required Skills: {project.requiredSkill.join(', ')}</li>
                <li>Status: {project.status}</li>
                <li>Team Size: {project.teamsize}</li>
                <li>Members : {project.members.length}</li>
                <li>Leader: {project.leader.username}</li>
                </ul>
            ))
        )
        }

    
    
    </>
  )
}

export default MyProject