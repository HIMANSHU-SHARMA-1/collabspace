import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import Nav from '../../components/Navbar/Nav'




const MyProject = () => {

    const [projects, setProjects] = useState([])
    const[error,setError] = useState()
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState({})

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

    const fetchRequests = async(ProjectId)=>{
        try{
            const requestData = await api.get(`/api/joinRequest/all/${ProjectId}`)
        // console.log(requestData)
        setRequests((prev)=>({...prev,[ProjectId]:requestData.data.data}))

        }
        catch(err){
            setError(err?.response?.message || err.message || 'request fetching failed')
        }
    }

    const handleApprove = async(requestee, ProjectId)=>{
        try{
        const approve = await api.put(`/api/joinRequest/approve/${requestee}`)
        fetchRequests(ProjectId)
        }
        catch(err){
            setError(err?.response?.message || err.message || 'request approving failed')
        }
    }
    const handleReject = async(requestee, ProjectId)=>{
        try{
            const reject = await api.put(`/api/joinRequest/reject/${requestee}`)
        fetchRequests(ProjectId)

            }
            catch(err){
                setError(err?.response?.message || err.message || 'request approving failed')
            }
    }

    useEffect(()=>{
        myProjects()
        // console.log(requests)

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
                <button onClick={()=>{fetchRequests(project._id)}}>View Requests</button>
                {
                    requests[project._id] && requests[project._id].map((requests)=>(
                        <ol key={requests._id}>
                           <li>{requests.requestee.username}</li> 
                            <button onClick={()=>{handleApprove(requests._id,project._id)}}>Approve</button>
                            <button onClick={()=>{handleReject(requests._id,project._id)}}>Reject</button>
                        </ol>
                    ))
                }
                </ul>
            ))
        )
        }

    
    
    </>
  )
}

export default MyProject