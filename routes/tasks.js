const router = require('express').Router();
const tasksController = require('../controllers/tasks');

router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);

module.exports = router;