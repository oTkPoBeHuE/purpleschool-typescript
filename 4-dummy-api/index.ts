// Для некоторых типов данных созданы алиасы
type IPv4 = string;
type MacAddress = string;
type SSN = string; // Номер социального обеспечения
type EIN = string; // Идентификационный номер работодателя
type DateYYYYMMDD = string; // Дата в формате '2000-12-25'
type DateDDMM = string; // Дата в формате '06/22'

type CardNumber = string;

enum Gender {
  MALE = "male",
  FEMALE = "female",
}

enum HairType {
  STRAIGHT = "Straight",
  STRANDS = "Strands",
  VERY_CURLY = "Very curly",
  CURLY = "Curly",
  WAVY = "Wavy",
}

interface Hair {
  color: string;
  type: HairType;
}

interface Coordinates {
  lat: number;
  lng: number;
}

enum USPS_CODE {
  ALABAMA = "AL",
  ALASKA = "AK",
  ARIZONA = "AZ",
  ARKANSAS = "AR",
  CALIFORNIA = "CA",
  COLORADO = "CO",
  CONNECTICUT = "CT",
  DELAWARE = "DE",
  DISTRICT_OF_COLUMBIA = "DC",
  FLORIDA = "FL",
  GEORGIA = "GA",
  HAWAII = "HI",
  IDAHO = "ID",
  ILLINOIS = "IL",
  INDIANA = "IN",
  IOWA = "IA",
  KANSAS = "KS",
  KENTUCKY = "KY",
  LOUISIANA = "LA",
  MAINE = "ME",
  MARYLAND = "MD",
  MASSACHUSETTS = "MA",
  MICHIGAN = "MI",
  MINNESOTA = "MN",
  MISSISSIPPI = "MS",
  MISSOURI = "MO",
  MONTANA = "MT",
  NEBRASKA = "NE",
  NEVADA = "NV",
  NEW_HAMPSHIRE = "NH",
  NEW_JERSEY = "NJ",
  NEW_MEXICO = "NM",
  NEW_YORK = "NY",
  NORTH_CAROLINA = "NC",
  NORTH_DAKOTA = "ND",
  OHIO = "OH",
  OKLAHOMA = "OK",
  OREGON = "OR",
  PENNSYLVANIA = "PA",
  RHODE_ISLAND = "RI",
  SOUTH_CAROLINA = "SC",
  SOUTH_DAKOTA = "SD",
  TENNESSEE = "TN",
  TEXAS = "TX",
  UTAH = "UT",
  VERMONT = "VT",
  VIRGINIA = "VA",
}

enum BloodGroup {
  ZERO_PLUS = "O+",
  ZERO_MINUS = "O−",

  A_PLUS = "A+",
  A_MINUS = "A−",

  B_PLUS = "B+",
  B_MINUS = "B−",

  AB_PLUS = "AB+",
  AB_MINUS = "AB−",
}
interface Address {
  address: string;
  city?: string;
  coordinates: Coordinates;
  postalCode: string;
  state: USPS_CODE;
}

interface Bank {
  cardExpire: DateDDMM;
  cardNumber: CardNumber;
  cardType: string;
  currency: string;
  iban: string;
}

interface Company {
  address: Address;
  department: string;
  name: string;
  title: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: Gender;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: DateYYYYMMDD;
  image: string;
  bloodGroup: BloodGroup;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  domain: string;
  ip: IPv4;
  address: Address;
  macAddress: MacAddress;
  university: string;
  bank: Bank;
  company: Company;
  ein: EIN;
  ssn: SSN;
  userAgent: string;
}
function isGender(value: unknown): value is Gender {
  return Object.values(Gender).includes(value as Gender);
}

