import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(async () => {
    testServer.close();
    await prisma.todo.deleteMany();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: 'Hola mundo 1' };
  const todo2 = { text: 'Hola mundo 2' };

  test('should return todos api/todos (GET)', async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app).get('/api/todos').expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
  });

  test('should return a TODO api/todos/:id (GET)', async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app).get(`/api/todos/${todo.id}`).expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test('should return a 404 not found api/todos/:id (GET)', async () => {
    const todoId = 1;
    const { body } = await request(testServer.app).get(`/api/todos/${todoId}`).expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return error when sending no numeric id api/todos:id (GET)', async () => {
    const todoId = 'textId';
    const { body } = await request(testServer.app).get(`/api/todos/${todoId}`).expect(400);
    expect(body).toEqual({ error: `Id must be a valid number` });
  });

  test('should return a new Todo api/todos (POST)', async () => {
    const { body } = await request(testServer.app).post('/api/todos').send(todo1).expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return a error if text is not present api/todos (POST)', async () => {
    const { body } = await request(testServer.app).post('/api/todos').send({}).expect(400);
    expect(body).toEqual({
      error: 'Text property is required',
    });
  });

  test('should return a error if text is empty api/todos (POST)', async () => {
    const { body } = await request(testServer.app).post('/api/todos').send({ text: '' }).expect(400);
    expect(body).toEqual({
      error: 'Text property is required',
    });
  });

  test('should return a updated todo api/todos:id (PUT)', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Hola mundo update', completedAt: '2023/11/20' })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: 'Hola mundo update',
      completedAt: '2023-11-20T06:00:00.000Z',
    });
  });

  test('should return 404 if TODO not found api/todos:id (PUT)', async () => {
    const todoId = 1;
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ text: 'Hola mundo update', completedAt: '2023/11/20' })
      .expect(404);

    expect(body).toEqual({
      error: `Todo with id ${todoId} not found`,
    });
  });

  test('should return error when sending no numeric id api/todos:id (PUT)', async () => {
    const todoId = 'textId';
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ text: 'Hola mundo update', completedAt: '2023/11/20' })
      .expect(400);

    expect(body).toEqual({
      error: `Id must be a valid number`,
    });
  });

  test('should return update todo only text api/todos:id (PUT)', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const newTextTodo = 'Hola mundo update';
    const { body } = await request(testServer.app).put(`/api/todos/${todo.id}`).send({ text: newTextTodo }).expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: newTextTodo,
      completedAt: null,
    });
  });

  test('should return update todo only date api/todos:id (PUT)', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app).put(`/api/todos/${todo.id}`).send({ completedAt: '2023/11/20' }).expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: '2023-11-20T06:00:00.000Z',
    });
  });

  test('should return error when sending no numeric id api/todos:id (PUT)', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/todos/textId`)
      .send({ text: 'Hola mundo update', completedAt: '2023/11/20' })
      .expect(400);

    expect(body).toEqual({
      error: 'Id must be a valid number',
    });
  });

  test('should return deleted TODO api/todos:id (DELETE)', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app).delete(`/api/todos/${todo.id}`).expect(200);
    expect(body).toEqual(todo);
  });

  test('should return 404 when TODO to delete not found api/todos:id (DELETE)', async () => {
    const todoId = 1;
    const { body } = await request(testServer.app).delete(`/api/todos/${todoId}`).expect(404);

    expect(body).toEqual({ error: 'Todo with id 1 not found' });
  });

  test('should return error when sending no numeric id api/todos:id (DELETE)', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/todos/textId`)
      .send({ text: 'Hola mundo update', completedAt: '2023/11/20' })
      .expect(400);

    expect(body).toEqual({
      error: 'Id must be a valid number',
    });
  });
});
