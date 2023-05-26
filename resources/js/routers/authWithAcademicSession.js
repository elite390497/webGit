export default [
    {
        path: '/academic/course',
        component: () => import(/* webpackChunkName: "js/academic/course/index" */ '@views/academic/course/index')
    },
    {
        path: '/academic/course/:id/edit',
        component: () => import(/* webpackChunkName: "js/academic/course/edit" */ '@views/academic/course/edit')
    },
    {
        path: '/academic/batch',
        component: () => import(/* webpackChunkName: "js/academic/batch/index" */ '@views/academic/batch/index')
    },
    {
        path: '/academic/batch/:id/edit',
        component: () => import(/* webpackChunkName: "js/academic/batch/edit" */ '@views/academic/batch/edit')
    },
    {
        path: '/academic/subject',
        component: () => import(/* webpackChunkName: "js/academic/subject/index" */ '@views/academic/subject/index')
    },
    {
        path: '/academic/subject/:id/edit',
        component: () => import(/* webpackChunkName: "js/academic/subject/edit" */ '@views/academic/subject/edit')
    },
    {
        path: '/academic/class/teacher',
        component: () => import(/* webpackChunkName: "js/academic/classTeacher/index" */ '@views/academic/class-teacher/index')
    },
    {
        path: '/academic/subject/teacher',
        component: () => import(/* webpackChunkName: "js/academic/subjectTeacher/index" */ '@views/academic/subject-teacher/index')
    },
    {
        path: '/academic/class/timing',
        component: () => import(/* webpackChunkName: "js/academic/classTiming/index" */ '@views/academic/class-timing/index')
    },
    {
        path: '/academic/class/timing/create',
        component: () => import(/* webpackChunkName: "js/academic/classTiming/create" */ '@views/academic/class-timing/create')
    },
    {
        path: '/academic/class/timing/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/academic/classTiming/edit" */ '@views/academic/class-timing/edit')
    },
    {
        path: '/academic/timetable',
        component: () => import(/* webpackChunkName: "js/academic/timetable/index" */ '@views/academic/timetable/index')
    },
    {
        path: '/academic/timetable/create',
        component: () => import(/* webpackChunkName: "js/academic/timetable/create" */ '@views/academic/timetable/create')
    },
    {
        path: '/academic/timetable/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/academic/timetable/edit" */ '@views/academic/timetable/edit')
    },
    {
        path: '/academic/timetable/:uuid/allocation',
        component: () => import(/* webpackChunkName: "js/academic/timetable/allocation" */ '@views/academic/timetable/allocation')
    },
    {
        path: '/academic/certificate',
        component: () => import(/* webpackChunkName: "js/academic/certificate/index" */ '@views/academic/certificate/index')
    },
    {
        path: '/academic/certificate/create',
        component: () => import(/* webpackChunkName: "js/academic/certificate/create" */ '@views/academic/certificate/create')
    },
    {
        path: '/academic/certificate/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/academic/certificate/edit" */ '@views/academic/certificate/edit')
    },
    {
        path: '/student',
        component: () => import(/* webpackChunkName: "js/student/index" */ '@views/student/index')
    },
    {
        path: '/student/import',
        component: () => import(/* webpackChunkName: "js/student/import/index" */ '@views/student/import/index')
    },
    {
        path: '/student/registration',
        component: () => import(/* webpackChunkName: "js/student/registration/index" */ '@views/student/registration/index')
    },
    {
        path: '/student/registration/card-view',
        component: () => import(/* webpackChunkName: "js/student/registration/card-view" */ '@views/student/registration/card-view')
    },
    {
        path: '/student/registration/:id',
        component: () => import(/* webpackChunkName: "js/student/registration/show" */ '@views/student/registration/show')
    },
    {
        path: '/student/login',
        component: () => import(/* webpackChunkName: "js/student/login/list" */ '@views/student/login/list')
    },
    {
        path: '/student/parent',
        component: () => import(/* webpackChunkName: "js/student/parent/index" */ '@views/student/parent/index')
    },
    {
        path: '/student/parent/:id/edit',
        component: () => import(/* webpackChunkName: "js/student/parent/edit" */ '@views/student/parent/edit')
    },
    {
        path: '/student/list',
        component: () => import(/* webpackChunkName: "js/student/admission/index" */ '@views/student/admission/index')
    },
    {
        path: '/student/card-view',
        component: () => import(/* webpackChunkName: "js/student/admission/card-view" */ '@views/student/admission/card-view')
    },
    {
        path: '/student/roll/number',
        component: () => import(/* webpackChunkName: "js/student/rollNumber/index" */ '@views/student/roll-number/index')
    },
    {
        path: '/student/id-card',
        component: () => import(/* webpackChunkName: "js/student/idCard/index" */ '@views/student/id-card/index')
    },
    {
        path: '/student/image',
        component: () => import(/* webpackChunkName: "js/student/image/index" */ '@views/student/image/index')
    },
    {
        path: '/student/attendance',
        component: () => import(/* webpackChunkName: "js/student/attendance/index" */ '@views/student/attendance/index')
    },
    {
        path: '/student/attendance/absentee',
        component: () => import(/* webpackChunkName: "js/student/attendance/absentee" */ '@views/student/attendance/absentee')
    },
    {
        path: '/student/promotion',
        component: () => import(/* webpackChunkName: "js/student/promotion/index" */ '@views/student/promotion/index')
    },
    {
        path: '/student/termination',
        component: () => import(/* webpackChunkName: "js/student/termination/index" */ '@views/student/termination/index')
    },
    {
        path: '/student/termination/:uuid/:record_id',
        component: () => import(/* webpackChunkName: "js/student/termination/view" */ '@views/student/termination/view')
    },
    {
        path: '/student/termination/:uuid/:record_id/edit',
        component: () => import(/* webpackChunkName: "js/student/termination/edit" */ '@views/student/termination/edit')
    },
    {
        path: '/student/:uuid',
        component: () => import(/* webpackChunkName: "js/student" */ '@views/student/show')
    },
    {
        path: '/student/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/student/edit" */ '@views/student/edit')
    },
    {
        path: '/student/:uuid/fee/:record_id',
        component: () => import(/* webpackChunkName: "js/student/fee/index" */ '@views/student/fee/index')
    },
    {
        path: '/student/:uuid/fee/:record_id/set',
        component: () => import(/* webpackChunkName: "js/student/fee/set" */ '@views/student/fee/set')
    },
    {
        path: '/student/:uuid/fee/:record_id/create',
        component: () => import(/* webpackChunkName: "js/student/fee/create" */ '@views/student/fee/create')
    },
    {
        path: '/online-exam',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/index" */ '@views/exam/online-exam/index')
    },
    {
        path: '/online-exam/create',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/create" */ '@views/exam/online-exam/create')
    },
    {
        path: '/online-exam/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/edit" */ '@views/exam/online-exam/edit')
    },
    {
        path: '/online-exam/:uuid/questions',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/questions" */ '@views/exam/online-exam/questions')
    },
    {
        path: '/online-exam/:uuid/records',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/records" */ '@views/exam/online-exam/records')
    },
    {
        path: '/online-exam/:uuid/records/:id/report',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/report" */ '@views/exam/online-exam/report')
    },
    {
        path: '/online-exam/:uuid/exam',
        component: () => import(/* webpackChunkName: "js/exam/online-exam/exam" */ '@views/exam/online-exam/exam')
    },
    {
        path: '/exam/schedule',
        component: () => import(/* webpackChunkName: "js/exam/schedule/index" */ '@views/exam/schedule/index')
    },
    {
        path: '/exam/schedule/create',
        component: () => import(/* webpackChunkName: "js/exam/schedule/create" */ '@views/exam/schedule/create')
    },
    {
        path: '/exam/schedule/:id/edit',
        component: () => import(/* webpackChunkName: "js/exam/schedule/edit" */ '@views/exam/schedule/edit')
    },
    {
        path: '/exam/record',
        component: () => import(/* webpackChunkName: "js/exam/record/index" */ '@views/exam/record/index')
    },
    {
        path: '/exam/record/observation',
        component: () => import(/* webpackChunkName: "js/exam/record/observation" */ '@views/exam/record/observation')
    },
    {
        path: '/exam/report',
        component: () => import(/* webpackChunkName: "js/exam/report/index" */ '@views/exam/report/index')
    },
    {
        path: '/exam/report/exam-wise',
        component: () => import('@views/exam/report/exam-wise' /* webpackChunkName: "js/exam/report/exam-wise" */)
    },
    {
        path: '/exam/report/term-wise',
        component: () => import('@views/exam/report/term-wise' /* webpackChunkName: "js/exam/report/term-wise" */)
    },
    {
        path: '/exam/report/topper',
        component: () => import(/* webpackChunkName: "js/exam/report/topper" */ '@views/exam/report/topper')
    },
    {
        path: '/exam',
        component: () => import(/* webpackChunkName: "js/exam/index" */ '@views/exam/index')
    },
    {
        path: '/exam/:id/edit',
        component: () => import(/* webpackChunkName: "js/exam/edit" */ '@views/exam/edit')
    },
    {
        path: '/finance',
        component: () => import(/* webpackChunkName: "js/finance/index" */ '@views/finance/index')
    },
    {
        path: '/finance/fee',
        component: () => import(/* webpackChunkName: "js/finance/fee/index" */ '@views/finance/fee/index')
    },
    {
        path: '/finance/fee/group',
        component: () => import(/* webpackChunkName: "js/finance/fee/group/index" */ '@views/finance/fee/group/index')
    },
    {
        path: '/finance/fee/group/:id/edit',
        component: () => import(/* webpackChunkName: "js/finance/fee/group/edit" */ '@views/finance/fee/group/edit')
    },
    {
        path: '/finance/fee/concession',
        component: () => import(/* webpackChunkName: "js/finance/fee/concession/index" */ '@views/finance/fee/concession/index')
    },
    {
        path: '/finance/fee/concession/:id/edit',
        component: () => import(/* webpackChunkName: "js/finance/fee/concession/edit" */ '@views/finance/fee/concession/edit')
    },
    {
        path: '/finance/fee/head',
        component: () => import(/* webpackChunkName: "js/finance/fee/head/index" */ '@views/finance/fee/head/index')
    },
    {
        path: '/finance/fee/head/:id/edit',
        component: () => import(/* webpackChunkName: "js/finance/fee/head/edit" */ '@views/finance/fee/head/edit')
    },
    {
        path: '/finance/fee/allocation',
        component: () => import(/* webpackChunkName: "js/finance/fee/allocation/index" */ '@views/finance/fee/allocation/index')
    },
    {
        path: '/finance/fee/allocation/create',
        component: () => import(/* webpackChunkName: "js/finance/fee/allocation/create" */ '@views/finance/fee/allocation/create')
    },
    {
        path: '/finance/fee/allocation/create/:uuid',
        component: () => import(/* webpackChunkName: "js/finance/fee/allocation/create" */ '@views/finance/fee/allocation/create')
    },
    {
        path: '/finance/fee/allocation/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/finance/fee/allocation/edit" */ '@views/finance/fee/allocation/edit')
    },
    {
        path: '/finance/fee/allocation/:uuid',
        component: () => import(/* webpackChunkName: "js/finance/fee/allocation/show" */ '@views/finance/fee/allocation/show')
    },
    {
        path: '/finance/transaction/income',
        component: () => import(/* webpackChunkName: "js/finance/transaction/income/index" */ '@views/finance/transaction/income/index')
    },
    {
        path: '/finance/transaction/income/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/finance/transaction/income/edit" */ '@views/finance/transaction/income/edit')
    },
    {
        path: '/finance/transaction/expense',
        component: () => import(/* webpackChunkName: "js/finance/transaction/expense/index" */ '@views/finance/transaction/expense/index')
    },
    {
        path: '/finance/transaction/expense/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/finance/transaction/expense/edit" */ '@views/finance/transaction/expense/edit')
    },
    {
        path: '/finance/transaction/account/transfer',
        component: () => import(/* webpackChunkName: "js/finance/transaction/accountTransfer/index" */ '@views/finance/transaction/account-transfer/index')
    },
    {
        path: '/finance/transaction/account/transfer/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/finance/transaction/accountTransfer/edit" */ '@views/finance/transaction/account-transfer/edit')
    },
    {
        path: '/transport',
        component: () => import(/* webpackChunkName: "js/transport/index" */ '@views/transport/index')
    },
    {
        path: '/transport/circle',
        component: () => import(/* webpackChunkName: "js/transport/circle/index" */ '@views/transport/circle/index')
    },
    {
        path: '/transport/circle/:id/edit',
        component: () => import(/* webpackChunkName: "js/transport/circle/edit" */ '@views/transport/circle/edit')
    },
    {
        path: '/transport/stoppage',
        component: () => import(/* webpackChunkName: "js/transport/stoppage/index" */ '@views/transport/stoppage/index')
    },
    {
        path: '/transport/stoppage/:id/edit',
        component: () => import(/* webpackChunkName: "js/transport/stoppage/edit" */ '@views/transport/stoppage/edit')
    },
    {
        path: '/transport/route/assign',
        component: () => import(/* webpackChunkName: "js/transport/route/assign" */ '@views/transport/route/assign')
    },
    {
        path: '/transport/route',
        component: () => import(/* webpackChunkName: "js/transport/route/index" */ '@views/transport/route/index')
    },
    {
        path: '/transport/route/:id/edit',
        component: () => import(/* webpackChunkName: "js/transport/route/edit" */ '@views/transport/route/edit')
    },
    {
        path: '/transport/report/route',
        component: () => import(/* webpackChunkName: "js/transport/report/route" */ '@views/transport/report/route')
    },
    {
        path: '/transport/report/stoppage',
        component: () => import(/* webpackChunkName: "js/transport/report/stoppage" */ '@views/transport/report/stoppage')
    },
    {
        path: '/transport/fee',
        component: () => import(/* webpackChunkName: "js/transport/fee/index" */ '@views/transport/fee/index')
    },
    {
        path: '/transport/fee/:id/edit',
        component: () => import(/* webpackChunkName: "js/transport/fee/edit" */ '@views/transport/fee/edit')
    },
    {
        path: '/library',
        component: () => import(/* webpackChunkName: "js/library/index" */ '@views/library/index')
    },
    {
        path: '/library/barcode',
        component: () => import(/* webpackChunkName: "js/library/barcode/index" */ '@views/library/barcode/index')
    },
    {
        path: '/library/book',
        component: () => import(/* webpackChunkName: "js/library/book/index" */ '@views/library/book/index')
    },
    {
        path: '/library/book/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/library/book/edit" */ '@views/library/book/edit')
    },
    {
        path: '/library/book/:uuid',
        component: () => import(/* webpackChunkName: "js/library/book/show" */ '@views/library/book/show')
    },
    {
        path: '/library/issue',
        component: () => import(/* webpackChunkName: "js/library/issueReturn/issue" */ '@views/library/issue-return/issue')
    },
    {
        path: '/library/issue/list',
        component: () => import(/* webpackChunkName: "js/library/issueReturn/log" */ '@views/library/issue-return/log')
    },
    {
        path: '/library/return',
        component: () => import(/* webpackChunkName: "js/library/issueReturn/return" */ '@views/library/issue-return/return')
    },
    {
        path: '/library/issue/:uuid',
        component: () => import(/* webpackChunkName: "js/library/issueReturn/show" */ '@views/library/issue-return/show')
    },
    {
        path: '/inventory',
        component: () => import(/* webpackChunkName: "js/inventory/index" */ '@views/inventory/index')
    },
    {
        path: '/resource',
        component: () => import(/* webpackChunkName: "js/resource/index" */ '@views/resource/index')
    },
    {
        path: '/resource/assignment',
        component: () => import(/* webpackChunkName: "js/resource/assignment/index" */ '@views/resource/assignment/index')
    },
    {
        path: '/resource/assignment/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/resource/assignment/edit" */ '@views/resource/assignment/edit')
    },
    {
        path: '/resource/assignment/:uuid',
        component: () => import(/* webpackChunkName: "js/resource/assignment/show" */ '@views/resource/assignment/show')
    },
    {
        path: '/resource/notes',
        component: () => import(/* webpackChunkName: "js/resource/notes/index" */ '@views/resource/notes/index')
    },
    {
        path: '/resource/notes/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/resource/notes/edit" */ '@views/resource/notes/edit')
    },
    {
        path: '/resource/notes/:uuid',
        component: () => import(/* webpackChunkName: "js/resource/notes/show" */ '@views/resource/notes/show')
    },
    {
        path: '/resource/lesson/plan',
        component: () => import(/* webpackChunkName: "js/resource/lessonPlan/index" */ '@views/resource/lesson-plan/index')
    },
    {
        path: '/resource/lesson/plan/create',
        component: () => import(/* webpackChunkName: "js/resource/lessonPlan/create" */ '@views/resource/lesson-plan/create')
    },
    {
        path: '/resource/lesson/plan/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/resource/lessonPlan/edit" */ '@views/resource/lesson-plan/edit')
    },
    {
        path: '/resource/lesson/plan/:uuid',
        component: () => import(/* webpackChunkName: "js/resource/lessonPlan/show" */ '@views/resource/lesson-plan/show')
    },
    {
        path: '/resource/syllabus',
        component: () => import(/* webpackChunkName: "js/resource/syllabus/index" */ '@views/resource/syllabus/index')
    },
    {
        path: '/resource/syllabus/create',
        component: () => import(/* webpackChunkName: "js/resource/syllabus/create" */ '@views/resource/syllabus/create')
    },
    {
        path: '/resource/syllabus/:uuid/edit',
        component: () => import(/* webpackChunkName: "js/resource/syllabus/edit" */ '@views/resource/syllabus/edit')
    },
    {
        path: '/resource/syllabus/:uuid',
        component: () => import(/* webpackChunkName: "js/resource/syllabus/show" */ '@views/resource/syllabus/show')
    }
]