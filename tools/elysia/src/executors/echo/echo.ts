import { PromiseExecutor } from '@nx/devkit';
import { EchoExecutorSchema } from './schema';
import { promisify } from 'util';
import { exec } from 'child_process';

const runExecutor: PromiseExecutor<EchoExecutorSchema> = async (options) => {
  console.info(`Executing "echo"...`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);

  const { stdout, stderr } = await promisify(exec)(
    `echo ${options.textToEcho}`,
  );
  console.log(stdout);
  console.error(stderr);

  const success = !stderr;
  return { success };
};

export default runExecutor;
