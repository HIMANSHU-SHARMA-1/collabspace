const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/register',authController.register)

router.post('/login',authController.login)
//!bearer token :eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDVlMTRmNDAyNWMzMWE4NjhjZGUyZCIsImlhdCI6MTc4MDQ2NTkwNywiZXhwIjoxNzgxMDcwNzA3fQ.JjqCGdga92g2Qu9jPk_kBtLsUvoXc4Ntq1N9g7XSDL0

router.get('/me',auth , (req,res)=>{
res.json({message:'protected user route works', user:req.user})
})



module.exports = router;