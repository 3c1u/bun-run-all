import { describe, expect, test } from 'bun:test'
import {
  filterTasksFromGlobPatterns,
  getTasksFromGlobPatterns,
} from '../src/task-glob'

describe('filterTasksFromGlobPatterns', () => {
  test('should parse wildcard pattern', () => {
    expect(
      filterTasksFromGlobPatterns(
        ['for-test:*'],
        ['for-test:hoge', 'for-test:fuga', 'for-test:piyo'],
      ),
    ).toEqual(['for-test:hoge', 'for-test:fuga', 'for-test:piyo'])
  })
})

describe('getTasksFromGlobPatterns', () => {
  test('should parse wildcard pattern', async () => {
    expect(await getTasksFromGlobPatterns(['for-test:*'])).toEqual([
      'for-test:hoge',
    ])
  })
})
