const router = require('express').Router();

router.use("/", require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World!']
    res.send('Hello World!<br>' +
        'For <strong>all tasks</strong>, go to <strong>/tasks</strong><br>' +
        'For <strong>single task</strong>, go to <strong>/tasks/:id</strong><br>' +
        'For <strong>all users</strong>, go to <strong>/users</strong>' +
        'For <strong>single user</strong>, go to <strong>/users/:id</strong>'
    );
});

router.use('/tasks', require('./tasks'));
router.use('/users', require('./users'));

module.exports = router;