<!-- Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
/* eslint-disable zammad/zammad-detect-translatable-string */

import Form from '@shared/components/Form/Form.vue'
import { defineFormSchema } from '@mobile/form/defineFormSchema'
import { useDialog } from '@shared/composables/useDialog'
import CommonButtonGroup from '@mobile/components/CommonButtonGroup/CommonButtonGroup.vue'
import { useUserCreate } from '@mobile/entities/user/composables/useUserCreate'
import CommonStepper from '@mobile/components/CommonStepper/CommonStepper.vue'
import { ref } from 'vue'

const linkSchemaRaw = [
  {
    type: 'textarea',
    name: 'textarea',
    label: 'Textarea',
  },
  {
    type: 'toggle',
    name: 'toggle',
    label: 'Toggle',
    required: true,
    // disabled: true,
    props: {
      value: false,
      variants: {
        true: 'Yes',
        false: 'No',
      },
    },
  },
  {
    type: 'text',
    name: 'some_input',
    label: 'Input',
    disabled: true,
    required: true,
  },
  {
    type: 'textarea',
    name: 'select',
    label: 'Textarea',
    required: true,
  },
  {
    type: 'text',
    name: 'some_input_link',
    label: 'Linked',
    props: {
      link: '/',
    },
  },
  {
    type: 'date',
    name: 'some_input_date',
    label: 'Date',
    props: {
      link: '/',
    },
  },
  {
    type: 'date',
    name: 'some_input_2',
    label: 'Date 2',
  },
  {
    type: 'tags',
    name: 'tags',
    label: 'Tags',
    props: {
      link: '/',
      options: [
        { label: 'test', value: 'test' },
        { label: 'support', value: 'support' },
        { label: 'paid', value: 'paid' },
        { label: 'paid2', value: 'paid2' },
        { label: 'paid3', value: 'paid3' },
        { label: 'paid4', value: 'paid4' },
        { label: 'paid5', value: 'paid5' },
        { label: 'paid6', value: 'paid6' },
        { label: 'paid7', value: 'paid7' },
        { label: 'paid8', value: 'paid8' },
        { label: 'paid9', value: 'paid9' },
        { label: 'paid10', value: 'paid10' },
        { label: 'paid11', value: 'paid11' },
      ],
      canCreate: true,
    },
  },
  {
    type: 'treeselect',
    name: 'treeselect',
    label: 'TreeSelect',
    value: [0, 3, 5, 6, 1, 2, 8, 7],
    props: {
      clearable: true,
      multiple: true,
      options: [
        {
          value: 0,
          label: 'Item A',
          children: [
            {
              value: 1,
              label: 'Item 1',
              children: [
                {
                  value: 2,
                  label: 'Item I',
                },
                {
                  value: 3,
                  label: 'Item II',
                },
                {
                  value: 4,
                  label: 'Item III',
                },
              ],
            },
            {
              value: 5,
              label: 'Item 2',
              children: [
                {
                  value: 6,
                  label: 'Item IV',
                },
              ],
            },
            {
              value: 7,
              label: 'Item 3',
            },
          ],
        },
        {
          value: 8,
          label: 'Item B',
        },
        {
          value: 9,
          label: 'Ítem C',
        },
      ],
      link: '/tickets',
    },
  },
  {
    type: 'treeselect',
    name: 'treeselect_2',
    label: 'TreeSelect 2',
    props: {
      link: '/',
      options: [
        {
          value: 0,
          label: 'Item A',
        },
      ],
    },
  },
  {
    type: 'select',
    name: 'select_1',
    label: 'Select 1',
    disabled: true,
    props: {
      link: '/',
      options: [
        {
          value: 0,
          label: 'Item A',
        },
      ],
    },
  },
  {
    type: 'select',
    name: 'select_2',
    label: 'Select 2',
    props: {
      link: '/',
      multiple: true,
      options: [
        {
          value: 0,
          label: 'Item A',
        },
        {
          value: 1,
          label: 'Item B',
        },
        {
          value: 2,
          label: 'Item C',
        },
      ],
    },
  },
  {
    type: 'autocomplete',
    name: 'autocomplete',
    label: 'AutoComplete',
    props: {
      sorting: 'label',
      link: '/tickets',
      action: '/tickets',
      actionIcon: 'mobile-new-customer',
      gqlQuery: `
query autocompleteSearchUser($query: String!, $limit: Int) {
  autocompleteSearchUser(query: $query, limit: $limit) {
    value
    label
    labelPlaceholder
    heading
    headingPlaceholder
    disabled
    icon
  }
}
`,
    },
  },
  {
    type: 'recipient',
    name: 'recipient',
    label: 'Recipient',
    props: {
      gqlQuery: `
query autocompleteSearchUser($query: String!, $limit: Int) {
  autocompleteSearchUser(query: $query, limit: $limit) {
    value
    label
    labelPlaceholder
    heading
    headingPlaceholder
    disabled
    icon
  }
}
`,
    },
  },
  {
    type: 'organization',
    name: 'organization',
    label: 'Organization',
    props: {
      gqlQuery: `
query autocompleteSearchUser($query: String!, $limit: Int) {
  autocompleteSearchUser(query: $query, limit: $limit) {
    value
    label
    labelPlaceholder
    heading
    headingPlaceholder
    disabled
    icon
  }
}
`,
    },
  },
  {
    type: 'customer',
    name: 'customer',
    label: 'Customer',
    props: {
      gqlQuery: `
query autocompleteSearchUser($query: String!, $limit: Int) {
  autocompleteSearchUser(query: $query, limit: $limit) {
    value
    label
    labelPlaceholder
    heading
    headingPlaceholder
    disabled
    icon
  }
}
`,
    },
  },
]
const linkSchemas = defineFormSchema(linkSchemaRaw)

