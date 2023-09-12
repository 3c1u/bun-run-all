import { describe, expect, test } from 'bun:test'
import { runTask } from '../src/run-task'

describe('runTask', () => {
  test('should run an npm task', async () => {
    const result = await runTask('for-test:hoge', {
      stdout: 'pipe',
    })
    const stdout = await new Response(result.stdout).text()

    expect(result.exitCode).toBe(0)
    expect(stdout).toBe('hoge\n')
  })

  test('process should abort when an abort signal is triggered', async () => {
    const controller = new AbortController()
    const resultPromise = runTask('for-test:sleep', {
      signal: controller.signal,
    })

    setTimeout(() => {
      controller.abort()
    }, 100)

    const result = await resultPromise

    expect(result.killed).toBe(true)
  })
})
