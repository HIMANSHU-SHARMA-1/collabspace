const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')

router.post('/create',auth,projectController.createProject)
router.get('/getAll', projectController.getAllProjects)
router.get('/myProjects',auth,projectController.getMyProjects)
router.get('/By/:id',projectController.getProjectbyID)
router.get('/joinedProjects',auth, projectController.getJoinedProjects)
router.put('/update/:id', projectController.updateProjects)
router.delete('/delete/:id', projectController.deleteProjects)

module.exports = router;