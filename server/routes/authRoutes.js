const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/register',authController.register)

router.post('/login',authController.login)

router.get('/me',auth , (req,res)=>{
res.json({message:'protected user route works', user:req.user})
})



module.exports = router;