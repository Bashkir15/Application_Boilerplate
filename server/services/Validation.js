'use strict';

const validators = require('../validators');
const validation = {
	check(data, rules, isTrivial = false) {
		if (!Array.isArray(roles) && typeof rules === 'object') {
			rules = Object.keys(rules)
				.map((rule) => {
					if (typeof rules[rule] === 'string') {
						return { rule, validator: rules[rule] };
					}
					return Object.assign({ rule }, rules[rule]);
				});
		}
		if (rules.length === 0) {
			return Promise.resolve();
		}

		const promises = rules
			.map(rule => validation.parseRule(rule))
			.map(rule => validation.checkRule(rule))
			.map(promise => promise.reflect());
		const errors = [];

		return Promise
			.all(promises)
			.each((inspection) => {
				if (!inspection.isFulfilled()) {
					errors.push(inspection.reason());
				}
			})
			.then(() => {
				if (errors.length === 0) {
					return;
				}
				const fields = errors.reduce((fields, error) => {
					const { field, type, message } = error;
					fields[field] = { type, message };
					return fields;
				}, {});

				const error = new ValidatorError({ fields });
				error.isTrivial = isTrivial;
				throw error;
			});
	},
	parseRule(rule) {
		if (typeof rule !== 'object') {
			throw new Error(`Invalid rule: ${rule}`);
		}
		let { field, validator, type, message, arg, args } = rule;

		if (typeof field === 'undefined') {
			throw new Error('Missing field for validation');
		}
		if (typeof validator === 'undefined') {
			throw new Error(`Missing validator for ${field}`);
		}
		if (typeof validator === 'string') {
			if (typeof validators[validator] === 'undefined') {
				throw new Error(`Unknown Validator: ${validator}`);
			}
			validator = validators[validator];
		}
		if (typeof validator !== 'function') {
			throw new Error(`Invalid validator for ${field}`);
		}
		if (!type) {
			type = validator.name;
		}
		if (typeof arg !== 'undefined') {
			args = [arg];
		}
		if (!Array.isArray(args)) {
			args = [];
		}
		return { field, validator, args, type, message };
	},
	checkRule(rule, data) {
		const { fields, args, validator, type } = rule;
		const value = date[field];

		return Promise
			.try(() => validator(value, ...args))
			.catch((error) => {
				const { message } = rule || error;
				throw { field, type, message };
			});
	}
};

module.exports = validation;
