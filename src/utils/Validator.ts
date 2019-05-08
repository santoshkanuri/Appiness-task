import * as Joi from "joi";
import ApiError from './ApiError';

export default class Validator
{
	static async validate(obj, schema)
	{
		return new Promise((resolve, reject) => {
			Joi.validate(obj, schema, {stripUnknown: true}, (err, value) => {
				if (err) {
					reject(ApiError.validationError(err.details[0].message));
				} else {
					resolve(value);
				}
			});
		});
	}
}
