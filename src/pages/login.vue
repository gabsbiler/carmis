<script setup lang="ts">
import { client, getCurrentUser } from '@/composables/useDirectus.ts'
import { router } from '@/plugins/1.router'
import { themeConfig } from '@themeConfig'

const SnackBarRef = ref()

definePage({
  meta: {
    layout: 'blank',
  },
})

const form = ref({
  email: 'admin@admin.com',
  password: '@Dm1n@Dm1n',
})

const loading = ref(false)
const isPasswordVisible = ref(false)

const login = async () => {
  loading.value = true
  try {
    await client.login(form.value.email, form.value.password)

    sessionStorage.setItem('user', JSON.stringify(await getCurrentUser()))

    router.push('/')
  }
  catch (e) {
    // SnackBarRef.value.show('error', e.errors[0].message)
    console.log(e)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-sm-4 pa-md-7 pa-0"
      max-width="448"
    >
      <VCardText>
        <h4 class="text-h4 mb-1">
          <span class="text-capitalize">{{ themeConfig.app.title }}</span>
        </h4>
        <p class="mb-0">
          Please sign-in to your account
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="login">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                autofocus
                label="Email"
                type="email"
                placeholder="johndoe@email.com"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </VCol>
            <VCol cols="12">
              <VBtn
                block
                type="submit"
                :loading="loading"
              >
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <SnackBar ref="SnackBarRef" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
