<template>
    <AppPage>
        <template v-slot:header>
            <AppPageHeader :title="$t('booking_describe')" icon="mdi-map-marker-alert-outline" />
        </template>

        <AppCard
            :title="$t('booking_title')"
            @submit="saveAction.execute(500)"
            :validation-schema="userUpdateSchema"
            :initial-values="form"
            is-form
        >
            <template #default>
                <div class="q-pa-md">
                    <div class="q-gutter-md">
                        <q-date landscape v-model="date" :events="events" :locale="locale" />
                    </div>
                </div>
            </template>

            <template #actions>
                <q-space />

                <q-btn
                    icon="mdi-check"
                    :label="$t('save')"
                    type="submit"
                    :loading="saveAction.isLoading"
                    :disable="saveAction.isLoading"
                    color="primary"
                    rounded
                />
            </template>
        </AppCard>
    </AppPage>
</template>

<script setup lang="ts">
import { api, usePromiseState, ResponseError } from '@/common';
import { userUpdateSchema } from '@workspace/shared';

const date = ref('2019/02/01');
const events = ref(['2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23']);

const locale = ref({
    /* starting with Sunday */
    days: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    daysShort: '日_一_二_三_四_五_六'.split('_'),
    months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
    format24h: true,
    pluralDay: 'dias',
});

const form = reactive<any>({
    firstName: '',
    lastName: '',
    position: '',
    password: '',
    isActive: true,
});

const saveAction = usePromiseState<void, ResponseError>(async () => {
    // const { data } = await api.users.updateOne(userAction.state.id, form);

    console.log('🐉🐉🐉 - saveAction - data:');
    // loadForm(data);
    // $q.notify({
    //     icon: 'mdi-check',
    //     color: 'positive',
    //     message: t('saved_successfully'),
    //     timeout: 1000,
    // });
});
</script>
