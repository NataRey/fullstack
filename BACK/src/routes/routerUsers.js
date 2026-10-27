import {Router} from 'express';
import ControllerUsers, {forgotPassword} from '../controllers/controllerUsers.js';
import {uploadUserImage} from '../middleware/upload.js';

const routerUsers = Router();

routerUsers.post('/',uploadUserImage, ControllerUsers.createUser);
routerUsers.get('/', ControllerUsers.readUsers);
routerUsers.get('/:id', ControllerUsers.readUsersId);
routerUsers.delete('/:id', ControllerUsers.deleteUser);
routerUsers.put('/:id', uploadUserImage, ControllerUsers.updateUser);
routerUsers.post('/forgotPassword', forgotPassword);

export default routerUsers;

