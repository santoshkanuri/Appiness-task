export default class ApiError
{
	static internalError(message)
	{
		return {status : 500, code : 'InternalError', message : message || 'Internal Server Error'};
	}
	
	static validationError(message)
	{
		return {status : 400, code : 'ValidationError', message : message || 'Validation Failure'};
	}
	
	static invalidCredentialsError(message)
	{
		return {status : 401, code : 'InvalidCredentials', message : message || 'Invalid Credentials'};
	}
	
	static notAuthorizedError(message)
	{
		return {status : 403, code : 'NotAuthorized', message : message || 'Not Authorized'};
	}
	
	static notFoundError(message)
	{
		return {status : 404, code : 'NotFound', message : message || 'Not Found'};
	}
	
	static generic(code, message)
	{
		return {status : 400, code : code || 'UnknownError', message};
	}
};
