const express = require('express')
const router = express.Router()
const aiController = require('../controllers/aiController')
const auth = require('../middleware/auth')

router.get('/test',aiController.testAi)
router.get('/recommend-projects', auth, aiController.recommendProjects)
module.exports = router