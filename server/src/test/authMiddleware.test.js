require('./setup')
const request = require('supertest')
const app = require('../index')

describe('auth Middleware',()=>{

    //without token test
    test('rejects a request with no Authorization header',async()=>{
        //Act
        const res = await request(app).get('/api/project/myProjects')

        expect(res.statusCode).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('login required')
    })

    //malformed token
    test('reject a request with malformed token',async()=>{
        //act
        const res = await request(app).get('/api/project/myProjects').set('Authorization', 'Bearer this-is-not-a-real-token')

        //Assert
        expect(res.body.message).toBe('jwt malformed')



    })


})