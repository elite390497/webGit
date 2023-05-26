export default [
    {
        path: '/maintenance',
        component: () => import(/* webpackChunkName: "js/errors/maintenance" */ '@views/errors/maintenance')
    },
    {
        path: '*',
        component: () => import(/* webpackChunkName: "js/errors/pageNotFound" */ '@views/errors/page-not-found')
    }
]