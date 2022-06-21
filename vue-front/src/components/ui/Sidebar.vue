<template>
  <div>
    <b-sidebar id="main-sidebar" title="СайдБар" backdrop>
      <div>Пользователь: {{ userInfo.username }}</div>
      <button
        style="float: right; margin-right: 3px"
        type="button"
        class="btn btn-success btn-sm"
        @click="logoutPage"
      >
        Logout
      </button>
      <br />
      <hr />
      <b-nav vertical class="py-1 px-1">
        <b-nav-item to="/books">Books</b-nav-item>
        <b-nav-item to="/profile" v-if="isAuth()">Profile</b-nav-item>
        <b-nav-item to="/Admin" v-if="userInfo.role === 4"
          >Admin(админ)</b-nav-item
        >
        <b-nav-item to="/lorem" v-if="userInfo.role !== 0"
          >Модерация актов(админ, оператор)</b-nav-item
        >
      </b-nav>
    </b-sidebar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { RouteConfigSingleView } from 'vue-router/types/router'
import { userMapper } from '@/store/modules/user'

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo', '_isAuth'])
  },
  methods: {
    ...userMapper.mapActions(['logOut'])
  }
})

@Component({ components: {} })
export default class Sidebar extends Mappers {
  logoutPage() {
    this.logOut()
    this.$router.push('/auth')
  }
  mounted() {
    let gg = true
    if (!gg) {
      gg = false
    }
  }
  isAuth() {
    return this._isAuth
  }
  getUserInfo() {
    return this.userInfo.username
  }
  private treeSidebar: { [k: string]: RouteConfigSingleView[] } = {}
}
</script>

<style scoped>
.sidebar-header {
  padding: 0 1rem;
}
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.blue {
  color: blue;
}
</style>
