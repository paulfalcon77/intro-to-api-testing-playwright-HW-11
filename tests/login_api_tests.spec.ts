import { expect, test } from '@playwright/test'

test.describe('Login API tests', () => {
  const BaseEndPoint = 'https://backend.tallinn-learning.ee/login/student'
  test('Incorrest login ', async ({request}) => {
    const LoginResponse = await request.post(BaseEndPoint, {
      data: {
        username: '',
        password: '',
      }
    });
    expect(LoginResponse.status()).toBe(401);
  })
})
