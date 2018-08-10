const mongoose = require("mongoose");
const _ = require("lodash");
const Expo = require("expo-server-sdk");
const utils = require("../utils");
const store = require('../store');
const Giveaway = mongoose.model("Giveaway");
const Product = mongoose.model("Product");
const Route = mongoose.model("Route");
const User = mongoose.model("User");

exports.saveRoute = function (req, res, next) {
	let route = req.body;

	new Route(req.body).save(function (err, route) {
		if (err) next(err);

		res.send(route);
	});
};

exports.getAllGivaways = function (req, res, next) {
	Giveaway.find({}).populate("products").exec(function (err, data) {
		if (err) next(err);

		res.send(data);
	});
};

exports.getGiveawaysByIds = function (req, res, next) {
	let ids = req.body;

	let mongoIds = [];
	mongoIds = ids.map(id => mongoose.Types.ObjectId(id));

	Giveaway.find()
		.where('_id')
		.in(mongoIds)
		.populate("products")
		.exec(function (err, data) {
			if (err) next(err);

			res.send(data);
		});
};

exports.getGiveawayById = function (req, res, next) {
	Giveaway.findById(req.params.id)
		.populate("products")
		.exec(function (err, data) {
			if (err) next(err);

			res.send(data);
		});
};

exports.getGiveawaysByUser = function (req, res, next) {
	console.log("getting giveways..", req.params.userId);
	Giveaway.find({ userId: mongoose.Types.ObjectId(req.params.userId) })
		.populate("products")
		.exec(function (err, data) {
			if (err) next(err);
			console.log("giveaways found:", data);

			res.send(data);
		})
}

exports.createGiveaway = function (req, res, next) {
	let giveaway = req.body;

	// Converting to ObjectId id needed - for testing
	if (typeof giveaway.userId !== mongoose.Schema.Types.ObjectId) {
		try {
			giveaway.userId = mongoose.Types.ObjectId(giveaway.userId);
		} catch (e) {
			console.log(e);
			giveaway.userId = mongoose.Types.ObjectId();
		}
	}

	new Giveaway(req.body).save(function (err, giveaway) {
		if (err) next(err);

		res.send(giveaway);
	});
};

exports.createGiveawayWithProducts = function (req, res, next) {
	let giveaway = req.body;

	// Converting to ObjectId id needed - for testing
	if (typeof giveaway.userId !== mongoose.Schema.Types.ObjectId) {
		try {
			giveaway.userId = mongoose.Types.ObjectId(giveaway.userId);
		} catch (e) {
			console.log(e);
			giveaway.userId = mongoose.Types.ObjectId();
		}
	}

	// Check if there's an embedded product object
	if (giveaway.products.length) {
		// Clone prodcts array to save for later
		let productsClone = giveaway.products.slice();

		// remove "bad" prodcts array..
		giveaway.products = [];

		new Giveaway(giveaway).save().then(function (savedGiveaway, err) {
			if (err) {
				console.log("error!", err);
				next(err);
			}

			console.log("giveaway saved!", savedGiveaway);

			let productsPromises = [];
			let rankDelta = 0;

			// Go through each product, save it to the DB and then add it to the giveaway object
			productsClone.forEach(function (prod) {
				prod.giveawayId = savedGiveaway._id;

				console.log("saving product..", prod);
				rankDelta += 5;
				productsPromises.push(new Product(prod).save());
			});

			Promise.all(productsPromises)
			.then(function (prodArray, err) {
				if (err) next(err);

				prodArray.forEach(function (prod) {
					savedGiveaway.products.push(prod._id);
				});

				// saving giveaway
				savedGiveaway.save(function (err, updatedGiveaway) {
					if (err) next(err);

					User.findById(updatedGiveaway.userId).exec(function (findUserErr, user) {
						if (findUserErr) next(findUserErr);

						// if (user) {
						user.rank += rankDelta;
						user.save(function (saveUserErr, savedUser) {
							if (saveUserErr) throw saveUserErr;

							return {
								"updatedGiveaway": updatedGiveaway,
								"updatedUser": savedUser
							};
						});
						// }
					});
				});
			})
			.then(function (result) {

				let volasTokens = store.getRegisteredVolunteerClientsToken();
				
				let payload = {
					notification: {
					// to: tolken,
						// sound: 'default',
						title: 'תרומה חדשה!',
						body: 'בדיוק נכנסה תרומה חדשה, לך תבדוק!'
					}
					// data: result.updatedGiveaway
				};
				
				if (volasTokens.length > 0) {
					utils.pushFirebase(payload, volasTokens);
				} else {
					console.log("wasnt able to send pudh because no volas tokens registered");
				}

				res.send(result);
			})
			.catch(function (err) {
				next(err);
			});
		});
	}
};

