<script setup lang="ts">
import { aggregate, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['selected'])
const isDialogOpen = ref(false)
const loading = ref(false)

const tableSettings = ref({
  itemsPerPage: 10,
  itemLength: 0,
  search: '',
  page: 1,
})

const cars = ref()

const headers = [
  {
    title: 'Plate Number',
    key: 'plate_number',
  },
  {
    title: 'CS Number',
    key: 'cs_number',
  },
  {
    title: 'Color',
    key: 'color',
  },
  {
    title: 'Engine Number',
    key: 'engine_number',
  },
  {
    title: 'Action',
    key: 'action',
  },
]

const fetchCars = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('Cars', {
        aggregate: { count: '*' },
      }),
    )

    const response = await client.request(
      readItems('Cars', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
      }),
    )

    // console.log(response)

    tableSettings.value.itemLength = count[0].count

    cars.value = response
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
      block
      variant="outlined"
      @click="isDialogOpen = !isDialogOpen"
    >
      Select Car
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard
        title="Select Car"
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
            :items="cars"
            :items-length="tableSettings.itemLength"
            :search="tableSettings.search"
            @update:options="fetchCars"
          >
            <template #item.action="{ item }">
              <div>
                <VBtn
                  variant="text"
                  @click="emits('selected', item)"
                >
                  Select
                </VBtn>
              </div>
            </template>
          </VDataTableServer>
        </VCardText>
        <VCardActions class="mx-3 d-flex justify-space-between align-center">
          <AddCarDialog @saved="fetchCars(tableSettings)" />
          <VBtn @click="isDialogOpen = false">
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
