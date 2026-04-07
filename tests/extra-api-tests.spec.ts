import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDTO } from './models/OrderDTO'
import { getJwt } from './helpers/api-helpers'
import { UserDTO } from './models/LoginDTOcourier'

const ORDERS_URL = 'https://backend.tallinn-learning.ee/orders'

test('Full process: Create courier, Order and Deliver', async ({ request }) => {
  //  Студент логинится
  const studentToken = await getJwt(request)

  //  Создаем курьера
  const pavelData = UserDTO.generateCourier()

  //  Регистрируем курьера  (от лица студента !!!!!)
  await request.post('https://backend.tallinn-learning.ee/users/courier', {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: pavelData, //  login, password, name
  })

  //  Студент создает заказ
  const orderResponse = await request.post(ORDERS_URL, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: OrderDTO.generateDefault(),
  })
  const order = await orderResponse.json()

  //  Логинимся  как новый  курьер

  const courierLoginRes = await request.post('https://backend.tallinn-learning.ee/login/courier', {
    data: {
      username: pavelData.login,
      password: pavelData.password,
    },
  })
  const tokenCourier = await courierLoginRes.text()

  //  Назначаем новый статус
  const assignResponse = await request.put(`${ORDERS_URL}/${order.id}/assign`, {
    headers: { Authorization: `Bearer ${tokenCourier}` },
  })
  expect(assignResponse.status()).toBe(200)
  const finalRes = await request.put(`${ORDERS_URL}/${order.id}/status`, {
    headers: {
      Authorization: `Bearer ${tokenCourier}`,
    },
    data: { status: 'DELIVERED' },
  })
  const finalResBody = finalRes.json()
  console.log('response body:', await finalResBody)
  expect(finalRes.status()).toBe(200)
})

test('DELETE order and check deleted order', async ({ request }) => {
  const token = await getJwt(request)
  const response = await request.post(ORDERS_URL, {
    headers: { Authorization: `Bearer ${token}` },
    data: OrderDTO.generateDefault(),
  })
  const responseBody = await response.json()
  console.log('response body:', await responseBody)

  const delResponse = await request.delete(`${ORDERS_URL}/${responseBody.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const statusCode = delResponse.status()
  expect(statusCode).toBe(StatusCodes.OK)
  //expect(delResponse.status()).toBe(200) - for example

  const delResponseCheck = await request.get(`${ORDERS_URL}/${responseBody.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  expect(delResponseCheck.status()).toBe(StatusCodes.OK)
  const checkBody = await delResponseCheck.text()
  console.log('Check body:', checkBody)
})

// Test: Courier has got an order. Another Courier is trying to get this order and change the status.

test('Full process: Create courier, Order and Deliver, create new courier and new courier try to change created status', async ({
  request,
}) => {
  //  Студент логинится
  const studentToken = await getJwt(request)

  //  Создаем курьера
  const pavelData = UserDTO.generateCourier()

  //создаем второго курьера
  const ivanData = UserDTO.generateCourierSecond()

  //  Регистрируем курьера  (от лица студента !!!!!)
  await request.post('https://backend.tallinn-learning.ee/users/courier', {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: pavelData, //  login, password, name
  })

  //  Регистрируем Второго  курьера  (от лица студента !!!!!)
  await request.post('https://backend.tallinn-learning.ee/users/courier', {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: ivanData, //  login, password, name
  })

  //  Студент создает заказ
  const orderResponse = await request.post(ORDERS_URL, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: OrderDTO.generateDefault(),
  })
  const order = await orderResponse.json()

  //  Логинимся  как новый  курьер

  const courierLoginRes = await request.post('https://backend.tallinn-learning.ee/login/courier', {
    data: {
      username: pavelData.login,
      password: pavelData.password,
    },
  })
  const tokenCourier = await courierLoginRes.text()

  //  Логинимся  как новый Второй  курьер
  const courierSecondLoginRes = await request.post(
    'https://backend.tallinn-learning.ee/login/courier',
    {
      data: {
        username: ivanData.login,
        password: ivanData.password,
      },
    },
  )
  const tokenCourierSecond = await courierSecondLoginRes.text()

  //  Назначаем новый статус
  const assignResponse = await request.put(`${ORDERS_URL}/${order.id}/assign`, {
    headers: { Authorization: `Bearer ${tokenCourier}` },
  })
  expect(assignResponse.status()).toBe(200)
  const finalRes = await request.put(`${ORDERS_URL}/${order.id}/status`, {
    headers: {
      Authorization: `Bearer ${tokenCourier}`,
    },
    data: { status: 'ACCEPTED' },
  })
  const finalResBody = finalRes.json()
  console.log('response body:', await finalResBody)
  expect(finalRes.status()).toBe(200)

  //  Назначаем новый статус для второго курьера
  const assignResponseSecond = await request.put(`${ORDERS_URL}/${order.id}/assign`, {
    headers: { Authorization: `Bearer ${tokenCourierSecond}` },
  })
  expect(assignResponseSecond.status()).toBe(200)
  const finalResSecond = await request.put(`${ORDERS_URL}/${order.id}/status`, {
    headers: {
      Authorization: `Bearer ${tokenCourierSecond}`,
    },
    data: { status: 'DELIVERED' },
  })
  const finalResBodySecond = finalResSecond.json()
  console.log('response body:', await finalResBodySecond)
  expect(finalResSecond.status()).toBe(200)
  expect(finalResSecond.status()).toBe(StatusCodes.OK)
})

// There is a bag. The second courier could get created order and changed  the status.
