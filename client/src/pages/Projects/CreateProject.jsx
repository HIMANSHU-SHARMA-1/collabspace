import React, { useState } from "react";
import Nav from "../../components/Navbar/Nav";
import api from "../../api/axios";
import { Navigate, useNavigate } from "react-router-dom";


const CreateProject = () => {

    const navigate = useNavigate()

  const [skillName, setSkillName] = useState("");

  const [formData, setformData] = useState({
    projectname: "",
    description: "",
    requiredSkill: [],
    teamsize: "",
    githubLink: "",
    //leader:'', backend will auto. handles the leader insertion and members insertion through logics already in the backend
    //members:[],
    status: "open",
  });

  const[error,setError] = useState()
  const handleSkill=(e)=>{
        setSkillName(e.target.value)
  }

  const handleAddSkill=()=>{
    setformData((prev)=>({
        ...prev,
        requiredSkill:[...prev.requiredSkill,skillName.trim()]
    })
    )
    setSkillName('')

  }

  const addData = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
          const projectData = await api.post('/api/project/create',formData)
          if(projectData){
            navigate('/dashboard')
          }
    }
    catch(err){
        setError(err.response?.data?.message || err.message || 'Project Creation failed')
    }
  };
//   console.log(formData)
 
  return (
    <>
      <Nav />
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <label>Project Name:</label>
        <input type="text" name="projectname" onChange={addData} />

        <label>Description:</label>
        <textarea name="description" onChange={addData} />

        <div><label>Required Skill:</label>
        <input type="text" value={skillName} onChange={(e)=>{handleSkill(e)}}/>
        <button type="button" onClick={handleAddSkill}>Add Skill</button>
        {formData.requiredSkill && (formData.requiredSkill.map((skills,index)=>(
            <li key={index}>{skills}</li>
        )))}
        </div>

        <label>Team Size:</label>
        <input type="number" name="teamsize" onChange={addData} />

        <label>Github Link</label>
        <input type="text" name="githubLink" onChange={addData} />

        <label>Status:</label>
        <select name="status" onChange={addData}>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button type="submit">Create Project</button>
      </form>
    </>
  );
};

export default CreateProject;
