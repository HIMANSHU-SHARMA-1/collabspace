import api from '../api/axios'

const login = async(email, password)=>{
    const res = await api.post('/api/auth/login',{email, password})
    return res.data
}

const register = async(userData)=>{
    const res = await api.post('/api/auth/register',userData)
    return res.data
}

export {login, register}