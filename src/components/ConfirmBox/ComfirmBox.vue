<template>
  <v-dialog v-model="dialog" :width="width">
    <v-card>
      <v-card-title class="headline">
        <v-icon color="orange" class="mr-3">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <br />
      <v-card-text style="color: black">
        <div v-html="body"></div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="gray" text @click="dialog = false">
          Hủy bỏ
        </v-btn>
        <v-btn class="ma-2" color="primary" dark small @click="accept()" :loading="btnLoading">
          Đồng ý
          <v-icon dark right>
            mdi-checkbox-marked-circle
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    title: "",
    body: "",
    width: 500,
    btnLoading: false,
    message: "Thành công",
    icon: "mdi-alert",
    action: () => {},
    onDone: () => {},
  }),
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "confirmBox/SET_BOX") {
        this.title = state.confirmBox.title;
        this.body = state.confirmBox.body;
        this.action = state.confirmBox.action;
        this.width = state.confirmBox.width;
        this.onDone = state.confirmBox.onDone;
        this.message = state.confirmBox.message;
        this.dialog = true;
      }
    });
  },
  methods: {
    async accept() {
      try {
        this.btnLoading = true;
        await this.action();
        this.dialog = false;
        this.btnLoading = false;
        this.$toast.info(this.message, {
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
        this.onDone();
      } catch (error) {
        this.btnLoading = false;
        this.dialog = false;
        console.log(error);
      }
    },
  },
};
</script>
