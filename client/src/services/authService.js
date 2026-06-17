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
export {login}