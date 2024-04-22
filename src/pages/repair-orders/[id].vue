<script setup lang="ts">
import { deleteItem, readItem, updateItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const route = useRoute()
const repairOrderId = route.params.id
const loading = ref(false)
const data = ref()
const router = useRouter()

const fetch = async () => {
  loading.value = true
  try {
    const response = await client.request(readItem('RepairOrders', repairOrderId, {
      fields: [
        '*',
        'customer_details.*',
        'car_details.*',
        'part_orders.PartOrders_id.*',
      ],
    }))

    data.value = response
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

const updateStatus = async (status: Text) => {
  loading.value = true
  try {
    const response = await client.request(updateItem('RepairOrders', repairOrderId, {
      status,
    }))

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
        <!-- Head -->
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <h5 class="text-h5">
              <b>Repair No:</b>  {{ data.repair_no }}
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
            >
              Delete
            </VBtn>
            <VBtn
              :color="
                data.status === 'finished' ? 'success'
                : data.status === 'processing' ? 'secondary'
                  : data.status === 'pending' ? 'warning' : ''
              "
              @click="updateStatus(
                data.status === 'finished' ? 'pending'
                : data.status === 'processing' ? 'finished'
                  : data.status === 'pending' ? 'processing'
                    : '',
              )"
            >
              {{ data.status === 'pending' ? 'Pending'
                : data.status === 'finished' ? 'Finished'
                  : data.status === 'processing' ? 'Processing'
                    : '' }}
            </VBtn>
          </VCol>
        </VRow>

        <VDivider class="my-3" />

        <!-- Repair Details -->
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Service Type: </b> {{
                data.type_of_service === '1' ? "Express Maintenance"
                : data.type_of_service === '2' ? "General Job"
                  : data.type_of_service === '3' ? "Body & Paint" : ""
              }}
            </h6>
            <h6 class="text-h6">
              <b>Client Type: </b> {{
                data.type_of_client === '1' ? "Appointment"
                : data.type_of_client === '2' ? "Walk-in"
                  : data.type_of_client === '3' ? "Non-Waiting" : ""
              }}
            </h6>
            <h6 class="text-h6">
              <b>Payment Method: </b>{{ data.payment_method }}
            </h6>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Delivery Date: </b>{{ data.delivery_date }}
            </h6>
            <h6 class="text-h6">
              <b>VIN: </b> {{ data.vehicle_identification_number }}
            </h6>
          </VCol>
        </VRow>

        <VDivider class="my-3" />

        <!-- Customer Details -->
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Customer Name: </b>{{ data.customer_details.name }}
            </h6>
            <h6 class="text-h6">
              <b>Address: </b>{{ data.customer_details.address }}
            </h6>
            <h6 class="text-h6">
              <b>Contact No.: </b>{{ data.customer_details.contact_number }}
            </h6>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Valid ID: </b>{{ data.customer_details.valid_id_type }}
            </h6>
            <h6 class="text-h6">
              <b>Valid ID No.: </b>{{ data.customer_details.valid_id_number }}
            </h6>
          </VCol>
        </VRow>

        <VDivider class="my-3" />

        <!-- Car Details -->
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Plate Number: </b> {{ data.car_details.plate_number }}
            </h6>
            <h6 class="text-h6">
              <b>Color: </b> {{ data.car_details.color }}
            </h6>
            <h6 class="text-h6">
              <b>CS Number: </b> {{ data.car_details.cs_number }}
            </h6>
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <h6 class="text-h6">
              <b>Mileage: </b> {{ data.car_details.mileage }}
            </h6>
            <h6 class="text-h6">
              <b>Engine No.: </b> {{ data.car_details.engine_number }}
            </h6>
            <h6 class="text-h6">
              <b>Warranty Expiration: </b> {{ data.car_details.warranty_expiration_date }}
            </h6>
          </VCol>
        </VRow>

        <VDivider class="my-3" />

        <!-- Repair Request and Recommedation -->
        <VRow>
          <VCol cols="12">
            <h6 class="text-h6">
              <b>Customer Request</b>
            </h6>
            <VTextarea
              :value="data.customer_request"
              class="mt-3"
              readonly
            />
          </VCol>
          <VCol cols="12">
            <h6 class="text-h6">
              <b>Service Advisor Instruction</b>
            </h6>
            <VTextarea
              :value="data.service_advisor_instruction"
              class="mt-3"
              readonly
            />
          </VCol>
          <VCol cols="12">
            <h6 class="text-h6">
              <b>Technician Instructor</b>
            </h6>
            <VTextarea
              :value="data.technician_instruction"
              class="mt-3"
              readonly
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <h6 class="text-h6">
              <b>Part Orders</b>
            </h6>
            <VTable>
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Status</th>
                  <th>Supplier</th>
                  <th>Date Ordered</th>
                  <th>Date Arrived</th>
                  <th>Parts Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data.part_orders">
                  <td>
                    {{ item.PartOrders_id.order_number }}
                  </td>
                  <td>
                    {{ item.PartOrders_id.status }}
                  </td>
                  <td>
                    {{ item.PartOrders_id.supplier }}
                  </td>
                  <td>
                    {{ item.PartOrders_id.date_ordered }}
                  </td>
                  <td>
                    {{ item.PartOrders_id.date_arrived ? item.PartOrders_id.date_arrived : 'Waiting...' }}
                  </td>
                  <td>
                    {{ item.PartOrders_id.orders.length }}
                  </td>
                  <td>
                    <VBtn
                      variant="text"
                      icon="ri-eye-line"
                      density="compact"
                      @click="router.push(`/part-orders/${item.PartOrders_id.id}`)"
                    />
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
