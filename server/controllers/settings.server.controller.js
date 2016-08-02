import mongoose from 'mongoose';
import json from '../helpers/json';
import async from 'async';

var User = mongoose.model('User');
var Setting = mongoose.model('Setting');

module.exports = function() {
	var obj = {};

	obj.get = function (req, res) {
		if (req.user) {
			Setting.findOne({creator: req.user._id})
			.exec((err, item) => {
				var hasNoSettings;

				if (err) {
					return json.bad(err, res);
				}

				if (!item) {
					return json.good({
						hasNoSettings: hasNoSettings
					}, res);
				}

				json.good({
					item: item
				}, res);
			});
		}
	}

	obj.create = function (req, res) {
		Setting.findOne({creator: req.user._id}, (err, setting) => {
			if (err) {
				return json.bad(err, res);
			} else if (setting) {
				setting.theme = req.body.theme || setting.theme;
				setting.save((err, item) => {
					if (err) {
						return json.bad(err, res);
					}

					json.good({
						record: item
					}, res);
				})
			} else {
				var item = new Setting(req.body);
				item.creator = req.user._id;
				item.save((err) => {
					if (err) {
						return json.bad(err, res);
					}

					json.good({
						record: item
					},res);
				});
			}
		});
	};

	return obj;
};