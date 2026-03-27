import { Elysia, Handler } from 'elysia';

const home: Handler = () => {
  return 'Hello Elysia';
};

const app = new Elysia().get('/', home).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
