import { Guru } from '.'

// placeholder test
describe('Guru class', () => {
    it('creates a Guru instance', () => {
        const guru = new Guru({
            email: 'example@company.com',
            token: 'xxxxxxxxxxxxxxxxxxxx',
        })

        expect(guru).toBeInstanceOf(Guru)
    })
})
