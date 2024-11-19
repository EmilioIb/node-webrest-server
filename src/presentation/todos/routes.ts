import { Router } from 'express';
import { TodosController } from './controller';

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const todoContoller = new TodosController();

    router.get('/', todoContoller.getTodos);
    router.get('/:id', todoContoller.getTodoById);
    router.post('/', todoContoller.createTodo);
    router.put('/:id', todoContoller.updateTodo);
    router.delete('/:id', todoContoller.deleteTodo);

    return router;
  }
}
