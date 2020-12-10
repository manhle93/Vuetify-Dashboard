<template>
  <!-- :permanent="$vuetify.breakpoint.mdAndUp"  bỏ thuộc tính này trong <v-navigation-drawer sẽ ẩn toàn bộ  sidebar-->

  <v-navigation-drawer
    app
    v-model="DRAWER_STATE"
    :mini-variant="!DRAWER_STATE"
    :width="drawerWidth"
    :class="{'drawer-mini': !DRAWER_STATE}"
    style="top: 64px!important; height: calc(100vh - 64px)!important;"
  >
    <v-list :dense="drawerWidth !== sidebarMinWidth" class="pa-0">
      <template v-for="(item, key) in menus">
        <template v-if="item.children && item.children.length > 0">
          <v-list-group :key="key" no-action :to="item.path">
            <template v-slot:prependIcon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" v-text="item.icon" />
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.name" />
              </v-list-item-content>
            </template>
            <v-list-item
              :class="drawerWidth === sidebarMinWidth ? 'pl-4' : ''"
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="subItem.path"
            >
              <template v-if="drawerWidth === sidebarMinWidth">
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon size="20" v-bind="attrs" v-on="on" v-text="subItem.icon" />
                    </template>
                    <span>{{subItem.name}}</span>
                  </v-tooltip>
                </v-list-item-icon>
              </template>
              <template v-else>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon size="20" v-text="subItem.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="subItem.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item>
          </v-list-group>
        </template>

        <template v-else>
          <v-list-item :key="key" :to="item.path" active-class="activeMenu">
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" v-text="item.icon" />
                </template>
                <span>{{item.name}}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== sidebarMinWidth">
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>

    <template v-slot:append>
      <div class="grey lighten-3">
        <template v-if="drawerWidth === sidebarMinWidth">
          <div class="d-flex">
            <v-btn :width="sidebarMinWidth" icon tile @click="handleDrawerCollapse" class="mx-auto">
              <v-icon>mdi-arrow-collapse-right</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-else>
          <div class="d-flex">
            <v-spacer />
            <v-btn icon tile @click="handleDrawerCollapse" class="mr-2">
              <v-icon>mdi-arrow-collapse-left</v-icon>
            </v-btn>
          </div>
        </template>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import "perfect-scrollbar/css/perfect-scrollbar.css";
export default {
  props: {
    source: String,
  },
  data() {
    return {
      drawerWidth: 0,
      scrollSettings: {
        maxScrollbarLength: 160,
      },
      sponsor: {
        href: "https://www.theopticalfiber.com/",
        src: "https://www.theopticalfiber.com/logo/logo.png",
        srcMini: "https://www.theopticalfiber.com/logo/logo_mini.png",
      },
      mini: false,
      ps: null,
      clipped: true,
      temporary: false,
      admins: [
        ["mdi-grid-large", "mdi-home"],
        ["mdi-home", "mdi-grid-large"],
      ],

      items: [
        { title: "Dashboard", icon: "mdi-home", link: "/dashboard" },
        { title: "Typography", icon: "mdi-format-size", link: "/typography" },
        { title: "Tables", icon: "mdi-grid-large", link: "/tables" },
        {
          title: "Notifications",
          icon: "mdi-bell-outline",
          link: "/notifications",
        },
        {
          title: "UI Elements",
          icon: "mdi-image-filter-none",
          link: "/icons",
          model: false,
          children: [
            {
              title: "Icons",
              icon: "mdi-circle-small",
              link: "/ui-elements/icons",
            },
            { title: "Charts", icon: "mdi-circle-small", link: "/charts" },
            { title: "Maps", icon: "mdi-circle-small", link: "/maps" },
          ],
        },
        { divider: true },
        { heading: "HELP" },
        { title: "Library", icon: "mdi-book-variant-multiple" },
        { title: "Support", icon: "mdi-forum" },
        { title: "FAQ", icon: "mdi-help-circle-outline" },
        { divider: true },
        { heading: "PROJECTS" },
        { title: "My recent", icon: "mdi-circle-medium", color: "warning" },
        { title: "Starred", icon: "mdi-circle-medium", color: "primary" },
        { title: "Background", icon: "mdi-circle-medium", color: "error" },
      ],
      sidebarWidth: 250,
      sidebarMinWidth: 64,
    };
  },

  created() {
    this.drawerWidth = this.sidebarWidth;
  },
  computed: {
    ...mapState(["drawer"]),
    menus() {
      return this.$store.state.routerRole.routes;
    },
    DRAWER_STATE: {
      get() {
        return this.drawer;
      },
      set(newValue) {
        if (newValue === this.drawer) return;
        this.TOGGLE_DRAWER();
      },
    },
  },
  methods: {
    ...mapActions(["TOGGLE_DRAWER"]),
    handleDrawerCollapse() {
      this.drawerWidth =
        this.drawerWidth === this.sidebarWidth
          ? this.sidebarMinWidth
          : this.sidebarWidth;
    },
  },
};
</script>
<style lang="css" scoped>
.v-application--is-ltr
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding-left: 10px;
}
.activeMenu {
  color: #1A5276;
}
.v-application .primary--text {
  color: #1A5276 !important
}
</style>>
