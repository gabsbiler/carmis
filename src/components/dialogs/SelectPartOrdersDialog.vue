<script setup lang="ts">
import { aggregate, deleteItem, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['select'])
const isDialogOpen = ref(false)
const partsOrders = ref()
const loading = ref(false)
const selected = ref([])

const select = item => {
  if (selected.value.includes(item)) {
    selected.value.splice(selected.value.indexOf(item, 1))
  }
  else {
    selected.value.push(item)
    console.log(item)
  }
}

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

const apply = () => {
  emits('select', selected.value)
  isDialogOpen.value = false
}
</script>

<template>
  <div>
    <VBtn
      variant="outlined"
      block
      @click="isDialogOpen = !isDialogOpen"
    >
      Select Part Order
    </VBtn>
    <VDialog v-model="isDialogOpen">
      <VCard class="mx-auto">
        <VCardTitle class="d-flex justify-space-between align-center  mx-1 mt-1">
          <h5 class="text-h5">
            Parts Orders
          </h5>
        </VCardTitle>
        <VCardText>
          <VTextField
            v-model="tableSettings.search"
            label="Search"
            class="mb-3"
          />
          <VDataTableServer
            v-model:items-per-page="tableSettings.itemsPerPage"
            :headers="headers"
            :items="partsOrders"
            :items-length="tableSettings.itemLength"
            :search="tableSettings.search"
            :loading="loading"
            @update:options="fetchParts"
          >
            <template #item.actions="{ item }">
              <VBtn
                variant="text"
                @click="select(item)"
              >
                {{ selected.includes(item) ? "Selected" : "Select" }}
              </VBtn>
              <VBtn
                variant="text"
                density="compact"
                @click="deletePartOrder(item.id)"
              >
                Delete
              </VBtn>
            </template>
          </VDataTableServer>
        </VCardText>
        <VCardActions class="mx-3 mb-3 mt-1">
          <div>
            <AddPartOrdersDialog @part-order-saved="fetchParts(tableSettings)" />
          </div>

          <VSpacer />
          <VBtn @click="isDialogOpen = !isDialogOpen">
            Cancel
          </VBtn>
          <VBtn
            variant="elevated"
            @click="apply"
          >
            Apply
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
