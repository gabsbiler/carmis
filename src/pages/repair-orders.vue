<script setup lang="ts">
import { readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const repairOrders = ref()
const AppLoadingIndicatorRef = ref()

const fetchOrders = async () => {
  AppLoadingIndicatorRef.value.fallbackHandle()
  try {
    const response = await client.request(
      readItems('RepairOrders', {
        fields: ['*', {
          customer_details: ['*'],
          car_details: ['*'],
        }],
      }),
    )

    repairOrders.value = response
  }
  catch (error) {
    console.log(error)
  }
  finally {
    AppLoadingIndicatorRef.value.resolveHandle()
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center mt-2">
        <h6 class="text-h4">
          Repair Orders
        </h6>
        <VSpacer />
        <AddRepairOrderDialog @repair-order-saved="fetchOrders" />
        <VTextField
          label="Search Repair No."
          style="max-inline-size: 15rem;"
          class="mx-1"
        />
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol
            v-for="order in repairOrders"
            :key="order.repairNo"
            cols="12"
            lg="4"
            md="6"
          >
            <VCard>
              <VCardTitle class="d-flex justify-space-between">
                <div>
                  {{ order.repair_no }}
                </div>
                <div style="text-transform: capitalize;">
                  {{ order.status }}
                </div>
              </VCardTitle>
              <VCardText>
                <div>
                  Type of Service: {{
                    order.type_of_service === '1' ? "EM"
                    : order.type_of_service === '2' ? "GJ"
                      : order.type_of_service === '3' ? "BP" : ""
                  }}
                </div>
                <div>
                  Type of Client: {{
                    order.type_of_client === '1' ? "Appointment"
                    : order.type_of_client === '2' ? "Walk-in"
                      : order.type_of_client === '3' ? "Non-Waiting" : ""
                  }}
                </div>
                <div>
                  Vehicle Identication No.: {{ order.vehicle_identification_number }}
                </div>
                <VDivider class="my-3" />
                <div>
                  Customer Name: {{ order.customer_details ? order.customer_details.name : 'Not Available' }}
                </div>
                <div>
                  Contact No.: {{ order.customer_details ? order.customer_details.contact_number : 'Not Available' }}
                </div>
                <div>
                  Customer Request: {{ order.customer_request }}
                </div>
              </VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn
                  icon="ri-delete-bin-line"
                  density="compact"
                />

                <!--
                  <VBtn
                  icon="ri-edit-box-line"
                  density="compact"
                  />
                -->
                <!--
                  <VBtn
                  icon="ri-file-info-line"
                  density="compact"
                  />
                -->
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <AppLoadingIndicator ref="AppLoadingIndicatorRef" />
  </div>
</template>
