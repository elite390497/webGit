(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[7792],{35641:(t,e,i)=>{"use strict";i.r(e),i.d(e,{default:()=>s});const a={components:{},data:function(){return{certificates:{total:0,data:[]},filter:{sort_by:"date_of_certificate",order:"desc",type:null,certificate_template_id:[],date_of_certificate_start_date:"",date_of_certificate_end_date:"",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"date_of_certificate",translation:i18n.academic.date_of_certificate}],types:[{text:i18n.student.student,value:"student"},{text:i18n.employee.employee,value:"employee"}],certificate_templates:[],selected_certificate_templates:null,showFilterPanel:!1,help_topic:""}},mounted:function(){helper.hasPermission("list-certificate")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getCertificates()},methods:{hasPermission:function(t){return helper.hasPermission(t)},getEmployeeName:function(t){return helper.getEmployeeName(t)},getEmployeeDesignationOnDate:function(t,e){return helper.getEmployeeDesignationOnDate(t,e)},getStudentName:function(t){return helper.getStudentName(t)},getStudentBatch:function(t){return t.batch.course.name+" "+t.batch.name},getCertificates:function(t){var e=this,i=this.$loading.show();"number"!=typeof t&&(t=1),this.filter.date_of_certificate_start_date=helper.toDate(this.filter.date_of_certificate_start_date),this.filter.date_of_certificate_end_date=helper.toDate(this.filter.date_of_certificate_end_date);var a=helper.getFilterURL(this.filter);axios.get("/api/certificate?page="+t+a).then((function(t){e.certificates=t.certificates,e.certificate_templates=t.filters.certificate_templates,i.hide()})).catch((function(t){i.hide(),helper.showErrorMsg(t)}))},editCertificate:function(t){this.$router.push("/academic/certificate/"+t.uuid+"/edit")},confirmDelete:function(t){var e=this;return function(i){return e.deleteCertificate(t)}},deleteCertificate:function(t){var e=this,i=this.$loading.show();axios.delete("/api/certificate/"+t.uuid).then((function(t){toastr.success(t.message),e.getCertificates(),i.hide()})).catch((function(t){i.hide(),helper.showErrorMsg(t)}))},getConfig:function(t){return helper.getConfig(t)},print:function(){var t=this.$loading.show();axios.post("/api/certificate/print",{filter:this.filter}).then((function(e){var i=window.open("/print");t.hide(),i.document.write(e)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},pdf:function(){var t=this,e=this.$loading.show();axios.post("/api/certificate/pdf",{filter:this.filter}).then((function(i){e.hide(),window.open("/download/report/"+i+"?token="+t.authToken)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},onCertificateTemplateSelect:function(t){this.filter.certificate_template_id.push(t.id)},onCertificateTemplateRemove:function(t){this.filter.certificate_template_id.splice(this.filter.certificate_template_id.indexOf(t.id),1)}},filters:{moment:function(t){return helper.formatDate(t)},momentDateTime:function(t){return helper.formatDateTime(t)}},watch:{"filter.sort_by":function(t){this.getCertificates()},"filter.order":function(t){this.getCertificates()},"filter.page_length":function(t){this.getCertificates()}},computed:{authToken:function(){return helper.getAuthToken()}}};const s=(0,i(51900).Z)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"page-titles"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-12 col-sm-6"},[i("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("academic.certificate"))+" \n                    "),t.certificates.total?i("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.total_result_found",{count:t.certificates.total,from:t.certificates.from,to:t.certificates.to})))]):i("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.no_result_found")))])])]),t._v(" "),i("div",{staticClass:"col-12 col-sm-6"},[i("div",{staticClass:"action-buttons pull-right"},[t.hasPermission("create-certificate")?i("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(e){return t.$router.push("/academic/certificate/create")}}},[i("i",{staticClass:"fas fa-plus"}),t._v(" "),i("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("academic.add_new_certificate")))])]):t._e(),t._v(" "),t.showFilterPanel?t._e():i("button",{staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showFilterPanel=!t.showFilterPanel}}},[i("i",{staticClass:"fas fa-filter"}),t._v(" "),i("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("general.filter")))])]),t._v(" "),i("sort-by",{attrs:{"order-by-options":t.orderByOptions,"sort-by":t.filter.sort_by,order:t.filter.order},on:{updateSortBy:function(e){t.filter.sort_by=e},updateOrder:function(e){t.filter.order=e}}}),t._v(" "),i("div",{staticClass:"btn-group"},[i("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[i("i",{staticClass:"fas fa-ellipsis-h"}),t._v(" "),i("span",{staticClass:"d-none d-sm-inline"})]),t._v(" "),i("div",{class:["dropdown-menu","ltr"==t.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[i("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.print}},[i("i",{staticClass:"fas fa-print"}),t._v(" "+t._s(t.trans("general.print")))]),t._v(" "),i("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.pdf}},[i("i",{staticClass:"fas fa-file-pdf"}),t._v(" "+t._s(t.trans("general.generate_pdf")))])])]),t._v(" "),i("help-button",{on:{clicked:function(e){t.help_topic="academic.certificate"}}})],1)])])]),t._v(" "),i("div",{staticClass:"container-fluid"},[i("transition",{attrs:{name:"fade"}},[t.showFilterPanel?i("div",{staticClass:"card card-form"},[i("div",{staticClass:"card-body"},[i("h4",{staticClass:"card-title"},[t._v(t._s(t.trans("general.filter")))]),t._v(" "),i("div",{staticClass:"row"},[i("div",{staticClass:"col-12 col-sm-3"},[i("div",{staticClass:"form-group"},[i("label",{attrs:{for:""}},[t._v(t._s(t.trans("academic.certificate_template")))]),t._v(" "),i("v-select",{attrs:{label:"name","track-by":"id",name:"certificate_template_id",id:"certificate_template_id",options:t.certificate_templates,placeholder:t.trans("academic.select_certificate_template"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:t.selected_certificate_templates},on:{select:t.onCertificateTemplateSelect,remove:t.onCertificateTemplateRemove},model:{value:t.selected_certificate_templates,callback:function(e){t.selected_certificate_templates=e},expression:"selected_certificate_templates"}},[t.certificate_templates.length?t._e():i("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[t._v("\n                                        "+t._s(t.trans("general.no_option_found"))+"\n                                    ")])])],1)]),t._v(" "),i("div",{staticClass:"col-12 col-sm-3"},[i("div",{staticClass:"form-group"},[i("label",{attrs:{for:""}},[t._v(t._s(t.trans("academic.certificate_template_type")))]),t._v(" "),i("select",{directives:[{name:"model",rawName:"v-model",value:t.filter.type,expression:"filter.type"}],staticClass:"custom-select col-12",on:{change:function(e){var i=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.$set(t.filter,"type",e.target.multiple?i:i[0])}}},[i("option",{attrs:{value:"null",selected:""}},[t._v(t._s(t.trans("general.select_one")))]),t._v(" "),t._l(t.types,(function(e){return i("option",{domProps:{value:e.value}},[t._v("\n                                    "+t._s(e.text)+"\n                                  ")])}))],2)])]),t._v(" "),i("div",{staticClass:"col-12 col-sm-6"},[i("date-range-picker",{attrs:{"start-date":t.filter.date_of_certificate_start_date,"end-date":t.filter.date_of_certificate_end_date,label:t.trans("academic.date_of_certificate_between")},on:{"update:startDate":function(e){return t.$set(t.filter,"date_of_certificate_start_date",e)},"update:start-date":function(e){return t.$set(t.filter,"date_of_certificate_start_date",e)},"update:endDate":function(e){return t.$set(t.filter,"date_of_certificate_end_date",e)},"update:end-date":function(e){return t.$set(t.filter,"date_of_certificate_end_date",e)}}})],1)]),t._v(" "),i("div",{staticClass:"card-footer text-right"},[i("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(e){t.showFilterPanel=!1}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),i("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"button"},on:{click:t.getCertificates}},[t._v(t._s(t.trans("general.filter")))])])])]):t._e()]),t._v(" "),i("div",{staticClass:"card"},[i("div",{staticClass:"card-body"},[t.certificates.total?i("div",{staticClass:"table-responsive"},[i("table",{staticClass:"table table-sm"},[i("thead",[i("tr",[i("th",[t._v(t._s(t.trans("academic.certificate_template")))]),t._v(" "),"employee"!=t.filter.type?i("th",[t._v(t._s(t.trans("student.student")))]):t._e(),t._v(" "),"student"!=t.filter.type?i("th",[t._v(t._s(t.trans("employee.employee")))]):t._e(),t._v(" "),i("th",[t._v(t._s(t.trans("academic.date_of_certificate")))]),t._v(" "),i("th",[t._v(t._s(t.trans("general.created_at")))]),t._v(" "),i("th",{staticClass:"table-option"},[t._v(t._s(t.trans("general.action")))])])]),t._v(" "),i("tbody",t._l(t.certificates.data,(function(e){return i("tr",[i("td",{domProps:{textContent:t._s(e.certificate_template.name)}}),t._v(" "),"employee"!=t.filter.type?i("td",["student"==e.certificate_template.type?i("span",[t._v("\n                                        "+t._s(t.getStudentName(e.student_record.student))+" "),i("br"),t._v(" "+t._s(t.getStudentBatch(e.student_record))+"\n                                    ")]):i("span",[t._v("\n                                        -\n                                    ")])]):t._e(),t._v(" "),"student"!=t.filter.type?i("td",["employee"==e.certificate_template.type?i("span",[t._v("\n                                        "+t._s(t.getEmployeeName(e.employee))+" "),i("br"),t._v(" "+t._s(t.getEmployeeDesignationOnDate(e.employee,e.date_of_certificate))+"\n                                    ")]):i("span",[t._v("\n                                        -\n                                    ")])]):t._e(),t._v(" "),i("td",[t._v(t._s(t._f("moment")(e.date_of_certificate)))]),t._v(" "),i("td",[t._v(t._s(t._f("momentDateTime")(e.created_at)))]),t._v(" "),i("td",{staticClass:"table-option"},[i("div",{staticClass:"btn-group"},[i("a",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.print"),expression:"trans('general.print')"}],staticClass:"btn btn-success btn-sm",attrs:{target:"_blank",href:"/academic/certificate/"+e.uuid+"/print?token="+t.authToken}},[i("i",{staticClass:"fas fa-print"})]),t._v(" "),t.hasPermission("edit-certificate")?i("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("academic.edit_certificate"),expression:"trans('academic.edit_certificate')"}],staticClass:"btn btn-info btn-sm",on:{click:function(i){return i.preventDefault(),t.editCertificate(e)}}},[i("i",{staticClass:"fas fa-edit"})]):t._e(),t._v(" "),t.hasPermission("delete-certificate")?i("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:t.confirmDelete(e)},expression:"{ok: confirmDelete(certificate)}"},{name:"tooltip",rawName:"v-tooltip",value:t.trans("academic.delete_certificate"),expression:"trans('academic.delete_certificate')"}],key:e.id,staticClass:"btn btn-danger btn-sm"},[i("i",{staticClass:"fas fa-trash"})]):t._e()])])])})),0)])]):t._e(),t._v(" "),t.certificates.total?t._e():i("module-info",{attrs:{module:"academic",title:"certificate_module_title",description:"certificate_module_description",icon:"list"}}),t._v(" "),i("pagination-record",{attrs:{"page-length":t.filter.page_length,records:t.certificates},on:{"update:pageLength":function(e){return t.$set(t.filter,"page_length",e)},"update:page-length":function(e){return t.$set(t.filter,"page_length",e)},updateRecords:t.getCertificates}})],1)])],1),t._v(" "),i("right-panel",{attrs:{topic:t.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=fbf06bcd92517a107165