exports.addProductToGiveaway = function (req, res, next) {
	Giveaway.findById(req.params.id).exec(function (err, giveaway) {
		if (err) next(err);

		let prod = req.body;
		prod.giveawayId = giveaway._id;

		new Product(prod).save(function (err, product) {
			if (err) next(err);

			giveaway.products.push(product._id);
			giveaway.save(function (err, updatedGiveaway) {
				if (err) next(err);

				res.send(prod);
			});
		});
	});
};

exports.editGiveaway = function (req, res, next) {
	Giveaway.findById(req.params.id).exec(function (err, giveaway) {
		if (err) next(err);

		// Setting up chnages
		Object.assign(giveaway, req.body);
		giveaway.save(function (err, updatedGiveaway) {
			if (err) next(err);

			res.send(updatedGiveaway);
		});
	});
};

exports.editProductInGiveaway = function editProductInGiveaway(req, res, next) {
	Product.findById(req.params.productId).exec(function (err, product) {
		if (err) next(err);

		// Setting up chnages
		Object.assign(product, req.body);
		product.save(function (err, updatedProduct) {
			if (err) next(err);

			res.send(updatedProduct);
		});
	});
};

exports.changeProductsStatus = function (req, res, next) {
	let productIds = req.body.productIds;
	let status = req.body.status;

	let mongoIds = [];
	mongoIds = productIds.map(id => mongoose.Types.ObjectId(id));

	let productsToRet = [];

	let p = new Promise((resolve, reject) => {

		Product.find()
			.where('_id').in(productIds)
			.exec(function (findErr, products) {
				if (findErr) next(findErr);
				let promises = [];
				products.forEach(function (product) {
					product.status = status;
					promises.push(product.save());
				});

				resolve(promises);
			})
	})
		.then(function (promises) {
			return Promise.all(promises);
		})
		.then(function (updatedProducts, saveErr) {
			if (saveErr) next(saveErr);

			productsToRet = updatedProducts;

			let giveawayIds = _.map(updatedProducts, "giveawayId");
			return Giveaway.find()
				.where('_id').in(giveawayIds)
				.exec();
		})
		.then(function (giveaways, giveawayFindErr) {
			if (giveawayFindErr) next(giveawayFindErr);
			
			let usersIds = _.map(giveaways, "userId");
			return User.find()
				.select("pushNotificationToken")
				.where('_id').in(usersIds)
				.exec();
		})
		.then(function (users, findUserErr) {
			if (findUserErr) next(findUserErr);
			
			let messages = [];
			users.forEach((user) => {

				// Check that all your push tokens appear to be valid Expo push tokens
				if (!Expo.isExpoPushToken(user.pushNotificationToken)) {
					console.error(`Push token ${pushToken} is not a valid Expo push token`);
				} else {
					messages.push({
						to: user.pushNotificationToken,
						sound: 'default',
						title: 'התרומה שלך עומדת להיאסף!',
						body: 'בקרוב יגיע נציג מהעמותה ויאסוף את המוצרים שהזנת',
						// data: { withSome: 'data' },
					})
				}
			})

			return messages;
		})
		.then(function (messages) {
			utils.sendPush(messages);
			res.send(productsToRet);
		})
		.catch(function (err) {
			next(err);
		});
}

exports.deleteProductFromGiveaway = function (req, res, next) {
	Giveaway.update(
		{ _id: req.params.giveawayId },
		{ $pullAll: { _id: req.params.productId } }
	).exec(function (err, updatedGiveaway) {
		if (err) next(err);

		res.send(updatedGiveaway);
	});
};

exports.deleteGiveaway = function (req, res, next) {
	Giveaway.deleteOne({ _id: req.params.id }).exec(function (err) {
		if (err) next(err);
		res.sendStatus(200);
	});
};

exports.associationTakesProduct = function (req, res, next) { };
