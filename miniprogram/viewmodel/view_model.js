class ViewModel {
    constructor() {
        this.observers = {};
    }
    init() {
        this._defineReactive();
    }

    _defineReactive() {
        console.log(Object.keys(this));
        let obj = this;
        Object.keys(obj).forEach((key) => {
            var val = obj[key];
            Object.defineProperty(obj, key, {
                get: () => val,
                set: (value) => {
                    if (val === value) {
                        return
                    }
                    val = value;
                    obj._trigger(key, val);
                }
            });
        })
        // Object.defineProperty(this, );
    }

    _trigger(dataName, value) {
        Object.keys(this.observers[dataName])
            .map(item => this.observers[dataName][item])
            .flatMap(item => item)
            .forEach(fn => fn(value));
    }

    _observer(observer, dataName, fn) {
        this.observers[dataName] = {};
        this.observers[dataName][observer] = [];
        this.observers[dataName][observer].push(fn)
    }

    _unObserver(context) {
        this.observers.forEach(dataName => {
            dataName.removeChild(context);
        })
    }

}

export {ViewModel}