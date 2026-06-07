const express = require('express')
const router = express.Router()

const joinRequestController = require('../controllers/joinRequestController')
const auth = require('../middleware/auth')

router.post('/send', auth, joinRequestController.sendRequest)
router.put('/approve/:id', auth, joinRequestController.approveRequest)
router.put('/reject/:id', auth, joinRequestController.rejectRequest)
router.get('/all/:projectId',auth, joinRequestController.getAllRequest)

module.exports = router;