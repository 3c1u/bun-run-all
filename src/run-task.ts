import type { SpawnOptions } from 'bun'

import { parse } from 'shell-quote'
import type { ParseEntry } from 'shell-quote'

interface RunTaskOptions extends SpawnOptions.OptionsObject {
  signal?: AbortSignal
}

const taskArgumentToString = (taskArgument: ParseEntry): string | undefined => {
  if (typeof taskArgument === 'string') {
    return taskArgument
  }

  if ('pattern' in taskArgument) {
    return taskArgumentToString(taskArgument.pattern)
  }

  if ('op' in taskArgument) {
    return taskArgument.op
  }

  return undefined
}

/**
 * Runs a npm task.
 *
 * @param task    A npm task to run.
 * @param options An object with options.
 */
export const runTask = async (task: string, options?: RunTaskOptions) => {
  const taskArguments = parse(task).flatMap((taskArgument) => {
    const result = taskArgumentToString(taskArgument)
    return result === undefined ? [] : [result]
  })

  const subprocess = Bun.spawn({
    cmd: ['bun', 'run', '--silent', ...taskArguments],
    ...options,
  })

  const abortSignal = options?.signal

  if (abortSignal) {
    abortSignal.addEventListener('abort', () => {
      const reason = abortSignal.reason as unknown

      if (typeof reason === 'number') {
        subprocess.kill(reason)
      } else {
        subprocess.kill()
      }
    })
  }

  await subprocess.exited

  return subprocess
}
