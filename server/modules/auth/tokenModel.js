'use strict';

const { Schema, model } = require('mongoose');
const UsedTokenSchema = new Schema({
	_id: {
		type: Schema.ObjectId,
		required: true,
	},
});

UsedTokenSchema.statics = {
	markAsUsed(claims) {
		if (!claims || !claims.once || !claims.id) {
			return Promise.resolve();
		}
		return this.create({
			_id: claims.id,
		});
	},
	checkIfUsed(claims) {
		id (!claims || !claims.once || !claims.id) {
			return Promise.resolve(false);
		}
		return this
			.findById(claims.id)
			.select('_id')
			.then(used => !!used);
	},
};

const UsedTokens = model('UsedTokens', UsedTokenSchema);
module.exports = {
	UsedTokens,
};
