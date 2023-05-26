export default [
    {
        path: '/auth/security',
        component: () => import(/* webpackChunkName: "js/auth/security" */ '@views/auth/security'),
    },
    {
        path: '/auth/lock',
        component: () => import(/* webpackChunkName: "js/auth/lock" */ '@views/auth/lock'),
    }
]