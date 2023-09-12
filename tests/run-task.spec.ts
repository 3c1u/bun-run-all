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
})
