import { expect, test } from '@playwright/test'
import { LoginDTO } from './models/LoginDTO'

test.describe('Login API tests', () => {
  const BaseEndPoint = 'https://backend.tallinn-learning.ee/login/student'
  test('Incorrect login ', async ({ request }) => {
    const LoginResponse = await request.post(BaseEndPoint, {
      data: LoginDTO.generateIncorrectPair(),
    })
    expect(LoginResponse.status()).toBe(401)
  })
  test('Correct login ', async ({ request }) => {
    console.log(LoginDTO.generateCorrectPair())
    const LoginResponse = await request.post(BaseEndPoint, {
      data: LoginDTO.generateCorrectPair(),
    })
    console.log(await LoginResponse.text())
    expect(LoginResponse.status()).toBe(200)
  })
})
