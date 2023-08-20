# Примечания

## Spread оператор на типах
``` ts
const a: [number, number, ...boolean[]] = [1, 2, true, false, true, true];
```


## В Typescript есть массивоподобные readonly типы
`ReadonlyArray`, `ReadonlyMap` и `ReadonlySet` 

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
lay
## В WebStorm можно включить локализацию ошибок Typescript

Если у вас WebStorm версии 2023.2 и выше вы можете зайти в 
`Preferences | Languages & Frameworks | TypeScript` 
И в поле `option` добавить `--locale ru`

<details>
  <summary>Скриншот</summary>

![Preferences | Languages & Frameworks | TypeScript в поле option --locale ru](https://blog.jetbrains.com/wp-content/uploads/2023/06/Pretty-typeLocale.png)
</details>


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

## Пример организации полной валидации

<details>
  <summary>Осторожно! Много кода!</summary>

``` ts
enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

function isGender(value: unknown): value is Gender {
    // Так можно достать значения из неконстантного enum
    return Object.values(Gender).includes(value as Gender);
}

// удобная функция
function isObjectSimilarToType<T>(
  value: unknown,
): value is Record<keyof T, unknown> {
  return typeof value === "object" && value !== null;
}



function isUser(value: unknown): value is User {
    if (!isObjectSimilarToType<User>(value)) {
        console.error('Ошибка: значение не является объектом типа User.');
        return false;
    }
    
    // Теперь value у нас с такими же ключами как User, но у них типы unknown
    
    const checks: { [key in keyof User]: () => boolean } = {
        // Если мы забудем проверить какое-либо поле - типизация будет ругаться
        id: () => typeof value.id === 'number',
        firstName: () => typeof value.firstName === 'string',
        lastName: () => typeof value.lastName === 'string',
        maidenName: () => typeof value.maidenName === 'string',
        age: () => typeof value.age === 'number',
        gender: () => isGender(value.gender),
        email: () => typeof value.email === 'string',
        phone: () => typeof value.phone === 'string',
        username: () => typeof value.username === 'string',
        password: () => typeof value.password === 'string',
        birthDate: () => isDateYYYYMMDD(value.birthDate),
        image: () => typeof value.image === 'string',
        bloodGroup: () => isBloodGroup(value.bloodGroup),
        height: () => typeof value.height === 'number',
        weight: () => typeof value.weight === 'number',
        eyeColor: () => typeof value.eyeColor === 'string',
        domain: () => typeof value.domain === 'string',
        ip: () => isIPv4(value.ip),
        address: () => isAddress(value.address),
        macAddress: () => isMacAddress(value.macAddress),
        university: () => typeof value.university === 'string',
        bank: () => isBank(value.bank),
        company: () => isCompany(value.company),
        ein: () => isEIN(value.ein),
        ssn: () => isSSN(value.ssn),
        userAgent: () => typeof value.userAgent === 'string',
        hair: () => isHair(value.hair)
    };

    for (const key in checks) {
        if (!checks[key as keyof User]()) {
            console.error(`Ошибка: поле '${key}' не соответствует ожидаемому типу. Текущее значение:`, value[key as keyof User]);
            return false;
        }
    }

    return true;
}
```

</details>

# Продвинутые техники

## Как складывать числа на Typescript

<details>
  <summary>Пример исчерпывающие проверки (exhaustiveness checking)</summary>

``` ts
type Sum<
A extends number, 
B extends number, 
Ac1 extends number[] = [], 
Ac2 extends number[] = []> =
    A extends Ac1['length']
        ?  B extends Ac2['length']
            ? [...Ac1, ...Ac2]['length']
            : Sum<A, B, Ac1, [...Ac2, 0]>
        : Sum<A, B, [...Ac1, 0], Ac2>


const value_2: Sum<1, 1> = 2;
const value_25: Sum<10, 115> = 125;
```

</ details>
