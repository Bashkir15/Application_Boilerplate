'use strict';

const { Schema, model } = require('mongoose');
const ChatsSchema = new Schema({
	created: {
		type: Date,
		default: Date.now,
	},
	lastUpdated: {
		type: Date,
	},
	lastAccessed: [{
		accessed: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		unread: Number,
	}],
	creator: {
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	},
	unread: Number,
	messages: [{
		created: {
			type: Date,
			default: Date.now,
		},
		creator: {
			type: Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		message: String,
		attachment: String,
	}],
	participants: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: true,
	}],
	saves: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	}],
	saved: {
		type: Boolean,
		default: false,
	},
	hidden: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	}],
	isHidden: {
		type: Boolean,
		default: false,
	},
});

ChatsSchema.methods = {
	toJSON() {
		const obj = this.toObject();
		if (obj.creator) {
			obj.creator.password = '';
		}
		if (obj.messages.creator) {
			obj.messages.creator.password = '';
		}
		if (obj.lastAccessed.user) {
			obj.lastAccessed.user.password = '';
		}
		return obj;
	},
	calculateUnread() {
		const obj = this;
		obj.lastAccessed.map((access) => {
			access.unread = obj.messages.filter((message) => {
				return message.created > access.accessed;
			}).length;
		});
	},
	calculateUnreadFor(user) {
		const obj = this;
		obj.lastAccessed.map((access) => {
			if (access.user.toString() === user._id.toString()) {
				obj.unread = access.unread;
			}
		});
	},
	doAccess(user) {
		const chat = this;
		let lastAccessedUpdated = false;

		chat.lastAccessed.map((access) => {
			if (access.user.toString() === user._id.toString()) {
				access.accessed = Date.now();
				lastAccessedUpdated = true;
			}
		});
		if (!lastAccessedUpdated) {
			chat.lastAccessed.push({
				user: user._id,
				accessed: Date.now(),
			});
		}
	},
	afterSave(user) {
		this.saved = this.saves.includes(user._id);
		this.isHidden = this.hidden.includes(user._id);
	},
};

const Chats = model('Chats', ChatsSchema);
module.exports = {
	Chats,
};
