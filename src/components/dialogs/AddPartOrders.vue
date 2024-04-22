<script setup lang="ts">
const isAddPartDialogOpen = ref(false)
</script>

<template>
  <VBtn @click="isAddPartDialogOpen = !isAddPartDialogOpen">
    Add Part Order
  </VBtn>
  <VDialog v-model="isAddPartDialogOpen">
    <VCard>
      <VCardText>
        Hello
      </VCardText>
    </VCard>
  </VDialog>
</template>
