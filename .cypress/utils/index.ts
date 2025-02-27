// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import { merge } from 'lodash-es'
import initializeStore from '@shared/stores'
import initializeGlobalComponents from '@shared/initializer/globalComponents'
import initializeGlobalProperties from '@shared/initializer/globalProperties'
import initializeForm from '@mobile/form'

// imported only for types
// for some reason adding it to tsconfig doesn't work
import '@testing-library/cypress'
import 'cypress-real-events'
import '../types/commands'

import type { FormSchemaField } from '@shared/components/Form/types'
import { FormKit } from '@formkit/vue'
import type { mount } from 'cypress/vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { App } from 'vue'

const router = createRouter({
  history: createMemoryHistory('/'),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

export const mountComponent: typeof mount = (
  component: any,
  options: any,
): Cypress.Chainable => {
  const plugins = []
  plugins.push(initializeStore)
  plugins.push(initializeGlobalComponents)
  plugins.push(initializeGlobalProperties)
  plugins.push(initializeForm)
  plugins.push((app: App) => router.install(app))

  return cy.mount(component, merge({ global: { plugins } }, options))
}

export const mountFormField = (
  field: string,
  props?: Partial<FormSchemaField> & Record<string, unknown>,
) => {
  return mountComponent(FormKit, {
    props: {
      name: field,
      type: field,
      ...props,
    },
  })
}

interface CheckFormMatchOptions {
  subTitle?: string
  type?: string
  wrapperSelector?: string
}

export const checkFormMatchesSnapshot = (options?: CheckFormMatchOptions) => {
  const title = options?.subTitle ? `${Cypress.currentTest.title} - ${options.subTitle}` : Cypress.currentTest.title
  const wrapperSelector = options?.wrapperSelector || '.formkit-outer'

  return cy.wrap(document.fonts.ready).then(() => {
    cy.get(wrapperSelector).matchImage({
      title,
      imagesDir: options?.type ? `__image_snapshots__/${options.type}` : undefined,
    })
  })
}
