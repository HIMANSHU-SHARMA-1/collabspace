require('./setup')
const {registerAndLogin} = require('./helper')

test('registerAndLogin returns a real token and userId', async()=>{

    const userData ={
        username: 'helpertest',
    email: 'helpertest@example.com',
    password: 'password123',
    }

    //Act
    const {token, userId} = await registerAndLogin(userData)

    //Assert 
    //toBedefined - We're just checking it exists and has the right shape.
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(userId).toBeDefined()


})