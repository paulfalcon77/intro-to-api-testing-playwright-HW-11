import { expect, test } from '@playwright/test'
import { LoginDTO, LoginSchema } from './models/LoginDTO'
import { z } from 'zod'

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

    const token: z.infer<typeof LoginSchema> = await LoginResponse.text()
    const TestToken = LoginSchema.parse(token)
    console.log(TestToken)
    console.log(await LoginResponse.text())
    expect(LoginResponse.status()).toBe(200)
    expect(token.length).toBeGreaterThan(0)
  })
})
