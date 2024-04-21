export default interface User {
  _id?: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password?: string;
  confirmPassword?: string;
  address: string;
  isBuyer: boolean;
  profilePic: string;
}
