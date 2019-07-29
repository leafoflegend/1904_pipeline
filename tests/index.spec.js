const request = require('supertest');
const app = require('../src/server.js');
const { models: { Task }, db } = require('../src/db/index.js')

let resolvedDb;

describe('Application', () => {
  beforeAll(async () => {
    await db
      .sync({ force: true });

    await db.authenticate();

    resolvedDb = db;
  });

  afterAll(async () => {
    await resolvedDb.close();
  });

  describe('/health', () => {
    it('Responds that it is healthy, when requested with a GET to the /health route', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toEqual({ message: 'I am healthy' });
    });
  });

  describe('/tasks', () => {
    beforeEach(async () => {
      await resolvedDb.sync({ force: true });
    });

    it('Creates a new task when hit with a POST request', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'First Task',
        });

      const tasks = await Task.findAll();

      expect(tasks.length).toEqual(1);
    });

    it('Gets all tasks when hit with a GET request', async () => {
      const templateTasks = ['First Task', 'Second Task', 'Third Task'];

      const createTasksHelper = async arrOfTitles => {
        for (let i = 0; i < arrOfTitles.length; ++i) {
          const title = arrOfTitles[i];

          await request(app)
            .post('/tasks')
            .send({
              title,
            });
        }
      };

      await createTasksHelper(templateTasks);

      const response = await request(app).get('/tasks');

      expect(response.body.length).toEqual(templateTasks.length);

      for (let i = 0; i < response.body.length; ++i) {
        const curTask = response.body[i];

        expect(curTask.title).toEqual(templateTasks[i]);
      }
    });
  });
});
