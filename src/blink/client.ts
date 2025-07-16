import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'school-pickup-manager-ot6ubhqd',
  authRequired: true
})

export default blink