Valloc [![build status](https://travis-ci.org/nphyx/valloc.svg?branch=master)](https://travis-ci.org/nphyx/valloc) [![Coverage Status](https://coveralls.io/repos/github/nphyx/valloc/badge.svg?branch=master)](https://coveralls.io/github/nphyx/valloc?branch=master) [![npm (scoped)](https://img.shields.io/npm/v/@nphyx/valloc.svg)](https://www.npmjs.com/package/@nphyx/valloc)
======
A fixed-size, high-performance object pool that minimizes iteration loops,
eliminates garbage collection, automates recycling, and generally reduces
the annoyance of using large amounts of similar objects.

Valloc never mutates its internal array of objects and keeps track of which
objects are allocated with a separate boolean array, which means it will never
lose an object, trigger memory allocation or garbage collection after being 
instantiated.

It can't track use after free or failure to free after use, so it's still up 
to you to remember to allocate and free objects as needed.

Installation
------------
```bash
npm install --save @nphyx/valloc
```

Valloc is an ES6 module. Webpack builds will be included in a later version. 
```javascript
import valloc from "@nphyx/valloc"
```

Basic Usage Examples
--------------------
```js
// create a pool and set up a valloc allocator
const length = 100
const innerPool = new Array(length)
for(let i = 0; i < length; ++i) pool[i] = {foo:0,bar:1,index:i}
const pool = valloc.from(innerPool)
// get information about the pool
pool.length // 100
pool.available // 100
pool.used // 0
pool.nextIndex // 0

// allocate an object
let first = pool.next() // {foo:0,bar:1,index:0}
pool.indexOf(first) // 0

// allocate a second object
let second = pool.next() // => {foo:0,bar:1,index:1}
pool.indexOf(second) // 1
pool.nextIndex // 2

// free an object
pool.free(first)
pool.available // 99 

// allocate another object, reusing the freed object
let third = pool.next() // {foo:0,bar:1,index:0}
pool.indexOf(third) // 0
```

Advanced Usage
--------------
You can supply a factory to automate instantiation of the pool, as well as 
init and clean callbacks to automate these tasks when allocating and freeing 
objects.

```js
const config = {
  // factory receives the index of the object to be created
	factory: (index) => ({foo:undefined, bar:undefined, index})
  // init receives the object to be allocated, along with any parameters you
  // supply when calling pool.next()
	init: (object, foo, bar) => {
		object.foo = foo
		object.bar = bar
	},
  // clean receives the object to be freed
  clean: (object) => {
	 object.foo = undefined
	 object.bar = undefined
	}
}

const length = 100
const pool = valloc.create(length, config)

// supply parameters for the 'init' function during allocation
const first = pool.next(1, 1) // {foo:1, bar:1, index:0}
const second = pool.next(2, 2) // {foo:2, bar:2, index:1}

// valloc will run the 'clean' function on the object during deallocation
pool.free(second)

// clean will have been called (NOTE: you should not use objects after freeing them!)
second // {foo:undefined, bar:undefined, index:1}

// you can ask valloc whether an object is still allocated
pool.isAllocated(second) // false
pool.isIndexAllocated(1) // false
```

Performance Tips
----------------
Freeing and checking allocation of objects is relatively expensive because it 
has to find the index of an object. Use the index versions of valloc functions
for faster, more predictable performance.
```js
// the factory function gets the index of the object, so you can store it on
// for easy access
const pool = valloc.create(100, { factory: (index) => ({poolIndex: index}) })
const {allocate, freeIndex} = pool
let obj1 = allocate()
let obj2 = allocate()
obj1.poolIndex // 0
obj2.poolIndex // 1
/* ... do stuff with object ... */
freeIndex(obj1.poolIndex)
isIndexAllocated(obj1.poolIndex) // false
```

Development
-----------
Setup:
```bash
git clone git@github.com:nphyx/valloc.git
cd valloc
npm install .
```

Run linter (a linter config is supplied at .eslintrc):
```bash
npm run lint
```

Run unit tests (uses nyc for coverage, mocha + should for tests):
```
npm test
```

Generate nice html coverage reports after running tests (ends up in coverage/index.html):
```
npm coverage-report
```

License
-------
MIT
