import { LoginDTO } from '../models/LoginDTO'
import { APIRequestContext } from 'playwright'
import { StatusCodes } from 'http-status-codes'
import { OrderDTO } from '../models/OrderDTO'

//const serviceURL = 'https://backend.tallinn-learning.ee/'
const AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'
const AUTH_URL_COURIER = 'https://backend.tallinn-learning.ee/login/courier'
//const loginPath = 'login/student'
//const orderPath = 'orders'

export async function getJwt(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })
  if (loginResponse.status() !== StatusCodes.OK) {
    throw new Error(`Authorization failed. Status: ${loginResponse.status()}`)
  }
  return await loginResponse.text()
}

export async function getJwtCourier(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(AUTH_URL_COURIER, {
    data: LoginDTO.generateCorrectPair(),
  })
  if (loginResponse.status() !== StatusCodes.OK) {
    throw new Error(`Authorization failed. Status: ${loginResponse.status()}`)
  }
  return await loginResponse.text()
}

export async function createOrder(request: APIRequestContext, token: string): Promise<number> {
  const response = await request.post(AUTH_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: OrderDTO.generateDefault(),
  })

  const responseBody = await response.json()

  return responseBody.id
}
