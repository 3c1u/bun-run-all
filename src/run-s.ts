import { Command } from 'commander'
import { runParallelTasks } from './run-p'

const program = new Command()

program
  .usage('[options] <tasks...>')
  .description('Runs tasks sequentially.')
  .arguments('<tasks...>')
  .option('-c, --continue-on-error', 'Continue on error')
  .option('-l, --print-label', 'Prepends the task name to its output')
  .option('-n, --print-name', 'Prints the task name before running it')
  .option('-s, --silent', 'Suppresses all output')

export const main = async () => {
  const parsedArguments = program.parse(process.argv)
  const options = program.opts()
  const tasks = parsedArguments.args

  await runParallelTasks(tasks, {
    continueOnError: Boolean(options.continueOnError),
    maxConcurrency: 1,
  })
}

if (import.meta.path === Bun.main) {
  await main()
}
