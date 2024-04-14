<script setup lang="ts">
import { aggregate, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['selected'])

const isDialogOpen = ref(false)

const customers = ref()
const loading = ref(false)

const tableSettings = ref({
  itemsPerPage: 10,
  itemLength: 0,
  search: '',
  page: 1,
})

const headers = [
  {
    title: 'Customer Name',
    key: 'name',
  },
  {
    title: 'Contact Number',
    key: 'contact_number',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const fetchCustomers = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('Customers', {
        aggregate: { count: '*' },
      }),
    )

    const response = await client.request(
      readItems('Customers', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
      }),
    )

    // console.log(response)

    tableSettings.value.itemLength = count[0].count

    customers.value = response
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

const select = (id: number) => {
  emits('selected', id)
  isDialogOpen.value = false
}
</script>

<template>
  <div>
    <VBtn
      block
      variant="outlined"
      @click="isDialogOpen = !isDialogOpen"
    >
      Select Customer
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard
        title="Select a Customer"
        class="mx-auto"
        :loading="loading"
      >
        <VCardText>
          <VTextField
            v-model="tableSettings.search"
            label="Search"
          />

          <VDivider class="my-5" />

          <VDataTableServer
            v-model:items-per-page="tableSettings.itemsPerPage"
            :headers="headers"
            :items="customers"
            :items-length="tableSettings.itemLength"
            :search="tableSettings.search"
            @update:options="fetchCustomers"
          >
            <template #item.action="{ item }">
              <VBtn
                variant="text"
                @click="select(item)"
              >
                Select
              </VBtn>
            </template>
          </VDataTableServer>
        </VCardText>
        <VCardActions class="d-flex justify-space-between ma-3">
          <AddCustomerDialog @saved="fetchCustomers(tableSettings)" />
          <VBtn @click="isDialogOpen = false">
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
