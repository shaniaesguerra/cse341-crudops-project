const { ObjectId } = require('mongodb');
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

const createTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const task = await taskModel.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            userId: req.body.userId
        });

        //return 201 Created status code
        return res.status(201).json(task);
    }
    catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({error: error.message})
        }
        return res.status(500).json({ error: error.message });
    }
};

const updateTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const task = await taskModel.findByIdAndUpdate(req.params.id,
            {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            userId: req.body.userId
            },
            { new: true, runValidators: true });
        
        //Check if the task exists:
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        //else, return result
        return res.json(task);
    }
    catch (error) {
        console.error(error);
        if (error.name === 'ValidationError' || error.name === 'CastError') {
           //error message if there is a validation error or incorrect MongoDb id
            return res.status(400).json({ error: error.message })
        }
        return res.status(500).json({ error: error.message });
    }
}

const deleteTask = async (req, res) => {
    //#swagger.tags=['Tasks']
    try {
        const task = await taskModel.findByIdAndDelete(req.params.id);
       
        //Check if  task exists:
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        //return 204 No Content status code
        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            // error message for invalid MongoDb id
            return res.status(400).json({error: error.message})
        }
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}