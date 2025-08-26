const express = require('express')
const path=require('path')
const router =express.Router()
const logTimeController = require('../../controllers/logTimeController')

router.route('/')
.get(logTimeController.getallTime)
.post(logTimeController.startTimer)



router.route
("/:id").patch(logTimeController.stopTimer)
.delete(logTimeController.deleteTimer)

router.route("/export")
.get(logTimeController.exportLogsToCSV)
module.exports=router


router.route('/earnings')
.get(logTimeController.getEarningsSummary)
