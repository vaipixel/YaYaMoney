class ViewModel {
    constructor() {
        this.observers = {};
    }
    init() {
        this._defineReactive();
    }

    _defineReactive() {
        let obj = this;
        Object.keys(obj).forEach((key) => {
            let val = obj[key];
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
    }

    _trigger(dataName, value) {
        Object.keys(this.observers[dataName] ? this.observers[dataName] : {})
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
        Object.keys(this.observers)
            .map(item => this.observers[item])
            .forEach(item => {
                delete item[context]
            });
    }

}

export {ViewModel}