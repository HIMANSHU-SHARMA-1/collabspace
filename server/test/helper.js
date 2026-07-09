const request = require('supertest')
const app = require('../index')

async function registerAndLogin(userData){


//register
    await request(app).post('/api/auth/register').send(userData)

    //login
    const res = await request(app).post('/api/auth/login').send({email:userData.email,password:userData.password})
    return {token:res.body.token,userId:res.body.data.id}

}

module.exports = {registerAndLogin}