const Role = require('../models/roleModel');
const User = require('../models/userModel');


//create a role
const createRole = async (req, res) => {
    try{
        const {name} = req.body;
        if(!name){
            return res.status(404).json({error: 'Name is required'});
        }
        const role = new Role({name});
        await role.save();
        res.status(200).json(role);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to create role'});
    }
};


//get all roles
const getAllRoles = async (req, res) => {
    try{
        const roles = await Role.find().populate('users');
        res.status(200).json(roles);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to retrieve roles'});
    }
};


//update a role
const updateRole = async (req, res) => {
    try {
      const { id: roleId } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(404).json({ error: 'Name is required' });
      }
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      role.name = name;
      await role.save();
      await User.updateOne({ role: role._id }, { role: role._id });
      res.status(200).json(role);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update role' });
    }
};
  


//delete a role
const deleteRole = async (req, res) => {
    try{
        const role = await Role.findById(req.params.id);
        if(!role){
            return res.status(404).json({error: 'Role not found'});
        }
        await role.deleteOne();
        res.json({message: 'Role deleted successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Failed to delete role'});
    }
};


module.exports = {
    createRole,
    getAllRoles,
    updateRole,
    deleteRole,
};