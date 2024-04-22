<script setup lang="ts">
import { aggregate, deleteItem, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const partsOrders = ref()
const loading = ref(false)
const router = useRouter()

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
        fields: ['*', 'part.*'],
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

const deletePartOrder = async (id: number) => {
  try {
    const response = await client.request(deleteItem('PartOrders', id))

    console.log(response)
    fetchParts(tableSettings.value)
  }
  catch (e) {
    console.log(e)
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
          <div>
            <AddPartOrdersDialog @part-order-saved="fetchParts(tableSettings)" />
          </div>
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
        >
          <template #item.status="{ item }">
            <VChip
              :color="item.status === 'arrived' ? 'success'
                : item.status === 'waiting' ? 'warning'
                  : ''"
            >
              {{ item.status === 'arrived' ? 'Arrived'
                : item.status === 'waiting' ? 'Waiting'
                  : '' }}
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <VBtn
              variant="text"
              icon="ri-eye-line"
              density="compact"
              @click="router.push(`/part-orders/${item.id}`)"
            />
            <VBtn
              variant="text"
              icon="ri-delete-bin-line"
              density="compact"
              @click="deletePartOrder(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>
  </div>
</template>
