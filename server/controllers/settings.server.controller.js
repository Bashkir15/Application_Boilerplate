import mongoose from 'mongoose';
import json from '../helpers/json';
import async from 'async';

var User = mongoose.model('User');
var Setting = mongoose.model('Setting');

module.exports = function() {
	var obj = {};

	obj.get = function (req, res) {
		if (req.user) {
			Settings.find({creator: req.user._id})
			.lean()
			.exec((err, items) {
				var hasNoSettings;

				if (err) {
					return json.bad(err, res);
				}

				if (!items.length) {
					return json.good({
						hasNoSettings: hasNoSettings
					}, res);
				}

				json.good({
					items: items
				}, res);
			});
		}
	}

	obj.create = function (req, res) {
		var saveSettings = function (setting, callback) {
			Setting.findOne({name: setting.key})
			.exec(function (err, item) {
				if (err) {
					return json.bad(err, res);
				}

				if (item) {
					item.value = setting.val;
				} else {
					item = new Setting();
					item.creator = req.user._id;
					item.name = setting.key;
					item.value = setting.value;
				}

				item.save((err) => {
					callback(err);
				});
			});
		};

		var items = [];

		for (var key in req.body) {
			var val = req.body[key];
			items.push({key: key, val: val});
		};

		async.map(items, saveSettings, (err, results) => {
			return json.good({
				items: items,
				results: results
			}, res);
		});
	};

	return obj;
};