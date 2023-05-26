export default [
    {
        path: '',
        component: () => import(/* webpackChunkName: "js/utility/index" */ '@views/utility/index')
    },
    {
        path: 'todo',
        component: () => import(/* webpackChunkName: "js/utility/todo/index" */ '@views/utility/todo/index')
    },
    {
        path: 'todo/:id/edit',
        component: () => import(/* webpackChunkName: "js/utility/todo/edit" */ '@views/utility/todo/edit')
    },
    {
        path: 'backup',
        component: () => import(/* webpackChunkName: "js/utility/backup/index" */ '@views/utility/backup/index')
    },
    {
        path: 'ip-filter',
        component: () => import(/* webpackChunkName: "js/utility/ipFilter/index" */ '@views/utility/ip-filter/index')
    },
    {
        path: 'ip-filter/:id/edit',
        component: () => import(/* webpackChunkName: "js/utility/ipFilter/edit" */ '@views/utility/ip-filter/edit')
    },
    {
        path: 'email-template',
        component: () => import(/* webpackChunkName: "js/utility/emailTemplate/index" */ '@views/utility/email-template/index')
    },
    {
        path: 'email-template/:id/edit',
        component: () => import(/* webpackChunkName: "js/utility/emailTemplate/edit" */ '@views/utility/email-template/edit')
    },
    {
        path: 'email-log',
        component: () => import(/* webpackChunkName: "js/utility/emailLog/index" */ '@views/utility/email-log/index')
    },
    {
        path: 'scheduled-job',
        component: () => import(/* webpackChunkName: "js/utility/scheduledJob/index" */ '@views/utility/scheduled-job/index')
    }
]