function swapKeysAndValues<T extends  object>(obj: T):{
    [K in keyof T as T[K]]: K;
} {
    return Object.fromEntries(Object.entries(obj).map(arr => arr.reverse()))
}

const obj= {
    a: '1',
    b: '2'
} satisfies Record<'a' | 'b', '1' | '2'>

const res = swapKeysAndValues(obj)
console.log(res)
