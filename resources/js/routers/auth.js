import configRoutes from './config';
import utilityRoutes from './utility';

export default [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "js/dashboard" */ '@views/dashboard')
    },
    {
        path: '/product/about',
        name: 'productAbout',
        component: () => import(/* webpackChunkName: "js/product/about" */ '@views/product/about')
    },
    {
        path: '/product/update',
        name: 'productUpdate',
        component: () => import(/* webpackChunkName: "js/product/update" */ '@views/product/update')
    },
    {
        path: '/product/support',
        name: 'productSupport',
        component: () => import(/* webpackChunkName: "js/product/support" */ '@views/product/support')
    },
    {
        path: '/change/password',
        name: 'changePassword',
        component: () => import(/* webpackChunkName: "js/auth/changePassword" */ '@views/auth/change-password')
    },
    {
        path: '/setup',
        name: 'setup',
        component: () => import(/* webpackChunkName: "js/setup" */ '@views/setup/index')
    },
    {
        path: '/configuration',
        component: () => import(/* webpackChunkName: "js/configuration" */ '@views/configuration/layout/index'),
        children: [
        	...configRoutes
        ]
    },
    {
        path: '/utility',
        component: () => import(/* webpackChunkName: "js/utility" */ '@views/utility/layout/index'),
        children: [
        	...utilityRoutes
        ]
    },
    {
        path: '/academic',
        name: 'academic',
        component: () => import(/* webpackChunkName: "js/academic/index" */ '@views/academic/index')
    },
    {
        path: '/academic/session',
        name: 'academicSession',
        component: () => import(/* webpackChunkName: "js/academic/session/index" */ '@views/academic/session/index')
    },
    {
        path: '/academic/session/:id/edit',
        name: 'academicSessionEdit',
        component: () => import(/* webpackChunkName: "js/academic/session/edit" */ '@views/academic/session/edit')
    },
    {
        path: '/finance/account',
        name: 'financeAccount',
        component: () => import(/* webpackChunkName: "js/finance/account/index" */ '@views/finance/account/index')
    },
    {
        path: '/finance/account/:id/edit',
        name: 'financeAccountEdit',
        component: () => import(/* webpackChunkName: "js/finance/account/edit" */ '@views/finance/account/edit')
    },
    {
        path: '/finance/report',
        name: 'financeReport',
        component: () => import(/* webpackChunkName: "js/finance/report" */ '@views/finance/report')
    },
    {
        path: '/finance/fee/report/summary',
        name: 'financeFeeSummaryReport',
        component: () => import(/* webpackChunkName: "js/finance/fee/report/summary" */ '@views/finance/fee/report/summary')
    },
    {
        path: '/finance/fee/report/concession',
        name: 'financeFeeConcessionReport',
        component: () => import(/* webpackChunkName: "js/finance/fee/report/concession" */ '@views/finance/fee/report/concession')
    },
    {
        path: '/finance/fee/report/due',
        name: 'financeFeeDueReport',
        component: () => import(/* webpackChunkName: "js/finance/fee/report/due" */ '@views/finance/fee/report/due')
    },
    {
        path: '/finance/fee/report/payment',
        name: 'financeFeePaymentReport',
        component: () => import(/* webpackChunkName: "js/finance/fee/report/payment" */ '@views/finance/fee/report/payment')
    },
    {
        path: '/finance/transaction/report/summary',
        name: 'financeTransactionSummaryReport',
        component: () => import(/* webpackChunkName: "js/finance/transaction/report/summary" */ '@views/finance/transaction/report/summary')
    },
    {
        path: '/finance/transaction/report/day-book',
        name: 'financeTransactionDayBookReport',
        component: () => import(/* webpackChunkName: "js/finance/transaction/report/dayBook" */ '@views/finance/transaction/report/day-book')
    },
    {
        path: '/employee',
        name: 'employee',
        component: () => import(/* webpackChunkName: "js/employee/index" */ '@views/employee/index')
    },
    {
        path: '/employee/import',
        name: 'employeeImport',
        component: () => import(/* webpackChunkName: "js/employee/import/index" */ '@views/employee/import/index')
    },
    {
        path: '/employee/id-card',
        name: 'employeeIdCard',
        component: () => import(/* webpackChunkName: "js/employee/idCard/index" */ '@views/employee/id-card/index')
    },
    {
        path: '/employee/leave',
        name: 'employeeLeave',
        component: () => import(/* webpackChunkName: "js/employee/leave/index" */ '@views/employee/leave/index')
    },
    {
        path: '/employee/leave/allocation',
        name: 'employeeLeaveAllocation',
        component: () => import(/* webpackChunkName: "js/employee/leave/allocation/index" */ '@views/employee/leave/allocation/index')
    },
    {
        path: '/employee/leave/allocation/:uuid/edit',
        name: 'employeeLeaveAllocationEdit',
        component: () => import(/* webpackChunkName: "js/employee/leave/allocation/edit" */ '@views/employee/leave/allocation/edit')
    },
    {
        path: '/employee/leave/request',
        name: 'employeeLeaveRequest',
        component: () => import(/* webpackChunkName: "js/employee/leave/request/index" */ '@views/employee/leave/request/index')
    },
    {
        path: '/employee/leave/request/create',
        name: 'employeeLeaveRequestCreate',
        component: () => import(/* webpackChunkName: "js/employee/leave/request/create" */ '@views/employee/leave/request/create')
    },
    {
        path: '/employee/leave/request/:uuid/edit',
        name: 'employeeLeaveRequestEdit',
        component: () => import(/* webpackChunkName: "js/employee/leave/request/edit" */ '@views/employee/leave/request/edit')
    },
    {
        path: '/employee/leave/request/:uuid',
        name: 'employeeLeaveRequestDetail',
        component: () => import(/* webpackChunkName: "js/employee/leave/request/show" */ '@views/employee/leave/request/show')
    },
    {
        path: '/employee/payroll',
        name: 'employeePayroll',
        component: () => import(/* webpackChunkName: "js/employee/payroll/index" */ '@views/employee/payroll/index')
    },
    {
        path: '/employee/payroll/template',
        name: 'employeePayrollTemplate',
        component: () => import(/* webpackChunkName: "js/employee/payroll/template/index" */ '@views/employee/payroll/template/index')
    },
    {
        path: '/employee/payroll/template/create',
        name: 'employeePayrollTemplateCreate',
        component: () => import(/* webpackChunkName: "js/employee/payroll/template/create" */ '@views/employee/payroll/template/create')
    },
    {
        path: '/employee/payroll/template/:uuid/edit',
        name: 'employeePayrollTemplateEdit',
        component: () => import(/* webpackChunkName: "js/employee/payroll/template/edit" */ '@views/employee/payroll/template/edit')
    },
    {
        path: '/employee/payroll/salary',
        name: 'employeePayrollSalary',
        component: () => import(/* webpackChunkName: "js/employee/payroll/salary/index" */ '@views/employee/payroll/salary/index')
    },
    {
        path: '/employee/payroll/salary/create',
        name: 'employeePayrollSalaryCreate',
        component: () => import(/* webpackChunkName: "js/employee/payroll/salary/create" */ '@views/employee/payroll/salary/create')
    },
    {
        path: '/employee/payroll/salary/:uuid/edit',
        name: 'employeePayrollSalaryEdit',
        component: () => import(/* webpackChunkName: "js/employee/payroll/salary/edit" */ '@views/employee/payroll/salary/edit')
    },
    {
        path: '/employee/payroll/transaction',
        name: 'employeePayrollTransaction',
        component: () => import(/* webpackChunkName: "js/employee/payroll/transaction/index" */ '@views/employee/payroll/transaction/index')
    },
    {
        path: '/employee/payroll/transaction/:uuid/edit',
        name: 'employeePayrollTransactionEdit',
        component: () => import(/* webpackChunkName: "js/employee/payroll/transaction/edit" */ '@views/employee/payroll/transaction/edit')
    },
    {
        path: '/employee/payroll/list',
        name: 'employeePayrollList',
        component: () => import(/* webpackChunkName: "js/employee/payroll/list" */ '@views/employee/payroll/list')
    },
    {
        path: '/employee/payroll/generate',
        name: 'employeePayrollGenerate',
        component: () => import(/* webpackChunkName: "js/employee/payroll/generate" */ '@views/employee/payroll/generate')
    },
    {
        path: '/employee/payroll/:uuid/edit',
        name: 'employeePayrollEdit',
        component: () => import(/* webpackChunkName: "js/employee/payroll/edit" */ '@views/employee/payroll/edit')
    },
    {
        path: '/employee/payroll/:uuid',
        name: 'employeePayrollDetail',
        component: () => import(/* webpackChunkName: "js/employee/payroll/show" */ '@views/employee/payroll/show')
    },
    {
        path: '/employee/attendance',
        name: 'employeeAttendance',
        component: () => import(/* webpackChunkName: "js/employee/attendance/index" */ '@views/employee/attendance/index')
    },
    {
        path: '/employee/attendance/regular',
        name: 'employeeRegularAttendance',
        component: () => import(/* webpackChunkName: "js/employee/attendance/regular" */ '@views/employee/attendance/regular')
    },
    {
        path: '/employee/attendance/production',
        name: 'employeeProductionAttendance',
        component: () => import(/* webpackChunkName: "js/employee/attendance/production" */ '@views/employee/attendance/production')
    },
    {
        path: '/employee/list',
        name: 'employeeList',
        component: () => import(/* webpackChunkName: "js/employee/list" */ '@views/employee/list')
    },
    {
        path: '/employee/card-view',
        name: 'employeeCardView',
        component: () => import(/* webpackChunkName: "js/employee/card-view" */ '@views/employee/card-view')
    },
    {
        path: '/employee/:uuid',
        name: 'employeeDetail',
        component: () => import(/* webpackChunkName: "js/employee" */ '@views/employee/show')
    },
    {
        path: '/employee/:uuid/edit',
        name: 'employeeEdit',
        component: () => import(/* webpackChunkName: "js/employee/edit" */ '@views/employee/edit')
    },
    {
        path: '/transport/vehicle',
        name: 'transportVehicle',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/index" */ '@views/transport/vehicle/index')
    },
    {
        path: '/transport/vehicle/:id/edit',
        name: 'transportVehicleEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/edit" */ '@views/transport/vehicle/edit')
    },
    {
        path: '/transport/vehicle/log',
        name: 'transportVehicleLog',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/log/index" */ '@views/transport/vehicle/log/index')
    },
    {
        path: '/transport/vehicle/log/:id/edit',
        name: 'transportVehicleLogEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/log/edit" */ '@views/transport/vehicle/log/edit')
    },
    {
        path: '/transport/vehicle/service/record',
        name: 'transportVehicleServiceRecord',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/serviceRecord/index" */ '@views/transport/vehicle/service-record/index')
    },
    {
        path: '/transport/vehicle/service/record/:id/edit',
        name: 'transportVehicleServiceRecordEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/serviceRecord/edit" */ '@views/transport/vehicle/service-record/edit')
    },
    {
        path: '/transport/vehicle/fuel',
        name: 'transportVehicleFuel',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/fuel/index" */ '@views/transport/vehicle/fuel/index')
    },
    {
        path: '/transport/vehicle/fuel/:id/edit',
        name: 'transportVehicleFuelEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/fuel/edit" */ '@views/transport/vehicle/fuel/edit')
    },
    {
        path: '/transport/vehicle/document',
        name: 'transportVehicleDocument',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/document/index" */ '@views/transport/vehicle/document/index')
    },
    {
        path: '/transport/vehicle/document/:id/edit',
        name: 'transportVehicleDocumentEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/document/edit" */ '@views/transport/vehicle/document/edit')
    },
    {
        path: '/transport/vehicle/incharge',
        name: 'transportVehicleIncharge',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/incharge/index" */ '@views/transport/vehicle/incharge/index')
    },
    {
        path: '/transport/vehicle/performance/criteria',
        name: 'transportVehiclePerformanceCriteria',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/performanceCriteria/index" */ '@views/transport/vehicle/performance-criteria/index')
    },
    {
        path: '/transport/vehicle/performance/criteria/:id/edit',
        name: 'transportVehiclePerformanceCriteriaEdit',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/performanceCriteria/edit" */ '@views/transport/vehicle/performance-criteria/edit')
    },
    {
        path: '/transport/report',
        name: 'transportReport',
        component: () => import(/* webpackChunkName: "js/transport/report" */ '@views/transport/report')
    },
    {
        path: '/transport/vehicle/report/summary',
        name: 'transportVehicleSummaryReport',
        component: () => import(/* webpackChunkName: "js/transport/vehicle/report/summary" */ '@views/transport/vehicle/report/summary')
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import(/* webpackChunkName: "js/calendar/index" */ '@views/calendar/index')
    },
    {
        path: '/calendar/holiday',
        name: 'calendarHoliday',
        component: () => import(/* webpackChunkName: "js/calendar/holiday/index" */ '@views/calendar/holiday/index')
    },
    {
        path: '/calendar/holiday/:id/edit',
        name: 'calendarHolidayEdit',
        component: () => import(/* webpackChunkName: "js/calendar/holiday/edit" */ '@views/calendar/holiday/edit')
    },
    {
        path: '/calendar/event',
        name: 'calendarEvent',
        component: () => import(/* webpackChunkName: "js/calendar/event/index" */ '@views/calendar/event/index')
    },
    {
        path: '/calendar/event/:uuid/edit',
        name: 'calendarEventEdit',
        component: () => import(/* webpackChunkName: "js/calendar/event/edit" */ '@views/calendar/event/edit')
    },
    {
        path: '/calendar/celebration/birthday',
        name: 'calendarBirthdayCelebration',
        component: () => import(/* webpackChunkName: "js/calendar/celebration/birthday" */ '@views/calendar/celebration/birthday')
    },
    {
        path: '/calendar/celebration/anniversary',
        name: 'calendarAnniversaryCelebration',
        component: () => import(/* webpackChunkName: "js/calendar/celebration/anniversary" */ '@views/calendar/celebration/anniversary')
    },
    {
        path: '/calendar/celebration/work/anniversary',
        name: 'calendarWorkAnniversaryCelebration',
        component: () => import(/* webpackChunkName: "js/calendar/celebration/workAnniversary" */ '@views/calendar/celebration/work-anniversary')
    },
    {
        path: '/frontend',
        name: 'frontend',
        component: () => import(/* webpackChunkName: "js/frontend/index" */ '@views/frontend/index')
    },
    {
        path: '/frontend/page',
        name: 'frontendPage',
        component: () => import(/* webpackChunkName: "js/frontend/page/index" */ '@views/frontend/page/index')
    },
    {
        path: '/frontend/page/:uuid/edit',
        name: 'frontendPageEdit',
        component: () => import(/* webpackChunkName: "js/frontend/page/edit" */ '@views/frontend/page/edit')
    },
    {
        path: '/frontend/page/:uuid',
        name: 'frontendPageDetail',
        component: () => import(/* webpackChunkName: "js/frontend/page/edit" */ '@views/frontend/page/edit')
    },
    {
        path: '/frontend/block',
        name: 'frontendBlock',
        component: () => import(/* webpackChunkName: "js/frontend/block/index" */ '@views/frontend/block/index')
    },
    {
        path: '/frontend/block/:uuid/edit',
        name: 'frontendBlockEdit',
        component: () => import(/* webpackChunkName: "js/frontend/block/edit" */ '@views/frontend/block/edit')
    },
    {
        path: '/frontend/block/:uuid',
        name: 'frontendBlockDetail',
        component: () => import(/* webpackChunkName: "js/frontend/block/edit" */ '@views/frontend/block/edit')
    },
    {
        path: '/frontend/menu',
        name: 'frontendMenu',
        component: () => import(/* webpackChunkName: "js/frontend/menu/index" */ '@views/frontend/menu/index')
    },
    {
        path: '/frontend/menu/:id/edit',
        name: 'frontendMenuEdit',
        component: () => import(/* webpackChunkName: "js/frontend/menu/edit" */ '@views/frontend/menu/edit')
    },
    {
        path: '/post',
        name: 'post',
        component: () => import(/* webpackChunkName: "js/post/index" */ '@views/post/index')
    },
    {
        path: '/post/article',
        name: 'postArticle',
        component: () => import(/* webpackChunkName: "js/post/article/index" */ '@views/post/article/index')
    },
    {
        path: '/post/article/:uuid/edit',
        name: 'postArticleEdit',
        component: () => import(/* webpackChunkName: "js/post/article/edit" */ '@views/post/article/edit')
    },
    {
        path: '/post/feed',
        name: 'postFeed',
        component: () => import(/* webpackChunkName: "js/post/feed/index" */ '@views/post/feed/index')
    },
    {
        path: '/reception',
        name: 'reception',
        component: () => import(/* webpackChunkName: "js/reception/index" */ '@views/reception/index')
    },
    {
        path: '/reception/enquiry',
        name: 'receptionEnquiry',
        component: () => import(/* webpackChunkName: "js/reception/enquiry/index" */ '@views/reception/enquiry/index')
    },
    {
        path: '/reception/enquiry/:uuid/edit',
        name: 'receptionEnquiryEdit',
        component: () => import(/* webpackChunkName: "js/reception/enquiry/edit" */ '@views/reception/enquiry/edit')
    },
    {
        path: '/reception/enquiry/:uuid',
        name: 'receptionEnquiryDetail',
        component: () => import(/* webpackChunkName: "js/reception/enquiry/show" */ '@views/reception/enquiry/show')
    },
    {
        path: '/reception/visitor/log',
        name: 'receptionVisitorLog',
        component: () => import(/* webpackChunkName: "js/reception/visitorLog/index" */ '@views/reception/visitor-log/index')
    },
    {
        path: '/reception/visitor/log/:uuid/edit',
        name: 'receptionVisitorLogEdit',
        component: () => import(/* webpackChunkName: "js/reception/visitorLog/edit" */ '@views/reception/visitor-log/edit')
    },
    {
        path: '/reception/call/log',
        name: 'receptionCallLog',
        component: () => import(/* webpackChunkName: "js/reception/callLog/index" */ '@views/reception/call-log/index')
    },
    {
        path: '/reception/call/log/:uuid/edit',
        name: 'receptionCallLogEdit',
        component: () => import(/* webpackChunkName: "js/reception/callLog/edit" */ '@views/reception/call-log/edit')
    },
    {
        path: '/reception/complaint',
        name: 'receptionComplaint',
        component: () => import(/* webpackChunkName: "js/reception/complaint/index" */ '@views/reception/complaint/index')
    },
    {
        path: '/reception/complaint/:uuid/edit',
        name: 'receptionComplaintEdit',
        component: () => import(/* webpackChunkName: "js/reception/complaint/edit" */ '@views/reception/complaint/edit')
    },
    {
        path: '/reception/gate/pass',
        name: 'receptionGatePass',
        component: () => import(/* webpackChunkName: "js/reception/gatePass/index" */ '@views/reception/gate-pass/index')
    },
    {
        path: '/reception/gate/pass/:uuid/edit',
        name: 'receptionGatePassEdit',
        component: () => import(/* webpackChunkName: "js/reception/gatePass/edit" */ '@views/reception/gate-pass/edit')
    },
    {
        path: '/reception/postal/record',
        name: 'receptionPostalRecord',
        component: () => import(/* webpackChunkName: "js/reception/postalRecord/index" */ '@views/reception/postal-record/index')
    },
    {
        path: '/reception/postal/record/:uuid/edit',
        name: 'receptionPostalRecordEdit',
        component: () => import(/* webpackChunkName: "js/reception/postalRecord/edit" */ '@views/reception/postal-record/edit')
    },
    {
        path: '/reception/postal/record/:uuid',
        name: 'receptionPostalRecordDetail',
        component: () => import(/* webpackChunkName: "js/reception/postalRecord/show" */ '@views/reception/postal-record/show')
    },
    {
        path: '/reception/visitor/message',
        name: 'receptionVisitorMessage',
        component: () => import(/* webpackChunkName: "js/reception/visitorMessage/index" */ '@views/reception/visitor-message/index')
    },
    {
        path: '/communication',
        name: 'communication',
        component: () => import(/* webpackChunkName: "js/communication/index" */ '@views/communication/index')
    },
    {
        path: '/communication/notification',
        name: 'myNotification',
        component: () => import(/* webpackChunkName: "js/communication/notification" */ '@views/communication/notification')
    },
    {
        path: '/inventory/stock/category',
        name: 'inventoryStockCategory',
        component: () => import(/* webpackChunkName: "js/inventory/stock-category/index" */ '@views/inventory/stock-category/index')
    },
    {
        path: '/inventory/stock/category/:id/edit',
        name: 'inventoryStockCategoryEdit',
        component: () => import(/* webpackChunkName: "js/inventory/stock-category/edit" */ '@views/inventory/stock-category/edit')
    },
    {
        path: '/inventory/stock/item',
        name: 'inventoryStockItem',
        component: () => import(/* webpackChunkName: "js/inventory/stock-item/index" */ '@views/inventory/stock-item/index')
    },
    {
        path: '/inventory/stock/item/:id/edit',
        name: 'inventoryStockItemEdit',
        component: () => import(/* webpackChunkName: "js/inventory/stock-item/edit" */ '@views/inventory/stock-item/edit')
    },
    {
        path: '/inventory/stock/purchase',
        name: 'inventoryStockPurchase',
        component: () => import(/* webpackChunkName: "js/inventory/stock-purchase/index" */ '@views/inventory/stock-purchase/index')
    },
    {
        path: '/inventory/stock/purchase/:id/edit',
        name: 'inventoryStockPurchaseEdit',
        component: () => import(/* webpackChunkName: "js/inventory/stock-purchase/edit" */ '@views/inventory/stock-purchase/edit')
    },
    {
        path: '/inventory/stock/purchase/:id',
        name: 'inventoryStockPurchaseDetail',
        component: () => import(/* webpackChunkName: "js/inventory/stock-purchase/show" */ '@views/inventory/stock-purchase/show')
    },
    {
        path: '/inventory/stock/transfer',
        name: 'inventoryStockTransfer',
        component: () => import(/* webpackChunkName: "js/inventory/stock-transfer/index" */ '@views/inventory/stock-transfer/index')
    },
    {
        path: '/inventory/stock/transfer/:id/edit',
        name: 'inventoryStockTransferEdit',
        component: () => import(/* webpackChunkName: "js/inventory/stock-transfer/edit" */ '@views/inventory/stock-transfer/edit')
    },
    {
        path: '/inventory/stock/transfer/:id',
        name: 'inventoryStockTransferDetail',
        component: () => import(/* webpackChunkName: "js/inventory/stock-transfer/show" */ '@views/inventory/stock-transfer/show')
    },
    {
        path: '/inventory/vendor',
        name: 'inventoryVendor',
        component: () => import(/* webpackChunkName: "js/inventory/vendor/index" */ '@views/inventory/vendor/index')
    },
    {
        path: '/inventory/vendor/:id/edit',
        name: 'inventoryVendorEdit',
        component: () => import(/* webpackChunkName: "js/inventory/vendor/edit" */ '@views/inventory/vendor/edit')
    },
    {
        path: '/communication/sms',
        name: 'communicationSMS',
        component: () => import(/* webpackChunkName: "js/communication/sms/index" */ '@views/communication/sms/index')
    },
    {
        path: '/communication/push-notification',
        name: 'communicationPushNotification',
        component: () => import(/* webpackChunkName: "js/communication/push-notification/index" */ '@views/communication/push-notification/index')
    },
    {
        path: '/communication/email',
        name: 'communicationEmail',
        component: () => import(/* webpackChunkName: "js/communication/email/index" */ '@views/communication/email/index')
    },
    {
        path: '/institute/document',
        name: 'instituteDocument',
        component: () => import(/* webpackChunkName: "js/institute/document/index" */ '@views/institute/document/index')
    },
    {
        path: '/institute/document/:id/edit',
        name: 'instituteEdit',
        component: () => import(/* webpackChunkName: "js/institute/document/edit" */ '@views/institute/document/edit')
    }
]