//*** LinkedList start ***//
interface INode<Value>  {
    value: Value;
    next: INode<Value>
    prev: INode<Value>
}

type TPosition = number; // Алиас для наглядности ,
type TPredicate<T> = (value: T, index: TPosition) => boolean;
interface ILinkedList<Value>  {
    // Реализация LinkedList о характере хранимых данных.
    // Можно переписать чтобы знала, тогда работа в HashMap будет немного проще.
    set(position: TPosition, value: Value): this;
    clear(): this;
    // Работать с LinkedList для моей задачи проще через такие функции, поэтому обычный get делать не стал
    findFirst(predicate: TPredicate<Value>): Value | undefined;
    removeFirst(predicate: TPredicate<Value>): this;
    findIndex(predicate: TPredicate<Value>): TPosition
}

class NodeItem<Value> implements INode<Value> {
    value: Value;
    next: INode<Value>
    prev: INode<Value>

    constructor(value: Value);
    constructor(value: Value, prev: NodeItem<Value>, next: NodeItem<Value>);
    constructor(
        value: Value,
        prev?: NodeItem<Value>,
        next?: NodeItem<Value>){
        this.value = value;
        this.prev = prev ?? this;
        this.next = next ?? this;
    };
}


class LinkedList<Value> implements ILinkedList<Value> {
    // https://en.wikipedia.org/wiki/Sentinel_node
    // Позволяет не осуществлять проверки на null
    private readonly sentinelNode: INode<Value | undefined>;

    constructor() {
        this.sentinelNode = new NodeItem(undefined);
    }

    removeFirst(predicate: TPredicate<Value>): this {
        const node = this.findNode(predicate);
        if(this.isNotSentinelNode(node)){
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        return this;
    }

    append(value: Value): this {
        const newItem = new NodeItem(value,  this.sentinelNode.prev,  this.sentinelNode);
        this.sentinelNode.prev.next = newItem;
        this.sentinelNode.prev = newItem;

        return this;
    }

    clear(): this {
        this.sentinelNode.prev =  this.sentinelNode;
        this.sentinelNode.next =  this.sentinelNode;
        return this;
    }
    findFirst(predicate: TPredicate<Value>) {
        return this.findNode(predicate).value;
    }

    findIndex(predicate: TPredicate<Value>){
        return this.find(predicate).index;
    }

    set(position: TPosition, value: Value): this {
        const node = this.findNode((_value, currentPosition) => currentPosition === position )
        if(this.isNotSentinelNode(node)){
            node.value = value;
        } else {
            this.append(value);
        }

        return this;
    }

    private findNode(predicate: TPredicate<Value>): INode<Value | undefined> {
        return this.find(predicate).node;
    }
    private find(predicate: TPredicate<Value>): { node: INode<Value | undefined> , index: TPosition }{
        let current = this.sentinelNode.next;
        let index = 0;

        while (this.isNotSentinelNode(current)){
            if(predicate(current.value, index)){
                return { node: current , index: index };
            }
            index++;
            current = current.next
        }

        return { node: current , index: -1 };
    }

    private isNotSentinelNode(value: typeof this.sentinelNode): value is INode<Value> {
        return value !== this.sentinelNode;
    }

}

//*** LinkedList end ***//

//*** Map start ***//


interface IMap<Key, Value> {
    get(key: Key): Value | undefined;
    clear(): this;
    delete(key: Key): this;
    set(key: Key, value: Value): this;
}

type THash = number;
type HashMapItem<Key, Value> = { key: Key, value: Value};
class HashMap<Key extends string | number, Value> implements IMap<Key, Value> {
    buckets: ILinkedList<HashMapItem<Key, Value>>[] = [];
    get(key: Key): Value | undefined {
        const hash = this.hash(key);

        const linkedList = this.buckets[hash];

        return linkedList?.findFirst(data => data.key === key)?.value
    }
    clear(): this {
        // Как альтернатива можно просто this.buckets = [],
        // освободиться больше памяти, но нужно будет заново пересоздавать объекты.
        this.buckets.forEach(bucket => bucket.clear());
        return this;
    }

    delete(key: Key): this {
        const hash = this.hash(key);
        this.buckets[hash]?.removeFirst((data => data.key === key));
        return this;
    }



    set(key: Key, value: Value): this {
        this.checkStringOrNumber(key);

        const hash = this.hash(key);

        if(!this.buckets[hash]){
            this.buckets[hash] = new LinkedList();
        }

        const index = this.buckets[hash].findIndex((data) => data.key === key);
        this.buckets[hash].set(index, { key, value });

        return this;
    }

    private hash(key: Key): THash {
        // Ограничение диапазона от 0 до MAX_VALUE - 1. Можно поставить больше
        const MAX_VALUE = 32;
        const str = String(key);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += str.charCodeAt(i)
            // Битовый сдвиг и вычитание для создания лавинного эффекта https://ru.wikipedia.org/wiki/Лавинный_эффект
            hash = (hash << 5) - hash;
        }
        return Math.abs(hash) % MAX_VALUE;
    }

    private checkStringOrNumber(key: unknown): asserts key is string | number {
        //
        if(typeof key !== 'string' && typeof key !== 'number'){
            throw new Error('Ключ должен быть string или number');
        }
    }
}
//^^^^^^^^^^^^//
//*** Map end ***//
