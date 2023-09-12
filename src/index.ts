import { Command } from 'commander'
import { runParallelTasks } from './run-p'

const program = new Command()

program
  .usage('[options] <tasks...>')
  .description('Runs tasks in parallel or sequentially.')
  .arguments('<tasks...>')
  .option('-p, --parallel', 'Run tasks in parallel', true)
  .option('-s, --sequential', 'Run tasks sequentially')
  .option('-c, --continue-on-error', 'Continue on error')
  .option('-j, --max-parallel <number>', 'Max concurrency', '4')
  .option(
    '--aggregate-output',
    'Aggregates the output of all tasks by throttling',
  )
  .option('-l, --print-label', 'Prepends the task name to its output')
  .option('-n, --print-name', 'Prints the task name before running it')
  .option('-r, --race', 'Kills all tasks if one finishes successfully')
  .option('-s, --silent', 'Suppresses all output')

export const main = async () => {
  const parsedArguments = program.parse(process.argv)
  const options = program.opts()
  const tasks = parsedArguments.args

  if (options.parallel && options.sequential) {
    throw new Error('Cannot run tasks in parallel and sequentially.')
  }

  await runParallelTasks(tasks, {
    continueOnError: Boolean(options.continueOnError),
    maxConcurrency: options.parallel ? Number(options.maxParallel) || 4 : 1,
  })
}

if (import.meta.path === Bun.main) {
  await main()
}
