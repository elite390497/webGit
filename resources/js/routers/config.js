export default [
    {
        path: '',
        component: () => import(/* webpackChunkName: "js/configuration/basic/index" */ '@views/configuration/basic/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'basic',
        component: () => import(/* webpackChunkName: "js/configuration/basic/index" */ '@views/configuration/basic/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'social',
        component: () => import(/* webpackChunkName: "js/configuration/social/index" */ '@views/configuration/social/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'system',
        component: () => import(/* webpackChunkName: "js/configuration/system/index" */ '@views/configuration/system/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'mail',
        component: () => import(/* webpackChunkName: "js/configuration/mail/index" */ '@views/configuration/mail/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'role',
        component: () => import(/* webpackChunkName: "js/configuration/role/index" */ '@views/configuration/role/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: 'permission',
        component: () => import(/* webpackChunkName: "js/configuration/permission/index" */ '@views/configuration/permission/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/permission/:module',
        component: () => import(/* webpackChunkName: "js/configuration/permission/module" */ '@views/configuration/permission/module'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/authentication',
        component: () => import(/* webpackChunkName: "js/configuration/authentication/index" */ '@views/configuration/authentication/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/sms',
        component: () => import(/* webpackChunkName: "js/configuration/sms/index" */ '@views/configuration/sms/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/payment/gateway',
        component: () => import(/* webpackChunkName: "js/configuration/paymentGateway/index" */ '@views/configuration/payment-gateway/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/locale',
        component: () => import(/* webpackChunkName: "js/configuration/locale/index" */ '@views/configuration/locale/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/locale/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/locale/edit" */ '@views/configuration/locale/edit'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/locale/:locale',
        component: () => import(/* webpackChunkName: "js/configuration/locale/show" */ '@views/configuration/locale/show'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/locale/:locale/:module',
        component: () => import(/* webpackChunkName: "js/configuration/locale/show" */ '@views/configuration/locale/show'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/menu',
        component: () => import(/* webpackChunkName: "js/configuration/menu/index" */ '@views/configuration/menu/index'),
        meta: { menu: 'configuration'}
    },
    {
        path: '/configuration/module',
        component: () => import(/* webpackChunkName: "js/configuration/module/index" */ '@views/configuration/module/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/course/group',
        component: () => import(/* webpackChunkName: "js/configuration/academic/courseGroup/index" */ '@views/configuration/academic/course-group/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/course/group/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/academic/courseGroup/edit" */ '@views/configuration/academic/course-group/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/institute',
        component: () => import(/* webpackChunkName: "js/configuration/academic/institute/index" */ '@views/configuration/academic/institute/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/institute/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/academic/institute/edit" */ '@views/configuration/academic/institute/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/certificate/template',
        component: () => import(/* webpackChunkName: "js/configuration/academic/certificateTemplate/index" */ '@views/configuration/academic/certificate-template/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/certificate/template/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/academic/certificateTemplate/edit" */ '@views/configuration/academic/certificate-template/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/id-card/template',
        component: () => import(/* webpackChunkName: "js/configuration/academic/idCardTemplate/index" */ '@views/configuration/academic/id-card-template/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/id-card/template/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/academic/idCardTemplate/edit" */ '@views/configuration/academic/id-card-template/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/academic/id-card/template/:id',
        component: () => import(/* webpackChunkName: "js/configuration/academic/idCardTemplate/show" */ '@views/configuration/academic/id-card-template/show'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/caste',
        component: () => import(/* webpackChunkName: "js/configuration/misc/caste/index" */ '@views/configuration/misc/caste/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/caste/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/misc/caste/edit" */ '@views/configuration/misc/caste/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/religion',
        component: () => import(/* webpackChunkName: "js/configuration/misc/religion/index" */ '@views/configuration/misc/religion/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/religion/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/misc/religion/edit" */ '@views/configuration/misc/religion/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/category',
        component: () => import(/* webpackChunkName: "js/configuration/misc/category/index" */ '@views/configuration/misc/category/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/category/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/misc/category/edit" */ '@views/configuration/misc/category/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/blood/group',
        component: () => import(/* webpackChunkName: "js/configuration/misc/bloodGroup/index" */ '@views/configuration/misc/blood-group/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/misc/blood/group/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/misc/bloodGroup/edit" */ '@views/configuration/misc/blood-group/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/finance/transaction/category',
        component: () => import(/* webpackChunkName: "js/configuration/finance/transaction/category/index" */ '@views/configuration/finance/transaction/category/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/finance/transaction/category/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/finance/transaction/category/edit" */ '@views/configuration/finance/transaction/category/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/finance/payment/method',
        component: () => import(/* webpackChunkName: "js/configuration/finance/transaction/paymentMethod/index" */ '@views/configuration/finance/transaction/payment-method/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/finance/payment/method/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/finance/transaction/paymentMethod/edit" */ '@views/configuration/finance/transaction/payment-method/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/frontend/index',
        component: () => import(/* webpackChunkName: "js/configuration/frontend/index" */ '@views/configuration/frontend/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/student',
        component: () => import(/* webpackChunkName: "js/configuration/student/index" */ '@views/configuration/student/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/student/document/type',
        component: () => import(/* webpackChunkName: "js/configuration/student/documentType/index" */ '@views/configuration/student/document-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/student/document/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/student/documentType/edit" */ '@views/configuration/student/document-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/student/group',
        component: () => import(/* webpackChunkName: "js/configuration/student/studentGroup/index" */ '@views/configuration/student/student-group/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/student/group/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/student/studentGroup/edit" */ '@views/configuration/student/student-group/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/term',
        component: () => import(/* webpackChunkName: "js/configuration/exam/term/index" */ '@views/configuration/exam/term/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/term/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/exam/term/edit" */ '@views/configuration/exam/term/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/assessment',
        component: () => import(/* webpackChunkName: "js/configuration/exam/assessment/index" */ '@views/configuration/exam/assessment/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/assessment/create',
        component: () => import(/* webpackChunkName: "js/configuration/exam/assessment/create" */ '@views/configuration/exam/assessment/create'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/assessment/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/exam/assessment/edit" */ '@views/configuration/exam/assessment/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/observation',
        component: () => import(/* webpackChunkName: "js/configuration/exam/observation/index" */ '@views/configuration/exam/observation/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/observation/create',
        component: () => import(/* webpackChunkName: "js/configuration/exam/observation/create" */ '@views/configuration/exam/observation/create'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/observation/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/exam/observation/edit" */ '@views/configuration/exam/observation/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/grade',
        component: () => import(/* webpackChunkName: "js/configuration/exam/grade/index" */ '@views/configuration/exam/grade/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/grade/create',
        component: () => import(/* webpackChunkName: "js/configuration/exam/grade/create" */ '@views/configuration/exam/grade/create'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/exam/grade/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/exam/grade/edit" */ '@views/configuration/exam/grade/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/group',
        component: () => import(/* webpackChunkName: "js/configuration/employee/employeeGroup/index" */ '@views/configuration/employee/employee-group/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/group/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/employeeGroup/edit" */ '@views/configuration/employee/employee-group/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee',
        component: () => import(/* webpackChunkName: "js/configuration/employee/index" */ '@views/configuration/employee/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/document/type',
        component: () => import(/* webpackChunkName: "js/configuration/employee/documentType/index" */ '@views/configuration/employee/document-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/document/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/documentType/edit" */ '@views/configuration/employee/document-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/leave/type',
        component: () => import(/* webpackChunkName: "js/configuration/employee/leaveType/index" */ '@views/configuration/employee/leave-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/leave/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/leaveType/edit" */ '@views/configuration/employee/leave-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/attendance/type',
        component: () => import(/* webpackChunkName: "js/configuration/employee/attendanceType/index" */ '@views/configuration/employee/attendance-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/attendance/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/attendanceType/edit" */ '@views/configuration/employee/attendance-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/pay/head',
        component: () => import(/* webpackChunkName: "js/configuration/employee/payHead/index" */ '@views/configuration/employee/pay-head/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/pay/head/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/payHead/edit" */ '@views/configuration/employee/pay-head/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/category',
        component: () => import(/* webpackChunkName: "js/configuration/employee/category/index" */ '@views/configuration/employee/category/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/category/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/category/edit" */ '@views/configuration/employee/category/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/department',
        component: () => import(/* webpackChunkName: "js/configuration/employee/department/index" */ '@views/configuration/employee/department/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/department/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/department/edit" */ '@views/configuration/employee/department/edit'),
        meta: { menu: 'module-configuration'}       
    },
    {
        path: '/configuration/employee/designation',
        component: () => import(/* webpackChunkName: "js/configuration/employee/designation/index" */ '@views/configuration/employee/designation/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/employee/designation/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/employee/designation/edit" */ '@views/configuration/employee/designation/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/document/type',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/documentType/index" */ '@views/configuration/transport/vehicle/document-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/document/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/documentType/edit" */ '@views/configuration/transport/vehicle/document-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/service/center',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/serviceCenter/index" */ '@views/configuration/transport/vehicle/service-center/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/service/center/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/serviceCenter/edit" */ '@views/configuration/transport/vehicle/service-center/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/fuel/type',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/fuelType/index" */ '@views/configuration/transport/vehicle/fuel-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/transport/vehicle/fuel/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/transport/vehicle/fuelType/edit" */ '@views/configuration/transport/vehicle/fuel-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/asset/building',
        component: () => import(/* webpackChunkName: "js/configuration/asset/building/index" */ '@views/configuration/asset/building/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/asset/building/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/asset/building/edit" */ '@views/configuration/asset/building/edit'),
        meta: { menu: 'module-configuration'}       
    },
    {
        path: '/configuration/asset/room',
        component: () => import(/* webpackChunkName: "js/configuration/asset/room/index" */ '@views/configuration/asset/room/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/asset/room/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/asset/room/edit" */ '@views/configuration/asset/room/edit'),
        meta: { menu: 'module-configuration'}       
    },
    {
        path: '/configuration/library',
        component: () => import(/* webpackChunkName: "js/configuration/library/index" */ '@views/configuration/library/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/author',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookAuthor/index" */ '@views/configuration/library/book-author/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/author/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookAuthor/edit" */ '@views/configuration/library/book-author/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/language',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookLanguage/index" */ '@views/configuration/library/book-language/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/language/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookLanguage/edit" */ '@views/configuration/library/book-language/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/topic',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookTopic/index" */ '@views/configuration/library/book-topic/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/topic/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookTopic/edit" */ '@views/configuration/library/book-topic/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/publisher',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookPublisher/index" */ '@views/configuration/library/book-publisher/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/publisher/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookPublisher/edit" */ '@views/configuration/library/book-publisher/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/condition',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookCondition/index" */ '@views/configuration/library/book-condition/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/library/book/condition/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/library/bookCondition/edit" */ '@views/configuration/library/book-condition/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/calendar/event/type',
        component: () => import(/* webpackChunkName: "js/configuration/calendar/eventType/index" */ '@views/configuration/calendar/event-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/calendar/event/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/calendar/eventType/edit" */ '@views/configuration/calendar/event-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/post/article/type',
        component: () => import(/* webpackChunkName: "js/configuration/post/articleType/index" */ '@views/configuration/post/article-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/post/article/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/post/articleType/edit" */ '@views/configuration/post/article-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/enquiry/type',
        component: () => import(/* webpackChunkName: "js/configuration/reception/enquiryType/index" */ '@views/configuration/reception/enquiry-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/enquiry/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/reception/enquiryType/edit" */ '@views/configuration/reception/enquiry-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/enquiry/source',
        component: () => import(/* webpackChunkName: "js/configuration/reception/enquirySource/index" */ '@views/configuration/reception/enquiry-source/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/enquiry/source/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/reception/enquirySource/edit" */ '@views/configuration/reception/enquiry-source/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/complaint/type',
        component: () => import(/* webpackChunkName: "js/configuration/reception/complaintType/index" */ '@views/configuration/reception/complaint-type/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/complaint/type/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/reception/complaintType/edit" */ '@views/configuration/reception/complaint-type/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/visiting/purpose',
        component: () => import(/* webpackChunkName: "js/configuration/reception/visitingPurpose/index" */ '@views/configuration/reception/visiting-purpose/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/visiting/purpose/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/reception/visitingPurpose/edit" */ '@views/configuration/reception/visiting-purpose/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/calling/purpose',
        component: () => import(/* webpackChunkName: "js/configuration/reception/callingPurpose/index" */ '@views/configuration/reception/calling-purpose/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/reception/calling/purpose/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/reception/callingPurpose/edit" */ '@views/configuration/reception/calling-purpose/edit'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/custom-field',
        component: () => import(/* webpackChunkName: "js/configuration/customField/index" */ '@views/configuration/custom-field/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/custom-field',
        component: () => import(/* webpackChunkName: "js/configuration/customField/index" */ '@views/configuration/custom-field/index'),
        meta: { menu: 'module-configuration'}
    },
    {
        path: '/configuration/custom-field/:id/edit',
        component: () => import(/* webpackChunkName: "js/configuration/customField/edit" */ '@views/configuration/custom-field/edit'),
        meta: { menu: 'module-configuration'}
    }
]