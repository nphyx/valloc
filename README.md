Valloc
======
A utility for tracking allocation/use of items in an array. It uses an internally managed boolean array built around a TypedArray for improved performance.

Valloc is useful when you have a set of reusable variables or indexes, like an object pool or other array, and you want to keep track of which indexes are currently in use, which are free, and how many free members remain.

Basic Usage Examples
--------------------
```js
// create a pool and set up a valloc allocator
const length = 100
const innerPool = new Array(length)
for(let i = 0; i < length; ++i) pool[i] = {foo:0,bar:1,index:i}
const pool = valloc(innerPool)
// get information about the pool
pool.length // 100
pool.available // 100
pool.used // 0

// allocate an object
let first = pool.next() // {foo:0,bar:1,index:0}
pool.indexOf(first) // 0

// allocate a second object
let second = pool.next() // => {foo:0,bar:1,index:1}
pool.indexOf(second) // 1
pool.nextIndex // 2
pool.length // 100
pool.available // 98 
pool.used // 2

// free an object
pool.free(first)
pool.nextIndex // 0
pool.length // 100
pool.available // 99 
pool.used // 1

// allocate another object, reusing the freed object
let third = pool.next() // {foo:0,bar:1,index:0}
pool.indexOf(third) // 0
pool.nextIndex // 2
pool.length // 100
pool.available // 98 
pool.used // 2
```

Advanced Usage
--------------
You can supply factory, init, and clean functions to automate tasks related to valloc
```js
const config = {
	// valloc supplies the object's index as the fist parameter to the factory
  // function, but it doesn't care whether you use it
	factory: (index) => ({foo:undefined, bar:undefined, index})
	init: (entry, foo, bar) => {
		member.foo = foo
		member.bar = bar
	},
  clean: (entry) => {
	 entry.foo = undefined
	 entry.bar = undefined
	}
}

const length = 100
// create an array of objects using the factory
const pool = valloc(length, config) 

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

License
-------
MIT
