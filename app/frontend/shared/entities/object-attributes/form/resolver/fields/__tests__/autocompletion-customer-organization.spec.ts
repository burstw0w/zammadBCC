// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import { FieldResolverAutocompletionCustomerOrganization } from '../autocompletion-customer-organization'

describe('FieldResolverAutocompletionCustomerOrganization', () => {
  it('should return the correct field attributes', () => {
    const fieldResolver = new FieldResolverAutocompletionCustomerOrganization({
      dataType: 'user_autocempletion',
      name: 'organization',
      display: 'Organization',
      dataOption: {
        // TODO ...
        belongs_to: 'organization',
      },
      isInternal: true,
    })

    expect(fieldResolver.fieldAttributes()).toEqual({
      label: 'Organization',
      name: 'organization',
      required: false,
      props: {
        belongsToObjectField: 'organization',
      },
      type: 'organization',
      internal: true,
    })
  })
})
