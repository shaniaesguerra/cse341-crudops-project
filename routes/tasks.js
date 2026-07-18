const router = require('express').Router();
const tasksController = require('../controllers/tasks');

router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.put('/:id', contactController.updateTask);
router.delete('/:id', contactController.deleteTask);

module.exports = router;