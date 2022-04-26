<template>
  <div>
    <div>Пользователь: {{ username }}</div>
    <button type="button" class="btn btn-success btn-sm" @click="passChange">
      Сменить пароль
    </button>
    <br />
    <hr />
    <PassswordChange/>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PassswordChange from '@/views/PasswordChange.vue'
import { RouteConfigSingleView } from 'vue-router/types/router'
import { userMapper } from '@/store/modules/user'
import store from '@/store'
import _ from 'lodash'

const Mappers = Vue.extend({
  computed: {
     ...userMapper.mapState(['userInfo', 'isBadAuth']),
     ...userMapper.mapState(['username'])
  },
  methods: {
    ...userMapper.mapActions(['fetchLoginUser'])
  }
})

@Component({ 
    components: {   PassswordChange  } 
})

export default class Profile extends Mappers {
  private allFill = false
  private passChange() {
    //this.$router.push('/registration')
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