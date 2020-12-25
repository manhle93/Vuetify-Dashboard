<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-img height="230px" :src="masterialPic">
            <v-card-text>
              <v-layout column class="align-center">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-avatar size="200" style="border: 4px solid white" v-bind="attrs" v-on="on" @click="uploadAvatar">
                      <img :src="USER.urlImage ? imageEndpoint + USER.urlImage : avatarNone" alt="ManhLe" />
                      <v-btn color="blue" fab x-small style="position: absolute; top: 155px; right: 50px">
                        <v-icon color="white">mdi-pencil</v-icon>
                      </v-btn>
                    </v-avatar>
                  </template>
                  <span>Upload Ảnh đại diện</span>
                </v-tooltip>
              </v-layout>
              <input name="avatar" ref="upload-image" style="display: none" type="file" @change="handleUpload($event)" />
            </v-card-text>
          </v-img>
          <v-layout column class="align-center">
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
            <div class="mb-2">
              Quyền quản trị: {{ USER && USER.role ? USER.role.name + " - " + USER.role.description : "" }}
            </div>
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
import {changePassword} from "@/api/user";
import avatarNone from "../../../../docs/img/avatar_none.png";
import masterialPic from "../../../../docs/img/masterial.png";

export default {
  components: {Inbox},
  data: () => ({
    avatarNone,
    masterialPic,
    tab: null,
    imageEndpoint: process.env.VUE_APP_BASE,
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
      if (!this.changePassWord.reNewPassWord) return () => "Hãy nhập lại mật khẩu mới";
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
    uploadAvatar() {
      this.$refs["upload-image"].click();
    },
    handleUpload(e) {
      let files = e.target.files;
      let data = new FormData();
      data.append("file", files[0]);

      var filePath = files[0].name.split(".").pop(); //lấy định dạng file
      var dinhDangChoPhep = ["jpg", "jpeg", "png"]; //các tập tin cho phép
      const isLt2M = files[0].size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.form.fileList.pop();
        this.$toast.warning("Kích thước file ảnh tối đa 20Mb!", {
          position: "top-center",
          timeout: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
        });
        return false;
      }
      if (!dinhDangChoPhep.find(el => el == filePath.toLowerCase())) {
        this.loadingUpload = false;
        this.listLoading = false;
        this.iconUpload = "el-icon-bottom";
        this.$toast.warning("Tập tin không hợp lệ!", {
          position: "top-center",
          timeout: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: false,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
        });
        return;
      } else {
        // uploadAvatar(data)
        //   .then((res) => {
        //     this.src = process.env.VUE_APP_BASE + res;
        //   })
        //   .catch((error) => {});
      }
      this.$refs["upload-image"].value = null;
    },
    changePass() {
      this.showFormChangePass = true;
      this.changePassWord = {
        currentPass: null,
        newPassWord: null,
        reNewPassWord: null,
      };
    },
    async updatePass() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        try {
          this.btnLoading = true;
          await changePassword(this.changePassWord);
          this.showFormChangePass = false;
          this.btnLoading = false;
          this.changePassWord = {
            currentPass: null,
            newPassWord: null,
            reNewPassWord: null,
          };
          this.$toast.info("Đổi mật khẩu thành công!", {
            position: "top-center",
            timeout: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
          });
          window.location.reload();
        } catch (error) {
          this.btnLoading = false;
        }
      }
    },
  },
  created() {
    console.log(3232, this.USER);
  },
};
</script>
