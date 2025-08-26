const express = require('express')
const path=require('path')
const router =express.Router()
const projectController = require('../../controllers/projectController')
router.route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject)
  .put(projectController.updateProjects)
  .delete(projectController.deleteProjects);
    




module.exports=router