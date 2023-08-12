# Примечания

## Spread оператор на типах
``` ts
const a: [number, number, ...boolean[]] = [1, 2, true, false, true, true];
```


## ReadonlyArray
``` ts
const v: readonly number[] = [1, 2, 3];
const v: ReadonlyArray<number> = [1, 2, 3];
```

## Оптимизация enum с помощью const
``` ts
// Меньше скомпилированного кода ✅
const enum Sizes {
    Small,
    Medium,
    Large,
}

// Больше скомпилированного кода ❌ 
enum Sizes {
    Small,
    Medium,
    Large,
}
```

<details>
  <summary>Без const</summary>

``` ts
enum Sizes {
    Small,
    Medium,
    Large,
}

const coffee = {
    name: 'Espresso',
    size: Sizes.Small,
};
```
Компилируется в

``` js
var Sizes;
(function (Sizes) {
    Sizes[Sizes["Small"] = 0] = "Small";
    Sizes[Sizes["Medium"] = 1] = "Medium";
    Sizes[Sizes["Large"] = 2] = "Large";
})(Sizes || (Sizes = {}));
var coffee = {
    name: 'Espresso',
    size: Sizes.Small,
};
```
</details>


<details>
  <summary>C const</summary>

``` ts
const enum Sizes {
    Small,
    Medium,
    Large,
}

const coffee = {
    name: 'Espresso',
    size: Sizes.Small,
};
```

Компилируется в

``` js
var coffee = {
name: 'Espresso',
size: 0 /* Sizes.Small */,
};
```
</details>


<details>
  <summary>Что происходит ?</summary>

Перечисления также создают [обратное сопоставление](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings)

Это означает, что мы можем взять значение свойства Enum и передать его самому Enum:

``` ts
const coffee = {
  name: 'Espresso',
  size: Sizes[Sizes.Small], // возвращает 'Small'
};
```

или

``` ts
enum PrintMedia {
  Newspaper = 1,
  Newsletter,
  Magazine,
  Book
}

PrintMedia.Magazine;   // возвращает  3
PrintMedia["Magazine"];// возвращает  3
PrintMedia[3];         // возвращает  Magazine
```

</details>

## Enum

В typescript 5.0 [исправили](https://github.com/microsoft/TypeScript/pull/50528) поведение enum.

``` ts
const enum Sizes {
 Small,
 Medium,
 Large,
}

f(1) // Валидно
f(9) // Ошибка: Argument of type '9' is not assignable to parameter of type 'Sizes'.

```

``` ts
const BaseValue = 10;
const Prefix = "/data";
const enum Values {
    First = BaseValue,  // 10
    Second,             // 11
    Third               // 12
}
const enum Routes {
    Parts = `${prefix}/parts`,       // "/data/parts"
    Invoices = `${prefix}/invoices`  // "/data/invoices"
}
```

## Можно специфицировать enum через Exclude
``` ts
const enum Sizes {
 Small,
 Medium,
 Large,
 Extra_Large
}

const largeSize: Exclude<Sizes,  ENumbers.Small | ENumbers.Medium>;
```

## Как проверить что switch имеет все возможные cases

- Есть удобный хак:

<details>
  <summary>Пример исчерпывающие проверки (exhaustiveness checking)</summary>

Пишем специальную функцию.
``` ts
function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}
```

И далее

``` ts
enum Color {
    Red,
    Green,
    Blue
}

function getColorName(c: Color): string {
    switch(c) {
        case Color.Red:
            return 'red';
        case Color.Green:
            return 'green';
    }
    return assertUnreachable(c); // Type "Color.Blue" is not assignable to type "never"
}
```

Суть хака в том что переменной типа `never` нельзя присваивать значения.
Проверка будет только в том случае если код достижим.

``` ts
function getColorName(c: Color): string {
  switch (c) {
    case Color.Red:
      return "red";
    case Color.Green:
      return "green";
    // Forgot about Blue
    default:
      const exhaustiveCheck: never = c;
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
  }
}
```

</details>



## В typescript указать типы можно с помощью <>

Но такая запись не работает с React. 

``` ts
type User = {
    name: string;
}

const user = <User> {
    name: 'Ivan'
}
```

## Отличие asserts от is

``` ts
function isStringAssert(condition: any): asserts value is string {
    if (typeof value !== 'string') {
        throw new Error(``);
    }
}

value.toUppercase() // Ошибка
isStringAssert(value)
value.toUppercase() // Валидно
```

``` ts
function isString(value: any): value is string {
    return typeof value === 'string';
}

value.toUppercase() // Ошибка
if(isString(value)){
  value.toUppercase() // Валидно
}
```

## Есть сервисы, которые превращают Json в Typescript

Это может быть полезно, когда у вас есть просто ответ от сервера.

[json-to-typescript](https://transform.tools/json-to-typescript)
