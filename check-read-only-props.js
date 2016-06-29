var async = require('async');
var packageJSON = require("./package");
var READONLY_PROP = packageJSON.mixinName;

function checkReadOnlyProps (Model, mixinOptions, ctx, modelInstance) {
    return function (finalCb) {
        
        // check for the mixin key in the model's settings
        if (typeof mixinOptions !== "object") {
            return finalCb();
        }
        
        // get props for readonly
        var readOnlyProps = getReadOnlyProps(Model);
        
        async.forEach(readOnlyProps, function (readOnlyProp, eachCb) {
            var prop = Model.definition.properties[readOnlyProp];
            var readonly = {
                propName: readOnlyProp,
                options: prop[READONLY_PROP]
            };
            
            async.waterfall([
                isWritableRole(Model, readonly, ctx),
                checkProp(Model, readonly, ctx)
            ], function (err) {
                if (err && err !== true) return eachCb(err);
                return eachCb();
            });
   
        }, function (err) {
            return finalCb(err);
        });
        
    };
}

function isWritableRole (Model, readonly, ctx) {
    return function (finalCb) {
        // check for valid acceptedRoles
        if(!readonly || !readonly.options || !readonly.options.acceptedRoles || !Array.isArray(readonly.options.acceptedRoles)) {
            return finalCb();
        }

        // make sure user is logged in
        if(!ctx.req || !ctx.req.accessToken || !ctx.req.accessToken.userId) {
            return finalCb();
        }

        var userId = ctx.req.accessToken.userId;
        var User = Model.app.models.user;

        // check for user in roles
        User.isInRoles(userId,
            readonly.options.acceptedRoles,
            ctx.req,
            function (err, isInRoles) {
                if(err) return finalCb(err);
                if(!isInRoles.none) {
                    return finalCb(true);
                }
                return finalCb();
            }
        );
    };
}

function getReadOnlyProps (Model) {
    var allProps = Model.definition.properties;
    var readOnlyProps = [];
    
    for (key in allProps) {
        if (allProps[key].hasOwnProperty(READONLY_PROP)) {
            readOnlyProps.push(key);
        }
    }
    
    return readOnlyProps;
}

function fieldExists (body, fieldNames) {
    var field = body;
    
    if (fieldNames.indexOf('.') !== -1) {
        fieldNames = fieldNames.split('.');
    } else {
        fieldNames = [fieldNames];
    }
    var lastProp = fieldNames.pop();
    
    for (var i = 0; i < fieldNames.length; i++) {
        if (!field.hasOwnProperty(fieldNames[i])) {
            return false;
        }
        field = field[fieldNames[i]];
    }
    
    return field.hasOwnProperty(lastProp);
}

function checkProp (Model, readonly, ctx) {
    return function (finalCb) {
        var body = ctx.req.body;
        if (!body) { return finalCb(); }
        
        var propName = readonly.propName;
        var exists = fieldExists(body, propName);

        if (exists) {
            var err = new Error('Unable to update ' + Model.modelName + ': ' + propName + ' is read only.');
            err.statusCode = 401;
            return finalCb(err);
        }
        
        return finalCb();
        
    };
};

module.exports = checkReadOnlyProps;