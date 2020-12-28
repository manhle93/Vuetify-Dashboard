<template>
  <v-container>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"><v-icon size="40">mdi-wrench</v-icon> PHÂN QUYỀN</v-list-item-title>
          <v-list-item-subtitle>Thiết lập quyền truy cập và thực hiện chức năng hệ thống</v-list-item-subtitle>
        </v-list-item-content>
        <!-- <v-btn color="teal" @click="createMenu()">
          <v-icon left color="white">mdi-plus</v-icon>
          <span style="color: white">Tạo Menu</span>
        </v-btn> -->
      </v-list-item>
    </v-card>
    <br />
    <v-data-table
      :headers="headers"
      :items="tableData"
      :loading="loading"
      :items-per-page="5"
      class="elevation-1"
      loading-text="Đang tải dữ liệu ..."
    >
      <template v-slot:[`item.action`]="{item}">
        <v-tooltip right>
          <template v-slot:activator="{on, attrs}">
            <v-btn small tile color="primary" v-bind="attrs" v-on="on" @click="config(item)">
              <v-icon left size="20">
                mdi-wrench
              </v-icon>
              Thiết lập
            </v-btn>
          </template>
          <span>Thiết lập phân quyền</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="showConfig" max-width="500px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Phân quyền
        </v-card-title>

        <v-card-text>
          <v-list-item-group>
            <template v-for="(item, i) in menuRoles">
              <v-list-item
                v-if="!item.children || item.children.length == 0"
                :key="`item-${i}`"
                :value="item"
                active-class="deep-purple--text text--accent-4"
              >
                <template>
                  <v-list-item-content @click="item.role = !item.role">
                    <v-list-item-title style="color: black;font-weight: 500; font-size: 16px">{{
                      item.name
                    }}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox v-model="item.role"></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider :key="`divider-${i}`"></v-divider>
              <v-list-group v-if="item.children && item.children.length" :key="`item-${i}`" :value="item">
                <template v-slot:activator>
                  <v-list-item-title style="color: black;font-weight: 500; font-size: 16px">{{
                    item.name
                  }}</v-list-item-title>
                </template>

                <v-list-item
                  v-for="(menu, i) in item.children"
                  :key="i"
                  link
                  active-class="deep-purple--text text--accent-4"
                >
                  <v-list-item-title @click="menu.role = !menu.role">{{ menu.name }}</v-list-item-title>
                  <v-list-item-action>
                    <v-checkbox v-model="menu.role"></v-checkbox>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list-item-group>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="updateRole">
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {getRoles, getMenuRole, updateMenuRole} from "@/api/menu";

export default {
  data: () => ({
    headers: [
      {text: "Tên quyền", value: "name"},
      {text: "Mã quyền", value: "code"},
      {text: "Mô tả", value: "description"},
      {text: "Cấu hình", value: "action"},
    ],
    tableData: [],
    loading: false,
    showConfig: false,
    menuRoles: [],
    roleId: null,
  }),
  created() {
    this.getAllRoles();
  },
  methods: {
    async getAllRoles() {
      let data = await getRoles();
      this.tableData = data;
    },
    async config(role) {
      console.log(role);
      this.showConfig = true;
      let data = await getMenuRole({roleId: role.id});
      this.menuRoles = data;
      this.roleId = role.id;
    },
    async updateRole() {
      let data = [];
      this.menuRoles.forEach(el => {
        if (el.children && el.children.length) {
          el.children.map(it => {
            if (it.role) {
              data.push(it.id);
              if (!data.includes(el.id)) {
                data.push(el.id);
              }
            }
          });
        } else if (el.role) {
          data.push(el.id);
        }
      });
      let form = {
        menu: data,
        roleId: this.roleId,
      };
      try {
        await updateMenuRole(form);
        this.showConfig = false;
        this.roleId = null;
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
        console.log(error);
      }
    },
  },
};
</script>
