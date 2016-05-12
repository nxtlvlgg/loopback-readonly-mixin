var async = require('async');
var xloop = require("xloop");
var utils = xloop.utils;
var packageJSON = require("./package");

function stripReadOnlyProps (Model, mixinOptions, ctx, modelInstance) {
    return function (finalCb) {
        
        ctx.Model = utils.getModelFromRemoteMethod(Model, ctx.method.name);

        // check for the mixin key in the model's settings
        mixinOptions = ctx.Model.definition.settings.mixins[packageJSON.mixinName];
        if (typeof mixinOptions !== "object") {
            return finalCb();
        }
        
        return async.series([
            isWritableRole(ctx, mixinOptions),
            stripProps(ctx, mixinOptions)
        ], function (err) {
            if (err && err !== true) return finalCb(err);
            return finalCb();
        });
        
    };
}

function isWritableRole (ctx, mixinOptions, finalCb) {
    // check for valid acceptedRoles
    if(!Array.isArray(mixinOptions.acceptedRoles)) {
        return finalCb();
    }

    // make sure user is logged in
    if(!ctx.req || !ctx.req.accessToken || !ctx.req.accessToken.userId) {
        return finalCb();
    }
    var userId = ctx.req.accessToken.userId;
    var User = ctx.Model.app.models.user;
    
    // check for user in roles
    User.isInRoles(userId,
        mixinOptions.acceptedRoles,
        ctx.req,
        {
            modelClass: ctx.Model.definition.name,
            modelId: result.id
        },
        function (err, isInRoles) {
            if(err) return finalCb(err);
            if(!isInRoles.none) {
                return finalCb(true);
            }
            return finalCb();
        }
    );
}

function stripProps (ctx, mixinOptions, finalCb) {
    var body = ctx.req.body;
    if (!body) { return finalCb(); }

    var properties = (Object.keys(options).length) ? options : null;
    if (properties) {
        Object.keys(properties).forEach(function (key) {
            delete body[key];
        });
        return finalCb();
    } else {
        var err = new Error('Unable to update: ' + Model.modelName + ' is read only.');
        err.statusCode = 401;
        return finalCb(err);
    }
}

module.exports = stripReadOnlyProps;