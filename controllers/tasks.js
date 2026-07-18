const taskModel = require('../models/tasks');

const getAllTasks = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const tasks = await taskModel.find();
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    
};

const getTaskById = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const task = await taskModel.findById(req.params.id);

        //Show error message if there is no task with that id
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        //otherwise, show the task
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTaskById
}