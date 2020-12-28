<template>
  <v-container fluid>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"><v-icon size="40">mdi-menu</v-icon> DANH SÁCH MENU</v-list-item-title>
          <v-list-item-subtitle>Tạo và cập nhật menu hệ thống. Chức năng dành cho nhà phát triển</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn color="teal" @click="createMenu()">
          <v-icon left color="white">mdi-plus</v-icon>
          <span style="color: white">Tạo Menu</span>
        </v-btn>
      </v-list-item>
    </v-card>
    <br />
    <v-card class="mb-1">
      <v-card-title class="pa-6 pb-4">
        <p>Menu</p>
        <v-spacer></v-spacer>
        <div style="width: 300px">
          <v-text-field
            append-icon="mdi-magnify"
            v-model="search"
            label="Tìm kiếm"
            clearable
            single-line
            hide-details
          ></v-text-field>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="tableData"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        :loading="loading"
        class="elevation-1"
        loading-text="Đang tải dữ liệu ..."
      >
        <template v-slot:[`item.icon`]="{item}">
          <v-icon>{{ item.icon }}</v-icon>
        </template>
        <template v-slot:[`item.order`]="{item}">
          <span>{{ item.Parent ? item.Parent.order + "-" + item.order : item.order }}</span>
        </template>
        <template v-slot:[`item.action`]="{item}">
          <v-menu>
            <template v-slot:activator="{on, attrs}">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon color="textColor">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="editMenu(item)">
                <v-list-item-title>
                  <v-icon class="mr-2">
                    mdi-pencil
                  </v-icon>
                  Cập nhật</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="xoaMenu(item)">
                <v-list-item-title>
                  <v-icon class="mr-2">
                    mdi-delete
                  </v-icon>
                  Xóa Menu</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- <v-tooltip left>
            <template v-slot:activator="{on, attrs}">
              <v-icon v-bind="attrs" v-on="on" @click="editMenu(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Cập nhật Menu</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{on, attrs}">
              <v-icon color="pink" class="ml-4" v-bind="attrs" v-on="on" @click="xoaMenu(item)">
                mdi-delete
              </v-icon>
            </template>
            <span>Xóa Menu</span>
          </v-tooltip> -->
        </template>
      </v-data-table>
    </v-card>
    <div class="pt-2">
      <v-pagination v-model="page" :length="pageCount" @input="changePage">></v-pagination>
    </div>
    <create-edit ref="menuForm" @on-done="getMenu"></create-edit>
  </v-container>
</template>
<script>
import {getMenuAdmin, deleteMenu} from "@/api/menu";
import CreateEdit from "./create-edit";
import {debounce} from "lodash";

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
      loading: false,
      search: "",
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
        {text: "Vị trí", value: "order"},
        {text: "Hành động", value: "action", sortable: false, align: "center", width: "150"},
      ],
    };
  },
  computed: {},
  created() {
    this.getMenu();
  },
  watch: {
    search: debounce(async function(val) {
      this.loading = true;
      let data = await getMenuAdmin({
        page: this.page,
        perPage: this.itemsPerPage,
        search: val,
      });
      this.loading = false;
      this.tableData = data.docs;
      this.pageCount = data.pages;
    }, 300),
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
    editMenu(menu) {
      this.$refs.menuForm.showFormEdit(menu);
    },
    async xoaMenu(menu) {
      this.$confirmBox.show({
        title: "Xóa Menu - Router hệ thống",
        width: 500,
        body:
          "Bạn có chắc chắn muốn xóa menu - router " +
          "<strong>" +
          menu.name +
          " ?" +
          "</strong><br>" +
          "<strong>" +
          menu.name +
          "</strong>" +
          " sẽ không thể truy cập",
        action: () => deleteMenu({id: menu.id}),
        onDone: this.getMenu,
      });
    },
    createMenu() {
      this.$refs.menuForm.showFormAdd();
    },
  },
};
</script>
