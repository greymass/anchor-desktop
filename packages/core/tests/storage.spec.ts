import {expect, test} from 'vitest'
import {createStorage} from '../src/modules/storage'

test('Should create storage', async () => {
    const storage = createStorage()
    expect(storage).toBeDefined()
    expect(storage.store).toBeDefined()
    expect(storage.store.size).toBe(0)
    expect(storage.store.path).toBeDefined()
})

test('Should store and remove values', async () => {
    const storage = createStorage()
    storage.set('foo', 'bar')
    expect(storage.get('foo')).toBe('bar')
    storage.remove('foo')
    expect(storage.get('foo')).toBe(null)
})

test('Should update values', async () => {
    const storage = createStorage()
    storage.set('foo', 'bar')
    expect(storage.get('foo')).toBe('bar')
    storage.set('foo', 'baz')
    expect(storage.get('foo')).toBe('baz')
    storage.remove('foo')
    expect(storage.get('foo')).toBe(null)
})
