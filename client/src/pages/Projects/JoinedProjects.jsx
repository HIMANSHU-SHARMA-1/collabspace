import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import Chat from '../chat/Chat'
import Nav from '../../components/Navbar/Nav'

const JoinedProjects = () => {

    const [openChat, setopenChat] = useState(null)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()



    const getJoinedProjects = async()=>{
        try{
            setLoading(true)
        const getProjects = await api.get('/api/project/joinedProjects') 
        // console.log(getProjects.data.data)
        setProjects(getProjects.data.data)
        setLoading(false)
        }catch(err){
            setError(err?.response?.data?.message || err.message || 'Projects fetching failed')
        }
    }
useEffect(()=>{
    getJoinedProjects()
},[])


  return (
    <>
    <Nav/>
    {
        loading?(<p>Loading Projects.....</p>):error?(<p>{error}</p>):  projects.length === 0?(<p>Currently there is no Joined Projects </p>):(
        <div>
            {projects.map((project,index)=>(
                <ol key={index}>
                <li>Project Name: {project.projectname}</li>
        <li>Description: {project.description}</li>
        <li>Required Skill: {project.requiredSkill.join(', ')}</li>
        <li>Status: {project.status}</li>
        <li>Team Size: {project.teamsize}</li>
        <li>Members: {project.members.length}</li>
        <li>Leader: {project.leader.username}</li>
        <button onClick={()=>{setopenChat(project._id)}}>💬 Chat</button>

            </ol>
            ))
            }

        </div>
        )
        
    }
    {openChat && <Chat projectId={openChat} members={projects.find(p=>p._id === openChat)?.members}/>}
    
    </>
  )
}

export default JoinedProjects