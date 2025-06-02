import { BaseRepository } from "@/databases/database.repository";
import { IUserDocument, User } from "@/models/users.model";

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  // Custom methods specific to User entity
  async findByEmail(email: string): Promise<IUserDocument | null> {
    console.log("inside user repo")
    return this.findOne({ email }, { select: '+password' });
  }

}
