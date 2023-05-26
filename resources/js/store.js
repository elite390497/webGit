import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import createPersistedState from 'vuex-persistedstate'

const store = new Vuex.Store({
    state: {
        auth: {
            status: false,
            id: '',
            name: '',
            email: '',
            username: '',
            avatar: '',
            roles: [],
            color_theme: '',
            direction: '',
            locale: '',
            sidebar: '',
            two_factor_code: null,
            permissions: [],
            last_activity: ''
        },
        config: {},
        academic_sessions: [],
        default_academic_session: {}
    },
    mutations: {
        setAuthUserDetail (state, auth) {
            for (let key of Object.keys(auth)) {
                state.auth[key] = auth[key] !== null ? auth[key] : '';
            }
            if ('avatar' in auth)
                state.auth.avatar = auth.avatar !== null ? auth.avatar : '';
            state.auth.status = true;
            state.auth.roles = auth.roles;
            state.auth.permissions = auth.permissions;
            state.auth.last_activity = moment().format();
        },
        resetAuthUserDetail (state) {
            for (let key of Object.keys(state.auth)) {
                state.auth[key] = '';
            }
            state.auth.status = false;
            state.auth.roles = [];
            state.auth.permissions = [];
            state.auth.last_activity = null;
            Vue.cookie.delete('auth_token');
            axios.defaults.headers.common['Authorization'] = null;
        },
        setConfig (state, config) {
            for (let key of Object.keys(config)) {
                state.config[key] = config[key];
            }
        },
        resetConfig (state) {
            for (let key of Object.keys(state.config)) {
                delete state.config[key];
            }
        },
        resetTwoFactorCode (state) {
            state.auth.two_factor_code = '';
        },
        setLastActivity(state) {
            state.auth.last_activity = moment().format();
        },
        setAcademicSession(state, data) {
            state.academic_sessions = data;
        },
        resetAcademicSession(state) {
            state.academic_sessions = [];
        },
        setDefaultAcademicSession(state, data) {
            state.default_academic_session = data;
        },
        resetDefaultAcademicSession(state) {
            state.default_academic_session = {};
        }
    },
    actions: {
        setAuthUserDetail ({ commit }, auth) {
            commit('setAuthUserDetail',auth);
        },
        resetAuthUserDetail ({commit}){
            commit('resetAuthUserDetail');
        },
        setConfig ({ commit }, data) {
            commit('setConfig',data);
        },
        resetConfig({ commit }) {
            commit('resetConfig');
        },
        resetTwoFactorCode({ commit }) {
            commit('resetTwoFactorCode');
        },
        setLastActivity({ commit }) {
            commit('setLastActivity');
        },
        setAcademicSession({ commit }, data) {
            commit('setAcademicSession',data);
        },
        resetAcademicSession({ commit }) {
            commit('resetAcademicSession');
        },
        setDefaultAcademicSession({ commit }, data) {
            commit('setDefaultAcademicSession',data);
        },
        resetDefaultAcademicSession({ commit }) {
            commit('resetDefaultAcademicSession');
        }
    },
    getters: {
        getAuthUser: (state) => (name) => {
            return state.auth[name];
        },
        getAuthStatus: (state) => {
            return state.auth.status;
        },
        getAuthUserRoles: (state) => {
            return state.auth.roles.toString();
        },
        hasRole: (state) => (name) => {
            return (state.auth.roles.indexOf(name) >= 0) ? true : false
        },
        hasAnyRole: (state) => (roles) => {
            return (state.auth.roles.some(role => {
                return roles.indexOf(role) > -1; 
            })) ? true : false;
        },
        hasNotAnyRole: (state) => (roles) => {
            return (state.auth.roles.every(role => {
                return roles.indexOf(role) < 0; 
            })) ? true : false;
        },
        getConfig: (state) => (name) => {
            return state.config[name];
        },
        hasPermission: (state) => (name) => {
            return (state.auth.permissions.indexOf(name) > -1) ? true : false;
        },
        hasAnyPermission: (state) => (permissions) => {
            return (state.auth.permissions.some(permission => {
                return permissions.indexOf(permission) > -1; 
            })) ? true : false;
        },
        getLastActivity: (state) => {
            return state.auth.last_activity;
        },
        getDefaultRole: (state) => (name) => {
            return state.config.default_roles ? state.config.default_roles[name] : '';
        },
        getAcademicSessions: (state) => {
            return state.academic_sessions;
        },
        getDefaultAcademicSession: (state) => {
            return state.default_academic_session;
        }
    },
    plugins: [
        createPersistedState({
            key: 'InstiKit',
        })
    ]
});

export default store;
