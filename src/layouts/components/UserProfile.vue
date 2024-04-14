<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { client } from '@/composables/useDirectus.ts'
import { router } from '@/plugins/1.router'
import avatar1 from '@images/avatars/avatar-1.png'

const userProfileList = [
  { type: 'divider' },

  // {
  //   type: 'navItem',
  //   icon: 'ri-user-line',
  //   title: 'Profile',
  //   value: 'profile',
  // },
  // { type: 'divider' },
]

const logout = async () => {
  loading.value = true
  try {
    await client.logout()
    sessionStorage.clear()

    router.push('/login')
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
}

const user = JSON.parse(sessionStorage.getItem('user'))
const loading = ref(false)
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      size="38"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="15px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <h6 class="text-sm font-weight-medium">
              {{ user.first_name }} {{ user.last_name }}
            </h6>
            <VListItemSubtitle class=" text-disabled">
              {{ user.email }}
            </VListItemSubtitle>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :value="item.value"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.badgeProps"
                  #append
                >
                  <VBadge
                    inline
                    v-bind="item.badgeProps"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-1"
              />
            </template>

            <VListItem>
              <VBtn
                block
                color="error"
                append-icon="ri-logout-box-r-line"
                :loading="loading"
                @click="logout"
              >
                Logout
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
