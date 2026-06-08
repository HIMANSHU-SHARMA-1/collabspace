const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/register',authController.register)

router.post('/login',authController.login)
//!bearer(rohit)leader token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjU4Mjg1Yzk2NmViZGJlNjJmYjhjZCIsImlhdCI6MTc4MDkxMDc4MSwiZXhwIjoxNzgxNTE1NTgxfQ.BX_E8F4iqxF5P6Dcnh-omUpKZ7tv3FfMwV-wNYFQ5bg
//!bearer(himanshu) token :
router.get('/me',auth , (req,res)=>{
res.json({message:'protected user route works', user:req.user})
})



module.exports = router;