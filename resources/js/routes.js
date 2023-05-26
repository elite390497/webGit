import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import frontendRoutes from '@routers/frontend';
import guestRoutes from '@routers/guest';
import authRoutes from '@routers/auth';
import authWithAcademicSessionRoutes from '@routers/authWithAcademicSession';
import licenseRoutes from '@routers/license';
import authSecurityRoutes from '@routers/authSecurity';
import errorRoutes from '@routers/error';

Vue.use(Loading);

let pageLoader;

let routes = [
    {
        path: '/',                      // all the routes which can be access without authentication
        component: () => import(/* webpackChunkName: "js/frontendPage" */ '@layouts/frontend-page'),
        meta: { validate: ['is_frontend_website'] },
        children: [
            ...frontendRoutes,
        ]
    },
    {
        path: '/',                      // all the routes which can be access without authentication
        component: () => import(/* webpackChunkName: "js/guestPage" */ '@layouts/guest-page'),
        meta: { validate: ['is_guest'] },
        children: [
            ...guestRoutes,
        ]
    },
    {
        path: '/',                                       // all the routes which needs authentication + two factor authentication + lock screen
        component: () => import(/* webpackChunkName: "js/defaultPage" */ '@layouts/default-page'),
        meta: { validate: ['is_auth','two_factor_security','is_screen_locked','has_valid_license'] },
        children: [
            ...authRoutes,
        ]
    },
    {
        path: '/',                                       // all the routes which needs authentication + two factor authentication + lock screen
        component: () => import(/* webpackChunkName: "js/defaultPage" */ '@layouts/default-page'),
        meta: { validate: ['is_auth','two_factor_security','is_screen_locked','has_valid_license','has_academic_session'] },
        children: [
            ...authWithAcademicSessionRoutes,
        ]
    },
    {
        path: '/',                                       // all the routes which needs authentication + two factor authentication + lock screen
        component: () => import(/* webpackChunkName: "js/defaultPage" */ '@layouts/default-page'),
        meta: { validate: ['is_auth','two_factor_security','is_screen_locked'] },
        children: [
            ...licenseRoutes,
        ]
    },
    {
        path: '/',
        component: () => import(/* webpackChunkName: "js/guestPage" */ '@layouts/guest-page'),
        meta: { validate: ['is_auth'] },
        children: [
            ...authSecurityRoutes,
        ]
    },
    {
        path: '/',
        component : require('@layouts/error-page').default,
        children: [
            ...errorRoutes
        ]
    }
];


const router = new VueRouter({
    routes,
    // linkActiveClass: 'active',
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});

router.beforeEach((to, from, next) => {
    pageLoader = Vue.$loading.show();

    // Initialize toastr notification
    helper.notification();

    helper.setConfig().then(() => {

        let auth_token = Vue.cookie.get('auth_token');

        if(helper.getConfig('failed_install') && to.fullPath != '/install') {
            pageLoader.hide();
            return next({ path: '/install' })
        }

        // Check for authentication; If no, redirect to "/login" route
        if (auth_token && ! helper.hasRole('admin') && helper.getConfig('maintenance_mode') && to.fullPath != '/maintenance'){
            toastr.error(helper.getConfig('maintenance_mode_message'));
            pageLoader.hide();
            return next({ path: '/maintenance'})
        }
            
        if (to.matched.some(m => m.meta.validate)){
            const m = to.matched.find(m => m.meta.validate);

            // Check for authentication; If no, redirect to "/login" route
            if (m.meta.validate.indexOf('is_auth') > -1 && ! auth_token){
                helper.clearSession();
                toastr.error(i18n.auth.auth_required);
                pageLoader.hide();
                return next({ path: '/login' })
            }

            // Check for two factor security; If enabled, redirect to "/auth/security" route after login
            if (m.meta.validate.indexOf('two_factor_security') > -1 && helper.getConfig('two_factor_security') && helper.getAuthUser('two_factor_code')){
                pageLoader.hide();
                return next({ path: '/auth/security' })
            }

            // Check for screen lock; If enabled, redirect to "/auth/lock" route after screen lock timeout
            if (m.meta.validate.indexOf('is_screen_locked') > -1 && helper.getConfig('lock_screen') && helper.isScreenLocked()){
                pageLoader.hide();
                return next({ path: '/auth/lock' })
            }

            // Check for valid license; If invalid, redirect to "/license"
            if (m.meta.validate.indexOf('has_valid_license') > -1 && !helper.getConfig('l') && to.fullPath != '/license'){
                toastr.error(i18n.install.invalid_license);
                pageLoader.hide();
                if(helper.hasRole('admin')){
                    return next({ path: '/license' })
                } else {
                    helper.clearSession();
                    return next({ path: '/login' })
                }
            }

            // Check for valid academic session; If invalid redirect to "/dashboard"
            if (m.meta.validate.indexOf('has_academic_session') > -1 && ! helper.getDefaultAcademicSession()){
                toastr.error(i18n.academic.choose_session_detail);
                pageLoader.hide();
                return next({ path: '/dashboard' })
            }

            // Check if frontend website is enabled; If invalid redirect to "/dashboard"
            if (m.meta.validate.indexOf('is_frontend_website') > -1 && !helper.getConfig('frontend_website')){
                pageLoader.hide();
                return next({ path: '/login' })
            }

            // Check for authentication; If authenticated, redirect to "/dashboard" route
            if (m.meta.validate.indexOf('is_guest') > -1 && auth_token){
                pageLoader.hide();
                toastr.error(i18n.auth.guest_required);
                return next({ path: '/dashboard' })
            }
        }

        return next()

    });
});


router.afterEach((to, from) => {
    pageLoader.hide();
});

export default router;
