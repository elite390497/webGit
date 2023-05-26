(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[457],{67113:(t,e,o)=>{"use strict";o.d(e,{Z:()=>r});const s={components:{},data:function(){return{courseGroupForm:new Form({name:"",description:""})}},props:["id"],mounted:function(){this.id&&this.get()},methods:{proceed:function(){this.id?this.update():this.store()},store:function(){var t=this,e=this.$loading.show();this.courseGroupForm.post("/api/academic/course/group").then((function(o){toastr.success(o.message),t.$emit("completed"),e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},get:function(){var t=this,e=this.$loading.show();axios.get("/api/academic/course/group/"+this.id).then((function(o){t.courseGroupForm.name=o.name,t.courseGroupForm.description=o.description,e.hide()})).catch((function(o){e.hide(),helper.showErrorMsg(o),t.$router.push("/configuration/academic/course/group")}))},update:function(){var t=this,e=this.$loading.show();this.courseGroupForm.patch("/api/academic/course/group/"+this.id).then((function(o){toastr.success(o.message),e.hide(),t.$router.push("/configuration/academic/course/group")})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))}}};const r=(0,o(51900).Z)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("form",{on:{submit:function(e){return e.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(e){return t.courseGroupForm.errors.clear(e.target.name)}}},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("academic.course_group_name")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.courseGroupForm.name,expression:"courseGroupForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:t.trans("academic.course_group_name")},domProps:{value:t.courseGroupForm.name},on:{input:function(e){e.target.composing||t.$set(t.courseGroupForm,"name",e.target.value)}}}),t._v(" "),o("show-error",{attrs:{"form-name":t.courseGroupForm,"prop-name":"name"}})],1)]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("academic.course_group_description")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.courseGroupForm.description,expression:"courseGroupForm.description"}],staticClass:"form-control",attrs:{type:"text",name:"description",placeholder:t.trans("academic.course_group_description")},domProps:{value:t.courseGroupForm.description},on:{input:function(e){e.target.composing||t.$set(t.courseGroupForm,"description",e.target.value)}}}),t._v(" "),o("show-error",{attrs:{"form-name":t.courseGroupForm,"prop-name":"description"}})],1)])]),t._v(" "),o("div",{staticClass:"card-footer text-right"},[o("router-link",{directives:[{name:"show",rawName:"v-show",value:t.id,expression:"id"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/configuration/academic/course/group"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),t.id?t._e():o("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(e){return t.$emit("cancel")}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),o("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.id?o("span",[t._v(t._s(t.trans("general.update")))]):o("span",[t._v(t._s(t.trans("general.save")))])])],1)])}),[],!1,null,null,null).exports},53855:(t,e,o)=>{"use strict";o.r(e),o.d(e,{default:()=>r});const s={components:{courseGroupForm:o(67113).Z},data:function(){return{course_groups:{total:0,data:[]},filter:{sort_by:"position",order:"asc",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"position",translation:i18n.academic.course_group_order},{value:"name",translation:i18n.academic.course_group_name}],showCreatePanel:!1,showReorderModal:!1,list:[],help_topic:""}},mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getCourseGroups()},methods:{getCourseGroups:function(t){var e=this,o=this.$loading.show();"number"!=typeof t&&(t=1);var s=helper.getFilterURL(this.filter);axios.get("/api/academic/course/group?page="+t+s).then((function(t){e.list=[],e.course_groups=t,e.course_groups.data.forEach((function(t){e.list.push(t.name)})),o.hide()})).catch((function(t){o.hide(),helper.showErrorMsg(t)}))},editCourseGroup:function(t){this.$router.push("/configuration/academic/course/group/"+t.id+"/edit")},confirmDelete:function(t){var e=this;return function(o){return e.deleteCourseGroup(t)}},deleteCourseGroup:function(t){var e=this,o=this.$loading.show();axios.delete("/api/academic/course/group/"+t.id).then((function(t){toastr.success(t.message),e.getCourseGroups(),o.hide()})).catch((function(t){o.hide(),helper.showErrorMsg(t)}))},getConfig:function(t){return helper.getConfig(t)},print:function(){var t=this.$loading.show();axios.post("/api/academic/course/group/print",{filter:this.filter}).then((function(e){var o=window.open("/print");t.hide(),o.document.write(e)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},pdf:function(){var t=this,e=this.$loading.show();axios.post("/api/academic/course/group/pdf",{filter:this.filter}).then((function(o){e.hide(),window.open("/download/report/"+o+"?token="+t.authToken)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},reorderCourseGroup:function(){var t=this;axios.post("/api/academic/course/group/reorder",{list:this.list}).then((function(e){toastr.success(e.message),t.showReorderModal=!1,t.getCourseGroups()})).catch((function(t){helper.showErrorMsg(t)}))}},filters:{momentDateTime:function(t){return helper.formatDateTime(t)}},watch:{"filter.sort_by":function(t){this.getCourseGroups()},"filter.order":function(t){this.getCourseGroups()},"filter.page_length":function(t){this.getCourseGroups()}},computed:{authToken:function(){return helper.getAuthToken()}}};const r=(0,o(51900).Z)(s,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticClass:"page-titles"},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("academic.course_group"))+"\n                    "),t.course_groups.total?o("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.total_result_found",{count:t.course_groups.total,from:t.course_groups.from,to:t.course_groups.to})))]):o("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.no_result_found")))])])]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"action-buttons pull-right"},[t.course_groups.total&&!t.showCreatePanel?o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showCreatePanel=!t.showCreatePanel}}},[o("i",{staticClass:"fas fa-plus"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("academic.add_new_course_group")))])]):t._e(),t._v(" "),t.course_groups.total?o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("academic.reorder_course_group"),expression:"trans('academic.reorder_course_group')"}],staticClass:"btn btn-info btn-sm",on:{click:function(e){t.showReorderModal=!0}}},[o("i",{staticClass:"fas fa-arrows-alt"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("academic.reorder_course_group")))])]):t._e(),t._v(" "),o("sort-by",{attrs:{"order-by-options":t.orderByOptions,"sort-by":t.filter.sort_by,order:t.filter.order},on:{updateSortBy:function(e){t.filter.sort_by=e},updateOrder:function(e){t.filter.order=e}}}),t._v(" "),o("div",{staticClass:"btn-group"},[o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[o("i",{staticClass:"fas fa-ellipsis-h"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"})]),t._v(" "),o("div",{class:["dropdown-menu","ltr"==t.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[o("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.print}},[o("i",{staticClass:"fas fa-print"}),t._v(" "+t._s(t.trans("general.print")))]),t._v(" "),o("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.pdf}},[o("i",{staticClass:"fas fa-file-pdf"}),t._v(" "+t._s(t.trans("general.generate_pdf")))])])]),t._v(" "),o("help-button",{on:{clicked:function(e){t.help_topic="configuration.academic.course-group"}}})],1)])])]),t._v(" "),o("div",{staticClass:"container-fluid"},[o("transition",{attrs:{name:"fade"}},[t.showCreatePanel?o("div",{staticClass:"card card-form"},[o("div",{staticClass:"card-body"},[o("h4",{staticClass:"card-title"},[t._v(t._s(t.trans("academic.add_new_course_group")))]),t._v(" "),o("course-group-form",{on:{completed:t.getCourseGroups,cancel:function(e){t.showCreatePanel=!t.showCreatePanel}}})],1)]):t._e()]),t._v(" "),o("div",{staticClass:"card"},[o("div",{staticClass:"card-body"},[t.course_groups.total?o("div",{staticClass:"table-responsive"},[o("table",{staticClass:"table table-sm"},[o("thead",[o("tr",[o("th",[t._v(t._s(t.trans("academic.course_group_name")))]),t._v(" "),o("th",[t._v(t._s(t.trans("academic.course")))]),t._v(" "),o("th",[t._v(t._s(t.trans("academic.course_group_description")))]),t._v(" "),o("th",{staticClass:"table-option"},[t._v(t._s(t.trans("general.action")))])])]),t._v(" "),o("tbody",t._l(t.course_groups.data,(function(e){return o("tr",[o("td",[t._v("\n                                    "+t._s(e.name)+"\n                                ")]),t._v(" "),o("td",[o("ul",{staticStyle:{"list-style":"none",padding:"0",margin:"0"}},t._l(e.courses,(function(e){return o("li",[t._v(t._s(e.name))])})),0)]),t._v(" "),o("td",{domProps:{textContent:t._s(e.description)}}),t._v(" "),o("td",{staticClass:"table-option"},[o("div",{staticClass:"btn-group"},[o("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("academic.edit_course_group"),expression:"trans('academic.edit_course_group')"}],staticClass:"btn btn-info btn-sm",on:{click:function(o){return o.preventDefault(),t.editCourseGroup(e)}}},[o("i",{staticClass:"fas fa-edit"})]),t._v(" "),o("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:t.confirmDelete(e)},expression:"{ok: confirmDelete(course_group)}"},{name:"tooltip",rawName:"v-tooltip",value:t.trans("academic.delete_course_group"),expression:"trans('academic.delete_course_group')"}],key:e.id,staticClass:"btn btn-danger btn-sm"},[o("i",{staticClass:"fas fa-trash"})])])])])})),0)])]):t._e(),t._v(" "),t.course_groups.total?t._e():o("module-info",{attrs:{module:"academic",title:"course_group_module_title",description:"course_group_module_description",icon:"list"}},[o("div",{attrs:{slot:"btn"},slot:"btn"},[t.showCreatePanel?t._e():o("button",{staticClass:"btn btn-info btn-md",on:{click:function(e){t.showCreatePanel=!t.showCreatePanel}}},[o("i",{staticClass:"fas fa-plus"}),t._v(" "+t._s(t.trans("general.add_new")))])])]),t._v(" "),o("pagination-record",{attrs:{"page-length":t.filter.page_length,records:t.course_groups},on:{"update:pageLength":function(e){return t.$set(t.filter,"page_length",e)},"update:page-length":function(e){return t.$set(t.filter,"page_length",e)},updateRecords:t.getCourseGroups},nativeOn:{change:function(e){return t.getCourseGroups.apply(null,arguments)}}})],1)])],1),t._v(" "),t.showReorderModal?o("transition",{attrs:{name:"modal"}},[o("div",{staticClass:"modal-mask"},[o("div",{staticClass:"modal-wrapper"},[o("div",{staticClass:"modal-container modal-lg"},[o("div",{staticClass:"modal-header"},[t._t("header",(function(){return[t._v("\n                            "+t._s(t.trans("academic.reorder_course_group"))+"\n                            "),o("span",{staticClass:"float-right pointer",on:{click:function(e){t.showReorderModal=!1}}},[t._v("x")])]}))],2),t._v(" "),o("div",{staticClass:"modal-body"},[t._t("body",(function(){return[o("draggable",{staticClass:"list-group",on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.list,callback:function(e){t.list=e},expression:"list"}},t._l(t.list,(function(e){return o("div",{key:e.id,staticClass:"list-group-item pointer"},[o("i",{staticClass:"fas fa-arrows-alt"}),t._v(" "+t._s(e))])})),0),t._v(" "),o("button",{staticClass:"btn btn-info pull-right m-t-10",attrs:{type:"button"},on:{click:t.reorderCourseGroup}},[t._v(t._s(t.trans("general.save")))])]}))],2)])])])]):t._e(),t._v(" "),o("right-panel",{attrs:{topic:t.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=32293474e95a8735e72c