import api from '../api/axios'


const login = async(email, password)=>{
try{
    const res = await api.post('/api/auth/login',{email, password})
    return res.data
}
catch(err){
    throw err;
}
}

const register = async(userData)=>{
    try{
        const res = await api.post('/api/auth/register',userData)
        return res.data
    }
    catch(err){
        throw err
    }

}
export {login, register}