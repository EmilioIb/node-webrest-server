import { Request, Response } from 'express';

const todos = [
  {
    id: 1,
    text: 'Buy milk',
    completedAt: new Date(),
  },
  {
    id: 2,
    text: 'Do homework',
    completedAt: null,
  },
  {
    id: 3,
    text: 'Watch TV',
    completedAt: new Date(),
  },
];

export class TodosController {
  // * DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    const todo = todos.find(todo => todo.id === id);
    todo ? res.json(todo) : res.status(404).json({ error: `Error: todo with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text property is required' });

    const newTodo = { id: todos.length + 1, text, completedAt: new Date() };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    const todo = todos.find(todo => todo.id === id);
    if (!todo) return res.status(404).json({ error: `Error: todo with id ${id} not found` });

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    todo.completedAt = completedAt === null ? null : new Date(completedAt || todo.completedAt);

    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    const indexDelete = todos.findIndex(todo => todo.id === id);
    if (indexDelete === -1) return res.status(404).json({ error: `Error: todo with id ${id} not found` });

    const todoDeleted = todos[indexDelete];

    todos.splice(indexDelete, 1);
    res.json(todoDeleted);
  };
}
