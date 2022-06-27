<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-img
          :src="require('@/assets/images/logos/logo.svg')"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <v-slide-x-transition>
          <h2 class="app-title text--primary">Super duper</h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list expand shaped class="vertical-nav-menu-items pr-5">
      <nav-menu-link
        title="Dashboard"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Test"
        :to="{ name: 'Test' }"
        :icon="icons.mdiAccountCogOutline"
        v-if="isAuth()"
      ></nav-menu-link>
      <nav-menu-section-title title="Operator"></nav-menu-section-title>
      <nav-menu-link
        title="Act Generate"
        :to="{ name: 'ActGenerate' }"
        :icon="icons.mdiAccountCogOutline"
        v-if="userInfo.role === 2"
      ></nav-menu-link>
      <nav-menu-link
        title="Profile"
        :to="{ name: 'Profile' }"
        :icon="icons.mdiCreditCardOutline"
      ></nav-menu-link>
    </v-list>
    <div class="upgrade-banner mx-6">
      <theme-switcher></theme-switcher>
      <app-bar-user-menu></app-bar-user-menu>
    </div>
  </v-navigation-drawer>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline
} from '@mdi/js'
import NavMenuSectionTitle from './components/NavMenuSectionTitle.vue'
import NavMenuLink from './components/NavMenuLink.vue'
import ThemeSwitcher from '../ThemeSwitcher.vue'
import AppBarUserMenu from '../AppBarUserMenu.vue'
import { userMapper } from '@/store/modules/user'
import { Vue } from 'vue-property-decorator'

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo', '_isAuth'])
  },
  methods: {
    ...userMapper.mapActions(['logOut'])
  }
})

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuLink,
    ThemeSwitcher,
    AppBarUserMenu
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null
    }
  },
  setup() {
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline
      }
    }
  },
  isAuth() {
    return this._isAuth
  },
  getUserInfo() {
    return this.userInfo.username
  }
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}

// You can remove below style
// Upgrade Banner
.app-navigation-menu {
  .upgrade-banner {
    position: absolute;
    bottom: 13px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
