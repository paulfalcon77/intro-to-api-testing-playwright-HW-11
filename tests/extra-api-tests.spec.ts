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
