const confirmBoxPlugin = {
  install: (Vue, {store}) => {
    if (!store) {
      throw new Error("Please provide vuex store.");
    }

    Vue.prototype.$confirmBox = {
      show: function({title = "", body = "",width = 500, action = () => {}, onDone = () => {}, message = 'Thành công'}) {
        store.commit("confirmBox/SET_BOX", {title, body, message,width, action, onDone}, {root: true});
      },
    };
  },
};
export default confirmBoxPlugin;
