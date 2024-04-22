<script setup lang="ts">
import { deleteItem, readItem, updateItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const route = useRoute()
const router = useRouter()
const partId = route.params.id
const data = ref()
const loading = ref(false)
const deleteLoading = ref(false)

const fetch = async () => {
  loading.value = true
  try {
    const response = await client.request(readItem('PartOrders', partId, {
      fields: ['*', 'orders.PartOrderDetails_id.*', 'orders.PartOrderDetails_id.part.*'],
    }))

    data.value = response
    console.log(response)
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
    deleteLoading.value = true

    const response = await client.request(deleteItem('PartOrders', id))

    console.log(response)
    router.push('/part-orders')
  }
  catch (e) {
    console.log(e)
  }
  finally {
    deleteLoading.value = false
  }
}

const updateStatus = async (status: Text) => {
  loading.value = true
  try {
    if (status === 'arrived') {
      const response = await client.request(updateItem('PartOrders', partId, {
        status,
        date_arrived: new Date(),
      }))
    }
    else {
      const response = await client.request(updateItem('PartOrders', partId, {
        status,
        date_arrived: null,
      }))
    }

    await fetch()
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <div>
    <VCard :loading="loading">
      <VCardText v-if="data">
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <h5 class="text-h5">
              <b>Repair Order:</b>  {{ data.order_number }}
            </h5>
          </VCol>
          <VCol
            cols="12"
            md="6"
            class="d-flex"
          >
            <VSpacer />
            <VBtn
              color="error"
              class="mx-3"
              @click="deletePartOrder(partId)"
            >
              Delete
            </VBtn>
            <VBtn
              :color="data.status === 'waiting' ? 'warning' : 'success'"
              @click="updateStatus(data.status === 'waiting' ? 'arrived' : 'waiting')"
            >
              {{ data.status === 'waiting' ? "Click to receive" : "Received" }}
            </VBtn>
          </VCol>
        </VRow>

        <VDivider class="my-3" />
        <VRow class="d-flex justify-between">
          <VCol
            cols="12"
            sm="6"
          >
            <h6 class="text-h6">
              <b>Status: </b> {{ data.status }}
            </h6>
            <h6 class="text-h6">
              <b>Unit Price: </b> {{ data.unit_price }}
            </h6>
            <h6 class="text-h6">
              <b>Supplier: </b> {{ data.supplier }}
            </h6>
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <h6 class="text-h6">
              <b>Lead Time: </b> {{ data.lead_time }}
            </h6>
            <h6 class="text-h6">
              <b>Date Ordered: </b> {{ data.date_ordered }}
            </h6>
            <h6 class="text-h6">
              <b>Date Arrived: </b> {{ data.date_arrived ? data.date_arrived : 'Waiting...' }}
            </h6>
          </VCol>
        </VRow>
        <VDivider class="my-3" />
        <VTable>
          <thead>
            <tr>
              <th>Part Description</th>
              <th>Part No.</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in data.orders"
              :key="item.id"
            >
              <td>{{ item.PartOrderDetails_id.part.part_description }}</td>
              <td>{{ item.PartOrderDetails_id.part.part_number }}</td>
              <td>{{ item.PartOrderDetails_id.quantity }}</td>

              <td>
                <VBtn
                  variant="text"
                  icon="ri-eye-line"
                  density="compact"
                  @click="router.push(`/part/${item.PartOrderDetails_id.part.id}`)"
                />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </div>
</template>
