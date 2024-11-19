import { Request, Response } from 'express';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';
import { TodoEntity, TodoRepository } from '../../domain';

export class TodosController {
  // * DI
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    try {
      const todo = await this.todoRepository.findById(id);
      return res.json(todo);
    } catch (error) {
      return res.status(404).json({ error });
    }
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({ error });

    const todoCreated = await this.todoRepository.create(createTodoDto!);
    res.status(201).json(todoCreated);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id,
    });
    if (error) return res.status(400).json({ error });

    try {
      const todoUpdated = await this.todoRepository.updateById(updateTodoDto!);
      return res.json(todoUpdated);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    try {
      const todoDeleted = await this.todoRepository.deleteById(id);
      return res.json(todoDeleted);
    } catch (error) {
      res.status(400).json({ error: `Error: todo with id ${id} not found` });
    }
  };
}
