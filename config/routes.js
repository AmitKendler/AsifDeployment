"use strict";

/**
 * Module dependencies.
 */
const voluntaryAssociations = require("../app/controllers/voluntarAssociationController");
const giveaways = require("../app/controllers/giveawayController");
const vehicles = require("../app/controllers/vehicleController");
const routes = require("../app/controllers/routeController");
const users = require("../app/controllers/usersController");
const constantPaths = require("../app/controllers/constantPathsController");

/**
 * Expose
 */

module.exports = function(app) {
    /**
     * Voluntary assoiciation
     */
    app.get("/volas", voluntaryAssociations.getAll);
    app.get("/volas/:id", voluntaryAssociations.getById);
    app.post("/volas", voluntaryAssociations.create);

    /**
     * Constant paths
     */
    app.get("/getConstantPaths", constantPaths.getAllPaths);
    app.post("/addConstantPath", constantPaths.createPath);
    app.delete("/deleteConstantPath/:id", constantPaths.deletePath);
    app.put("/updateConstantPath/:id", constantPaths.updatePath);

    /**
     * Vehicle
     */
    app.get("/getVehicles", vehicles.getAllVehicles);
    app.get("/getVehicle/:id", vehicles.getVehicleById);
    app.post("/addVehicle", vehicles.createVehicale);
    app.delete("/deleteVehicle/:id", vehicles.deleteVehicle);
    app.put("/updateVehicle/:id", vehicles.updateVehicle);

    /**
     * Givaway
     */
    app.get("/giveaways", giveaways.getAllGivaways);
    app.post("/getGiveawaysByIds", giveaways.getGiveawaysByIds);
    app.get("/giveaways/:id", giveaways.getGiveawayById);
    app.post("/giveaways", giveaways.createGiveawayWithProducts);
    app.post("/giveaways/:id/products", giveaways.addProductToGiveaway);
    app.put("/editProductInGiveaway/:productId", giveaways.editProductInGiveaway);
    app.put("/products/status", giveaways.changeProductsStatus);
    app.get("/giveaways/users/:userId", giveaways.getGiveawaysByUser);


    app.post("/addRoute", routes.createRoute);
    app.put("/updateRoute/:id", routes.updateRoute);
    app.get("/getRoutes", routes.getAllRoutes);
    app.get("/getRoute/:id", routes.getRouteById);
    app.delete("/deleteRoute/:id", routes.deleteRoute);


    /**
     * User
     */
    app.post("/user/push-token", users.addPushTokenToUser);
    app.post("/user/volunteer/push-token", users.registerAssociationPushToken);
    app.post("/user/update", users.updateUserInfo);
    app.post("/user/exists", users.checkExists);
    app.post("/user/sendMessage", users.sendMessage);
    app.get("/login", users.login);
    app.post("/login", users.postLogin);
    app.post("/addUser", users.addUser);
    app.get("/getAllUsers", users.getAllUsers);
    app.get("/getDonors", users.getDonors);
    app.get("/getVolunteers", users.getVolunteers);
    app.get("/getUserById/:id", users.getUserById);
    app.delete("/deleteUser/:id", users.deleteUser);
    app.put("/updateUser/:id", users.updateUser);

    /**
     * Error handling
     */

    app.use(function(err, req, res, next) {
        // treat as 404
        if (
            err.message &&
            (~err.message.indexOf("not found") ||
                ~err.message.indexOf("Cast to ObjectId failed"))
        ) {
            next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render("500", { error: err.stack });
    });
};