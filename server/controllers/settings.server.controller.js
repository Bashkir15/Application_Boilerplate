import mongoose from 'mongoose';
import json from '../helpers/json';

var User = mongoose.model('User');
var Setting = mongoose.model('Setting');

module.exports = function() {
	var obj = {};

	obj.create = function (req, res) {
		var setting = new Setting(req.body);
		setting.user = req.user._id;
		setting.save((err) => {
			if (err) {
				return json.bad(err, res);
			}

			json.good({
				record: setting
			}, res);
		});
	};

	obj.get = function (req, res) {
		Setting.findOne({user: req.user._id}, (err, setting) => {
			if (err) {
				return json.bad(err, res);
			}

			json.good({
				record: setting
			}, res);
		});
	};

	return obj;
};