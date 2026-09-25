import modelUser from "../models/modelUser.js";
import bcrypt from "bcryptjs";

const ControllerUsers = {
    createUser: async(sol , res)=>{
        try{
            const {name, email, password} = sol.body;
            const passwordProtected = await bcrypt.hash(password, 10);
            const newUser = new modelUser({
                name,
                email,
                password: passwordProtected,
            });
            console.log(newUser);

            const userCreate = await newUser.save();
            if(userCreate._id){
                res.json({
                    result: 'fine',
                    message: 'User created',
                    data: userCreate,
                });
            }
        }catch(error){
            res.json({
                result: 'mistake',
                message: 'An error occurred while creating the user',
                data: error,
            });
        }
    },

    readUsers: async(sol , res)=>{
        try{
            const allUserFound = await modelUser.find();
            res.json({
                result: 'fine',
                message: 'Users found',
                data: allUserFound,
            })

        }catch(error){
            res.json({
                result: 'mistake',
                message: 'An error occurred while reading all users',
                data: error,
            });
        }
    },

    readUsersId: async(sol, res)=>{
        try {
            const userFound = await modelUser.findById(
                sol.params.id
            );
            if(userFound._id){
                res.json({
                result: 'fine',
                message: 'user found',
                data: userFound,
                });
            }
        } catch (error) {
                res.json({
                result: 'mistake',
                message: 'An error occurred while reading the user',
                data: error,
            });
        }
    },
    deleteUser: async(sol, res)=>{
        try{
            const userDelete = await modelUser.findByIdAndDelete(sol.params.id);
                if(userDelete._id){
                    res.json({
                    result: 'fine',
                    message: 'User Delete',
                    data: null,
                });
            }
        }catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred while deleting the user',
                data: error,
            });
        }
    }, 
    updateUser : async (sol, res)=>{
        try {
             const dataToUpdate = { ...sol.body };
            if (dataToUpdate.password) {
                dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
            }

            const userUpdate = await modelUser.findByIdAndUpdate(
                sol.params.id,
                dataToUpdate,
                { new: true } 
            );
            if(userUpdate._id){
                res.json({
                    result: 'fine',
                    message: 'User Update',
                    data: userUpdate,
                });
            }
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred while updating the user',
                data: error,
            });
        }
    }
}

export default ControllerUsers;
