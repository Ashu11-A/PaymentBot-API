export class UserLogin {
  user: {
    name: string
    email: string
  }
  accessToken: {
    token: string
    expireIn: number
  }
  refreshToken: {
    token: string
    expireIn: number
  }
}
