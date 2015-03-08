'use strict';

var expect        = require('chai').expect;
var localNpmCache = require('../');
var Promise       = require('rsvp').Promise;
var _             = require('lodash-node');

describe('willSatisfy()', function() {
});

describe('getLocallyCachedModules()', function() {
  it('returns an array of objects of the form { name: ..., constraint: ... }', function(done) {
    this.timeout(5000);
    localNpmCache.getLocallyCachedModules()
      .then(function(localCache) {
        expect(localCache).to.be.instanceof(Array);
        _.each(localCache, function(entry) {
          expect(entry.name).to.exist;
          expect(entry.constraint).to.exist;
        });
        done();
      })
      .catch(function() {
        done(new Error('The promise unexpectedly rejected'));
      });
  });

  it('returns a promise', function(done){
    var p = localNpmCache.getLocallyCachedModules();
    expect(p).to.be.instanceof(Promise);
    p.then(function() {
      done();
    });
  });

  it('returns the expected results', function(done){

    console.log('hi');
    done();
    // this.timeout(5000);
    // localNpmCache.getLocallyCachedModules()
    //   .then(function(localCache) {
    //     console.log(localCache);
    //     done();
    //   });
  });
});

