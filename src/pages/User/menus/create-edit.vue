<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <v-card-title class="headline">{{edit ? 'CẬP NHẬT MENU HỆ THỐNG': 'THÊM MENU HỆ THỐNG'}}</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form">
          <div class="label-form">Menu - Router cha</div>
          <v-select
            clearable
            v-model="form.parentId"
            :items="parentMenus"
            item-text="name"
            item-value="id"
            :prepend-inner-icon="iconParentMenu"
            outlined
            @change="changeIconParentMenu()"
            dense
            placeholder="Chọn Menu - Router cha "
          ></v-select>
          <v-row>
            <v-col cols="8">
              <div class="label-form">Tên Menu - Router</div>
              <v-text-field
                v-model="form.name"
                :rules="nameRules"
                placeholder="Nhập tên Menu - Router"
                outlined
                dense
                :prepend-inner-icon="form.icon ? form.icon : 'mdi-menu'"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <div class="label-form">STT Vị trí</div>
              <v-text-field v-model="form.order" type="number" placeholder="Nhập STT" outlined dense></v-text-field>
            </v-col>
            <v-col cols="8">
              <div class="label-form">Biểu tượng Menu Icon</div>
              <v-text-field
                v-model="form.icon"
                placeholder="Mã icon"
                outlined
                dense
                prepend-inner-icon="mdi-label"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <div class="label-form">Hình ảnh Icon</div>
              <v-btn style="width: 100%">
                <v-icon>{{ form.icon }}</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="8">
              <div class="label-form">Quyền truy cập</div>
              <v-select
                v-model="form.roles"
                :items="roles"
                multiple
                outlined
                dense
                item-text="name"
                item-value="id"
                prepend-inner-icon="mdi-wrench"
              >
                <template v-slot:prepend-item>
                  <v-list-item ripple @click="selectAllRoles">
                    <v-list-item-action>
                      <v-icon :color="form.roles.length > 0 ? 'indigo darken-4' : ''">
                        {{ form.roles.length == roles.length ? "mdi-close-box" : "mdi-checkbox-blank-outline" }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Chọn tất cả
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </v-col>
            <v-col cols="4">
              <div class="label-form">Ẩn/Hiện Menu</div>
              <v-select v-model="form.hidden" :items="menuType" outlined dense item-text="name" item-value="value">
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="show = false" class="mr-4">Đóng</v-btn>
        <v-btn :loading="btnLoading" color="primary" @click="addMenu" v-if="!edit">
          <v-icon left>mdi-plus</v-icon>
          Thêm mới
        </v-btn>
        <v-btn :loading="btnLoading" color="primary" @click="editMenu" v-else>
          <v-icon left>mdi-pencil</v-icon>
          Cập nhật
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {getParentMenu, editMenu, addMenu, getRoles} from "@/api/menu";
export default {
  data: () => ({
    show: false,
    edit: false,
    iconParentMenu: "mdi-menu",
    parentMenus: [],
    roles: [],
    btnLoading: false,
    form: {
      parentId: null,
      name: null,
      icon: null,
      hidden: false,
      roles: [],
      order: null
    },
    menuType: [
      {name: "Hiện", value: false},
      {name: "Ẩn", value: true},
    ],
    nameRules: [v => !!v || "Tên Menu không thể bỏ trống", v => (v && v.length >= 3) || "Tên Menu tối thiểu 3 ký tự"],
  }),
  computed: {},
  methods: {
    showFormAdd() {
      this.show = true;
      this.edit = false;
      this.form = {
        parentId: null,
        name: null,
        icon: null,
        hidden: false,
        roles: [],
        order: null
      };
      this.getParentMenu();
      this.getAllRoles();
    },
    async showFormEdit(data) {
      this.edit = true;
      await this.getParentMenu();
      this.getAllRoles();
      this.show = true;
      this.form = {...data};
      this.form.roles = data.roles.map(el => el.roleId);
      this.iconParentMenu = data.Parent ? data.Parent.icon : "mdi-menu";
      if(!data.parentId){
        let index = this.parentMenus.findIndex(el => el.id == data.id)
        this.parentMenus.splice(index,1 )
      }
    },
    async getParentMenu() {
      let data = await getParentMenu();
      this.parentMenus = data;
    },
    async getAllRoles() {
      let data = await getRoles();
      this.roles = data;
    },
    changeIconParentMenu() {
      if (this.form.parentId) {
        let menu = this.parentMenus.find(el => el.id == this.form.parentId);
        this.iconParentMenu = menu ? menu.icon : "mdi-menu";
      } else {
        this.iconParentMenu = "mdi-menu";
      }
    },
    async addMenu() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          await addMenu(this.form);
          this.show = false;
          this.btnLoading = false;
          this.$emit("on-done");
          this.$toast.info("Thêm Menu thành công", {
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
    async editMenu() {
      this.$refs.form.validate();
      if (this.$refs.form.validate()) {
        this.btnLoading = true;
        try {
          await editMenu(this.form);
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
    selectAllRoles() {
      this.$nextTick(() => {
        if (this.form.roles.length == this.roles.length) {
          this.form.roles = [];
        } else {
          this.form.roles = this.roles.slice();
        }
      });
    },
  },
};
</script>
