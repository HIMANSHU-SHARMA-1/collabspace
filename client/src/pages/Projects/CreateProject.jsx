import React, { useState } from 'react'

const CreateProject = () => {

    const [formData, setformData] = useState(
        {
            projectname:'',
description:'',
requiredSkill:[],
teamsize:'',
githubLink:'',
//leader:'', backend will auto. handles the leader insertion and members insertion through logics already in the backend
//members:[],
status:'open'
        })

    const addData=(e)=>{
        setformData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit =()=>{

    }
  return (
    <>
       <h1>Create Project</h1>
    <form onSubmit={handleSubmit}>
      
      <label>Project Name:</label>
      <input type="text" name="projectname" onChange={addData} />

        <label>Description:</label>
      <textarea name="description" onChange={addData} />

        <label>Required Skill:</label>
      <input type="text" />
      <button type="button">Add Skill</button>

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
  )
}

export default CreateProject