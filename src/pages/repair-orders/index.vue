<script setup lang="ts">
import { aggregate, deleteItem, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const repairOrders = ref()
const AppLoadingIndicatorRef = ref()
const loading = ref(false)
const router = useRouter()

const tableSettings = ref({
  itemsPerPage: 15,
  itemLength: 0,
  search: '',
  page: 1,
})

const headers = [
  {
    title: 'Repair No.',
    key: 'repair_no',
  },
  {
    title: 'Service Tye',
    key: 'type_of_service',
  },
  {
    title: 'Client Type',
    key: 'type_of_client',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Vehicle Identication No',
    key: 'vehicle_identification_number',
  },
  {
    title: 'Customer Name',
    key: 'customer_name',
  },
  {
    title: 'Contact No.',
    key: 'customer_number',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const fetchOrders = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('RepairOrders', {
        aggregate: { count: '*' },
      }),
    )

    const response = await client.request(
      readItems('RepairOrders', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
        fields: ['*', 'customer_details.*'],
      }),
    )

    console.log(response)

    tableSettings.value.itemLength = count[0].count

    repairOrders.value = response
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

const deleteOrder = async (id: number) => {
  try {
    const response = await client.request(deleteItem('RepairOrders', id))

    console.log(response)
    fetchOrders(tableSettings.value)
  }
  catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center mt-2">
        <h6 class="text-h4">
          Repair Orders
        </h6>
        <VSpacer />
        <VBtn
          class="mx-3"
          @click="router.push('/repair-orders/add')"
        >
          Add Repair Order
        </VBtn>
        <VTextField
          v-model="tableSettings.search"
          label="Search Repair No."
          style="max-inline-size: 15rem;"
          @input="fetchOrders(tableSettings)"
        />
      </VCardTitle>
      <VCardText>
        <VDataTableServer
          v-model:items-per-page="tableSettings.itemsPerPage"
          :headers="headers"
          :items="repairOrders"
          :items-length="tableSettings.itemLength"
          :search="tableSettings.search"
          :loading="loading"
          @update:options="() => fetchOrders(tableSettings)"
        >
          <template #item.type_of_service="{ item }">
            {{
              item.type_of_service === '1' ? "EM"
              : item.type_of_service === '2' ? "GJ"
                : item.type_of_service === '3' ? "BP" : ""
            }}
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="item.status === 'finished' ? 'success'
                : item.status === 'processing' ? 'secondary'
                  : item.status === 'pending' ? 'warning'
                    : ''"
            >
              {{ item.status === 'pending' ? 'Pending'
                : item.status === 'finished' ? 'Finished'
                  : item.status === 'processing' ? 'Processing'
                    : '' }}
            </VChip>
          </template>

          <template #item.type_of_client="{ item }">
            {{
              item.type_of_client === '1' ? "Appointment"
              : item.type_of_client === '2' ? "Walk-in"
                : item.type_of_client === '3' ? "Non-Waiting" : ""
            }}
          </template>

          <template #item.customer_name="{ item }">
            {{ item.customer_details ? item.customer_details.name : '' }}
          </template>

          <template #item.customer_number="{ item }">
            {{ item.customer_details ? item.customer_details.contact_number : '' }}
          </template>

          <template #item.actions="{ item }">
            <VBtn
              variant="text"
              icon="ri-eye-line"
              density="compact"
              @click="router.push(`/repair-orders/${item.id}`)"
            />
            <VBtn
              variant="text"
              icon="ri-delete-bin-line"
              density="compact"
              @click="deleteOrder(item.id)"
            />
          </template>
        </VDataTableServer>
      </VCardText>
    </VCard>

    <AppLoadingIndicator ref="AppLoadingIndicatorRef" />
  </div>
</template>
