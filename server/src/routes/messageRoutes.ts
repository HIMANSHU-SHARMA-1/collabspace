import express = require('express')
const router = express.Router()
import messageController = require('../controllers/messageController')
import auth = require('../middleware/auth')

router.get('/:projectId',auth, messageController.getProjectMessages)

export = router;