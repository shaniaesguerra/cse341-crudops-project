const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);

module.exports = router;