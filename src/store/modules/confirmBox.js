const state = {
  title: '',
  body: '',
  action: () => {},
  message: '',
  onDone: () => {},
  width: 500
}

const mutations = {
  SET_BOX(state, payload) {
    state.title = payload.title
    state.body = payload.body
    state.action = payload.action
    state.message = payload.message
    state.onDone = payload.onDone
    state.width = payload.width
  }
}

export default {
  namespaced: true,
  state,
  mutations,
};