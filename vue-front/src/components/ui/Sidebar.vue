<template>
  <div>
    <b-sidebar id="main-sidebar" title="СайдБар" backdrop>
      <hr />
      Test
      <b-nav vertical class="py-1 px-1">
        <b-nav-item to="/books">Books</b-nav-item>
        <b-nav-item to="/about">about</b-nav-item>
        <b-nav-item to="/admin" v-if="role === 4">admin</b-nav-item>
        <b-nav-item to="/lorem" v-if="role !== 0">
          <font-awesome-icon :icon="['fas', 'biking']" />
          lorem 
        </b-nav-item>
      </b-nav>
    </b-sidebar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { RouteConfigSingleView } from 'vue-router/types/router'
import {userMapper} from "@/store/modules/user";

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['role'])
  }
})

@Component({ components: { } })
export default class Sidebar extends Mappers {
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
