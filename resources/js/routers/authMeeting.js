export default [
    {
        path: '/communication/meeting/:uuid/live',
        name: 'meetingLive',
        component: () => import(/* webpackChunkName: "js/communication/meeting/live" */ '@views/communication/meeting/live'),
    }
]