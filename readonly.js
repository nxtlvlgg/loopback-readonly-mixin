var async = require('async');
var _ = require('underscore');
var stripReadOnlyProps = require('./strip-read-only-props');

module.exports = function (Model, mixinOptions) {
    
    var remotes = ['create', 'upsert', 'prototype.updateAttributes', 'updateAll'];
    
    _.forEach(remotes, function (remote) {

        Model.beforeRemote(remote, function(ctx, modelInstance, next) {
            async.series([
                stripReadOnlyProps(Model, mixinOptions, ctx, modelInstance)
            ], function (err) {
                return next(err);
            });
        });
    
    });
};