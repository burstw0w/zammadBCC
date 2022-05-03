// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import { nextTick } from 'vue'
import CommonNotifications from '@common/components/common/CommonNotifications.vue'
import { NotificationTypes } from '@common/types/notification'
import useNotifications from '@common/composables/useNotifications'
import {
  renderComponent,
  type ExtendedRenderResult,
} from '@tests/support/components'
import { waitForTimeout } from '@tests/support/utils'

let wrapper: ExtendedRenderResult

const message = 'Test Notification'
beforeEach(() => {
  const { clearAllNotifications } = useNotifications()
  clearAllNotifications()

  wrapper = renderComponent(CommonNotifications, { shallow: false })
})

describe('CommonNotifications.vue', () => {
  it('renders notification with passed message', async () => {
    const { notify } = useNotifications()
    await notify({
      message,
      type: NotificationTypes.WARN,
    })

    expect(wrapper.getByTestId('notification')).toBeInTheDocument()
    expect(wrapper.getByTestId('notification')).toHaveTextContent(message)
  })

  it('automatically removes notification after timeout', async () => {
    const { notify } = useNotifications()

    await notify({
      message,
      type: NotificationTypes.WARN,
      durationMS: 10,
    })

    await waitForTimeout(20)

    expect(wrapper.queryByTestId('notification')).not.toBeInTheDocument()
  })

  it('does not remove persistent notifications', async () => {
    const { notify } = useNotifications()

    await notify({
      message,
      type: NotificationTypes.WARN,
      durationMS: 10,
      persistent: true,
    })

    await waitForTimeout(20)

    expect(wrapper.getByTestId('notification')).toBeInTheDocument()
  })

  it('executes a callback on click', async () => {
    expect.assertions(2)

    const { notify } = useNotifications()

    let test = false

    await notify({
      message,
      type: NotificationTypes.WARN,
      callback: () => {
        expect(test).toBe(false)
        test = true
      },
    })
    await wrapper.events.click(wrapper.getByText(message))
    expect(test).toBe(true)
  })

  it('renders multiple notifications at the same time', async () => {
    const { notify, notifications } = useNotifications()

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    expect(wrapper.getAllByTestId('notification')).toHaveLength(3)
  })

  it('clears all notifications', async () => {
    const { notify, notifications, clearAllNotifications } = useNotifications()

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    await notify({
      message: `${message} - ${notifications.value.length}`,
      type: NotificationTypes.WARN,
    })

    clearAllNotifications()
    await nextTick()
    expect(notifications.value).toHaveLength(0)
    expect(wrapper.queryAllByTestId('notification')).toHaveLength(0)
  })

  it('renders notification with icon', async () => {
    const { notify } = useNotifications()
    await notify({
      message,
      type: NotificationTypes.WARN,
    })

    expect(wrapper.getIconByName('info')).toBeInTheDocument()
  })
})