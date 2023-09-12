import { Command } from 'commander'
import { runTask } from './run-task'
import { getTasksFromGlobPatterns } from './task-glob'

interface RunParallelTasksOptions {
  continueOnError?: boolean
  maxConcurrency?: number
  // TODO: Add support for the following options:
  // aggregateOutput?: boolean
  // printLabel?: boolean
  // printName?: boolean
  // race?: boolean
  // silent?: boolean
}

const program = new Command()

program
  .usage('[options] <tasks...>')
  .description('Runs tasks in parallel.')
  .arguments('<tasks...>')
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

export const runParallelTasks = async (
  taskPatterns: string[],
  { continueOnError = false, maxConcurrency = 4 }: RunParallelTasksOptions = {},
) => {
  const taskNames = taskPatterns.map((taskPattern) => taskPattern.split(' ')[0])
  const taskArguments = taskPatterns.map((taskPattern) =>
    taskPattern.split(' ').slice(1).join(' '),
  )

  const tasks = await getTasksFromGlobPatterns(taskNames)

  const taskQueue = tasks.map((task, index) => {
    const taskArgument = taskArguments[index]

    if (taskArgument !== '') {
      return `${task} ${taskArgument}`
    }

    return task
  })
  const abortController = new AbortController()

  process.on('SIGINT', () => {
    abortController.abort()
    console.log('Aborted!')
    process.exit()
  })

  const taskRunner = async () => {
    for (;;) {
      if (abortController.signal.aborted) {
        return
      }
      const current = taskQueue.pop()

      if (!current) {
        return
      }

      const spawnResult = await runTask(current, {
        signal: abortController.signal,
        stdout: 'inherit',
        stderr: 'inherit',
      })

      if (spawnResult.exitCode !== 0 && !continueOnError) {
        abortController.abort()
      }
    }
  }

  const taskPromises = Array.from({ length: maxConcurrency }).map(() =>
    taskRunner(),
  )

  await Promise.all(taskPromises)
}

export const main = async () => {
  const parsedArguments = program.parse(process.argv)
  const options = program.opts()
  const tasks = parsedArguments.args

  await runParallelTasks(tasks, {
    continueOnError: Boolean(options.continueOnError),
    maxConcurrency: Number(options.maxParallel),
  })
}

if (import.meta.path === Bun.main) {
  await main()
}
