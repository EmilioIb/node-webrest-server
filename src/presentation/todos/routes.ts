import { Router } from 'express';
import { TodosController } from './controller';
import { TodoDatasourceImpl } from '../../infrastructure/datasources/todo.datasource.impl';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new TodoDatasourceImpl();
    const todoRepository = new TodoRepositoryImpl(datasource);
    const todoContoller = new TodosController(todoRepository);

    router.get('/', todoContoller.getTodos);
    router.get('/:id', todoContoller.getTodoById);
    router.post('/', todoContoller.createTodo);
    router.put('/:id', todoContoller.updateTodo);
    router.delete('/:id', todoContoller.deleteTodo);

    return router;
  }
}
