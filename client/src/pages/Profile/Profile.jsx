import React, { useEffect, useState } from 'react'
import Nav from '../../components/Navbar/Nav'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'


const Profile = () => {

    const {user} = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState({})
    const [loading, setLoading] = useState(false)
const [error, setError] = useState('')  



const getProfile = async()=>{
    try{
        setLoading(true)
        const response = await api.get('/api/auth/me')
        setProfile(response.data.data)
        setLoading(false)
        // console.log()

    }catch(err){
        setError(err?.response?.data?.message || err.message || 'Profile fetching failed')
        setLoading(false)
    }
}

useEffect(()=>{
    getProfile()
},[])

  return (
    <>
    <Nav/>
    {
        loading?(<p>Loading Profile</p>):error?(<p>{error}</p>):(
            <div>
                

            </div>
        )

    }
    </>
)
}

export default Profile