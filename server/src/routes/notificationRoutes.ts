import express = require('express')
const router = express.Router()
import notificationController = require('../controllers/notificationController')
import auth = require('../middleware/auth')
router.get('/getAll',auth,notificationController.getNotifications)
router.patch('/read/:id',auth, notificationController.markAsRead)

export = router;