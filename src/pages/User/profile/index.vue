<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <div>
          <v-card>
            <v-card-text>
              <v-layout column style="align-items: center">
                <v-avatar size="200">
                  <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                  <v-btn color="blue" fab x-small style="position: absolute; top: 155px; right: 50px">
                    <v-icon color="white">mdi-pencil</v-icon>
                  </v-btn>
                </v-avatar>
                <v-card-title>{{ USER.name }}</v-card-title>
                <v-card-subtitle>{{ USER.email }}</v-card-subtitle>
              </v-layout>
            </v-card-text>
            <v-card-title class="pt-0 pb-2 pl-8">Thông tin</v-card-title>
            <v-layout column class="pl-8 pb-6">
              <div class="mb-2">
                Ngày tham gia: <strong>{{ formatDate(USER.createdAt) }}</strong>
              </div>
              <div class="mb-2">
                Tên đăng nhập: <strong>{{ USER.userName }}</strong>
              </div>
              <div class="mb-2">Quyền quản trị:</div>
              <span></span>
            </v-layout>
          </v-card>
        </div>
      </v-col>
      <v-col cols="8"></v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({}),
  computed: {
    USER() {
      return this.$store.state.User.me;
    },
  },
  methods: {
    formatDate(e) {
      try {
        let date = new Date(e);
        let ngay = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let thang = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
        return ngay + "/" + thang + "/" + date.getFullYear();
      } catch (error) {
        return "";
      }
    },
  },
  created() {
    console.log(3232, this.USER);
  },
};
</script>
