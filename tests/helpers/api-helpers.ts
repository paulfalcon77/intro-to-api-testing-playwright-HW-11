import { LoginDTO } from '../models/LoginDTO'
import { APIRequestContext } from 'playwright'
import { OrderDto } from '../models/OrderDTO'
import { StatusCodes } from 'http-status-codes'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const AUTH_URL = 'https://backend.tallinn-learning.ee/login/student'
const loginPath = 'login/student'
const orderPath = 'orders'

export async function getJwt(request: APIRequestContext): Promise<string> {
  const loginResponse = await request.post(AUTH_URL, {
    data: LoginDTO.generateCorrectPair(),
  })
  if (loginResponse.status() !== StatusCodes.OK) {
    throw new Error(`Authorization failed. Status: ${loginResponse.status()}`)
  }
  return await loginResponse.text()
}
