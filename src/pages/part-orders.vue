<script setup lang="ts">
import { aggregate, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const partsOrders = ref()
const loading = ref(false)

const headers = [

  {
    title: 'Order Number',
    key: 'order_number',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Supplier',
    key: 'supplier',
  },
  {
    title: 'Ordered By',
    key: 'date_ordered',
  },
  {
    title: 'Arrived By',
    key: 'date_arrived',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const tableSettings = ref({
  itemsPerPage: 10,
  itemLength: 0,
  search: '',
  page: 1,
})

const fetchParts = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('PartOrders', {
        aggregate: { count: '*' },
      }),
    )

    const response = await client.request(
      readItems('PartOrders', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
      }),
    )

    console.log(response)

    tableSettings.value.itemLength = count[0].count

    partsOrders.value = response
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center  mx-1 mt-1">
        <h5 class="text-h5">
          Parts Orders
        </h5>
        <div
          style="min-inline-size: 300px;"
          class="d-flex align-center gap-x-3"
        >
          <VTextField
            v-model="tableSettings.search"
            label="Search"
          />
          <AddPartOrders />
        </div>
      </VCardTitle>
      <VCardText>
        <VDataTableServer
          v-model:items-per-page="tableSettings.itemsPerPage"
          :headers="headers"
          :items="partsOrders"
          :items-length="tableSettings.itemLength"
          :search="tableSettings.search"
          :loading="loading"
          @update:options="fetchParts"
        />
      </VCardText>
    </VCard>
  </div>
</template>
