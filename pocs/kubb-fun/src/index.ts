import client from '@kubb/plugin-client/clients/axios'
import { getRandomFact } from './gen/clients/getRandomFact'
import { getFacts } from './gen/clients/getFacts'
import { getBreeds } from './gen/clients/getBreeds'

const config = { baseURL: 'https://catfact.ninja' }
client.setConfig(config)

async function main() {
  const fact = await getRandomFact(undefined, config)
  console.log('Random Cat Fact:', fact.fact)
  console.log('Length:', fact.length)
  console.log()

  const facts = await getFacts({ limit: 3 }, config)
  console.log('First 3 Cat Facts:')
  facts.data?.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.fact}`)
  })
  console.log()

  const breeds = await getBreeds({ limit: 5 }, config)
  console.log('First 5 Cat Breeds:')
  breeds.data?.forEach((b, i) => {
    console.log(`  ${i + 1}. ${b.breed} (${b.country}) - ${b.coat} coat, ${b.pattern} pattern`)
  })
}

main().catch(console.error)
