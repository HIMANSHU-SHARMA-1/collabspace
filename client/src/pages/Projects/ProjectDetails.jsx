import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import Nav from '../../components/Navbar/Nav'


const ProjectDetails = () => {

    const navigate = useNavigate()
    
    const {projectId} = useParams()
    const {user} = useAuth()

    const [loading, setLoading] = useState(false)
    const [project, setProject] = useState({})
    const [error,setError] = useState()

    const [isEditing, setIsEditing] = useState(false)
    const [skillName, setSkillName] = useState('')
    const [formData, setFormData] = useState({
         projectname: '',
    description: '',
    requiredSkill: [],
    teamsize: '',
    githubLink: '',
    status: 'open',
    })


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


    const startEditing =()=>{
        setFormData({
            projectname: project.projectname || '',
      description: project.description || '',
      requiredSkill: project.requiredSkill || [],
      teamsize: project.teamsize || '',
      githubLink: project.githubLink || '',
      status: project.status || 'open',
        })
        setIsEditing(true)
    }

    const addData =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleAddSkill =()=>{
        if(!skillName.trim()) return
        setFormData(prev=>({
            ...prev,
            requiredSkill:[...prev.requiredSkill, skillName.trim()]
        }))
        setSkillName('')
    }

    const handleRemoveSkill = (indexToRemove)=>{
        setFormData(prev=>({
            ...prev,
            requiredSkill: prev.requiredSkill.filter((skill,i)=> i !== indexToRemove),
        }))
    }

    const editDetails = async(e)=>{
        e.preventDefault()
        try{
            const response = await api.put(`/api/project/update/${projectId}`,formData)
            setProject(response.data.data)
            fetchProjectDetails()
            setIsEditing(false)

        }catch(err){
            setError(err?.response?.data?.message || err.response ||'Project update failed')
        }
    }

    const removeMember = async(memberId)=>{
        try{
            const response = await api.delete(`/api/project/removeMember/${projectId}/${memberId}`)
        setProject(response.data.data)
        alert(`Member removed successfully`)
        }catch(err){
            alert(err?.response?.data?.message || 'Failed to remove member')
        }
    }

    const deleteProject = async()=>{
       try{
        setLoading(true)
        await api.delete(`/api/project/delete/${projectId}`)
        alert('Project Deleted Successfully')
        navigate('/my-project')
        setLoading(false)
       }catch(err){
        setError(err?.response?.data?.message || err.response ||'Project update failed')
        setLoading(false)
       }
    }
    
   const isLeader = project.leader?._id === user.id


  return (
    <>
        <Nav/>
        {
       loading?(<p>Loading Project</p>): error?(<p>{error}</p>): isEditing? (

        <form onSubmit={editDetails} style={{border: '2px solid black', padding: '10px'}}>
            <label>Project Name:</label>
            <input type='text' name='projectname' value={formData.projectname} onChange={addData}/>

            <label>Description:</label>
            <input type='text' name='description' value={formData.description} onChange={addData}/>

            <div>
                <label>Required Skill:</label>
                <input type='text' value={skillName} onChange={(e)=>{setSkillName(e.target.value)}}/>
                <button onClick={handleAddSkill}>Add Skill</button>
                {
                    formData?.requiredSkill.map((skill,index)=>(
                        <li key={index}>
                            {skill}<button type='button' onClick={()=>{handleRemoveSkill(index)}}>X</button>
                        </li>
                    ))
                }
            </div>
            <label>Team Size:</label>
          <input type="number" name="teamsize" value={formData.teamsize} onChange={addData} />

          <label>Github Link:</label>
          <input type="text" name="githubLink" value={formData.githubLink} onChange={addData} />

          <label>Status:</label>
          <select name="status" value={formData.status} onChange={addData}>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button type="submit">Save Changes</button>
          <button type='button' onClick={()=>{setIsEditing(false)}}>cancel</button>
        </form>
       ):(
        <div >
          <ul style={{border:'2px solid black'}}>
            <li>Project Name: {project.projectname}</li>
          <li>Project Description: {project.description}</li>
          <li>Required Skill: {project.requiredSkill?.join(', ')}</li>
          <li>Github: {project.githubLink}</li>
          <li>Status: {project.status}</li>
          <li>Team Size: {project.teamsize}</li>
          <li>Leader: {project.leader?.username || 'NA'}</li>
          <li>Members: 
            <ul>
                {project.members?.map((m)=>(
                    <li key={m._id}>
                        {m.username}
                        {
                            isLeader && (
                                <button onClick={()=>{removeMember(m._id)}}>Remove</button>
                            )
                        }
                    </li>
                ))}
            </ul>
          </li>

          {
            isLeader && (<div>
                <button onClick={startEditing}>Edit Details</button>
                <button onClick={deleteProject}>Delete Project</button>
            </div>
            )
          }
          </ul>
        </div>
       )
      }
    
    </>
  )
}

export default ProjectDetails