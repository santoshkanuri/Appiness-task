import * as express from 'express';
import * as jwt from 'jsonwebtoken';
//import AuthController from './AuthController';
import LoginController from './LoginController';
import {config} from "../../config/";
import ApiError from '../../utils/ApiError';
import UserService from "../../services/UserService";

import UserController from './UserController';


const routes = express.Router();


// Auth
routes.post('/login', tryCatch(LoginController.login));
// user
routes.get('/users',checkAuth,tryCatch(UserController.fetchAllUsers));
routes.post('/signup',tryCatch(UserController.createUser));
routes.put('/user/:id',checkAuth,tryCatch(UserController.updateUser));
routes.delete('/user/:id',checkAuth,checkAdmin,tryCatch(UserController.deleteUser));
//roles
routes.get('/roles',checkAuth,tryCatch(UserController.fetchRoles));
routes.post('/role',checkAuth,checkAdmin,tryCatch(UserController.createRole));
routes.post('/assign-role',checkAuth,checkAdmin,tryCatch(UserController.assignRole));



function checkAuth(req, res, next)
{
	if (!req.headers.authorization)
	{
		const ae = ApiError.generic('InvalidHeaderError', 'Authorization header is missing.');
		res.status(ae.status).send(ae);
		return req.connection.destroy();
	}
	
	const token = req.headers.authorization.split(' ')[1];
	
	jwt.verify(token,config.jwtSecret, {}, async (err, decoded) => {
		if (err)
		{
			const ae = ApiError.invalidCredentialsError('Invalid or expired token.');
			res.status(ae.status).send(ae);
			return req.connection.destroy();
		}
		req.user = decoded.sub;		
		return next();
	});
}

function checkAdmin(req, res, next)
{

	if (!req.user.isAdmin)
	{
		const ae = ApiError.notAuthorizedError('Not authorized. Requires admin permission');
		res.status(ae.status).send(ae);
		return req.connection.destroy();
	}
		return next();
}



function tryCatch(func) {
	return async (req, res, next) => {
		try {
			await func(req, res, next)
		} catch(error) {		
			if (error.status && error.code)
				res.status(error.status).send(error);
			else
			{
				const ae = ApiError.internalError(null);
				res.status(ae.status).send(ae);
			}
		}
	}
}

module.exports = routes;