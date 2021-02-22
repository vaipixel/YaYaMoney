function promisifyForWxSdk(fn) {
    return async function(args) {
        return new Promise(resolve, reject => {
            fn({
                ...(args || {}),
                success: res => resolve(res),
                fail: err => reject(err)
            })
        });
    };

}

function promisifyForUI() {
    return async function(context, selector, fields) {
        console.log('promisifyForUI');
        return new Promise((resolve, reject) => {
            context.createSelectorQuery()
                .select(selector)
                .fields(fields)
                .exec(function(res) {
                    console.log(res.top);
                    resolve(res[0])
                });
        });
    };
}

function toAsync(names) {
    let result = (names || [])
        .map(name => ({
            name,
            member: wx[name]
        }))
        .filter(t => typeof t.member === 'function')
        .reduce((r, t) => {
            r[t.name] = promisifyForWxSdk(wx[t.name]);
            return r;
        }, {});
    result['asyncSelector'] = promisifyForUI();
    return result;
}

export { toAsync }