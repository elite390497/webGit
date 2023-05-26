export default [
    {
        path: '/',
        component: () => import(/* webpackChunkName: "js/pages/themes/home" */ '@views/pages/themes/default/home')
    },
    {
        path: '/home',
        component: () => import(/* webpackChunkName: "js/pages/themes/home" */ '@views/pages/themes/default/home')
    },
    {
        path: '/contact',
        component: () => import(/* webpackChunkName: "js/pages/themes/contact" */ '@views/pages/themes/default/contact')
    },
    {
        path: '/online-registration',
        component: () => import(/* webpackChunkName: "js/pages/themes/onlineRegistration" */ '@views/pages/themes/default/online-registration')
    },
    {
        path: '/events',
        component: () => import(/* webpackChunkName: "js/pages/themes/events" */ '@views/pages/themes/default/events')
    },
    {
        path: '/calendar',
        component: () => import(/* webpackChunkName: "js/pages/themes/calendar" */ '@views/pages/themes/default/calendar')
    },
    {
        path: '/gallery',
        component: () => import(/* webpackChunkName: "js/pages/themes/gallery" */ '@views/pages/themes/default/gallery')
    },
    {
        path: '/teachers',
        component: () => import(/* webpackChunkName: "js/pages/themes/teachers" */ '@views/pages/themes/default/teachers')
    },
    {
        path: '/articles',
        component: () => import(/* webpackChunkName: "js/pages/themes/articles/index" */ '@views/pages/themes/default/articles/index')
    },
    {
        path: '/articles/:uuid',
        component: () => import(/* webpackChunkName: "js/pages/themes/articles/show" */ '@views/pages/themes/default/articles/show')
    },
    {
        path: '/page/:page',
        component: () => import(/* webpackChunkName: "js/pages/themes/page" */ '@views/pages/themes/default/page')
    }
]