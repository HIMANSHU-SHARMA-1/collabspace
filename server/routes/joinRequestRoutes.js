const express = require('express')
const router = express.Router()

const joinRequestController = require('../controllers/joinRequestController')
const auth = require('../middleware/auth')

router.post('/send', auth, joinRequestController.sendRequest)
router.post('/approve', auth, joinRequestController.approveRequest)
router.post('/reject', auth, joinRequestController.rejectRequest)

module.exports = router;