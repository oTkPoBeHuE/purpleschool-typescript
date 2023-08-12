# Ошибки Typescript

## Материалы
- [Список ошибок с разбором](https://github.com/bennycode/typescript-errors/)
([сайт](https://typescript.tv/errors/))
- [Шаблоны ошибок](https://github.com/Microsoft/TypeScript/blob/v1.6.2/src/compiler/diagnosticInformationMap.generated.ts)


## Диапазоны ошибок
- 1xxx для синтаксических сообщений
- 2xxx для смысловых сообщений
- 4xxx для объявления выдачи сообщений
- 5xxx для сообщений параметров компилятора
- 6xxx для сообщений компилятора командной строки
- 7xxx для `noImplicitAny` сообщений


## Примеры

### 2xxx смысловые сообщения

### 2322

<details>
  <summary>Пример</summary>

``` terminal
TS2322: Тип number не может быть назначен для типа never:
DiagnosticCategory.Error, key: "Type '{0}' is not assignable to type '{1}'." }
```
</details>

### 2534

<details>
  <summary>Пример</summary>

``` text
TS2534: Функция, возвращающая neve, не может иметь доступную конечную точку.
```
</details>
