import { minimatch } from 'minimatch'

export const filterTasksFromGlobPatterns = (
  taskPatterns: string[],
  tasks: string[],
): string[] => {
  const filteredTasks = tasks.filter((task) => {
    const isMatch = taskPatterns.some((taskPattern) =>
      minimatch(task, taskPattern),
    )

    return isMatch
  })

  return filteredTasks
}

export const getTasksFromGlobPatterns = async (
  taskPatterns: string[],
): Promise<string[]> => {
  const packageJson = await Bun.file('package.json').text()
  const packageJsonParsed: unknown = JSON.parse(packageJson)

  if (typeof packageJsonParsed !== 'object' || packageJsonParsed === null) {
    throw new TypeError('package.json should be an object')
  }

  if (!('scripts' in packageJsonParsed)) {
    throw new Error('package.json does not have scripts')
  }

  const scripts = packageJsonParsed.scripts

  if (
    typeof scripts !== 'object' ||
    scripts === null ||
    Array.isArray(scripts)
  ) {
    throw new TypeError('package.json scripts should be an record')
  }

  const tasks = Object.keys(scripts)

  return filterTasksFromGlobPatterns(taskPatterns, tasks)
}
