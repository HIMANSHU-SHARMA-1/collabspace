require('./setup')
const request = require('supertest')
const app = require('../index')

describe('auth Middleware',()=>{

    test('rejects a request with no Authorization header',async()=>{
        //Act
        const res = await request(app).get('/api/project/myProjects')

        expect(res.statusCode).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('login required')
    })

})