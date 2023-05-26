export default [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "js/auth/login" */ '@views/auth/login')
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "js/auth/login" */ '@views/auth/login')
    },
    {
        path: '/password',
        component: () => import(/* webpackChunkName: "js/auth/password" */ '@views/auth/password')
    },
    {
        path: '/password/reset',
        component: () => import(/* webpackChunkName: "js/auth/reset" */ '@views/auth/reset')
    },
    {
        path: '/install',
        component: () => import(/* webpackChunkName: "js/formWizard" */ '@views/install/index')
    }
]