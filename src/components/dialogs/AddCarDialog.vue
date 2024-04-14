<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits('saved')
const isDialogOpen = ref(false)
const loading = ref(false)

const data = ref({
  plate_number: null,
  color: null,
  cs_number: null,
  mileage: null,
  engine_number: null,
  warranty_expiration_date: null,
})

const saveCar = async () => {
  loading.value = true
  try {
    await client.request(createItem('Cars', data.value))

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
    <VBtn
      variant="outlined"
      @click="isDialogOpen = !isDialogOpen"
    >
      Create Car
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard
        class="mx-auto"
        title="Create Car"
        min-width="400"
        :loading="loading"
      >
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="data.plate_number"
                label="Plate Number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.color"
                label="Color"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.cs_number"
                label="CS Number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.mileage"
                label="Mileage"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.engine_number"
                label="Engine Number"
              />
            </VCol>
            <VCol cols="12">
              <AppDateTimePicker
                v-model="data.warranty_expiration_date"
                label="Warranty Expiration Date"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="mx-3 mb-2 ">
          <VSpacer />
          <VBtn
            variant="outlined"
            @click="isDialogOpen = false"
          >
            Cancel
          </VBtn>
          <VBtn
            variant="elevated"
            @click="saveCar"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
