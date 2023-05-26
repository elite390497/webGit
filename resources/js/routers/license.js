export default [
    {
        path: '/license',
        component: () => import(/* webpackChunkName: "js/license/index" */ '@views/license/index'),
    }
]