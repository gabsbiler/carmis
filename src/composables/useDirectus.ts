import { authentication, createDirectus, readMe, rest } from '@directus/sdk'

export const client = createDirectus('https://apicarmis.gabsbiler.com/')
  .with(rest({ credentials: 'include' }))
  .with(authentication('cookie', { credentials: 'include' }))

export const getCurrentUser = async () => {
  return await client.request(
    readMe({
      fields: ['*'],
    }),
  )
}