function isDateYYYYMMDD(value: unknown): value is DateYYYYMMDD {
  // Дата в формате '2000-12-25'
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isDateDDMM(value: unknown): value is DateDDMM {
  // Дата в формате '06/22'
  return typeof value === "string" && /^\d{2}\/\d{2}$/.test(value);
}

function isBloodGroup(value: unknown): value is BloodGroup {
  return Object.values(BloodGroup).includes(value as BloodGroup);
}

function isSSN(value: unknown): value is SSN {
  // Проверка на соответствие формату SSN (три числа, два числа и четыре числа, разделенные дефисами).
  return typeof value === "string" && /^\d{3}-\d{2}-\d{4}$/.test(value);
}

function isEIN(value: unknown): value is EIN {
  // Проверка на соответствие формату EIN (два числа, дефис, семь чисел).
  return typeof value === "string" && /^\d{2}-\d{7}$/.test(value);
}

function isUSPS_CODE(value: unknown): value is USPS_CODE {
  return Object.values(USPS_CODE).includes(value as USPS_CODE);
}

function isObjectSimilarToType<T>(
  value: unknown,
): value is Record<keyof T, unknown> {
  return typeof value === "object" && value !== null;
}

function isCoordinates(value: unknown): value is Coordinates {
  if (!isObjectSimilarToType<Coordinates>(value)) {
    console.error("Ошибка: значение не является объектом типа Coordinates.");
    return false;
  }

  if (typeof value.lat !== "number") {
    console.error("Ошибка: поле 'lat' не является числом.");
    return false;
  }

  if (typeof value.lng !== "number") {
    console.error("Ошибка: поле 'lng' не является числом.");
    return false;
  }

  return true;
}

function isCardNumber(value: unknown): value is CardNumber {
  return typeof value === "string" && /^\d+$/.test(value);
}

function isBank(value: unknown): value is Bank {
  if (!isObjectSimilarToType<Bank>(value)) {
    console.error("Ошибка: значение не является объектом типа Bank.");
    return false;
  }

  if (typeof value.cardExpire !== "string") {
    console.error("Ошибка: поле 'cardExpire' не является строкой.");
    return false;
  }

  if (!isCardNumber(value.cardNumber)) {
    console.error(
      "Ошибка: поле 'cardNumber' не соответствует типу CardNumber.",
    );
    return false;
  }

  if (typeof value.cardType !== "string") {
    console.error("Ошибка: поле 'cardType' не является строкой.");
    return false;
  }

  if (typeof value.currency !== "string") {
    console.error("Ошибка: поле 'currency' не является строкой.");
    return false;
  }

  if (typeof value.iban !== "string") {
    console.error("Ошибка: поле 'iban' не является строкой.");
    return false;
  }

  return true;
}

function isAddress(value: unknown): value is Address {
  if (!isObjectSimilarToType<Address>(value)) {
    console.error("Ошибка: значение не является объектом типа Address.");
    return false;
  }

  if (typeof value.address !== "string") {
    console.error("Ошибка: поле 'address' не является строкой.");
    return false;
  }

  // Поле не обязательное.
  if (typeof value.city !== "string" && typeof value.city !== "undefined") {
    console.error("Ошибка: поле 'city' не является строкой.");
    return false;
  }

  if (!isCoordinates(value.coordinates)) {
    console.error(
      "Ошибка: поле 'coordinates' не соответствует типу Coordinates.",
    );
    return false;
  }

  if (typeof value.postalCode !== "string") {
    console.error("Ошибка: поле 'postalCode' не является строкой.");
    return false;
  }

  if (!isUSPS_CODE(value.state)) {
    console.error("Ошибка: поле 'state' не является допустимым кодом USPS.");
    return false;
  }

  return true;
}

function isCompany(value: unknown): value is Company {
  if (!isObjectSimilarToType<Company>(value)) {
    console.error("Ошибка: значение не является объектом типа Company.");
    return false;
  }

  if (!isAddress(value.address)) {
    console.error("Ошибка: поле 'address' не соответствует типу Address.");
    return false;
  }

  if (typeof value.department !== "string") {
    console.error("Ошибка: поле 'department' не является строкой.");
    return false;
  }

  if (typeof value.name !== "string") {
    console.error("Ошибка: поле 'name' не является строкой.");
    return false;
  }

  if (typeof value.title !== "string") {
    console.error("Ошибка: поле 'title' не является строкой.");
    return false;
  }

  return true;
}
function isMacAddress(value: unknown): value is MacAddress {
  // Проверка на соответствие формату MAC-адреса (шестигруппы двухзначных шестнадцатеричных чисел, разделенных двоеточиями).
  const pattern = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/;
  return typeof value === "string" && pattern.test(value);
}

function isIPv4(value: unknown): value is IPv4 {
  // Проверка на соответствие формату IPv4 (четыре числа, разделенные точками).
  const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  return typeof value === "string" && pattern.test(value);
}

function isHairType(value: unknown): value is HairType {
  return Object.values(HairType).includes(value as HairType);
}
function isHair(value: unknown): value is Hair {
  if (!isObjectSimilarToType<Hair>(value)) {
    console.error("Ошибка: значение не является объектом типа Hair.");
    return false;
  }

  if (typeof value.color !== "string") {
    console.error("Ошибка: поле 'color' не является строкой.");
    return false;
  }

  if (!isHairType(value.type)) {
    console.error("Ошибка: поле 'type' не является допустимым типом волос.");
    return false;
  }

  return true;
}
function isUser(value: unknown): value is User {
  if (!isObjectSimilarToType<User>(value)) {
    console.error("Ошибка: значение не является объектом типа User.");
    return false;
  }

  const checks: { [key in keyof User]: () => boolean } = {
    id: () => typeof value.id === "number",
    firstName: () => typeof value.firstName === "string",
    lastName: () => typeof value.lastName === "string",
    maidenName: () => typeof value.maidenName === "string",
    age: () => typeof value.age === "number",
    gender: () => isGender(value.gender),
    email: () => typeof value.email === "string",
    phone: () => typeof value.phone === "string",
    username: () => typeof value.username === "string",
    password: () => typeof value.password === "string",
    birthDate: () => isDateYYYYMMDD(value.birthDate),
    image: () => typeof value.image === "string",
    bloodGroup: () => isBloodGroup(value.bloodGroup),
    height: () => typeof value.height === "number",
    weight: () => typeof value.weight === "number",
    eyeColor: () => typeof value.eyeColor === "string",
    domain: () => typeof value.domain === "string",
    ip: () => isIPv4(value.ip),
    address: () => isAddress(value.address),
    macAddress: () => isMacAddress(value.macAddress),
    university: () => typeof value.university === "string",
    bank: () => isBank(value.bank),
    company: () => isCompany(value.company),
    ein: () => isEIN(value.ein),
    ssn: () => isSSN(value.ssn),
    userAgent: () => typeof value.userAgent === "string",
    hair: () => isHair(value.hair),
  };

  for (const key in checks) {
    if (!checks[key as keyof User]()) {
      console.error(
        `Ошибка: поле '${key}' не соответствует ожидаемому типу. Текущее значение:`,
        value[key as keyof User],
      );
      return false;
    }
  }

  return true;
}

type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

function isUsersResponse(value: unknown): value is UsersResponse {
  if (!isObjectSimilarToType<UsersResponse>(value)) {
    console.error(
      "Ошибка: значение не является объектом, подобным UsersResponse.",
    );
    return false;
  }

  if (typeof value.total !== "number") {
    console.error("Ошибка: поле 'total' должно быть числом.");
    return false;
  }

  if (typeof value.skip !== "number") {
    console.error("Ошибка: поле 'skip' должно быть числом.");
    return false;
  }

  if (typeof value.limit !== "number") {
    console.error("Ошибка: поле 'limit' должно быть числом.");
    return false;
  }

  if (!Array.isArray(value.users)) {
    console.error("Ошибка: поле 'users' должно быть массивом.");
    return false;
  }

  const invalidUsers: unknown[] = [];
  for (let i = 0; i < value.users.length; i++) {
    const currentUser = value.users[i];
    if (!isUser(currentUser)) {
      invalidUsers.push(currentUser);
      console.error(
        `Ошибка: элемент с индексом ${i} в поле 'users' не соответствует типу User.`,
      );
      console.error(currentUser);
    }
  }
  if (invalidUsers.length) {
    console.error(`Найдено ${invalidUsers.length} невалидных пользователей`);
  }

  return invalidUsers.length === 0;
}

// Typescript 5.1.6
// Требуется node v20.5.1
fetch("https://dummyjson.com/users")
  .then((res) => res.json())
  .then((user) => {
    if (isUsersResponse(user)) {
      console.log("Все данные валидны");
    } else {
      console.log("Ошибка в ответе");
    }
  })
  .catch((e) => {
    console.error("Ошибка", e);
  });
