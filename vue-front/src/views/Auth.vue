<template>
  <!-- <div>
    <div class="authCard">
      <div style="
      text-align: center;
      font-size:5rem"
      >
        Login
        </div>
      <div class="w-100 p-2">
        <b-form-input
          class="authInputElem"
          type="text"
          id="nameUserAuth"
          @input="onChangeField"
          v-model="authData.login"
          :state="!!authData.login && strCheckPage(authData.login)"
          placeholder="Username"
          trim
        />
      </div>
      <div class="w-100 p-2">
        <b-form-input
          class="authInputElem"
          id="surnameUserPersonal"
          type="password"
          @input="onChangeField"
          v-model="authData.password"
          :state="!!authData.password.length && strCheckPage(authData.login)"
          placeholder="Password"
          trim
        />
      </div>
      <div class="row authButton mt-2">
        <div class="col-lg-2">
          <b-button
          style="float:right;"
          :disabled="!allFill"
          @click="loginClick()"
          class="ml-5 btn-primary-outline authInputButton"
          variant="secondary"
          >
          Login
           </b-button>
        </div>
        <div class="col-lg-2">
          <b-button
          style="float:left;"
          @click="registrationClick()"
          class="ml-5 btn-primary-outline authInputButton"
          variant="secondary"
        >
        Registration
        </b-button>
        </div>
      </div>

      <br />
    </div>
    <Registration />
  </div> -->
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <v-card-title class="d-flex align-center justify-center py-7">
          <h2 class="text-2xl font-weight-semibold">Авторизация</h2>
        </v-card-title>

        <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary text-center">
            Введите логин и пароль
          </p>
        </v-card-text>

        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              v-model="authData.login"
              :state="!!authData.login && strCheckPage(authData.login)"
              outlined
              label="Логин"
              placeholder="IVAN"
              hide-details
              class="mb-3"
              trim
            ></v-text-field>

            <v-text-field
              v-model="authData.password"
              :state="
                !!authData.password.length && strCheckPage(authData.password)
              "
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Пароль"
              placeholder="············"
              :append-icon="
                isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
              "
              hide-details
              trim
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>
            <v-btn block color="primary" class="mt-6" @click="loginClick()">
              Войти
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <router-link :to="{ name: 'Registration' }">
            Перейти к регистрации
          </router-link>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Registration from '@/views/Registration.vue'
//import { checkEmail } from '@/utils/fieldValidation'
import { userMapper } from '@/store/modules/user'
import { strCheck } from '@/utils/fieldValidation'
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
const Mapper = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo'])
  },
  methods: {
    ...userMapper.mapActions(['fetchLoginUser'])
  }
})

@Component({
  components: { Registration }
})
export default class Auth extends Mapper {
  isPasswordVisible = false
  private allFill = false
  authData = {
    login: '', //'test1@mail.ru',
    password: '' //'test'
  }
  icons = {
    mdiEyeOutline,
    mdiEyeOffOutline
  }

  strCheckPage(value: string) {
    return strCheck(value)
  }

  // private checkEmail() {
  //   return checkEmail(this.authData.login)
  // }

  async created() {
    this?.onChangeField()
  }
  private onChangeField() {
    this.allFill = this.authData.login !== '' && this.authData.password !== ''
  }
  private registrationClick() {
    //this.$router.push('/registration')
    this.$bvModal.show('registrationModal')
  }
  async loginClick() {
    const objReq: any = {
      username: this.authData.login,
      password: this.authData.password
    }
    // await UserAPI.login(objReq)
    // this.userInfo.username = this.authData.login
    const data = await this.fetchLoginUser(objReq)
    if (data.ok) {
      this.$router.push('/profile')
    } else {
      // toastr message - unknown user or password
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
