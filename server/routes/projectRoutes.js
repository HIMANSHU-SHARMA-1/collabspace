const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')

router.post('/create',auth,projectController.createProject)
router.get('/getAll', projectController.getAllProjects)
router.get('/myProjects',auth,projectController.getMyProjects)
router.get('/By/:id',projectController.getProjectbyID)
router.get('/joinedProjects',auth, projectController.getJoinedProjects)
router.put('/update/:id',auth, projectController.updateProjects)
router.delete('/removeMember/:projectId/:memberId',auth, projectController.removeMember)
router.delete('/delete/:id',auth, projectController.deleteProjects)

module.exports = router;