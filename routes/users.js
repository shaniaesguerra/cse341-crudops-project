const router = require('express').Router();
const user = require('../models/users');

router.get('/', async (req, res) => {
    const user = await user.find();
    res.json(user);
});

module.exports = router;