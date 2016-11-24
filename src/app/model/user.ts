export class User {
  id: string;
  password: string;
  name: string;


  public constructor(id, password, name){
    this.id = id;
    this.password = password;
    this.name = name;
  }
}
