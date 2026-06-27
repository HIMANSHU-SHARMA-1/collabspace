import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import Nav from '../../components/Navbar/Nav'
import { useNavigate } from 'react-router-dom'

const Recommendation = () => {

    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const recommendProjects = async()=>{
        setLoading(true)

        try{
            const recomProjects = await api.get('/api/openAi/recommend-projects')
            console.log(recomProjects.data.data)
            setProjects(recomProjects.data.data)
            setLoading(false)
        }catch(err){
            setError(err?.response?.data?.message || err.message || 'Projects Recommendation fetching failed')
            setLoading(false)

        }

    }

    const viewHandle = ()=>{
        navigate('/dashboard')
    }

    useEffect(()=>{
        recommendProjects()
    },[])
  return (
    <>
    <Nav/>
    {
        loading?(<p>Loading projects....</p>):error?(<p>{error}</p>): projects.length === 0?(<p>Currently there is no recommended Projects for you</p>):(
            <div>
                {projects.map((projects,index)=>(
                    <ol key={index} style={{border:'2px solid black'}}>
                        <li>Project Name: {projects.projectName}</li>
                        <li>Score: {projects.score}</li>
                        <li>Team Size: {projects['Team Size']}</li>
                        <li>Current Members: {projects['Current Members']}</li>
                        <li>Reason: {projects.reason}</li>
                        <button onClick={viewHandle}>View</button>
                    </ol>
                ))}
            </div>
        )

    }
    
    </>
  )
}

export default Recommendation