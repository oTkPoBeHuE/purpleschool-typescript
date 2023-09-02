const obj3= {
    a: '1',
    b: '2'
} satisfies Record<'a' | 'b', '1' | '2'>

function swapKeysAndValues<T extends  object>(obj: T):{
    [K in keyof T as T[K]]: K;
} {
    return Object.fromEntries(Object.entries(obj).map(arr => arr.reverse()))
}

const res = swapKeysAndValues(obj3)
console.log(res)
