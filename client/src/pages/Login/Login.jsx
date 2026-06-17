import { useState } from 'react'
import {login} from '../../services/authService'
import { useNavigate } from 'react-router-dom'



const Login = () => {
const [formData, setformData] = useState({})
const navigate = useNavigate() //redirect after after submit

const handleSubmit = async (e)=>{
  e.preventDefault()
  try{
    const data = await login(formData.email, formData.password)
    localStorage.setItem('token',data.token)
    if(data.success === true){
      navigate("/dashboard")
    }
  }
  catch(err){
    console.log(err.message)
  }
  finally{
    e.target.reset()
  }
 
// console.log(formData)

}

const addData = (e)=>{
  setformData({...formData, [e.target.name]:e.target.value})
}
  return (
    <>
    <form action="" onSubmit={(e)=>{handleSubmit(e)}}>
    <input type="text" name='email'  onInput={(e)=>{addData(e)}} placeholder='enter your email'/>
    <input type='password' name='password'  onInput={(e)=>{addData(e)}} placeholder='enter your password'/>
    <button type='submit'>Login</button>
    </form>
    </>
  )
}

export default Login