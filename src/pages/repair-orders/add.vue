<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['repairOrderSaved'])
const router = useRouter()

const fieldContents = ref({
  typeOfService: [
    {
      name: 'Express Maintenance',
      value: '1',
    },
    {
      name: 'General Job',
      value: '2',
    },
    {
      name: 'Body & Paint',
      value: '3',
    },
  ],
  typeOfClient: [
    {
      name: 'Appointment',
      value: 1,
    },
    {
      name: 'Walk-in',
      value: 2,
    },
    {
      name: 'Non-Waiting',
      value: 3,
    },

  ],
})

const content = ref({
  repair_no: '',
  type_of_service: null,
  type_of_client: null,
  payment_method: null,
  deliver_date: null,
  vehicle_identification_number: null,
  customer_request: null,
  service_advisor_instruction: null,
  technician_instruction: null,

  // Parts
  part_orders: null,
})

const customerDetails = ref()
const carDetails = ref()
const loading = ref(false)

const saveRepairOder = async () => {
  loading.value = true
  try {
    const response = await client.request(createItem('RepairOrders', {
      status: 'pending',
      repair_no: content.value.repair_no,
      type_of_service: content.value.type_of_service,
      type_of_client: content.value.type_of_client,
      payment_method: content.value.payment_method,
      deliver_date: content.value.deliver_date,
      vehicle_identification_number: content.value.vehicle_identification_number,
      customer_request: content.value.customer_request,
      service_advisor_instruction: content.value.service_advisor_instruction,
      technician_instruction: content.value.technician_instruction,
      car_details: carDetails.value.id,
      customer_details: customerDetails.value.id,

      part_orders: content.value.part_orders.map(item => ({
        RepairOrders_id: '+',
        PartOrders_id: {
          id: item.id,
        },
      })),
    }))

    router.push('/repair-orders')
  }
  catch (e) {
    console.log(e)
  }
  finally {
    emits('repairOrderSaved')
    loading.value = false
  }
}

const selectCustomer = (customer: object) => {
  customerDetails.value = customer
}

const selectPartOrder = partOrder => {
  console.log(partOrder)
  content.value.part_orders = partOrder
}
</script>

<template>
  <section>
    <VCard
      title="Add Repair Order"
      class="mx-auto"
      min-width="300"
      sc
    >
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="content.repair_no"
              label="Repair No."
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="content.type_of_service"
              :items="fieldContents.typeOfService"
              item-title="name"
              item-value="value"
              label="Type of Service"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="content.type_of_client"
              :items="fieldContents.typeOfClient"
              item-title="name"
              item-value="value"
              label="Type of Client"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="content.payment_method"
              label="Payment Method"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="content.deliver_date"
              label="Delivery Date"
            />
          </VCol>
          <VCol>
            <VTextField
              v-model="content.vehicle_identification_number"
              label="Vehicle Identification No."
            />
          </VCol>
        </VRow>
        <VDivider class="my-5" />
        <VRow>
          <VCol>
            <div v-if="!(customerDetails)">
              <SelectCustomerDialog @selected="selectCustomer" />
            </div>
            <div v-if="customerDetails">
              <div class="d-flex justify-space-between align-center">
                <h6 class="text-h6">
                  Customer Details
                </h6>
                <VBtn
                  variant="text"
                  @click="() => {
                    customerDetails = null
                  }"
                >
                  Remove Customer
                </VBtn>
              </div>

              <div>
                Name: {{ customerDetails.name }}
              </div>
              <div>
                Contact No.: {{ customerDetails.contact_number }}
              </div>
            </div>
          </VCol>
        </VRow>
        <VDivider class="my-5" />
        <VRow>
          <VCol>
            <SelectCarDialog
              v-if="!(carDetails)"

              @selected="(item) => {
                carDetails = item
              }"
            />

            <div v-if="carDetails">
              <div class="d-flex justify-space-between align-center">
                <h6 class="text-h6">
                  Car Details
                </h6>
                <VBtn
                  variant="text"
                  @click="carDetails = null"
                >
                  Remove Car
                </VBtn>
              </div>

              <div>
                Plate Number: {{ carDetails.plate_number }}
              </div>
              <div>
                Color: {{ carDetails.color }}
              </div>
              <div>
                CS Number: {{ carDetails.cs_number }}
              </div>
            </div>
          </VCol>
        </VRow>

        <VDivider class="my-5" />

        <VRow>
          <VCol cols="12">
            <VTextarea
              v-model="content.customer_request"
              label="Customer Request"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="content.service_advisor_instruction"
              label="Service Advisor Instruction"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="content.technician_instruction"
              label="Technician Instruction"
            />
          </VCol>
        </VRow>

        <VDivider class="my-5" />

        <VRow>
          <VCol cols="12">
            <SelectPartOrdersDialog @select="selectPartOrder" />
          </VCol>
          <VCol cols="12">
            <VTable>
              <thead>
                <th>Order No.</th>
                <th>Status</th>
                <th>Supplier</th>
                <th>Date Ordered</th>
              </thead>
              <tbody>
                <tr v-for="item in content.part_orders">
                  <td>{{ item.order_number }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.supplier }}</td>
                  <td>{{ item.date_ordered }}</td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions class="d-flex gap-x-3 justify-end px-5">
        <VBtn @click="router.push('/repair-orders')">
          Cancel
        </VBtn>
        <VBtn
          variant="elevated"
          :loading="loading"
          @click="saveRepairOder"
        >
          Save Record
        </VBtn>
      </VCardActions>
    </VCard>
  </section>
</template>
