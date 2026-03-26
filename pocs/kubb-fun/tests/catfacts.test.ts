import client from '@kubb/plugin-client/clients/axios'
import { getRandomFact } from '../src/gen/clients/getRandomFact'
import { getFacts } from '../src/gen/clients/getFacts'
import { getBreeds } from '../src/gen/clients/getBreeds'

beforeAll(() => {
  client.setConfig({ baseURL: 'https://catfact.ninja' })
})

describe('Cat Facts API via Kubb generated client', () => {

  test('getRandomFact returns a fact with fact and length fields', async () => {
    const result = await getRandomFact(undefined, { baseURL: 'https://catfact.ninja' })
    expect(result).toBeDefined()
    expect(typeof result.fact).toBe('string')
    expect(result.fact.length).toBeGreaterThan(0)
    expect(typeof result.length).toBe('number')
    expect(result.length).toBe(result.fact.length)
    console.log('Random fact:', result.fact)
  })

  test('getRandomFact with max_length respects the limit', async () => {
    const maxLen = 50
    const result = await getRandomFact({ max_length: maxLen }, { baseURL: 'https://catfact.ninja' })
    expect(result).toBeDefined()
    expect(result.fact.length).toBeLessThanOrEqual(maxLen)
    expect(result.length).toBeLessThanOrEqual(maxLen)
    console.log('Short fact:', result.fact)
  })

  test('getFacts returns paginated facts', async () => {
    const result = await getFacts({ limit: 5, page: 1 }, { baseURL: 'https://catfact.ninja' })
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.data!.length).toBeLessThanOrEqual(5)
    expect(result.current_page).toBe(1)
    expect(result.per_page).toBe(5)
    expect(result.total).toBeGreaterThan(0)
    result.data!.forEach(fact => {
      expect(typeof fact.fact).toBe('string')
      expect(typeof fact.length).toBe('number')
    })
    console.log(`Got ${result.data!.length} facts out of ${result.total} total`)
  })

  test('getFacts page 2 returns different facts than page 1', async () => {
    const page1 = await getFacts({ limit: 3, page: 1 }, { baseURL: 'https://catfact.ninja' })
    const page2 = await getFacts({ limit: 3, page: 2 }, { baseURL: 'https://catfact.ninja' })
    expect(page1.current_page).toBe(1)
    expect(page2.current_page).toBe(2)
    const facts1 = page1.data!.map(f => f.fact)
    const facts2 = page2.data!.map(f => f.fact)
    expect(facts1).not.toEqual(facts2)
    console.log('Page 1 first fact:', facts1[0])
    console.log('Page 2 first fact:', facts2[0])
  })

  test('getBreeds returns paginated breeds', async () => {
    const result = await getBreeds({ limit: 5, page: 1 }, { baseURL: 'https://catfact.ninja' })
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.data!.length).toBeLessThanOrEqual(5)
    expect(result.current_page).toBe(1)
    expect(result.total).toBeGreaterThan(0)
    result.data!.forEach(breed => {
      expect(typeof breed.breed).toBe('string')
      expect(typeof breed.country).toBe('string')
      expect(typeof breed.origin).toBe('string')
      expect(typeof breed.coat).toBe('string')
      expect(typeof breed.pattern).toBe('string')
    })
    console.log(`Got ${result.data!.length} breeds out of ${result.total} total`)
    console.log('Breeds:', result.data!.map(b => b.breed).join(', '))
  })

  test('getBreeds returns breed details with all fields populated', async () => {
    const result = await getBreeds({ limit: 1 }, { baseURL: 'https://catfact.ninja' })
    const breed = result.data![0]
    expect(breed.breed).toBeTruthy()
    expect(breed.country).toBeTruthy()
    expect(breed.origin).toBeTruthy()
    expect(breed.coat).toBeTruthy()
    expect(breed.pattern).toBeTruthy()
    console.log(`Breed: ${breed.breed}, Country: ${breed.country}, Origin: ${breed.origin}, Coat: ${breed.coat}, Pattern: ${breed.pattern}`)
  })
})
