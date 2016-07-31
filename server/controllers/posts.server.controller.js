import mongoose from 'mongoose';
import json from '../helpers/json';

var Post = mongoose.model('Post');
var User = mongoose.model('User');

module.exports = function() {
	var obj = {};

	obj.create = function (req, res) {
		var post = new Post(req.body);
		post.creator = req.user._id;
		post.subscribers.push(req.user._id);
		post.save((err) => {
			post = post.afterSave(req.user);

			if (err) {
				return json.bad(err, res);
			}

			json.good({
				record: post
			}, res);
		});
	};

	obj.single = function (req, res) {
		Post.findOne({_id: req.params.postId})
		.populate('creator')
		.exec((err, post) => {
			if (err) {
				return json.bad(err, res);
			} else if (post) {
				if (req.user) {
					post = post.afterSave(req.user);

					return json.good({
						record: post
					}, res);
				} else {
					json.good({
						record: post
					}, res);
				}
			} else {
				return json.bad({message: 'Sorry, that post could not be found'}, res);
			}
		});
	};

	obj.list = function (req, res) {
		Post.find({})
		.populate('creator')
		.exec((err, posts) => {
			if (err) {
				return json.bad(err, res);
			} else {
				if (req.user) {
					posts.map((e) => {
						e = e.afterSave(req.user);
					});

					return json.good({
						records: posts
					}, res);
				} else {
					json.good({
						records: posts
					}, res);
				}
			}
		});
	};

	obj.timeline = function (req, res) {

		var getPosts = function() {
			var criteria = {
				creator: req.params.userId
			};

			if (req.query && req.query.timestamp) {
				criteria.created = {
					$gte: req.query.timestamp
				};
			}

			if (req.query && req.query.filter) {
				delete criteria.created;
				criteria.content = {
					new RegExp(req.query.filter, 'i');
				};
			}

			Post.find(criteria, null, {sort: {created: -1}})
			.populate('creator')
			.exec((err, posts) => {
				if (err) {
					return json.bad(err, res);
				} else {
					if (req.user) {
						posts.map((e) => {
							e = e.afterSave(req.user);
						});

						return json.good({
							records: posts
						}, res);
					} else {
						json.good({
							records: posts
						}, res);
					}
				}
			});
		};

		return getPosts();
	};

	return obj;
};