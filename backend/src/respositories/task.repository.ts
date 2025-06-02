import { BaseRepository } from "@/databases/database.repository";
import { ITaskDocument, Task } from "@/models/tasks.model";



export class TaskRepository extends BaseRepository<ITaskDocument> {
  constructor() {
    super(Task);
  }

}
