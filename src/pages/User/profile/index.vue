<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-img height="230px" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
            <v-card-text>
              <v-layout column style="align-items: center">
                <v-avatar size="200">
                  <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                  <v-btn color="blue" fab x-small style="position: absolute; top: 155px; right: 50px">
                    <v-icon color="white">mdi-pencil</v-icon>
                  </v-btn>
                </v-avatar>
              </v-layout>
            </v-card-text>
          </v-img>
          <v-layout column style="align-items: center">
            <v-card-title>{{ USER.name }}</v-card-title>
            <v-card-subtitle>{{ USER.email }}</v-card-subtitle>
            <v-btn rounded color="primary" dark small @click="changePass()">
              <v-icon left small>
                mdi-key
              </v-icon>
              Đổi mật khẩu
            </v-btn>
          </v-layout>
          <v-card-title class="pt-0 pb-2 pl-8">Thông tin</v-card-title>
          <v-layout column class="pl-8 pb-6">
            <div class="mb-2">
              Ngày tham gia: <strong>{{ formatDate(USER.createdAt) }}</strong>
            </div>
            <div class="mb-2">
              Tên đăng nhập: <strong>{{ USER.userName }}</strong>
            </div>
            <div class="mb-2">Quyền quản trị:</div>
            <span></span>
          </v-layout>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>Your Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-tabs v-model="tab" align-with-title>
                <v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab>HỘP THƯ</v-tab>
                <v-tab>THÔNG BÁO</v-tab>
                <v-tab>CẬP NHẬT THÔNG TIN</v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text><Inbox /></v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>333</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>3332222</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showFormChangePass" persistent width="500">
      <v-card>
        <v-card-title class="headline">THAY ĐỔI MẬT KHẨU</v-card-title>
        <br />
        <v-card-text>
          <v-form ref="form">
            <div class="label-form">Mật khẩu hiện tại</div>
            <v-text-field
              type="password"
              v-model="changePassWord.currentPass"
              :rules="rulePass.currentPass"
              placeholder="Nhập mật khẩu hiện tại"
              outlined
              dense
              prepend-inner-icon="mdi-account-key"
            ></v-text-field>
            <div class="label-form">Mật khẩu mới</div>
            <v-text-field
              type="password"
              v-model="changePassWord.newPassWord"
              :rules="rulePass.newPassWord"
              placeholder="Nhập mật khẩu mới"
              outlined
              dense
              prepend-inner-icon="mdi-lock"
            ></v-text-field>
            <div class="label-form">Xác nhận mật khẩu mới</div>
            <v-text-field
              type="password"
              v-model="changePassWord.reNewPassWord"
              :rules="[reNewPassWord]"
              placeholder="Nhập lại mật khẩu mới"
              outlined
              dense
              prepend-inner-icon="mdi-lock"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showFormChangePass = false" class="mr-4">Đóng</v-btn>
          <v-btn :loading="btnLoading" color="primary" @click="updatePass">
            <v-icon left>mdi-pencil</v-icon>
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import Inbox from "./dashboard/inbox";
export default {
  components: {Inbox},
  data: () => ({
    tab: null,
    showFormChangePass: false,
    changePassWord: {
      currentPass: null,
      newPassWord: null,
      reNewPassWord: null,
    },
    btnLoading: false,
    rulePass: {
      currentPass: [v => !!v || "Hãy nhập mật khẩu hiện tại"],
      newPassWord: [v => !!v || "Hãy nhập mật khẩu mới"],
    },
  }),
  computed: {
    USER() {
      return this.$store.state.User.me;
    },
    reNewPassWord() {
      if(! this.changePassWord.reNewPassWord)return () => 'Hãy nhập lại mật khẩu mới';
      return () => this.changePassWord.newPassWord === this.changePassWord.reNewPassWord || "Mật khẩu không trùng khớp";
    },
  },
  methods: {
    formatDate(e) {
      try {
        let date = new Date(e);
        let ngay = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let thang = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
        return ngay + "/" + thang + "/" + date.getFullYear();
      } catch (error) {
        return "";
      }
    },
    changePass() {
      this.showFormChangePass = true;
      this.changePassWord = {
        currentPass: null,
        newPassWord: null,
        reNewPassWord: null,
      };
    },
    updatePass() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        console.log(2121);
      }
    },
  },
  created() {
    console.log(3232, this.USER);
  },
};
</script>
