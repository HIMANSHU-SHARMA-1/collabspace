import express = require('express')
const router = express.Router()
import aiController = require('../controllers/aiController')
import auth = require('../middleware/auth')

router.get('/test',aiController.testAi)
router.get('/recommend-projects', auth, aiController.recommendProjects)
export = router