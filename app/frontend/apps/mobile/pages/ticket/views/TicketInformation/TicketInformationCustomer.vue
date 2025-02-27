<!-- Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { useUserDetail } from '@mobile/entities/user/composables/useUserDetail'
import { useUserEdit } from '@mobile/entities/user/composables/useUserEdit'
import { useUsersTicketsCount } from '@mobile/entities/user/composables/useUserTicketsCount'
import { watchEffect, computed } from 'vue'
import CommonTicketStateList from '@mobile/components/CommonTicketStateList/CommonTicketStateList.vue'
import CommonObjectAttributes from '@mobile/components/CommonObjectAttributes/CommonObjectAttributes.vue'
import { useSessionStore } from '@shared/stores/session'
import CommonLoader from '@mobile/components/CommonLoader/CommonLoader.vue'
import CommonUserAvatar from '@shared/components/CommonUserAvatar/CommonUserAvatar.vue'
import CommonOrganizationsList from '@mobile/components/CommonOrganizationsList/CommonOrganizationsList.vue'
import { normalizeEdges } from '@shared/utils/helpers'
import { useTicketInformation } from './composable/useTicketInformation'

interface Props {
  internalId: number
}

defineProps<Props>()

const ticket = useTicketInformation()

const session = useSessionStore()
const {
  user,
  loading,
  objectAttributes,
  loadUser,
  loadAllSecondaryOrganizations,
} = useUserDetail()

watchEffect(() => {
  if (ticket.value) {
    loadUser(ticket.value.customer.internalId)
  }
})

const { openEditUserDialog } = useUserEdit()

const { getTicketData } = useUsersTicketsCount()
const ticketsData = computed(() => getTicketData(user.value))

const secondaryOrganizations = computed(() =>
  normalizeEdges(user.value?.secondaryOrganizations),
)
</script>

<template>
  <CommonLoader :loading="loading">
    <div v-if="user" class="mb-3 flex items-center gap-3">
      <CommonUserAvatar aria-hidden="true" size="normal" :entity="user" />
      <div>
        <h2 class="text-lg font-semibold">
          {{ user.fullname }}
        </h2>
        <h3 v-if="user.organization">
          <CommonLink
            :link="`/organizations/${user.organization.internalId}`"
            class="text-blue"
          >
            {{ user.organization.name }}
          </CommonLink>
        </h3>
      </div>
    </div>
  </CommonLoader>
  <div v-if="user">
    <CommonObjectAttributes
      :attributes="objectAttributes"
      :object="user"
      :skip-attributes="['firstname', 'lastname']"
    >
      <template v-if="session.hasPermission(['ticket.agent'])" #after-fields>
        <button
          type="button"
          class="p-4 text-blue"
          @click="openEditUserDialog(user!)"
        >
          {{ $t('Edit Customer') }}
        </button>
      </template>
    </CommonObjectAttributes>
    <CommonOrganizationsList
      :organizations="secondaryOrganizations.array"
      :total-count="secondaryOrganizations.totalCount"
      :disable-show-more="loading"
      :label="__('Secondary organizations')"
      @show-more="loadAllSecondaryOrganizations()"
    />
    <CommonTicketStateList
      v-if="ticketsData"
      :counts="ticketsData.count"
      :tickets-link-query="ticketsData.query"
    />
  </div>
</template>
