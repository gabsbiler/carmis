<script setup lang="ts">
import { createItem } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits('saved')
const isDialogOpen = ref(false)
const loading = ref(false)

const data = ref({
  part_description: null,
  part_number: null,
  remarks: null,
})

const savePart = async () => {
  loading.value = true
  try {
    await client.request(createItem('Parts', data.value))

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
      Create Part
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard
        class="mx-auto"
        title="Create Part"
        min-width="400"
        :loading="loading"
      >
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="data.part_description"
                label="Description"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.part_number"
                label="Part Number"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="data.remarks"
                label="Remarks"
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
            @click="savePart"
          >
            Save
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
