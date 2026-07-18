const router = require('express').Router();
const task = require('../models/tasks');

router.get('/', async (req, res) => {
    const tasks = await task.find();
    res.json(tasks);
});

module.exports = router;