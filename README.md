## Angular like dependency injection for NodeJS.
---
### Installation

```bash
npm i --save inji
```

### Usage

```javascript
// Load Module 
const inji = require("inji");
```


```javascript
// Add Value
inji.value("ValueName", Value);

// Add Service
inji.service("ServiceName", [ServiceFunction]);

// Add Factory
inji.factory("FactoryName", [FactoryFunction])
```

Just like angular js, factory objects will be singleton. That means it will only created when its called. But services will be crated every time it needed. 

### Example : 

```javascript


// index.js
const inji = require("inji");

inji.value("Config", {
    "text" : "This is a test message"
});

// Every paremeter before factory function will be injected. 
// Config will be injected to LogFactory function in this case.
inji.factory("LogFactory", ["Config", require("./LogFactory.js")]);


// Not only in in index.js, you can reach any object from anywhere after adding it.
// There are two ways to reach objects. 
// First options is inji.get() function
var Config = inji.get("Config");
// or
var LogFactory = inji.get("LogFactory");


// The other way is inji.invoke() function.
// Instead of getting all injections oen by one with inji.get()
inji.invoke(["Config", "LogFactory", function (Config,LogFactory) {
    LogFactory.print(); // "This is a test message"
}])


```


```javascript
// LogFactory.js

function LogFactory (Config){

    // Intead of getting Config with inji.get("Config") here,
    // it is better inject all dependencies when you define this factory object.

    var vm = this;

    vm.print = () =>{
        console.log(Config.text);
    }
}

module.exports = LogFactory

```


For better project management, you can set your injections in a seperate file.

```javascript
// index.js
const inji = require("inji");
inji.load("./injections.js"); // or require("./injections.js") is same with load function.

inji.invoke(["LogicFactory", function (LogicFactory){
    LogicFactory.start();
}])

```

```javascript
// injections.js
const inji = require("inji");
var config = require('config.json')

inji.value("Config", config("./config.json"));

inji.factory("LogFactory", ["Config", require("./pathToLogFactory")]);
inji.service("SocketService", ["LogFactory", require("./pathToSocketService")]);
inji.factory("LogicFactory", ["LogFactory", "SomeService", require("./pathToLogicFactory")]);

```

