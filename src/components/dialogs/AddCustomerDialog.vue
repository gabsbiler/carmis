<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['saved'])
const isDialogOpen = ref(false)
const loading = ref(false)

const data = ref({
  name: '',
  address: '',
  contact_number: '',
  valid_id_type: '',
  valid_id_number: '',
})

const saveCustomer = async () => {
  loading.value = true
  try {
    await client.request(createItem('Customers', data.value))

    isDialogOpen.value = false
    emits('saved')
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
  <section>
    <VBtn @click="isDialogOpen = true">
      Create Customer
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard
        title="Create Customer"
        min-width="400"
        max-width="600"
        class="mx-auto"
        :loading="loading"
      >
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="data.name"
                label="Name"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.address"
                label="Address"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.contact_number"
                label="Contact Number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.valid_id_type"
                label="Valid ID Type"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.valid_id_number"
                label="Valid ID Number"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="mx-3 mb-2">
          <VSpacer />
          <VBtn
            variant="outlined"
            @click="isDialogOpen = false"
          >
            Cancel
          </VBtn>
          <VBtn
            variant="elevated"
            @click="saveCustomer"
          >
            Apply
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