const schema = defineFormSchema([
  {
    isLayout: true,
    component: 'FormGroup',
    children: [
      {
        type: 'file',
        name: 'file',
        // label: 'File',
      },
    ],
  },
])

const dialog = useDialog({
  name: 'dialog',
  component: () => import('@mobile/components/CommonDialog/CommonDialog.vue'),
})

const { openCreateUserDialog } = useUserCreate()

const currentStep = ref('step2')
const steps = {
  step1: {
    label: '1',
    order: 1,
    errorCount: 0,
    valid: true,
    disabled: false,
    completed: true,
  },
  step2: {
    label: '2',
    order: 2,
    errorCount: 0,
    valid: true,
    disabled: true,
    completed: false,
  },
  step3: {
    label: '3',
    order: 3,
    errorCount: 0,
    valid: true,
    completed: true,
    disabled: true,
  },
  step4: {
    label: '4',
    order: 4,
    errorCount: 3,
    valid: false,
    completed: false,
    disabled: true,
  },
}
</script>

<template>
  <div class="p-4">
    <button @click="dialog.toggle({ name: 'dialog', label: 'Hello World' })">
      Dialog
    </button>

    <CommonStepper v-model="currentStep" class="mx-20" :steps="steps" />

    <!-- TODO where to put this? -->
    <button @click="openCreateUserDialog()">Create user</button>

    <CommonButtonGroup
      class="py-4"
      mode="full"
      model-value="subscribe"
      :options="[
        { label: 'Merge tickets', icon: 'mobile-home' },
        { label: 'Subscribe', icon: 'mobile-home', value: 'subscribe' },
        { label: 'Ticket info', icon: 'mobile-home' },
      ]"
    />

    <Form :schema="linkSchemas" />
    <Form :schema="schema" />

    <FormKit
      type="radio"
      :buttons="true"
      :options="[
        { label: 'Incoming Phone', value: 1, icon: 'mobile-phone-in' },
        { label: 'Outgoing Phone', value: 2, icon: 'mobile-phone-out' },
        { label: 'Send Email', value: 3, icon: 'mobile-mail-out' },
      ]"
    />
  </div>
</template>
