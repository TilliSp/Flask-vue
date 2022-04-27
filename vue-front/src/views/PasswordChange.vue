<template>
  <div class="authCard">
    <b-modal
      hide-footer="true"
      id="passwordModal"
      title="Регистрация"
      size="lg"
      @ok="passChange"
    >
      <div class="w-100 p-2">
        <label class="centertext">Старый пароль:</label>
        <b-form-input
          class="authInputElem"
          type="password"
          id="nameUserAuth"
          @input="onChangeField"
          v-model="authData.passwordOld"
          :state="!!authData.passwordOld.length && strCheckPage(authData.passwordOld)"
          placeholder="Введите старый пароль"
          trim
        />
      </div>
      <input type="checkbox" onclick="showPassword()">Show Password


      <div class="w-100 p-2">
        <label class="centertext">Новый пароль:</label>
        <b-form-input
          class="authInputElem"
          id="passwordNew"
          type="password"
          @input="onChangeField"
          v-model="authData.password"
          :state="!!authData.password.length"
          placeholder="Введите новый пароль"
          trim
        />
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
          placeholder="Повторите новый пароль"
          trim
        />
        <div v-if="confirmPassword()" style="color: red; text-align: center">
          Пароли не совпадают!
        </div>
      </div>
      <div class="row authButton mt-2"  style="justify-content: center">
        
          <b-button
            style="float: left"
            @click="registrationClick()"
            class="ml-4 btn-primary-outline authInputButton"
            variant="secondary"
            :disabled="!allFill"
          >
            Сохранить
          </b-button>
       
      </div>

      <br />
    </b-modal>
  </div>
</template>

<script lang="ts">



 import { Component, Vue } from 'vue-property-decorator'
 // //import { checkEmail } from '@/utils/fieldValidation'
 import UserAPI from "@/api/user"
 import {PasswordChangeI}  from "@/api/user"
  import passChange  from "@/api/user";
 import { userMapper } from '@/store/modules/user'
import {strCheck} from "@/utils/fieldValidation"


const Mapper = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo', 'isBadAuth','username'])
  },
  methods: {
    ...userMapper.mapActions(['fetchRegisterUser'])
  }
})

@Component({
  components: { }
})
export default class PasswordChange extends Mapper {  
  private allFill = false
  private authData:PasswordChangeI = {
    username: this.username,
    passwordOld: '', //'test1@mail.ru',
    password: '', //'test'
    passwordConfirm: ''
  }
  // private PasswordChangeI = this.authData
  //const passwordField = document.querySelector('#nameUserAuth')
  private showPassword(){
    console.log('test showPassword: ')
  }

  // private checkEmail() {
  //   return checkEmail(this.authData.login)
  // }
  private strCheckPage(value: string) {
    return strCheck(value)
  }

  async created() {
    this?.onChangeField()
  }
  private onChangeField() {
    this.allFill =
        this.authData.passwordOld !== ''
        && this.authData.password !== ''
        && this.authData.password === this.authData.passwordConfirm
        && strCheck(this.authData.passwordOld)
        && strCheck(this.authData.password)
  }

  private confirmPassword() {
    return this.authData.passwordConfirm !== '' && this.authData.passwordConfirm !== this.authData.password
  }
  //  private async registrationClick(){
  //     await this.passChange(PasswordChangeI)
  //   console.log('test passChange: ')
  //  }
  
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
