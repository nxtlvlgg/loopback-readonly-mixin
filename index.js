var packageJSON = require('./package');
var readonly = require('./readonly');

module.exports = function mixin (app) {
    app.loopback.modelBuilder.mixins.define(packageJSON.mixinName, readonly);
};