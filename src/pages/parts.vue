<script setup lang="ts">
import { aggregate, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const parts = ref()
const loading = ref(false)

const headers = [
  {
    title: 'Description',
    key: 'part_description',
  },
  {
    title: 'Part Number',
    key: 'part_number',
  },
  {
    title: 'Remarks',
    key: 'remarks',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const tableSettings = ref({
  itemsPerPage: 10,
  itemLength: 0,
  search: '',
  page: 1,
})

const fetchParts = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('Parts', {
        aggregate: { count: '*' },
      }),
    )

    const response = await client.request(
      readItems('Parts', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
      }),
    )

    console.log(response)

    tableSettings.value.itemLength = count[0].count

    parts.value = response
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
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center  mx-1 mt-1">
        <h5 class="text-h5">
          Parts Management
        </h5>
        <div style="min-inline-size: 300px;">
          <VTextField
            v-model="tableSettings.search"
            label="Search"
          />
        </div>
      </VCardTitle>
      <VCardText>
        <VDataTableServer
          v-model:items-per-page="tableSettings.itemsPerPage"
          :headers="headers"
          :items="parts"
          :items-length="tableSettings.itemLength"
          :search="tableSettings.search"
          :loading="loading"
          @update:options="fetchParts"
        />
      </VCardText>
    </VCard>
  </div>
</template>
