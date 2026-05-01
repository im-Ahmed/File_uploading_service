export class ApiResponse {
  constructor(StatusCode, data, message = "success") {
    this.StatusCode = StatusCode;
    this.message = message;
    this.data = data;
    this.succes = 400 > StatusCode;
  }
}
