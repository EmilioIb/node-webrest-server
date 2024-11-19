import { CreateTodoDto, TodoDatasource, TodoEntity, TodoRepository, UpdateTodoDto } from '../../domain';

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private readonly dataSource: TodoDatasource) {}

  getAll(): Promise<TodoEntity[]> {
    return this.dataSource.getAll();
  }
  findById(id: number): Promise<TodoEntity> {
    return this.dataSource.findById(id);
  }
  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.dataSource.create(createTodoDto);
  }
  updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.dataSource.updateById(updateTodoDto);
  }
  deleteById(id: number): Promise<TodoEntity> {
    return this.dataSource.deleteById(id);
  }
}
