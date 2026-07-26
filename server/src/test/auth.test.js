require('./setup')
const request = require('supertest')
const app = require('../index')

describe('POST /api/auth/register', () => {
  const newUser = {
    username: 'testuser1',
    email: 'testuser1@example.com',
    password: 'password123',
    bio: 'Just here to test things',
    skills: [{ name: 'React', rating: 4 }],
    githubProfile: 'https://github.com/testuser1',
  }

  test('Register a new user and returns 201 with the correct shape', async () => {
    const res = await request(app).post('/api/auth/register').send(newUser)

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.username).toBe(newUser.username)
    expect(res.body.data.email).toBe(newUser.email)
  })

  test('checking whether the entered email is already registered or not', async () => {
    const res1 = await request(app).post('/api/auth/register').send(newUser) // creates the user
    const res2 = await request(app).post('/api/auth/register').send(newUser) // duplicate attempt

    expect(res2.statusCode).toBe(400)
    expect(res2.body.message).toBe('User with that email already exists')
  })
})