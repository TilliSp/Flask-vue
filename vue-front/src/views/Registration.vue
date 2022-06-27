<template>
  <!-- <div class="authCard">
    <b-modal
      id="registrationModal"
      title="Регистрация"
      size="lg"
      @ok="registrationClick"
    >
      <div class="w-100 p-2">
        <label class="centertext">Логин:</label>
        <b-form-input
          class="authInputElem"
          type="text"
          id="nameUserAuth"
          @input="onChangeField"
          v-model="authData.login"
          :state="!!authData.login.length && strCheckPage(authData.login)"
          placeholder="Username"
          trim
        />
      </div>
      <div class="w-100 p-2">
        <label class="centertext">Пароль:</label>
        <b-form-input
          class="authInputElem"
          id="surnameUserPersonal"
          type="password"
          @input="onChangeField"
          v-model="authData.password"
          placeholder="Password"
          trim
        />
        <div
          v-if="
            authData.password.length > 0 && !strCheckPage(authData.password)
          "
          style="color: red; text-align: center;"
        >
          Пароль может содержать только латинские буквы, цифры и символы: .!@-_
        </div>
      </div>
      <div class="w-100 p-2">
        <label class="centertext align-content-center"
          >Подтверждение пароля</label
        >
        <b-form-input
          class="authInputElem"
          id="passwordConfirmPersonal"
          type="password"
          @input="onChangeField"
          v-model="authData.passwordConfirm"
          :state="authData.passwordConfirm === authData.password"
          placeholder="Confir password"
          trim
        />
        <div v-if="confirmPassword()" style="color: red; text-align: center;">
          Пароли не совпадают!
        </div>
      </div>
      <div class="row authButton mt-2">
        <div class="col-lg-2">
          <b-button
            style="float:left;"
            @click="registrationClick()"
            class="ml-4 btn-primary-outline authInputButton"
            variant="secondary"
            :disabled="!allFill"
          >
            Registration
          </b-button>
        </div>
      </div>

      <br />
    </b-modal>
  </div> -->
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <h2 class="text-2xl font-weight-semibold">Регистрация</h2>
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p
            class="text-2xl font-weight-semibold text--primary mb-2 text-center"
          >
            Придумайте логин и пароль
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              @input="onChangeField"
              v-model="authData.login"
              :state="!!authData.login.length && strCheckPage(authData.login)"
              outlined
              label="Логин"
              placeholder="Ivan"
              hide-details
              class="mb-3"
              trim
            ></v-text-field>

            <v-text-field
              @input="onChangeField"
              v-model="authData.password"
              outlined
              label="Пароль"
              placeholder="············"
              :append-icon="
                isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
              "
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
              class="mb-3"
              trim
            ></v-text-field>

            <v-text-field
              @input="onChangeField"
              v-model="authData.passwordConfirm"
              outlined
              :type="isPasswordVisible_1 ? 'text' : 'password'"
              label="Повторите пароль"
              placeholder="············"
              trim
              :append-icon="
                isPasswordVisible_1
                  ? icons.mdiEyeOffOutline
                  : icons.mdiEyeOutline
              "
              hide-details
              @click:append="isPasswordVisible_1 = !isPasswordVisible_1"
            ></v-text-field>
            <div
              v-if="
                authData.password.length > 0 && !strCheckPage(authData.password)
              "
              style="color: red; text-align: center"
            >
              Пароль может содержать только латинские буквы, цифры и символы:
              .!@-_
            </div>
            <div
              v-if="
                authData.password.length < 6 && authData.password.length > 0
              "
              style="color: red; text-align: center"
            >
              Минимальная длина пароля 6 символов
            </div>
            <div
              v-if="confirmPassword()"
              style="color: red; text-align: center"
            >
              Пароли не совпадают!
            </div>
            <v-btn
              @click="registrationClick"
              block
              color="primary"
              class="mt-6"
            >
              Зарегистрироваться
            </v-btn>
          </v-form>
        </v-card-text>

        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <router-link :to="{ name: 'Auth' }">
            Перейти к авторизации
          </router-link>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
//import { checkEmail } from '@/utils/fieldValidation'
import { userMapper } from '@/store/modules/user'
import { strCheck } from '@/utils/fieldValidation'
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

const Mapper = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo'])
  },
  methods: {
    ...userMapper.mapActions(['fetchRegisterUser'])
  }
})

@Component({
  components: {}
})
export default class Registration extends Mapper {
  private allFill = false
  isPasswordVisible = false
  isPasswordVisible_1 = false
  authData = {
    login: '', //'test1@mail.ru',
    password: '', //'test'
    passwordConfirm: ''
  }
  icons = {
    mdiEyeOutline,
    mdiEyeOffOutline
  }
  // private checkEmail() {
  //   return checkEmail(this.authData.login)
  // }
  strCheckPage(value: string) {
    return strCheck(value)
  }

  async created() {
    this?.onChangeField()
  }
  onChangeField() {
    this.allFill =
      this.authData.login !== '' &&
      this.authData.password !== '' &&
      this.authData.password === this.authData.passwordConfirm &&
      strCheck(this.authData.login) &&
      strCheck(this.authData.password)
  }

  confirmPassword() {
    return (
      this.authData.passwordConfirm !== '' &&
      this.authData.passwordConfirm !== this.authData.password
    )
  }
  async registrationClick() {
    const objReq: any = {
      username: this.authData.login,
      password: this.authData.password
    }
    await this.fetchRegisterUser(objReq)
    console.log('test registrationClick: ')
    // await UserAPI.login(objReq)
    // this.userInfo.username = this.authData.login
    //await this.fetchLoginUser(objReq)
    this.$router.push('/books')
    //this.$bvModal.close('registrationModal')
  }
}
</script>

<style lang="scss" scoped>
.authCard {
  margin-top: 300px;
  width: 40%;
  margin-left: 30%;
  margin-right: 30%;
  background: black;
}
.authButton {
  width: 20%;
  margin-left: 35%;
  margin-right: 40%;
}
.authLink {
  width: 15%;
  margin-left: 45%;
}
.authInputElem {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 455px;
  outline: none;
  color: black;
  border-radius: 24px;
  transition: 0.25s;
}
.authInputElem:focus {
  width: 280px;
  border-color: #192bb1;
}
.authInputButton {
  border: 0;
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #192bb1;
  padding: 14px 40px;
  outline: none;
  color: black;
  border-radius: 24px;
  transition: 0.25s;
  cursor: pointer;
}
.authInputButton:hover {
  background: #192bb1;
}
.centertext {
  text-align: center;
}
</style>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
