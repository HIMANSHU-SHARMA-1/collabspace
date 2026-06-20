import {React,useState} from 'react'
import { login, register } from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const[formData, setFormData] = useState({
    username:'',
    email:'',
    password:'',
    bio:'',
    skills:[],
  })

const [success, setSuccess] = useState()
const [error,setError] = useState('')
const[loading,setLoading]=useState(false)
const[skillName, setSkillName] = useState('')
const[skillRating, setSkillRating] = useState('')


const handleSkill = (e)=>{
  setSkillName(e.target.value)
}

const handleRating=(e)=>{
setSkillRating(Number(e.target.value))
}

const handleAddSkill=()=>{
  if(!skillName.trim()){
    // 1️⃣ Validate the temporary fields
    return alert("Skill Name can't be empty");
  }
  if(isNaN(skillRating) || skillRating<1 || skillRating>5){
    return alert('Rating must be a number between 1 to 5')
  }
    // 2️⃣ Add the skill to the formData.skills array (immutably)

  setFormData(prev =>({
    ...prev,
    skills:[...prev.skills, {name:skillName.trim(),rating:skillRating}]
  }))
   // 3️⃣ Clear the temporary input
  setSkillName('')
  setSkillRating('')
}




const validateForm = ()=>{

}


  const handleSubmit = async(e)=>{
  setLoading(true)
    e.preventDefault()
    try{
      await register(formData) //we don't need the result here
      const loginData = await login(formData.email,formData.password)
      if(loginData.success === true){
        localStorage.setItem('token',loginData.token)
      setSuccess(true)
        navigate('/dashboard')
      }
      else{
        throw new Error('Login Failed after registration')
      }

    }catch(err){
      const msg = err.response?.data?.message || err.message ||'Something went wrong, Please try again.'
    setError(msg)
    }
    finally{
    setLoading(false)
    }
  }

  const addData =(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})

  }
  return (
    <>
    <h1 align='center'>Register</h1>
    <form onSubmit={(e)=>{handleSubmit(e)}}>
    <div>
      <label>Username:</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={addData}
        required
      />
    </div>
    <div>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={addData}
        required
      />
    </div>
    <div>
      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={addData}
        required
        minLength={6}
      />
    </div>
    <div>
      <label>Bio:</label>
      <textarea
        name="bio"
        value={formData.bio}
        onChange={addData}
      />
    </div>
    <div>
      <h3>Skills</h3>
      <div>
        <label>Skill Name:</label>
        <input
        type='text'
        value={skillName}
        onChange={handleSkill}
        placeholder='e.g. React '        
        />
      </div>
      <div>
        <label>Rating (1-5)</label>
        <input
        type='number'
        min={1}
        max={5}
        value={skillRating}
        onChange={handleRating}        
        />
      </div>
      <button type='button' onClick={handleAddSkill} disabled={loading}>Add Skill</button>
      {
        //display the current skills
        formData.skills.length>0 && (
        <div>
            <h4>Your Skills:</h4>
            <ul>
                {formData.skills.map((skill, index)=>(
                  <li key={index}><span>{skill.name}-{skill.rating}/5</span>
                   <button type='button' onClick={()=>{setFormData(
                    prev=>{
                      const newSkills = [...prev.skills]
                      newSkills.splice(index,1) //! removes 1 element starting at index
                      return {...prev, skills:newSkills}
                    }
                  )}}>Remove</button>
                  </li> 
                 
                ))}
            </ul>





        </div>
      )







      }
    </div>
    {
      error && <div style={{color:'red', marginBottom:'10px'}}>{error}</div>
    }

      <button type='submit' disabled={loading}>Submit</button>
      
      
    </form>
    </>
  )
}

export default Register