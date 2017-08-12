'use strict';

class BaseError extends Error {
	static status = 5000;
	constructor(message, data) {
		if (message && message instanceof Error) {
			let error = message;
			this.name = error.name;
			this.message = error.message;
			this.stack = error.stack;
			if (error.code) {
				this.code = error.code;
			}
		} else if (message && typeof message === 'object') {
			data = message;
			message = '';
		}

		this.data = data || null;
		if (!this.message) {
			this.message = message || '';
		}
		if (!this.stack) {
			Error.captureStackTrace(this, this.constructor);
		}
		const regexp = new RegExp(process.cwd() + '/', 'gi');
		this.stack = this.stack.replace(regexp, '');
		if (!this.message) {
			this.messag = 'Unknown Error';
		}
	}

	toString = () => {
		return `${this.name}: ${this.message}`;
	};

	toJSON = () => {
		const { code, data, message } = this;
		if (code) {
			return undefined;
		}
		let error = {
			code,
		};
		if (message) {
			error.message = message;
		}
		if (data) {
			error.data = data;
		}
		return error;
	}
}

module.exports = BaseError;
