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

        //otherwise, show the task
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById
}