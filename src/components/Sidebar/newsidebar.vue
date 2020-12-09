  <v-navigation-drawer
    v-model="DRAWER_STATE"
    :mini-variant="!DRAWER_STATE"
    :width="drawerWidth"
    :class="{'drawer-mini': !DRAWER_STATE}"
    style="top: 64px!important; height: calc(100vh - 64px)!important;"
    >
    <v-list :dense="drawerWidth !== 64" class="pa-0">
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
              :class="drawerWidth === 64 ? 'pl-4' : ''"
              v-for="subItem in item.children"
              :key="subItem.name"
              :to="subItem.path"
            >
              <template v-if="drawerWidth === 64">
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on" v-text="subItem.icon" />
                    </template>
                    <span>{{subItem.name}}</span>
                  </v-tooltip>
                </v-list-item-icon>
              </template>
              <template v-else>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.name" />
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item :key="key" :to="item.path">
            <v-list-item-icon>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" v-text="item.icon" />
                </template>
                <span>{{item.name}}</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-content v-if="drawerWidth !== 64">
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>

    <template v-slot:append>
      <div class="grey lighten-3">
        <template v-if="drawerWidth === 64">
          <div class="d-flex">
            <v-btn width="64" icon tile @click="handleDrawerCollapse" class="mx-auto">
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



  <style src="./Sidebar.scss" lang="scss"/>