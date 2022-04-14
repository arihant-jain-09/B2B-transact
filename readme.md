# B2BTranzact (using both SQL and NOSQL)

## Technologies

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/) [![Nodejs](https://img.shields.io/badge/-Nodejs-green?style=flat&logo=Node.js&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/) [![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/)[![Mongodb](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/)[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/) [![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat&logo=html5&logoColor=white&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/) [![SCSS](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white&link=https://burgurly.azurewebsites.net/)](https://burgurly.azurewebsites.net/)

## Web View

<div align="center">
  <a href="https://burgurly.azurewebsites.net/"><img src="https://i.ibb.co/bmYH0VG/Screenshot-2022-04-14-094528.png" alt="2021-07-20-10-30-15" border="0"></a>
</div>

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Links](#links)
- [EndPoints](#EndPoints)
- [Features](#Features)

## About

- A simple B2B system with features of adding and updating documents.
- React is used to power front-end.
- React Router is implemented to change routes (not added routes for now)
- Database used are SQL (for branch SQL) and NOSQL (for branch master).

## Installation

```js
# clone repo
$ git clone https://github.com/arihant-jain-09/B2B-transact.git
$ cd B2B-transact

#install dependencies

//for backend
$ npm install

//for frontend
$ cd client
$ npm install

for launch server
$ npm run dev
```

## Links

- [SQL](https://tranzactsql.herokuapp.com/)
- [NOSQL](https://b2btransact.herokuapp.com/)

## Assumptions

- A user may not be assigned to any company, we need to add it as an employee.
- After user becomes an employee it will be assigned a unique email and company_id by the company.
- Separate products table for generating invoice of goods.

## EndPoints

#### - GET

| Endpoint                                                          | Info                                                                                                     |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| /                                                                 | `Frontened on localhost:3000`                                                                            |
| /users                                                            | `List all the users`                                                                                     |
| /companies                                                        | `List all the companies`                                                                                 |
| /employee                                                         | `List all the employee of the companies`                                                                 |
| /employee/invoice?employee_id=2                                   | `List all the invoices of an employee`                                                                   |
| /employee/invoice?employee_id=2&count=3                           | `List all the invoices of an employee and limit results to 3`                                            |
| /employee/invoice?employee_id=2&count=3&page=2                    | `List all the invoices of an employee, go to page 2 and limit results to 3`                              |
| /employee/invoice?employee_id=2&count=3&page=2&status=pending     | `List all the invoices of an employee, go to page 2, filter by status of pending and limit results to 3` |
| /invoices                                                         | `List all the invoices`                                                                                  |
| /invoices?count=2                                                 | `List all the invoices with limit to 2`                                                                  |
| /invoices?count=2&sortBy=grand_total                              | `List all the invoices , sort by grand_total and limit to 2`                                             |
| /invoices?count=2&sortBy=grand_total&page=2                       | `List all the invoices , go to page 2, sort by grand_total and limit to 2`                               |
| /invoices?count=2&sortBy=grand_total&page=2&filter_status=pending | `List all the invoices , go to page 2, sort by grand_total, filter by status of pending and limit to 2`  |
| /invoices                                                         | `List all the invoices`                                                                                  |
| /products                                                         | `List all the products`                                                                                  |

#### - POST

| Endpoint   | body params                                              | Info                                       |
| ---------- | -------------------------------------------------------- | ------------------------------------------ |
| /addtable  | `sqlQuery`                                               | Adds a table to tranzact database          |
| /users     | `name` `username`                                        | Adds a user with unique username           |
| /companies | `company_name` `email` `established`                     | Adds a company with unique name and email  |
| /employee  | `email` `company_id` `user_id`                           | Adds an employee to the company            |
| /invoices  | `employee_id` `seller_id` `buyer_id` `grand_total` `sku` | Adds an invoice (requires all body params) |
| /products  | `sku` `item_name` `price`                                | Adds a product                             |

#### - PATCH

| Endpoint              | body params                                      | Info                                       |
| --------------------- | ------------------------------------------------ | ------------------------------------------ |
| /users/id             | `name` `username`                                | Change user properties                     |
| /companies/id         | `company_name` `email` `established`             | Adds a company with unique name and email  |
| /employee/id          | `email` `company_id`                             | Change email OR company_id or both.        |
| /invoices/id          | `employee_id` `seller_id` `grand_total` `status` | Update if employee_id is of seller company |
| /products/products/id | `item_name` `price` `currency`                   | SKU is fixed once declared.                |

## Features

- Invoices can be filtered based on grand_total or thier status.
- Company can register user as its employee.
- Separate Products table to keep track of all products.
- Pagination in /invoices and /employee/invoice and filteration based on query params
- Timestamp for all enteries.
