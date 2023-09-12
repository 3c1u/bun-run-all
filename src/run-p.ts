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
  // TODO: parse CLI arguments

  const taskPatterns = process.argv.slice(2)
  await runParallelTasks(taskPatterns)
}

if (import.meta.path === Bun.main) {
  void main()
}
