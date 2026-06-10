const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middleware/auth')

router.post('/register',authController.register)

router.post('/login',authController.login)
//!bearer(rohit)leader token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjU4Mjg1Yzk2NmViZGJlNjJmYjhjZCIsImlhdCI6MTc4MDkxMDc4MSwiZXhwIjoxNzgxNTE1NTgxfQ.BX_E8F4iqxF5P6Dcnh-omUpKZ7tv3FfMwV-wNYFQ5bg
//!bearer(aman) token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjU4Mzc3YTY4ZWQ1OTBhNjM1Zjg5NiIsImlhdCI6MTc4MDkyNzAzOCwiZXhwIjoxNzgxNTMxODM4fQ.JlfZwd2fiOcMwkOyEG-J2mtfPC3N2o1j4O1fQppNpik
//!bearer(priya) token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjdlMTc5MzMyOGU1MjJjNGFkYTNmMyIsImlhdCI6MTc4MDk5ODY2MSwiZXhwIjoxNzgxNjAzNDYxfQ.St-EePqsf7tO0HIzhbNr3QnS-gyBc0gZlIQ8Q-TDk1E
router.get('/me',auth , (req,res)=>{
res.json({message:'protected user route works', user:req.user})
})



module.exports = router;