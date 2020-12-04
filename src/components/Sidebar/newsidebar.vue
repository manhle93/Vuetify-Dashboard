<template>
  <v-navigation-drawer
    app
    clipped
    v-model="DRAWER_STATE"
    :mini-variant="!DRAWER_STATE"
    :width="sidebarWidth"
    :permanent="$vuetify.breakpoint.mdAndUp"
    :temporary="$vuetify.breakpoint.smAndDown"
    :mini-variant-width="sidebarMinWidth"
    :class="{'drawer-mini': !DRAWER_STATE}"
  >
    <v-list dense>
      <v-subheader>REPORTS</v-subheader>
      <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="(item, i) in menus" :key="i">
          <div v-if="item.children.length && DRAWER_STATE">
            <v-list-group
              color="primary"
              v-if="item.children.length && DRAWER_STATE"
              :key="item.title"
              append-icon
              :v-model="id"
            >
              <template v-slot:prependIcon>
                <v-icon size="24">{{item.icon}}</v-icon>
              </template>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title
                    style="font-size: 14px"
                    class="grey--text"
                    active-class="red--text"
                  >{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item v-for="(child, i) in item.children" :key="i" :to="child.path">
                <v-list-item-action v-if="child.icon">
                  <v-icon size="small">{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="grey--text" style="font-size: 14px">{{ child.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </div>
          <div v-else>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </div>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
      sidebarWidth: 240,
      sidebarMinWidth: 70,
    };
  },
  created() {
    console.log(this.menus);
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
  },
};
</script>

<style src="./Sidebar.scss" lang="scss"/>




