(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[2740],{7802:(t,e,s)=>{"use strict";s.d(e,{Z:()=>r});const a={components:{},props:["title","returnStatus"],data:function(){return{book_logs:{total:0,data:[]},filter:{sort_by:"date_of_issue",order:"desc",date_of_issue_start_date:"",date_of_issue_end_date:"",due_date_start:"",due_date_end:"",issue_to:"",return_status:"",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"date_of_issue",translation:i18n.library.book_title}],showFilterPanel:!1,help_topic:"",issue_to:[{text:i18n.student.student,value:"student"},{text:i18n.employee.employee,value:"employee"}],return_statuses:[{text:i18n.library.return_complete,value:"complete"},{text:i18n.library.return_due,value:"due"},{text:i18n.library.return_overdue,value:"overdue"}]}},mounted:function(){helper.hasPermission("issue-book")||helper.hasPermission("return-book")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.filter.return_status=this.returnStatus,this.getBookLogs(),helper.showDemoNotification(["library"])},methods:{hasPermission:function(t){return helper.hasPermission(t)},getStudentName:function(t){return helper.getStudentName(t)},getEmployeeName:function(t){return helper.getEmployeeNameWithCode(t)},getStudentBatch:function(t){return t.course.name+" "+t.name},getBookLogs:function(t){var e=this,s=this.$loading.show();"number"!=typeof t&&(t=1),this.filter.date_of_issue_start_date=helper.toDate(this.filter.date_of_issue_start_date),this.filter.date_of_issue_end_date=helper.toDate(this.filter.date_of_issue_end_date),this.filter.due_date_start=helper.toDate(this.filter.due_date_start),this.filter.due_date_end=helper.toDate(this.filter.due_date_end);var a=helper.getFilterURL(this.filter);axios.get("/api/book/log?page="+t+a).then((function(t){e.book_logs=t.book_logs,s.hide()})).catch((function(t){s.hide(),helper.showErrorMsg(t)}))},getConfig:function(t){return helper.getConfig(t)},print:function(){var t=this.$loading.show();axios.post("/api/book/log/print",{filter:this.filter}).then((function(e){var s=window.open("/print");t.hide(),s.document.write(e)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},pdf:function(){var t=this,e=this.$loading.show();axios.post("/api/book/log/pdf",{filter:this.filter}).then((function(s){e.hide(),window.open("/download/report/"+s+"?token="+t.authToken)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},isOverDue:function(t){return t.book_issue_count>t.book_return_count&&helper.toDate(t.due_date)<helper.today()},overdueDay:function(t){var e=helper.today();return this.isOverDue(t)?helper.getDateDiff(t.due_date,e):0}},filters:{moment:function(t){return helper.formatDate(t)},momentDateTime:function(t){return helper.formatDateTime(t)}},watch:{"filter.sort_by":function(t){this.getBookLogs()},"filter.order":function(t){this.getBookLogs()},"filter.page_length":function(t){this.getBookLogs()}},computed:{authToken:function(){return helper.getAuthToken()}}};const r=(0,s(51900).Z)(a,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.title)+" \n                    "),t.book_logs.total?s("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.total_result_found",{count:t.book_logs.total,from:t.book_logs.from,to:t.book_logs.to})))]):s("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.no_result_found")))])])]),t._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[t.showFilterPanel?t._e():s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showFilterPanel=!t.showFilterPanel}}},[s("i",{staticClass:"fas fa-filter"}),t._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("general.filter")))])]),t._v(" "),s("sort-by",{attrs:{"order-by-options":t.orderByOptions,"sort-by":t.filter.sort_by,order:t.filter.order},on:{updateSortBy:function(e){t.filter.sort_by=e},updateOrder:function(e){t.filter.order=e}}}),t._v(" "),s("div",{staticClass:"btn-group"},[s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[s("i",{staticClass:"fas fa-ellipsis-h"}),t._v(" "),s("span",{staticClass:"d-none d-sm-inline"})]),t._v(" "),s("div",{class:["dropdown-menu","ltr"==t.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[s("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.print}},[s("i",{staticClass:"fas fa-print"}),t._v(" "+t._s(t.trans("general.print")))]),t._v(" "),s("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.pdf}},[s("i",{staticClass:"fas fa-file-pdf"}),t._v(" "+t._s(t.trans("general.generate_pdf")))])])]),t._v(" "),s("help-button",{on:{clicked:function(e){t.help_topic="library-issue-return"}}})],1)])])]),t._v(" "),s("div",{staticClass:"container-fluid"},[s("transition",{attrs:{name:"fade"}},[t.showFilterPanel?s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body"},[s("h4",{staticClass:"card-title"},[t._v(t._s(t.trans("general.filter")))]),t._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[t._v(t._s(t.trans("library.issue_to")))]),t._v(" "),s("select",{directives:[{name:"model",rawName:"v-model",value:t.filter.issue_to,expression:"filter.issue_to"}],staticClass:"custom-select col-12",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.$set(t.filter,"issue_to",e.target.multiple?s:s[0])}}},[s("option",{attrs:{value:"null",selected:""}},[t._v(t._s(t.trans("general.select_one")))]),t._v(" "),t._l(t.issue_to,(function(e){return s("option",{domProps:{value:e.value}},[t._v("\n                                    "+t._s(e.text)+"\n                                  ")])}))],2)])]),t._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[t._v(t._s(t.trans("library.return_status")))]),t._v(" "),s("select",{directives:[{name:"model",rawName:"v-model",value:t.filter.return_status,expression:"filter.return_status"}],staticClass:"custom-select col-12",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.$set(t.filter,"return_status",e.target.multiple?s:s[0])}}},[s("option",{attrs:{value:"null",selected:""}},[t._v(t._s(t.trans("general.select_one")))]),t._v(" "),t._l(t.return_statuses,(function(e){return s("option",{domProps:{value:e.value}},[t._v("\n                                    "+t._s(e.text)+"\n                                  ")])}))],2)])]),t._v(" "),s("div",{staticClass:"col-12 col-sm-5"},[s("div",{staticClass:"form-group"},[s("date-range-picker",{attrs:{"start-date":t.filter.date_of_issue_start_date,"end-date":t.filter.date_of_issue_end_date,label:t.trans("library.date_of_issue_between")},on:{"update:startDate":function(e){return t.$set(t.filter,"date_of_issue_start_date",e)},"update:start-date":function(e){return t.$set(t.filter,"date_of_issue_start_date",e)},"update:endDate":function(e){return t.$set(t.filter,"date_of_issue_end_date",e)},"update:end-date":function(e){return t.$set(t.filter,"date_of_issue_end_date",e)}}})],1)]),t._v(" "),s("div",{staticClass:"col-12 col-sm-5"},[s("div",{staticClass:"form-group"},[s("date-range-picker",{attrs:{"start-date":t.filter.due_date_start,"end-date":t.filter.due_date_end,label:t.trans("library.due_date_between")},on:{"update:startDate":function(e){return t.$set(t.filter,"due_date_start",e)},"update:start-date":function(e){return t.$set(t.filter,"due_date_start",e)},"update:endDate":function(e){return t.$set(t.filter,"due_date_end",e)},"update:end-date":function(e){return t.$set(t.filter,"due_date_end",e)}}})],1)])]),t._v(" "),s("div",{staticClass:"card-footer text-right"},[s("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(e){t.showFilterPanel=!1}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"button"},on:{click:t.getBookLogs}},[t._v(t._s(t.trans("general.filter")))])])])]):t._e()]),t._v(" "),s("div",{staticClass:"card"},[s("div",{staticClass:"card-body"},[t.book_logs.total?s("div",{staticClass:"table-responsive"},[s("table",{staticClass:"table table-sm"},[s("thead",[s("tr",[s("th",[t._v(t._s(t.trans("library.date_of_issue")))]),t._v(" "),s("th",[t._v(t._s(t.trans("library.due_date")))]),t._v(" "),s("th",[t._v(t._s(t.trans("library.issue_to")))]),t._v(" "),s("th"),t._v(" "),s("th",[t._v(t._s(t.trans("library.no_of_books_issued")))]),t._v(" "),s("th",[t._v(t._s(t.trans("library.no_of_books_returned")))]),t._v(" "),s("th",[t._v(t._s(t.trans("library.issue_remarks")))]),t._v(" "),s("th",{staticClass:"table-option"},[t._v(t._s(t.trans("general.action")))])])]),t._v(" "),s("tbody",t._l(t.book_logs.data,(function(e){return s("tr",[s("td",[t._v(t._s(t._f("moment")(e.date_of_issue)))]),t._v(" "),s("td",[e.due_date?s("span",[t._v("\n                                        "+t._s(t._f("moment")(e.due_date))+"\n                                        "),t.isOverDue(e)?[s("br"),t._v(" "),s("span",{staticClass:"label label-danger"},[t._v(t._s(t.trans("library.overdue_by_days",{day:t.overdueDay(e)})))])]:t._e()],2):s("span",[t._v("-")])]),t._v(" "),s("td",[e.student_record_id?s("span",[t._v(t._s(t.trans("student.student")))]):t._e(),t._v(" "),e.employee_id?s("span",[t._v(t._s(t.trans("employee.employee")))]):t._e()]),t._v(" "),s("td",[e.student_record_id?[s("span",[t._v(t._s(t.trans("student.name")+": "+t.getStudentName(e.student_record.student)))]),t._v(" "),s("br"),t._v(" "),s("span",[t._v(t._s(t.trans("academic.batch")+": "+t.getStudentBatch(e.student_record.batch)))]),s("br"),t._v(" "),s("span",[t._v(t._s(t.trans("student.first_guardian_name")+": "+e.student_record.student.parent.first_guardian_name))])]:t._e(),t._v(" "),e.employee_id?[s("span",[t._v(t._s(t.trans("employee.name")+": "+t.getEmployeeName(e.employee)))]),t._v(" "),s("br"),t._v(" "),s("span",[t._v(t._s(t.trans("employee.father_name")+": "+e.employee.father_name))]),s("br"),t._v(" "),s("span",[t._v(t._s(t.trans("employee.contact_number")+": "+e.employee.contact_number))])]:t._e()],2),t._v(" "),s("td",{domProps:{textContent:t._s(e.book_issue_count)}}),t._v(" "),s("td",{domProps:{textContent:t._s(e.book_return_count)}}),t._v(" "),s("td",{domProps:{textContent:t._s(e.issue_remarks)}}),t._v(" "),s("td",{staticClass:"table-option"},[s("div",{staticClass:"btn-group"},[s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.view_detail"),expression:"trans('general.view_detail')"}],staticClass:"btn btn-info btn-sm",on:{click:function(s){return t.$router.push("/library/issue/"+e.uuid)}}},[s("i",{staticClass:"fas fa-arrow-circle-right"})])])])])})),0)])]):t._e(),t._v(" "),t.book_logs.total?t._e():s("module-info",{attrs:{module:"library",title:"issue_module_title",description:"issue_module_description",icon:"list"}},[s("div",{attrs:{slot:"btn"},slot:"btn"})]),t._v(" "),s("pagination-record",{attrs:{"page-length":t.filter.page_length,records:t.book_logs},on:{"update:pageLength":function(e){return t.$set(t.filter,"page_length",e)},"update:page-length":function(e){return t.$set(t.filter,"page_length",e)},updateRecords:t.getBookLogs}})],1)])],1)])}),[],!1,null,null,null).exports},15494:(t,e,s)=>{"use strict";s.r(e),s.d(e,{default:()=>r});const a={components:{bookLog:s(7802).Z}};const r=(0,s(51900).Z)(a,(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("book-log",{attrs:{title:t.trans("library.return_due"),"return-status":"due"}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=return.js.map?id=af3c3490f526426ca475