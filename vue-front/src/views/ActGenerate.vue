<template>
  <div>
    <v-card>
      <div class="container">
        <div class="row justify-content-start">
          <div class="col-2 col-sm-12 col-lg-2">
            <v-card-title>
              <span class="me-3">Папки</span>
              <v-spacer></v-spacer>
              <v-icon size="32">{{ icons.mdiFolder }}</v-icon>
            </v-card-title>

            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="data in folderList"
                  :key="data.type"
                  class="
                    d-flex
                    px-0
                    vertical-nav-menu-link
                    white--text
                    v-list-item v-list-item--link
                  "
                >
                  <v-icon size="16">{{ icons.mdiFolderMoveOutline }}</v-icon>

                  <div class="d-flex align-center flex-grow-1 flex-wrap">
                    <div class="me-auto pe-2">
                      <h4
                        class="font-weight-semibold"
                        :class="data.active ? 'hovered' : ''"
                      >
                        -> {{ data.name }}
                      </h4>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </v-card-text>
          </div>
          <v-divider :vertical="$vuetify.breakpoint.mdAndUp"></v-divider>
          <div class="col-9">
            <v-card-title>
              <span class="me-3">Фотографии</span>
            </v-card-title>

            <v-card-text>
              <div class="row row-cols-1 row-cols-md-4 g-4">
                <div class="col" v-for="data in images" :key="data.img">
                  <div class="card">
                    <v-badge bottom overlap color="warning" v-model="show">
                      <template v-slot:badge>
                        <v-icon>{{ icons.mdiCheck }}</v-icon>
                      </template>
                      <img :src="data.img" class="card-img-top" width="200" />
                    </v-badge>
                    <div class="card-body">
                      <h5 class="card-title">{{ data.title }}</h5>
                      <p class="card-text">
                        <v-btn
                          color="primary"
                          @click="
                            show = !show
                            dialogIsOpen = !dialogIsOpen
                          "
                        >
                          Составить акт
                        </v-btn>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </div>
        </div>
      </div></v-card
    >
    <IconModal :dialog="dialogIsOpen" />
  </div>
</template>

<script>
import { mdiFolder, mdiFolderMoveOutline, mdiCheck } from '@mdi/js'
import IconModal from './IconsModal.vue'

export default {
  components: {
    IconModal,
  },
  setup() {
    const dialogIsOpen = false

    // icons list
    const folderList = [
      { type: 'file', name: '05-04-2022', active: true },
      { type: 'file', name: '07-04-2022', active: false },
      { type: 'file', name: '08-04-2022', active: false },
      { type: 'file', name: '10-04-2022', active: false },
      { type: 'file', name: '14-04-2022', active: false },
      { type: 'file', name: '15-04-2022', active: false },
      { type: 'file', name: '12-05-2022', active: false },
    ]
    const images = [
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '05-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '06-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '07-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '07-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '11-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '05-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '06-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '07-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '07-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '08-04-2022'
      },
      {
        img: require('@/assets/images/pages/card-basic-person.png'),
        title: '11-04-2022'
      },
    ]

    return {
      dialogIsOpen,
      folderList,
      show: true,
      images,
      icons: {
        mdiFolder,
        mdiFolderMoveOutline,
        mdiCheck,
      },
    }
  },
}
</script>
<style>
.hovered {
  border-radius: 6px;
}
</style>
