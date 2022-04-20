<template>
  <div>
    <b-sidebar id="main-sidebar" title="СайдБар" backdrop>
      <div>Пользователь: {{ username }}</div>
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
        <b-nav-item to="/profile">Profile</b-nav-item>
        <b-nav-item to="/Admin" v-if="role === 4">Admin(админ)</b-nav-item>
        <b-nav-item to="/lorem" v-if="role !== 0"
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
import store from '@/store'
import _ from 'lodash'

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['role']),
    ...userMapper.mapState(['username'])
  },
  methods: {
    ...userMapper.mapMutations(['logOut'])
  }
})

@Component({ components: {} })
export default class Sidebar extends Mappers {
  logoutPage() {
    this.logOut()
    this.$router.push('/auth')
  }
  mounted() {
    const usernames = localStorage.getItem('user-username')
    if (usernames) {
      this.username = usernames
    }
  }
  getUserInfo() {
    const usernames = localStorage.getItem('user-username')
    if (!_.isEmpty(usernames)) {
      return usernames
    }
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
