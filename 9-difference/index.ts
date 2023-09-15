function difference<A extends  object, B extends object>(a: A, b: B): Omit<A, keyof B> {
    const entries = Object.entries(a).filter(([key, value]) => !(key in b));
    return Object.fromEntries(entries) as Omit<A, keyof B>;
}


interface IA {
    a: number;
    b: string;
    d: number,
    k: number
}


interface IB {
    a: number;
    c: boolean;
    k: number
}


let a: IA = {a: 5, b: '', d: 22, k: 22};
let b: IB = {a: 10, c: true, k: 11};


let v0 = difference(a, b);
console.log('v0', v0)
