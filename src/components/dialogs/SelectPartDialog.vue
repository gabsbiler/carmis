<script setup lang="ts">
import { aggregate, readItems } from '@directus/sdk'
import { client } from '@/composables/useDirectus'

const emits = defineEmits(['selected'])
const isDialogOpen = ref(false)
const loading = ref(false)

const headers = [
  {
    title: 'Description',
    key: 'part_description',
  },
  {
    title: 'Part No.',
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

const parts = ref()

const fetchParts = async (options: object) => {
  loading.value = true
  try {
    const count = await client.request(
      aggregate('Parts', {
        aggregate: { count: '*' },
      }),
    )

    tableSettings.value.itemLength = count[0].count

    const response = await client.request(
      readItems('Parts', {
        limit: options.itemsPerPage,
        page: options.page,
        search: options.search,
      }),
    )

    console.log(response)

    parts.value = response
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

const select = (id: number) => {
  emits('selected', id)
  isDialogOpen.value = false
}
</script>

<template>
  <div>
    <VBtn @click="isDialogOpen = !isDialogOpen">
      Select part
    </VBtn>

    <VDialog v-model="isDialogOpen">
      <VCard class="mx-auto">
        <VCardTitle>
          Select part_description
        </VCardTitle>
        <VCardText>
          <VTextField
            v-model="tableSettings.search"
            label="Search"
          />

          <VDivider class="my-5" />
          <VDataTableServer
            v-model:items-per-page="tableSettings.itemsPerPage"
            :headers="headers"
            :items="parts"
            :items-length="tableSettings.itemLength"
            :search="tableSettings.search"
            :loading="loading"
            @update:options="fetchParts"
          >
            <template #item.actions="{ item }">
              <VBtn
                variant="text"
                @click="select(item)"
              >
                Select
              </VBtn>
            </template>
          </VDataTableServer>
        </VCardText>
        <VCardActions class="mx-3 d-flex justify-space-between align-center mb-2">
          <AddPartDialog @saved="fetchParts(tableSettings)" />
          <VBtn @click="isDialogOpen = false">
            Cancel
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
