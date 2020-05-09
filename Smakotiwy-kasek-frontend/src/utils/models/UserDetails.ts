import { Role } from "./Role";

export class UserDetails {
  username: string | undefined;
  roles: Role[];

  constructor(username: string | undefined = undefined, roles: Role[]) {
    this.username = username;
    this.roles = roles;
  }
}
