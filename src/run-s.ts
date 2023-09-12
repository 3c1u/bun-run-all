import { runParallelTasks } from './run-p'

export const main = async () => {
  // TODO: parse CLI arguments

  const taskPatterns = process.argv.slice(2)
  await runParallelTasks(taskPatterns, {
    maxConcurrency: 1,
  })
}

if (import.meta.path === Bun.main) {
  await main()
}
