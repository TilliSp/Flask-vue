<template>
  <div>
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
    <Registration/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Registration from '@/views/Registration.vue'
//import { checkEmail } from '@/utils/fieldValidation'
import UserAPI from "@/api/user";
import { userMapper } from '@/store/modules/user'
import {strCheck} from "@/utils/fieldValidation";

const Mapper = Vue.extend({
  computed: {
    ...userMapper.mapState(['userInfo', 'isBadAuth'])
  },
  methods: {
    ...userMapper.mapActions(['fetchLoginUser'])
  }
})

@Component({
  components: { Registration }
})
export default class Auth extends Mapper {
  private allFill = false
  private authData = {
    login: '', //'test1@mail.ru',
    password: '' //'test'
  }

  private strCheckPage(value: string) {
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
  private async loginClick() {
    const objReq: any = {
      username: this.authData.login,
      password: this.authData.password
    }
    // await UserAPI.login(objReq)
    // this.userInfo.username = this.authData.login
    await this.fetchLoginUser(objReq)
    this.$router.push('/books')
  }
}
</script>

<style lang="scss" scoped>
.authCard {
  margin-top: 30px;
/*  border: solid black 1px;*/
  width: 40%;
  margin-left: 30%;
  margin-right: 30%;
  /*background: black;*/
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
  border:0;
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
  border:0;
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
</style>
