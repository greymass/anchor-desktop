import {tick} from 'svelte'
import {describe, expect, it} from 'vitest'
import Counter from '~/lib/Counter.svelte'

describe('Counter component', function () {
    it('creates an instance', function () {
        const host = document.createElement('div')
        document.body.appendChild(host)
        const instance = new Counter({target: host})
        expect(instance).toBeTruthy()
    })

    it('renders', function () {
        const host = document.createElement('div')
        document.body.appendChild(host)
        new Counter({target: host})
        expect(host.innerHTML).toContain('Clicks: 0')
    })

    it('updates count when clicking a button', async function () {
        const host = document.createElement('div')
        document.body.appendChild(host)
        new Counter({target: host})
        expect(host.innerHTML).toContain('Clicks: 0')
        const btn = host.getElementsByTagName('button')[0]
        btn.click()
        await tick()
        expect(host.innerHTML).toContain('Clicks: 1')
    })
})
