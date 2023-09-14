const user = {
    name: 'Ivan',
    age: 8,
    skills: ['typescript', 'javascript'],
}

function pickObjectKeys<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>{
    return keys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {} as Pick<T, K>)
}

const res = pickObjectKeys(user, ['age', 'skills'])
console.log('res', res)
