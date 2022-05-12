import {describe, expect, test} from 'vitest'
import {writable} from '../types/writable'
// import {writable} from 'svelte/store'

/**
 * This file is a copy of the tests from sveltejs to ensure compatibility with modified stores
 *
 * source: https://github.com/sveltejs/svelte/blob/master/test/store/index.ts
 */

describe('store', () => {
    describe('writable', () => {
        test('creates a writable store', () => {
            const count = writable(0)
            const values = []

            const unsubscribe = count.subscribe((value) => {
                values.push(value)
            })

            count.set(1)
            count.update((n) => n + 1)

            unsubscribe()

            count.set(3)
            count.update((n) => n + 1)

            expect(values).toEqual([0, 1, 2])
        })

        test('creates an undefined writable store', () => {
            const store = writable()
            const values = []

            const unsubscribe = store.subscribe((value) => {
                values.push(value)
            })

            unsubscribe()
            expect(values).toEqual([undefined])
        })

        test('calls provided subscribe handler', () => {
            let called = 0

            const store = writable(0, () => {
                called += 1
                return () => (called -= 1)
            })

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const unsubscribe1 = store.subscribe(() => {})
            expect(called).toEqual(1)

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const unsubscribe2 = store.subscribe(() => {})
            expect(called).toEqual(1)

            unsubscribe1()
            expect(called).toEqual(1)

            unsubscribe2()
            expect(called).toEqual(0)
        })

        test('does not assume immutable data', () => {
            const obj = {}
            let called = 0

            const store = writable(obj)

            store.subscribe(() => {
                called += 1
            })

            store.set(obj)
            expect(called).toEqual(2)

            store.update((obj) => obj)
            expect(called).toEqual(3)
        })

        test('only calls subscriber once initially, including on resubscriptions', () => {
            let num = 0
            const store = writable(num, (set) => set((num += 1)))

            let count1 = 0
            let count2 = 0

            store.subscribe(() => (count1 += 1))()
            expect(count1).toEqual(1)

            const unsubscribe = store.subscribe(() => (count2 += 1))
            expect(count2).toEqual(1)

            unsubscribe()
        })
    })

    // describe('readable', () => {
    //     test('creates a readable store', () => {
    //         let running
    //         let tick

    //         const store = readable(undefined, (set) => {
    //             tick = set
    //             running = true

    //             set(0)

    //             return () => {
    //                 tick = () => {}
    //                 running = false
    //             }
    //         })

    //         assert.ok(!running)

    //         const values = []

    //         const unsubscribe = store.subscribe((value) => {
    //             values.push(value)
    //         })

    //         assert.ok(running)
    //         tick(1)
    //         tick(2)

    //         unsubscribe()

    //         assert.ok(!running)
    //         tick(3)
    //         tick(4)

    //         assert.deepEqual(values, [0, 1, 2])
    //     })

    //     test('creates an undefined readable store', () => {
    //         const store = readable()
    //         const values = []

    //         const unsubscribe = store.subscribe((value) => {
    //             values.push(value)
    //         })

    //         unsubscribe()

    //         assert.deepEqual(values, [undefined])
    //     })

    //     test('creates a readable store without updater', () => {
    //         const store = readable(100)
    //         const values = []

    //         const unsubscribe = store.subscribe((value) => {
    //             values.push(value)
    //         })

    //         unsubscribe()

    //         assert.deepEqual(values, [100])
    //     })
    // })

    // const fake_observable = {
    //     subscribe(fn) {
    //         fn(42)
    //         return {
    //             unsubscribe: () => {},
    //         }
    //     },
    // }

    // describe('derived', () => {
    //     test('maps a single store', () => {
    //         const a = writable(1)
    //         const b = derived(a, (n) => n * 2)

    //         const values = []

    //         const unsubscribe = b.subscribe((value) => {
    //             values.push(value)
    //         })

    //         a.set(2)
    //         assert.deepEqual(values, [2, 4])

    //         unsubscribe()

    //         a.set(3)
    //         assert.deepEqual(values, [2, 4])
    //     })

    //     test('maps multiple stores', () => {
    //         const a = writable(2)
    //         const b = writable(3)
    //         const c = derived([a, b], ([a, b]) => a * b)

    //         const values = []

    //         const unsubscribe = c.subscribe((value) => {
    //             values.push(value)
    //         })

    //         a.set(4)
    //         b.set(5)
    //         assert.deepEqual(values, [6, 12, 20])

    //         unsubscribe()

    //         a.set(6)
    //         assert.deepEqual(values, [6, 12, 20])
    //     })

    //     test('passes optional set function', () => {
    //         const number = writable(1)
    //         const evens = derived(
    //             number,
    //             (n, set) => {
    //                 if (n % 2 === 0) set(n)
    //             },
    //             0
    //         )

    //         const values = []

    //         const unsubscribe = evens.subscribe((value) => {
    //             values.push(value)
    //         })

    //         number.set(2)
    //         number.set(3)
    //         number.set(4)
    //         number.set(5)
    //         assert.deepEqual(values, [0, 2, 4])

    //         unsubscribe()

    //         number.set(6)
    //         number.set(7)
    //         number.set(8)
    //         assert.deepEqual(values, [0, 2, 4])
    //     })

    //     test('prevents glitches', () => {
    //         const lastname = writable('Jekyll')
    //         const firstname = derived(lastname, (n) => (n === 'Jekyll' ? 'Henry' : 'Edward'))

    //         const fullname = derived([firstname, lastname], (names) => names.join(' '))

    //         const values = []

    //         const unsubscribe = fullname.subscribe((value) => {
    //             values.push(value)
    //         })

    //         lastname.set('Hyde')

    //         assert.deepEqual(values, ['Henry Jekyll', 'Edward Hyde'])

    //         unsubscribe()
    //     })

    //     test('prevents diamond dependency problem', () => {
    //         const count = writable(0)
    //         const values = []

    //         const a = derived(count, ($count) => {
    //             return 'a' + $count
    //         })

    //         const b = derived(count, ($count) => {
    //             return 'b' + $count
    //         })

    //         const combined = derived([a, b], ([a, b]) => {
    //             return a + b
    //         })

    //         const unsubscribe = combined.subscribe((v) => {
    //             values.push(v)
    //         })

    //         assert.deepEqual(values, ['a0b0'])

    //         count.set(1)
    //         assert.deepEqual(values, ['a0b0', 'a1b1'])

    //         unsubscribe()
    //     })

    //     test('derived dependency does not update and shared ancestor updates', () => {
    //         const root = writable({a: 0, b: 0})
    //         const values = []

    //         const a = derived(root, ($root) => {
    //             return 'a' + $root.a
    //         })

    //         const b = derived([a, root], ([$a, $root]) => {
    //             return 'b' + $root.b + $a
    //         })

    //         const unsubscribe = b.subscribe((v) => {
    //             values.push(v)
    //         })

    //         assert.deepEqual(values, ['b0a0'])

    //         root.set({a: 0, b: 1})
    //         assert.deepEqual(values, ['b0a0', 'b1a0'])

    //         unsubscribe()
    //     })

    //     test('is updated with safe_not_equal logic', () => {
    //         const arr = [0]

    //         const number = writable(1)
    //         const numbers = derived(number, ($number) => {
    //             arr[0] = $number
    //             return arr
    //         })

    //         const concatenated = []

    //         const unsubscribe = numbers.subscribe((value) => {
    //             concatenated.push(...value)
    //         })

    //         number.set(2)
    //         number.set(3)

    //         assert.deepEqual(concatenated, [1, 2, 3])

    //         unsubscribe()
    //     })

    //     test('calls a cleanup function', () => {
    //         const num = writable(1)

    //         const values = []
    //         const cleaned_up = []

    //         const d = derived(num, ($num, set) => {
    //             set($num * 2)

    //             return function cleanup() {
    //                 cleaned_up.push($num)
    //             }
    //         })

    //         num.set(2)

    //         const unsubscribe = d.subscribe((value) => {
    //             values.push(value)
    //         })

    //         num.set(3)
    //         num.set(4)

    //         assert.deepEqual(values, [4, 6, 8])
    //         assert.deepEqual(cleaned_up, [2, 3])

    //         unsubscribe()

    //         assert.deepEqual(cleaned_up, [2, 3, 4])
    //     })

    //     test('discards non-function return values', () => {
    //         const num = writable(1)

    //         const values = []

    //         const d = derived(num, ($num, set) => {
    //             set($num * 2)
    //             return {}
    //         })

    //         num.set(2)

    //         const unsubscribe = d.subscribe((value) => {
    //             values.push(value)
    //         })

    //         num.set(3)
    //         num.set(4)

    //         assert.deepEqual(values, [4, 6, 8])

    //         unsubscribe()
    //     })

    //     test('allows derived with different types', () => {
    //         const a = writable('one')
    //         const b = writable(1)
    //         const c = derived([a, b], ([a, b]) => `${a} ${b}`)

    //         assert.deepEqual(get(c), 'one 1')

    //         a.set('two')
    //         b.set(2)
    //         assert.deepEqual(get(c), 'two 2')
    //     })

    //     test('works with RxJS-style observables', () => {
    //         const d = derived(fake_observable, (_) => _)
    //         assert.equal(get(d), 42)
    //     })
    // })

    // describe('get', () => {
    //     test('gets the current value of a store', () => {
    //         const store = readable(42, () => {})
    //         assert.equal(get(store), 42)
    //     })

    //     test('works with RxJS-style observables', () => {
    //         assert.equal(get(fake_observable), 42)
    //     })
    // })
})
