<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['partOrderSaved'])
const isDialogOpen = ref(false)

const formData = ref({
  order_number: '',
  unit_price: '',
  lead_time: '',
  supplier: '',
  date_ordered: null,
  date_arrived: null,
  part_orders: [],
})

const loading = ref(false)

const partTemp = ref({
  part: null,
  quantity: null,
  status: 'waiting',
})

const addPart = () => {
  formData.value.part_orders.push({ PartOrderDetails_id: partTemp.value })
  partTemp.value = {
    part: null,
    quantity: null,
    status: 'waiting',
  }
}

const selectPart = (part: Object) => {
  partTemp.value.part = part.id
}

const savePartOrder = async () => {
  loading.value = true
  try {
    const payload = {
      order_number: formData.value.order_number,
      unit_price: formData.value.unit_price,
      lead_time: formData.value.lead_time,
      supplier: formData.value.supplier,
      date_ordered: formData.value.date_ordered,
      date_arrived: formData.value.date_arrived,
      orders: {
        create: formData.value.part_orders,
      },
    }

    const response = await client.request(createItem('PartOrders', payload))

    emits('partOrderSaved', response)
    console.log(response)
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
    isDialogOpen.value = false
    formData.value = {
      order_number: '',
      unit_price: '',
      supplier: '',
      lead_time: '',
      date_ordered: null,
      date_arrived: null,
      part_orders: null,
    }
  }
}

const removePartOrder = (index: number) => {
  formData.value.part_orders.splice(index, 1)
}
</script>

<template>
  <VBtn
    block
    variant="outlined"
    @click="isDialogOpen = !isDialogOpen"
  >
    Add Part Order
  </VBtn>
  <VDialog v-model="isDialogOpen">
    <VCard class="mx-auto">
      <VCardTitle>
        Add Part Order
      </VCardTitle>
      <VForm @submit.prevent="savePartOrder">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="formData.order_number"
                label="Order Number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="formData.unit_price"
                label="Unit Price"
                type="number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="formData.supplier"
                label="Supplier"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="formData.lead_time"
                label="Lead Time"
              />
            </VCol>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="formData.date_ordered"
                label="Date Ordered"
              />
            </VCol>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="formData.date_arrived"
                label="Date Arrived"
              />
            </VCol>
            <VDivider />
            <VCol cols="12">
              <VTable>
                <thead>
                  <tr>
                    <th>Part ID</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in formData.part_orders"
                    :key="index"
                  >
                    <td>
                      {{ item.PartOrderDetails_id.part }}
                    </td>
                    <td>
                      {{ item.PartOrderDetails_id.quantity }}
                    </td>
                    <td>
                      <VBtn
                        variant="text"
                        icon="ri-delete-bin-line"
                        density="compact"
                        @click="removePartOrder(index)"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <SelectPartDialog
                        v-if="partTemp.part === null"
                        @selected="selectPart"
                      />
                      <div v-else>
                        {{ partTemp.part }}
                      </div>
                    </td>
                    <td>
                      <VTextField
                        v-model="partTemp.quantity"
                        label="Quantity"
                      />
                    </td>
                    <td>
                      <VBtn
                        icon="ri-add-line"
                        @click="addPart"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="px-5 pb-5">
          <VBtn @click="isDialogOpen = !isDialogOpen">
            Cancel
          </VBtn>
          <VSpacer />
          <VBtn
            variant="elevated"
            type="submit"
          >
            Save
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>
