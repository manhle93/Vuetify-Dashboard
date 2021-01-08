<template>
  <v-container fluid>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"
            ><v-icon size="40">mdi-account-multiple</v-icon> QUẢN LÝ NGƯỜI DÙNG</v-list-item-title
          >
          <v-list-item-subtitle>Danh sách người dùng hệ thống</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn color="teal" @click="createMenu()">
          <v-icon color="white">mdi-plus</v-icon>
          <span style="color: white" class="btn-add">Thêm Người dùng</span>
        </v-btn>
      </v-list-item>
      
    </v-card>
    <br />
    <v-card class="mb-1">
      <v-card-title class="pa-6 pb-4">
        <p>Danh sách người dùng</p>
        <v-spacer></v-spacer>
        <div style="width: 500px" class="mr-4">
          <v-row>
            <v-col cols="5">
              <v-select
                v-model="roleId"
                item-text="name"
                item-value="id"
                :items="roles"
                placeholder="Quyền"
                hide-details
                clearable
              ></v-select
            ></v-col>
            <v-col cols="7">
              <v-text-field
                append-icon="mdi-magnify"
                v-model="search"
                label="Tìm kiếm"
                clearable
                single-line
                hide-details
              ></v-text-field
            ></v-col>
          </v-row>
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
        <template v-slot:[`item.name`]="{item}">
          <v-avatar color="indigo" size="28">
            <img v-if="item && item.urlImage" :src="imageEndpoint + item.urlImage" alt="John" />
            <span style="color: white" v-else-if="item && item.name">{{ item.name.charAt(0).toUpperCase() }}</span>
            <v-icon v-else dark>mdi-account</v-icon>
          </v-avatar>
          <span class="ml-3" style="font-size: 16px">{{ item.name }}</span>
        </template>
        <template v-slot:[`item.role`]="{item}">
          <v-list>
            <v-list-item-title>{{ item.role ? item.role.description : "" }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.role ? item.role.name : "" }}</v-list-item-subtitle>
          </v-list>
        </template>
        <template v-slot:[`item.active`]="{item}">
          <v-chip v-if="!item.active" color="pink" dark small>
            Chưa kích hoạt
          </v-chip>
          <v-chip v-else color="success" dark small>
            Đang hoạt động
          </v-chip>
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
              <v-list-item v-if="item.active" @click="deactivateUser(item)">
                <v-list-item-title>
                  <v-icon class="mr-2">
                    mdi-lock-outline
                  </v-icon>
                  Hủy kích hoạt</v-list-item-title
                >
              </v-list-item>
              <v-list-item v-else @click="activeUser(item)">
                <v-list-item-title>
                  <v-icon class="mr-2">
                    mdi-lock-open-outline
                  </v-icon>
                  Kích hoạt tài khoản</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <div class="pt-2">
      <v-pagination v-model="page" :length="pageCount" @input="changePage">></v-pagination>
    </div>
    <create-edit ref="menuForm" @on-done="getDataUsers" :roles="roles"></create-edit>
  </v-container>
</template>
<script>
import CreateEdit from "./create-edit";
import {debounce} from "lodash";
import {listUser, activeUser} from "@/api/user";
import {getRoles} from "@/api/menu";

export default {
  components: {CreateEdit},
  data() {
    return {
      page: 1,
      pageCount: 1,
      itemsPerPage: 10,
      options: {},
      totalDesserts: 0,
      tableData: [],
      btnLoading: false,
      menu: {},
      loading: false,
      search: "",
      roleId: null,
      imageEndpoint: process.env.VUE_APP_BASE,
      roles: [],
      headers: [
        {text: "STT", width: "100", sortable: false},
        {text: "Người dùng", value: "name", sortable: false},
        {
          text: "Tên đăng nhập",
          align: "start",
          sortable: false,
          value: "userName",
        },
        {
          text: "E-Mail",
          align: "start",
          sortable: false,
          value: "email",
        },
        {text: "Quyền", value: "role"},
        {text: "Trạng thái", value: "active"},
        {text: "Hành động", value: "action", sortable: false, align: "center", width: "150"},
      ],
    };
  },
  computed: {},
  created() {
    this.getDataUsers();
    this.getAllRoles();
  },
  watch: {
    search: debounce(async function(val){
      this.loading = true;
      let data = await listUser({
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
    async getDataUsers() {
      this.loading = true;
      let data = await listUser({
        page: this.page,
        perPage: this.itemsPerPage,
      });
      this.tableData = data.docs;
      this.loading = false;
      this.pageCount = data.pages;
    },
    changePage(val) {
      this.page = val;
      this.getDataUsers();
    },
    editMenu(menu) {
      this.$refs.menuForm.showFormEdit(menu);
    },
    createMenu() {
      this.$refs.menuForm.showFormAdd();
    },
    async activeUser(user) {
      this.$confirmBox.show({
        title: "Kích hoạt tài khoản người dùng",
        width: 500,
        body:
          "Bạn có chắc chắn muốn kích hoạt khoản người dùng " +
          "<strong>" +
          user.name +
          " ?" +
          "</strong><br>" +
          "<strong>" +
          user.name +
          "</strong>" +
          " có thể đăng nhập và sử dụng hệ thống",
        action: () => activeUser({userId: user.id, active: true}),
        onDone: this.getDataUsers,
      });
    },
    async deactivateUser(user) {
      this.$confirmBox.show({
        title: "Hủy kích hoạt tài khoản người dùng",
        width: 480,
        body:
          "Bạn có chắc chắn muốn hủy kích hoạt tài khoản của người dùng " +
          "<strong>" +
          user.name +
          " ?" +
          "</strong><br>" +
          "<strong>" +
          user.name +
          "</strong>" +
          " sẽ không đăng nhập hệ thống",
        action: () => activeUser({userId: user.id, active: false}),
        onDone: this.getDataUsers,
      });
    },
    async getAllRoles() {
      let data = await getRoles();
      this.roles = data;
    },
  },
};
</script>
<style scoped>

@media only screen and (max-width: 600px){
  .btn-add{
      display: none;
  }
}
</style>
