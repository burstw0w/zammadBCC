// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import headerTitle from '@common/router/guards/after/headerTitle'
import { createTestingPinia } from '@pinia/testing'
import { RouteLocationNormalized } from 'vue-router'
import { nextTick } from 'vue'
import useMetaTitle from '@common/composables/useMetaTitle'
import useApplicationStore from '@common/stores/application'

describe('headerTitle', () => {
  createTestingPinia({ createSpy: vi.fn })
  useApplicationStore().config.product_name = 'Zammad'

  const from = {} as RouteLocationNormalized

  beforeEach(() => {
    useMetaTitle().initializeMetaTitle()
  })

  it('should change the header title from the route meta data', async () => {
    expect.assertions(2)
    const to = {
      name: 'TicketOverview',
      path: '/tickets',
      meta: {
        title: 'Ticket Overview',
        requiresAuth: true,
      },
    } as RouteLocationNormalized

    expect(document.title).toEqual('Zammad')

    headerTitle(to, from)

    await nextTick()

    expect(document.title).toEqual('Zammad - Ticket Overview')
  })
})