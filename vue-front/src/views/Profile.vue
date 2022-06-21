<template>
  <div>
    <div>Пользователь: {{ userInfo.username }}</div>
    <button type="button" class="btn btn-success btn-sm" @click="passChange">
      Сменить пароль
    </button>
    <button type="button" class="btn btn-success btn-sm" @click="File">
      Покажи файлы
    </button>
    <div>Пользователь: {{ userInfo.username }}</div>
    <br />
    <hr />
    <PasswordChange />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PasswordChange from '@/views/PasswordChange.vue'
//import { RouteConfigSingleView } from 'vue-router/types/router'

import { userMapper } from '@/store/modules/user'

const Mappers = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo'])
  }
})

@Component({
  components: { PasswordChange }
})
export default class Profile extends Mappers {
  private allFill = false

  private passChange() {
    this.$bvModal.show('passwordModal')
  }
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
