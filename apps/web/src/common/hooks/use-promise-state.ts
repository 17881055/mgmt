import { timeout } from '@workspace/shared';
import { reactive, ref, shallowRef } from 'vue';
import { createEventHook, EventHookOn } from '@vueuse/core';

export interface UsePromiseStateRetrun<TResult, TError, TPayload> {
    isReady: boolean;
    isLoading: boolean;
    counter: number;
    startTime: number;
    endTime: number;
    state: TResult;
    error: TError;
    onError: EventHookOn<TError>;
    execute: (delay?: number, payload?: TPayload) => Promise<TResult>;
}

/**
 * 创建一个响应式状态管理钩子，用于处理 Promise 的执行和状态跟踪。
 *
 * @typeParam TResult - Promise 成功时返回的结果类型。
 * @typeParam TError - Promise 失败时抛出的错误类型，默认为 `unknown`。
 * @typeParam TPayload - 传递给 Promise 函数的负载参数类型，默认为 `any`。
 *
 * @param promise - 一个返回 Promise 的函数，接收可选的负载参数 `payload`。
 * @param onError - 一个可选的错误处理函数，当 Promise 执行失败时调用。
 *
 * @returns 一个包含 Promise 执行状态和控制方法的对象。
 */
export function usePromiseState<TResult, TError = unknown, TPayload = any>(
    promise: (payload?: any) => Promise<TResult>,
    onError?: (e: TError) => void
): UsePromiseStateRetrun<TResult, TError, TPayload> {
    const isReady = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const counter = ref<number>(0);
    const startTime = ref<number>(undefined);
    const endTime = ref<number>(undefined);

    const state = shallowRef<TResult>(undefined);
    const error = shallowRef<TError>(undefined);

    const errorEvent = createEventHook<TError>();
    if (onError) errorEvent.on(onError);

    async function execute(delay?: number, payload?: TPayload): Promise<TResult> {
        isReady.value = false;
        isLoading.value = true;
        startTime.value = Date.now();
        endTime.value = undefined;
        error.value = undefined;

        try {
            if (delay > 0) await timeout(delay);

            const data = await promise(payload);
            state.value = data;
            isReady.value = true;
            counter.value++;
        } catch (e) {
            error.value = e as TError;
            errorEvent.trigger(error.value);
        } finally {
            isLoading.value = false;
            endTime.value = Date.now();
        }

        return state.value;
    }

    return reactive({
        isReady,
        isLoading,
        counter,
        startTime,
        endTime,
        state,
        error,
        onError: errorEvent.on,
        execute,
    });
}
