import { http } from '../plugins/axios'

const state = () => ({
	token: '',
	id: '',
	email: '',
	nickname: '',
	avatar: ''
})

const mutations = {
	SET_TOKEN(state, token) {
		state.token = token
	},
	SET_USER(state, user) {
		state.id = user._id
		state.email = user.email
		state.nickname = user.nickname
		state.avatar = user.avatar
	}
}

const actions = {
	detail: async ({ state, commit }, data) => {
		let res = await http.get('/user/detail')
		if (res.code === 0) {
			commit('SET_USER', res.data)
			return res
		}
	}
}

export default {
	namespace: true,
	state,
	mutations,
	actions
}
