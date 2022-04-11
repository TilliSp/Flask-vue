<template>
  <div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: { }
})
export default class Home extends Vue {
  mounted() {

    //this.$router.push('/')
  }
}
</script>
