# bun-run-all

[![npm version](https://img.shields.io/npm/v/@3c1u/bun-run-all)](https://www.npmjs.com/package/@3c1u/bun-run-all)
[![Downloads/month](https://img.shields.io/npm/dm/@3c1u/bun-run-all)](http://www.npmtrends.com/@3c1u/bun-run-all)


Bun version of [npm-run-all](https://github.com/mysticatea/npm-run-all). No node required.

## Installation

```sh
bun i -D @3c1u/bun-run-all
```

## Usage

### run-p

```
Usage: run-p [options] <tasks...>

Runs tasks in parallel.

Options:
  -c, --continue-on-error      Continue on error
  -j, --max-parallel <number>  Max concurrency (default: "4")
  --aggregate-output           Aggregates the output of all tasks by throttling
  -l, --print-label            Prepends the task name to its output
  -n, --print-name             Prints the task name before running it
  -r, --race                   Kills all tasks if one finishes successfully
  -s, --silent                 Suppresses all output
  -h, --help                   display help for command
```

### run-s

```
Usage: run-s [options] <tasks...>

Runs tasks sequentially.

Options:
  -c, --continue-on-error  Continue on error
  -l, --print-label        Prepends the task name to its output
  -n, --print-name         Prints the task name before running it
  -s, --silent             Suppresses all output
  -h, --help               display help for command
```

### npm-run-all

```
Usage: npm-run-all [options] <tasks...>

Runs tasks in parallel or sequentially.

Options:
  -p, --parallel               Run tasks in parallel (default: true)
  -s, --sequential             Run tasks sequentially
  -c, --continue-on-error      Continue on error
  -j, --max-parallel <number>  Max concurrency (default: "4")
  --aggregate-output           Aggregates the output of all tasks by throttling
  -l, --print-label            Prepends the task name to its output
  -n, --print-name             Prints the task name before running it
  -r, --race                   Kills all tasks if one finishes successfully
  -s, --silent                 Suppresses all output
  -h, --help                   display help for command
```

## Known Limitations

Since this is under development, there are some limitations:

- Some options are not supported.
  - `--aggregate-output`
  - `--print-label`
  - `--print-name`
  - `--silent` option is not supported.
  - `--race` option is not supported.
- Combination of sequential and parallel tasks is not supported in `npm-run-all`.
  - e.g. `npm-run-all a b --parallel c d --sequential e f --parallel g h i`
- Does not emit errors when a task is not found.

## License

Licensed under the MIT License.
