export class AuthLoginInfo {
  username: string;
  password: string;
  rememberMe: boolean;

  constructor(username: string = "", password: string = "", rememberMe: boolean = false) {
    this.username = username;
    this.password = password;
    this.rememberMe = rememberMe;
  }
}
