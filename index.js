/** 
 * Created By alituran 
**/

function Inji() {
    var vm = this;
    vm.injis = {};

    vm.load = (path) => {
        require(path);
    }

    vm.factory = (factoryName, injections) => {
        setFunction("factory", factoryName, injections);
    }

    vm.service = (serviceName, injections) => {
        setFunction("service", serviceName, injections);
    }

    vm.value = (valueName, value) => {
        vm.injis[valueName] = {
            type: "value",
            name: valueName,
            value: value
        }
    }

    vm.invoke = (injections) => {
        var fn = injections[injections.length-1];
        var injis = []
        if (fn instanceof Function) {
            for (var i = 0; i < injections.length - 1; i++) {
                injis.push(injections[i]);
            }
        } else {
            console.error("Last item of the array must be function.");
        }

        getFunction({
            fn: fn,
            injections : injis
        });

    }

    vm.get = (key) => {
        var obj = vm.injis[key];
        if (obj) {
            switch (obj.type) {
                case "factory":
                    return getFactory(obj);
                    break;
                case "service":
                    return getService(obj);
                    break;
                case "value":
                    return getValue(obj);
                    break;
                default:
                    return null;
                    break;
            }
        } else {
            console.log("Can't find : ", key);
            return null;
        }
    }

    function setFunction(type, fnName, injections) {
        var fn = injections[injections.length-1];
        if (fn instanceof Function) {
            var functionObject = {
                type: type,
                name: fnName,
                injections: [],
                fn: fn
            }
            for (var i = 0; i < injections.length - 1; i++) {
                functionObject.injections.push(injections[i]);
            }
            vm.injis[fnName] = functionObject;
        } else {
            console.error("Last item of the array must be a function.");
        }
    }

    function getFactory(factoryObject) {
        if (!factoryObject.singleton) {
            factoryObject.singleton = getFunction(factoryObject);
        }
        return factoryObject.singleton
    }

    function getService(serviceObject) {
        return getFunction(serviceObject);
    }

    function getValue(valueObject) {
        return valueObject.value
    }

    function getFunction(injiObject) {
        var injections = [];
        for (var i = 0; i < injiObject.injections.length; i++) {
            var inji = injiObject.injections[i];
            if (typeof (inji) == "string") {
                var _inji = vm.get(inji)
                if (_inji) injections.push(_inji)
                else injections.push(inji);
            } else {
                injections.push(inji);
            }
        }
        injections.unshift({});
        return newCall(injiObject.fn, injections);;
    }

    function newCall(fn,injections) {
        return new(Function.prototype.bind.apply(fn, injections));
    }


}

module.exports = new Inji();