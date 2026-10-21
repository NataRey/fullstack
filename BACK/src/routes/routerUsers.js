import {Router} from 'express';
import ControllerUsers, {forgotPassword} from '../controllers/controllerUsers.js';

const routerUsers = Router();

routerUsers.post('/', ControllerUsers.createUser);
routerUsers.get('/', ControllerUsers.readUsers);
routerUsers.get('/:id', ControllerUsers.readUsersId);
routerUsers.delete('/:id', ControllerUsers.deleteUser);
routerUsers.put('/:id', ControllerUsers.updateUser);
routerUsers.post('/forgotPassword', forgotPassword);

export default routerUsers;

