// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import type { Ref, WatchStopHandle } from 'vue'
import { watch } from 'vue'
import type {
  FetchMoreOptions,
  FetchMoreQueryOptions,
  OperationVariables,
  SubscribeToMoreOptions,
} from '@apollo/client/core'
import type {
  OperationQueryOptionsReturn,
  OperationQueryResult,
  WatchResultCallback,
} from '@shared/types/server/apollo/handler'
import type { ReactiveFunction } from '@shared/types/utils'
import type { UseQueryReturn } from '@vue/apollo-composable'
import BaseHandler from './BaseHandler'

// eslint-disable-next-line no-use-before-define
export const handlers: QueryHandler[] = []

export default class QueryHandler<
  TResult = OperationQueryResult,
  TVariables = OperationVariables,
> extends BaseHandler<
  TResult,
  TVariables,
  UseQueryReturn<TResult, TVariables>
> {
  private firstResultLoaded = false

  public options(): OperationQueryOptionsReturn<TResult, TVariables> {
    return this.operationResult.options
  }

  public result(): Ref<TResult | undefined> {
    return this.operationResult.result
  }

  public subscribeToMore<
    TSubscriptionVariables = TVariables,
    TSubscriptionData = TResult,
  >(
    options:
      | SubscribeToMoreOptions<
          TResult,
          TSubscriptionVariables,
          TSubscriptionData
        >
      | ReactiveFunction<
          SubscribeToMoreOptions<
            TResult,
            TSubscriptionVariables,
            TSubscriptionData
          >
        >,
  ): void {
    return this.operationResult.subscribeToMore(options)
  }

  public fetchMore(
    options: FetchMoreQueryOptions<TVariables, TResult> &
      FetchMoreOptions<TResult, TVariables>,
  ): Promise<Maybe<TResult>> {
    return new Promise((resolve, reject) => {
      const fetchMore = this.operationResult.fetchMore(options)

      if (!fetchMore) {
        resolve(null)
        return
      }

      fetchMore
        .then((result) => {
          resolve(result.data)
        })
        .catch(() => {
          reject(this.operationError().value)
        })
    })
  }

  public refetch(variables?: TVariables): Promise<Maybe<TResult>> {
    return new Promise((resolve, reject) => {
      const refetch = this.operationResult.refetch(variables)

      if (!refetch) {
        resolve(null)
        return
      }

      refetch
        .then((result) => {
          resolve(result.data)
        })
        .catch(() => {
          reject(this.operationError().value)
        })
    })
  }

  public load(): void {
    if (
      typeof (this.operationResult as unknown as { load: () => void }).load !==
      'function'
    ) {
      return undefined
    }

    return (this.operationResult as unknown as { load: () => void }).load()
  }

  public start(): void {
    this.operationResult.start()
  }

  public stop(): void {
    this.firstResultLoaded = false
    this.operationResult.stop()
  }

  public abort() {
    this.operationResult.stop()
    this.operationResult.start()
  }

  public async onLoaded(
    triggerPossibleRefetch = false,
  ): Promise<Maybe<TResult>> {
    if (this.firstResultLoaded && triggerPossibleRefetch) {
      return this.refetch()
    }

    return new Promise((resolve, reject) => {
      let errorUnsubscribe!: () => void
      let resultUnsubscribe!: () => void

      const onFirstResultLoaded = () => {
        this.firstResultLoaded = true
        resultUnsubscribe()
        errorUnsubscribe()
      }

      resultUnsubscribe = watch(this.result(), (result) => {
        // After a variable change, the result will be reseted.
        if (result === undefined) return null

        // Remove the watchers again after the promise was resolved.
        onFirstResultLoaded()
        return resolve(result || null)
      })

      errorUnsubscribe = watch(this.operationError(), (error) => {
        onFirstResultLoaded()
        return reject(error)
      })
    })
  }

  public loadedResult(triggerPossibleRefetch = false): Promise<Maybe<TResult>> {
    return this.onLoaded(triggerPossibleRefetch)
      .then((data: Maybe<TResult>) => data)
      .catch((error) => error)
  }

  public watchOnceOnResult(callback: WatchResultCallback<TResult>) {
    const watchStopHandle = watch(
      this.result(),
      (result) => {
        if (!result) {
          return
        }
        callback(result)
        watchStopHandle()
      },
      {
        // Needed for when the component is mounted after the first mount, in this case
        // result will already contain the data and the watch will otherwise not be triggered.
        immediate: true,
      },
    )
  }

  public watchOnResult(
    callback: WatchResultCallback<TResult>,
  ): WatchStopHandle {
    return watch(
      this.result(),
      (result) => {
        if (!result) {
          return
        }
        callback(result)
      },
      {
        // Needed for when the component is mounted after the first mount, in this case
        // result will already contain the data and the watch will otherwise not be triggered.
        immediate: true,
      },
    )
  }
}
