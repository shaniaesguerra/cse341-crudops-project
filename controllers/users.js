const userModel = require('../models/users');

const getAllUsers = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const users = await userModel.find();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = await userModel.findById(req.params.id);
        //Show error message if there is no user with that id
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        //otherwise, show the user
        res.json(user);
    }
    catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            // error message for invalid MongoDb id
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({ error: error.message });
    }
};

const createUser= async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = await userModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
        });

        //return 201 Created status code
        return res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({error: error.message})
        }
        return res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id,
            {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role
            },
            { new: true, runValidators: true });
        
        //Check if the user exists:
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //else, return result
        return res.json(user);
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

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
       
        //Check if  user exists:
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}