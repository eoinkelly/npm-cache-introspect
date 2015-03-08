'use strict';

var semver  = require('semver');
var _       = require('lodash-node');
var Promise = require('rsvp').Promise;

module.exports = {

  /**
   * @param {Object} dependencies - collection of packages to check the cache for
   * @returns {Promise}
   *
   */
  willSatisfy: function(dependencies) {

    return this._getLocallyCachedModules().then(function(locallyCachedModules) {
      // return true iff there *every* one of our dependencies has a suitable
      // version in the local cache
      return _.every(dependencies, function(appVersionConstraint, moduleName) {
        // find all versions of the given module in the local cache
        var possibleMatches = _.filter(locallyCachedModules, { name: moduleName });

        // console.log('possible matches:', possibleMatches);
        // return true if *any* of the cached modules with the correct name
        // match the given version constraint
        return _.any(possibleMatches, function(possibleMatch) {
          // form of possibleMatch is { name: 'chai', constraint: '1.10.0' }
          // console.log('possible match', possibleMatch);
          // console.log('semver test', semver.satisfies(possibleMatch.constraint, appVersionConstraint));
          return semver.satisfies(possibleMatch.constraint, appVersionConstraint);
        });
      });
    });
  },

  /**
   *
   * @return {Promise} A promise that resolves to a
   *
   */
  getLocallyCachedModules: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      var npm = require('npm'); // Lazily load npm
      var npmOptions = {
        loglevel: 'error',
        color: 'never',
      };

      npm.load(npmOptions, function(err) {
        if (err) { return reject(err); }

        self._disableLogger();

        npm.commands.cache(['list'], function(err, cacheListOutput) {
          if (err) {
            self._restoreLogger();
            return reject(err);
          }

          // The `npm cache list` output looks like
          //
          //      ~/.npm/zlib-browserify/0.0.1/
          //      ~/.npm/zlib-browserify/0.0.1/package/
          //      ~/.npm/zlib-browserify/0.0.1/package.tgz
          //      ~/.npm/zlib-browserify/0.0.1/package/package.json
          //      ~/.npm/zlib-browserify/0.0.3/
          //      ~/.npm/zlib-browserify/0.0.3/package/
          //      ~/.npm/zlib-browserify/0.0.3/package.tgz
          //      ~/.npm/zlib-browserify/0.0.3/package/package.json
          //
          // so we use the `package.json` line to get a single line for each
          // version of each module

          var locallyCachedModules = _.chain(cacheListOutput)
            .filter(function(line) {
              return /package\.json$/.test(line);
            })
            .map(function(line) {
              // line example: ~/.npm/zlib-browserify/0.0.3/package/package.json
              var pathElements = line.split(/\//);
              var moduleName = pathElements[0];
              var constraintString = pathElements[1];
              return { name: moduleName, constraint: constraintString };
            })
            .value();

          self._restoreLogger();
          resolve(locallyCachedModules);
        });
      });
    }, 'npm cache list');
  },

  _disableLogger: function() {
    this.oldLog = console.log;
    console.log = function() {};
  },

  _restoreLogger: function() {
    console.log = this.oldLog;
  },
};

