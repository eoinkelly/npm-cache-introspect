# DO NOT USE: Work in progress

This is an exploration of making a module that will introspect the npm cache. It is not usable in its current form.


## The idea

Given a collection of module names and version constraints this module will
introspect the local npm cache to see if a module exists in the local cache
that would satisfy it

## Research

* https://www.npmjs.com/package/npm-offline-just-testing
    * provides a little server you can run to replace a remote registry
    * possible usage for this problem
    * if 'offline' mode requested we start a server and switch npm over to it
        * -- fiddly
* https://www.npmjs.com/package/npm-local-cache
    * create a separate local searchable npm cache which you can fill from registry.npmjs.com and/or your local cache


