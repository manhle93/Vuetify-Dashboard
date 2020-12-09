<template>
  <v-dialog v-model="show" persistent width="600">
    <v-card>
      <v-card-title class="headline">THÊM MENU HỆ THỐNG</v-card-title>
      <br />
      <v-card-text>
        <v-form ref="form">
          <div class="label-form">Menu cha</div>
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
            placeholder="Chọn menu cha"
          ></v-select>
          <div class="label-form">Tên Menu</div>
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            placeholder="Nhập tên Menu"
            outlined
            dense
            :prepend-inner-icon="form.icon ? form.icon : 'mdi-menu'"
          ></v-text-field>
          <v-row>
            <v-col cols="9">
              <div class="label-form">Biểu tượng Icon</div>
              <v-text-field
                v-model="form.icon"
                placeholder="Mã icon"
                outlined
                dense
                prepend-inner-icon="mdi-label"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <div class="label-form">Hình ảnh Icon</div>
              <v-btn style="width: 100%">
                <v-icon>{{ form.icon }}</v-icon>
              </v-btn>
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
import {getParentMenu, editMenu, addMenu} from "@/api/menu";
export default {
  data: () => ({
    show: false,
    edit: false,
    iconParentMenu: "mdi-menu",
    parentMenus: [],
    btnLoading: false,
    form: {
      parentId: null,
      name: null,
      icon: null,
    },
    nameRules: [v => !!v || "Tên Menu không thể bỏ trống", v => (v && v.length >= 3) || "Tên Menu tối thiểu 3 ký tự"],
  }),
  computed: {},
  methods: {
    showFormAdd() {
      this.show = true;
      this.edit = false;
      this.getParentMenu();
    },
    async showFormEdit(data) {
      this.edit = true;
      await this.getParentMenu();
      this.show = true;
      this.form = data;
      this.iconParentMenu = data.Parent ? data.Parent.icon : "mdi-menu";
    },
    async getParentMenu() {
      let data = await getParentMenu();
      this.parentMenus = data;
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
  },
};
</script>
