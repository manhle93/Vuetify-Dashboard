<template>
  <v-dialog v-model="show" persistent width="800">
    <v-card>
      <v-card-title class="headline">{{ edit ? "CẬP NHẬT THÔNG TIN NGƯỜI DÙNG" : "THÊM MỚI NGƯỜI DÙNG" }}</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row>
            <v-col cols="5" class="d-flex flex-column align-center">
              <v-img height="200px" :src="masterialPic">
                <v-card-text>
                  <v-layout column class="align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <v-avatar size="180" v-bind="attrs" v-on="on" @click="uploadAvatar">
                          <v-img :src="form.urlImage ? imageEndpoint + form.urlImage : avatarNone"></v-img>
                          <v-btn color="blue" fab x-small style="position: absolute; top: 130px; right: 40px">
                            <v-icon color="white">mdi-pencil</v-icon>
                          </v-btn>
                        </v-avatar>
                      </template>
                      <span>Upload Ảnh đại diện</span>
                    </v-tooltip>
                  </v-layout>
                  <input ref="upload-image" style="display: none" type="file" @change="handleUpload($event)" />
                </v-card-text>
              </v-img>
              <v-layout column class="align-center">
                <v-text-field
                  placeholder="E-Mail"
                  prepend-inner-icon="mdi-email"
                  v-model="form.email"
                  :rules="formValidate.email"
                ></v-text-field>
                <v-text-field
                  placeholder="Tên đăng nhập"
                  prepend-inner-icon="mdi-account"
                  v-model="form.userName"
                  :rules="formValidate.userName"
                ></v-text-field>
              </v-layout>
            </v-col>
            <v-col cols="7">
              <div class="label-form">Tên người dùng</div>
              <v-text-field
                placeholder="Nhập tên người dùng"
                :rules="formValidate.name"
                outlined
                dense
                prepend-inner-icon="mdi-account"
                v-model="form.name"
              ></v-text-field>
              <div class="label-form">Quyền quản trị</div>
              <v-select
                v-model="form.roleId"
                :items="roles"
                :rules="formValidate.roleId"
                outlined
                dense
                item-text="name"
                item-value="id"
                prepend-inner-icon="mdi-wrench"
                placeholder="Chọn quyền quản trị"
              >
                <template v-slot:selection="{item}">
                  {{ item.name + " - " + item.description }}
                </template>
                <template v-slot:item="{item, attrs, on}">
                  <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row no-gutters align="center">
                          <span>{{ item.name }}</span>
                          <v-spacer></v-spacer>
                          <v-chip text-color="white" color="green" small>{{ item.description }}</v-chip>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-select>
              <br />
              <div class="label-form" style="font-weight: bold">Mật khẩu đăng nhập</div>
              <v-row>
                <v-col cols="6"
                  ><v-text-field
                    v-model="form.password"
                    placeholder="Mật khẩu"
                    outlined
                    dense
                    :rules="edit ? [] : formValidate.password"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                  ></v-text-field
                ></v-col>
                <v-col cols="6"
                  ><v-text-field
                    v-model="form.confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    outlined
                    type="password"
                    :rules="[confirmPassword]"
                    dense
                    prepend-inner-icon="mdi-lock"
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="show = false" class="mr-4">Đóng</v-btn>
        <v-btn :loading="btnLoading" color="primary" @click="addUser" v-if="!edit">
          <v-icon left>mdi-plus</v-icon>
          Thêm mới
        </v-btn>
        <v-btn :loading="btnLoading" color="primary" @click="updateUser" v-else>
          <v-icon left>mdi-pencil</v-icon>
          Cập nhật
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import avatarNone from "../../../../docs/img/avatar_none.png";
import masterialPic from "../../../../docs/img/masterial.png";

export default {
  props: ["roles"],
  data: () => ({
    avatarNone,
    masterialPic,
    show: false,
    edit: false,
    parentMenus: [],
    imageEndpoint: process.env.VUE_APP_BASE,
    btnLoading: false,
    form: {
      roleId: null,
      email: "",
      name: null,
      password: null,
      confirmPassword: null,
      userName: null,
      urlImage: null,
    },
    formValidate: {
      name: [
        v => !!v || "Tên người dùng không thể bỏ trống",
        v => (v && v.length >= 3) || "Tên người dùng tối thiểu 3 ký tự",
      ],
      email: [v => !!v || "E-Mail không thể bỏ trống", v => /.+@.+\..+/.test(v) || "E-mail không hợp lệ"],
      roleId: [v => !!v || "Hãy chọn một quyền quản trị!"],
      password: [v => !!v || "Mật khẩu không thể bỏ trống"],
      userName: [
        v => !!v || "Tên đăng nhập không thể bỏ trống",
        v => (v && v.length >= 3) || "Tên đăng nhập tối thiểu 3 ký tự",
      ],
    },
  }),
  computed: {
    confirmPassword() {
      return () => this.form.confirmPassword === this.form.password || "Mật khẩu không trùng khớp";
    },
  },
  methods: {
    showFormAdd() {
      this.show = true;
      this.edit = false;
      this.form = {
        roleId: null,
        email: "",
        name: null,
        password: null,
        confirmPassword: null,
        userName: null,
        urlImage: null,
      };
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    async showFormEdit(data) {
      this.edit = true;
      this.show = true;
      this.form = {...data};
    },

    async addUser() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          this.show = false;
          this.btnLoading = false;
          this.$emit("on-done");
          this.$toast.info("Tạo người dùng thành công", {
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
        } catch (error) {
          this.btnLoading = false;
          this.show = false;
        }
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
    async updateUser() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          this.show = false;
          this.btnLoading = false;
          this.$emit("on-done");
          this.$toast.info("Cập nhật thành công", {
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
        } catch (error) {
          this.btnLoading = false;
          this.show = false;
        }
      }
    },
  },
};
</script>
