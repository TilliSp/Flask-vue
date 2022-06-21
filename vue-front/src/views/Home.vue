<template>
  <div>
    <b-button v-b-toggle.main-sidebar class="sidebar-button" v-if="_isAuth">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </b-button>
    <Sidebar />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Sidebar from '@/components/ui/Sidebar.vue'
import { userMapper } from '@/store/modules/user'

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['_isAuth'])
  }
})

@Component({
  components: {
    Sidebar
  }
})
export default class Home extends Mappers {
  getAuth() {
    return this._isAuth
  }
  mounted() {
    //this.$router.push('/')
  }
}
</script>

<style scoped>
.sidebar-button {
  background: white;
  border: 1px solid #0c2461;
  margin: 5px;
}
</style>
