import { expect, test } from '@playwright/test'

import { OrderDTO, OrderSchema } from './models/OrderDTO'
//import { Login, LoginDTO } from './models/LoginDTO'
import { getJwt } from './helpers/api-helpers'
import { StatusCodes } from 'http-status-codes'

const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'
//const AUTH_URL = "https://backend.tallinn-learning.ee/login/student"

test('post order with correct data should receive code 201', async ({ request }) => {
  const token = await getJwt(request)

  console.log('token' + token)

  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })

  const responseBody: OrderDTO = await response.json() //"age:20,title:'123'"
  const statusCode = response.status()

  const TestOrder = OrderSchema.parse(responseBody)
  expect(TestOrder.id).not.toBeUndefined()
  expect(statusCode).toBe(StatusCodes.OK)
})

test('get order with correct id should receive code 200', async ({ request }) => {
  const token = await getJwt(request)

  console.log('token' + token)

  const response = await request.post(ORDERS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })
  const responseBody: OrderDTO = await response.json()

  //
  const responseSearch = await request.get(`${ORDERS_URL}/${responseBody.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const responseBodySearch: OrderDTO = await responseSearch.json()
  const statusCode = responseSearch.status()

  console.log('response body:', responseBodySearch)

  expect(statusCode).toBe(200)
  const TestSearchOrder = OrderSchema.parse(responseBodySearch)
  expect(TestSearchOrder.id).not.toBeUndefined()
})

//test('get order with correct id should receive code 200', async ({ request }) => {
//  const response = await request.get(`${ORDERS_URL}/1`)

//  const responseBody = await response.json()
//  const statusCode = response.status()

//  console.log('response body:', responseBody)

//  expect(statusCode).toBe(200)
//})

//test('post order with correct data should receive code 201', async ({ request }) => {

//  const response = await request.post(ORDERS_URL, {
//    data: OrderDTO.generateDefault(),
//  })

//  const responseBody: OrderDTO = await response.json() //"age:20,title:'123'"
//  const statusCode = response.status()

//  console.log('response status:', statusCode)
//  console.log('response body:', responseBody)
//  expect(statusCode).toBe(StatusCodes.OK)

//  expect(typeof responseBody.comment).toBe('string')

//  expect(typeof responseBody.courierId).toBe('number')
//})
