export class UserDTO {
  login: string
  password: string
  name: string

  constructor(login: string, password: string, name: string) {
    this.login = login
    this.password = password
    this.name = name
  }

  static generateCourier(): UserDTO {
    return new UserDTO('Pavel', 'pavel', 'name')
  }
}
