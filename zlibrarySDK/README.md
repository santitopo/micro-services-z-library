# ZLibrary SDK

This is ZLibrary node sdk. It is intended to be integrated in js projects to help organizations interact with the system. Through an API Key any organization can use the external-api endpoints `Top Books` and `Reservations of Book between dates`.

# Installation

This package is publicly available in npm package manager. You can run `npm i zlibrarysdk` to get it insalled in its latest version within your js project.

# Usage

Example:

```
const ZLibrary = require("zlibrarysdk");

const zlibrary = new ZLibrary("http://localhost:3001", "30a4t32skwo8c2y7");

zlibrary
  .authenticate()
  .then((data) => console.log(data))
  .then(() => {
    zlibrary.topBooks().then((data) => console.log(data));
  });

```

## Authenticate

To use this package, the first step is authenticating against the API to validate the API key provided. This can be done by creating a ZLibrary instance and calling `authenticate` as follows :

```
const zlibrary = new ZLibrary("http://localhost:5004", "3c85i4okwjavxj3");

const {success, error} = await zlibrary.authenticate();
```

The error key can provide further information in case the authentication goes wrong.

## Methods

The library currently supports two methods, `reservationsOfBookBetween` and `topBooks` .

### reservationsOfBookBetween

This methods brings all the reservations of the book which overlap with the period provided.

`const {success, error, response }= await reservationsOfBookBetween( isbn, dateFrom, dateTo);`

```
const result = await zlibrary.reservationsOfBookBetween( '1234321', "2021-09-23","2021-12-20");

console.log(result);

/*{
success:true,
response:
[
  { member: 'test@gmail.com', date: '2021-12-12' },
  { member: 'test@gmail.com', date: '2021-12-13' },
  { member: 'test@gmail.com', date: '2021-12-14' }
]
}*/
```

### topBooks

This methods brings the top 5 organization books ordered by number of reservations in descending order.

`const {success, error, response }= await topBooks();`

```
const result = await zlibrary.topBooks();

console.log(result);

/*{
  success: true,
  response: [
    {
      id: 1,
      title: 'Cuentos de Hadas',
      isbn: '1234321',
      authors: 'JK Rowlings',
      year: 2006,
      is_deleted: false,
      quantity: 1,
      times_read: 12,
      organization_id: 1,
      createdAt: '2021-11-28T14:50:19.529Z',
      updatedAt: '2021-11-28T15:52:09.566Z'
    }
  ]
}*/
```
