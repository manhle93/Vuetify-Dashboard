<template>
  <v-container fluid>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">DANH SÁCH MENU</v-list-item-title>
          <v-list-item-subtitle>Tạo và cập nhật menu hệ thống. Chức năng dành cho nhà phát triển</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn color="teal" @click="createMenu()">
          <v-icon left color="white">mdi-plus</v-icon>
          <span style="color: white">Tạo Menu</span>
        </v-btn>
      </v-list-item>
    </v-card>
    <br />
    <v-data-table
      :headers="headers"
      :items="tableData"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:[`item.icon`]="{item}">
        <v-icon>{{ item.icon }}</v-icon>
      </template>
      <template v-slot:[`item.action`]="{item}">
        <v-tooltip left>
          <template v-slot:activator="{on, attrs}">
            <v-icon v-bind="attrs" v-on="on" @click="editMenu(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Cập nhật Menu</span>
        </v-tooltip>
        <v-tooltip right>
          <template v-slot:activator="{on, attrs}">
            <v-icon color="pink" class="ml-4" v-bind="attrs" v-on="on" @click="showConfirmDelete(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Xóa Menu</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <div class="pt-2">
      <v-pagination v-model="page" :length="pageCount" @input="changePage">></v-pagination>
    </div>
    <create-edit ref="menuForm" @on-done="getMenu"></create-edit>
    <v-dialog v-model="confirmDelete" width="450">
      <v-card>
        <v-card-title class="headline">
          Xóa Menu hệ thống?
        </v-card-title>

        <v-card-text>
          <div>
            Bạn có chắc chắn muốn xóa Menu: <strong>{{ menu.name }}</strong> ?
          </div>
          <br />
          <div>
            Mục <strong>{{ menu.name }}</strong> Sẽ không thể truy cập và không hiển thị trên hệ thống
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="confirmDelete = false">
            Hủy bỏ
          </v-btn>

          <v-btn :loading="btnLoading" color="primary" @click="xoaMenu" class="mr-3">
            <v-icon left>mdi-delete</v-icon>
            Xóa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {getMenuAdmin, deleteMenu} from "@/api/menu";
import CreateEdit from "./create-edit";
export default {
  components: {CreateEdit},
  data() {
    return {
      page: 1,
      pageCount: 1,
      itemsPerPage: 10,
      tableData: [],
      btnLoading: false,
      menu: {},
      confirmDelete: false,
      loading: false,
      headers: [
        {text: "STT", width: "100", sortable: false},
        {text: "Icon", value: "icon", sortable: false},
        {
          text: "Tên Menu",
          align: "start",
          sortable: false,
          value: "name",
        },
        {text: "Menu cha", value: "Parent.name"},
        {text: "Hành động", value: "action", sortable: false},
      ],
    };
  },
  computed: {},
  created() {
    this.getMenu();
  },
  methods: {
    async getMenu() {
      this.loading = true;
      let data = await getMenuAdmin({
        page: this.page,
        perPage: this.itemsPerPage,
      });
      this.loading = false;
      this.tableData = data.docs;
      this.pageCount = data.pages;
    },
    changePage(val) {
      this.page = val;
      this.getMenu();
    },
    showConfirmDelete(data) {
      this.menu = data;
      this.confirmDelete = true;
    },
    editMenu(menu) {
      this.$refs.menuForm.showFormEdit(menu);
    },
    async xoaMenu() {
      this.btnLoading = true;
      try {
        await deleteMenu({id: this.menu.id});
        this.btnLoading = false;
        this.confirmDelete = false
        this.$toast.info("Xóa Menu thành công", {
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
        this.getMenu();
      } catch (error) {
        this.btnLoading = false;
        this.confirmDelete = false
      }
    },
    createMenu() {
      this.$refs.menuForm.showFormAdd();
    },
  },
};
</script>
