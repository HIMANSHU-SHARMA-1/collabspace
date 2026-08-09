import express = require('express')
const router = express.Router()
import authController = require('../controllers/authController')
import auth = require('../middleware/auth')

router.post('/register',authController.register)

router.post('/login',authController.login)

router.get('/me',auth,authController.getCurrentUser)

router.put('/update-profile', auth, authController.updateProfile)

// router.get('/me',auth , (req,res)=>{
// res.json({message:'protected user route works', user:req.user})
// })



export = router;