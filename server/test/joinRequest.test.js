require('./setup')
const request  = require('supertest')
const app = require('../index')

const {registerAndLogin} = require('./helpers')

describe('PUT /api/joinRequest/reject/:id',()=>{

    test('a non-leader cannot reject a join request that is not theirs',async()=>{

        //Arrange
        //!1.register + login the leader
        const leader = await registerAndLogin({
            username: 'leaderuser',
      email: 'leader@example.com',
      password: 'password123',
        })

    //!2. register + login the requester
    const requester = await registerAndLogin({
        username: 'requestUser',
      email: 'requester@example.com',
      password: 'password123',
    })

    //!3 register + unrelated user
    const outsider = await registerAndLogin({
        username: 'outsider',
      email: 'outsider@example.com',
      password: 'password123',
    })

    // leader Creates the project
    const projectBody = {
        "projectname": "Test project",
  "requiredSkill": ["react"],
  "teamsize": "4",
  "githubLink": "https://test.com",
  "description": "it's a test description",
  "status": "open"
    }
    const projRes = await request(app).post('/api/project/create')
    .set('Authorization', `Bearer ${leader.token}`)
    .send(projectBody)

    //!5 requester send join request to the project
    const joinReqRes = await request(app).post('/api/joinRequest/send').set('Authorization', `Bearer ${requester.token}`).send({
        projectId: projRes.body.data.id
      })

    //!6 grab the actual join request's _id from joinReqRes 
    const reqId = joinReqRes.body.data.id

    //Act - the OUTSIDER (not the leader) tries to reject it
    const res = await request(app).put(`/api/joinRequest/reject/${reqId}`).set('Authorization', `Bearer ${outsider.token}`)

    //Assert
    expect(res.statusCode).toBe(403)
expect(res.body.message).toBe('not project leader, forbidden !')



    })
})