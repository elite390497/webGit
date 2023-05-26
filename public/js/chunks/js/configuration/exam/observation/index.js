(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[89],{67700:(t,e,a)=>{"use strict";a.d(e,{Z:()=>o});const s={components:{},data:function(){return{observationForm:new Form({name:"",description:"",details:[]})}},props:["id"],mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.id?this.get():this.addRow()},methods:{hasPermission:function(t){return helper.hasPermission(t)},addRow:function(){this.observationForm.details.push({name:"",max_mark:"",description:""})},confirmDeleteDetail:function(t){var e=this;return function(a){return e.deleteDetail(t)}},deleteDetail:function(t){this.observationForm.details.splice(t,1)},getDetailName:function(t){return t+"_detail_name"},getDetailMaxMarkName:function(t){return t+"_detail_max_mark"},getDetailDescriptionName:function(t){return t+"_detail_description"},proceed:function(){this.id?this.update():this.store()},store:function(){var t=this,e=this.$loading.show();this.observationForm.post("/api/exam/observation").then((function(a){toastr.success(a.message),t.observationForm.details=[],t.addRow(),t.$emit("completed"),e.hide()})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},get:function(){var t=this,e=this.$loading.show();axios.get("/api/exam/observation/"+this.id).then((function(a){t.observationForm.name=a.name,t.observationForm.description=a.description,a.details.forEach((function(e){t.observationForm.details.push({name:e.name,max_mark:e.max_mark,description:e.description})})),e.hide()})).catch((function(a){e.hide(),helper.showErrorMsg(a),t.$router.push("/configuration/exam/observation")}))},update:function(){var t=this,e=this.$loading.show();this.observationForm.patch("/api/exam/observation/"+this.id).then((function(a){toastr.success(a.message),e.hide(),t.$router.push("/configuration/exam/observation")})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))}}};const o=(0,a(51900).Z)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("form",{on:{submit:function(e){return e.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(e){return t.observationForm.errors.clear(e.target.name)}}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 col-sm-6"},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:""}},[t._v(t._s(t.trans("exam.observation_name")))]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.observationForm.name,expression:"observationForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:t.trans("exam.observation_name")},domProps:{value:t.observationForm.name},on:{input:function(e){e.target.composing||t.$set(t.observationForm,"name",e.target.value)}}}),t._v(" "),a("show-error",{attrs:{"form-name":t.observationForm,"prop-name":"name"}})],1)]),t._v(" "),a("div",{staticClass:"col-12 col-sm-6"},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:""}},[t._v(t._s(t.trans("exam.observation_description")))]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:t.observationForm.description,expression:"observationForm.description"}],staticClass:"form-control",attrs:{type:"text",name:"description",placeholder:t.trans("exam.observation_description")},domProps:{value:t.observationForm.description},on:{input:function(e){e.target.composing||t.$set(t.observationForm,"description",e.target.value)}}}),t._v(" "),a("show-error",{attrs:{"form-name":t.observationForm,"prop-name":"description"}})],1)])]),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col-12"},[a("h6",{staticClass:"card-title"},[t._v(t._s(t.trans("exam.observation_sub_parameter")))]),t._v(" "),t._l(t.observationForm.details,(function(e,s){return[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 col-sm-3"},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:""}},[t._v(t._s(t.trans("exam.observation_detail_name"))+" \n                                "),a("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:t.confirmDeleteDetail(s)},expression:"{ok: confirmDeleteDetail(index)}"},{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.delete"),expression:"trans('general.delete')"}],key:s+"_delete_detail",staticClass:"btn btn-xs btn-danger m-l-20",attrs:{type:"button"}},[a("i",{staticClass:"fas fa-times"})])]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"detail.name"}],staticClass:"form-control",attrs:{type:"text",name:t.getDetailName(s),placeholder:t.trans("exam.observation_detail_name")},domProps:{value:e.name},on:{input:function(a){a.target.composing||t.$set(e,"name",a.target.value)}}}),t._v(" "),a("show-error",{attrs:{"form-name":t.observationForm,"prop-name":t.getDetailName(s)}})],1)]),t._v(" "),a("div",{staticClass:"col-12 col-sm-2"},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:""}},[t._v(t._s(t.trans("exam.observation_detail_max_mark")))]),t._v(" "),a("input",{directives:[{name:"model",rawName:"v-model",value:e.max_mark,expression:"detail.max_mark"}],staticClass:"form-control",attrs:{type:"number",name:t.getDetailMaxMarkName(s),placeholder:t.trans("exam.observation_detail_max_mark")},domProps:{value:e.max_mark},on:{input:function(a){a.target.composing||t.$set(e,"max_mark",a.target.value)}}}),t._v(" "),a("show-error",{attrs:{"form-name":t.observationForm,"prop-name":t.getDetailMaxMarkName(s)}})],1)]),t._v(" "),a("div",{staticClass:"col-12 col-sm-4"},[a("div",{staticClass:"form-group"},[a("label",{attrs:{for:""}},[t._v(t._s(t.trans("exam.observation_detail_description")))]),t._v(" "),a("autosize-textarea",{attrs:{rows:"2",name:t.getDetailDescriptionName(s),placeholder:t.trans("resource.observation_detail_description")},model:{value:e.description,callback:function(a){t.$set(e,"description",a)},expression:"detail.description"}}),t._v(" "),a("show-error",{attrs:{"form-name":t.observationForm,"prop-name":t.getDetailDescriptionName(s)}})],1)])])]})),t._v(" "),a("div",{staticClass:"form-group"},[a("button",{staticClass:"btn btn-info btn-sm waves-effect waves-light",attrs:{type:"button"},on:{click:t.addRow}},[t._v(t._s(t.trans("exam.add_new_observation_detail")))])])],2)]),t._v(" "),a("div",{staticClass:"card-footer text-right"},[a("router-link",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/configuration/exam/observation"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),a("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.id?a("span",[t._v(t._s(t.trans("general.update")))]):a("span",[t._v(t._s(t.trans("general.save")))])])],1)])])}),[],!1,null,null,null).exports},91539:(t,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>o});const s={components:{observationForm:a(67700).Z},data:function(){return{observations:{total:0,data:[]},observation:{},filter:{sort_by:"name",order:"asc",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"name",translation:i18n.exam.observation_name}],showReorderModal:!1,observation_detail_list:[],help_topic:""}},mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getObservations()},methods:{getConfig:function(t){return helper.getConfig(t)},showReorderAction:function(t){this.showReorderModal=!0,this.getObservationDetailList(t)},getObservationDetailList:function(t){var e=this;this.observation_detail_list=[],this.observation=t,t.details.forEach((function(t){e.observation_detail_list.push(t.name)}))},getObservations:function(t){var e=this,a=this.$loading.show();"number"!=typeof t&&(t=1);var s=helper.getFilterURL(this.filter);axios.get("/api/exam/observation?page="+t+s).then((function(t){e.observations=t,a.hide()})).catch((function(t){a.hide(),helper.showErrorMsg(t)}))},editObservation:function(t){this.$router.push("/configuration/exam/observation/"+t.id+"/edit")},confirmDelete:function(t){var e=this;return function(a){return e.deleteObservation(t)}},deleteObservation:function(t){var e=this,a=this.$loading.show();axios.delete("/api/exam/observation/"+t.id).then((function(t){toastr.success(t.message),e.getObservations(),a.hide()})).catch((function(t){a.hide(),helper.showErrorMsg(t)}))},print:function(){var t=this.$loading.show();axios.post("/api/exam/observation/print",{filter:this.filter}).then((function(e){var a=window.open("/print");t.hide(),a.document.write(e)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},pdf:function(){var t=this,e=this.$loading.show();axios.post("/api/exam/observation/pdf",{filter:this.filter}).then((function(a){e.hide(),window.open("/download/report/"+a+"?token="+t.authToken)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},reorderObservation:function(){var t=this;axios.post("/api/exam/observation/"+this.observation.id+"/reorder",{list:this.observation_detail_list}).then((function(e){toastr.success(e.message),t.showReorderModal=!1,t.getObservations()})).catch((function(t){helper.showErrorMsg(t)}))}},filters:{momentDateTime:function(t){return helper.formatDateTime(t)}},watch:{"filter.sort_by":function(t){this.getObservations()},"filter.order":function(t){this.getObservations()},"filter.page_length":function(t){this.getObservations()}},computed:{authToken:function(){return helper.getAuthToken()}}};const o=(0,a(51900).Z)(s,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"page-titles"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-12 col-sm-6"},[a("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("exam.observation"))+" \n                    "),t.observations.total?a("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.total_result_found",{count:t.observations.total,from:t.observations.from,to:t.observations.to})))]):a("span",{staticClass:"card-subtitle d-none d-sm-inline"},[t._v(t._s(t.trans("general.no_result_found")))])])]),t._v(" "),a("div",{staticClass:"col-12 col-sm-6"},[a("div",{staticClass:"action-buttons pull-right"},[a("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(e){return t.$router.push("/configuration/exam/observation/create")}}},[a("i",{staticClass:"fas fa-plus"}),t._v(" "),a("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("exam.add_new_observation")))])]),t._v(" "),a("sort-by",{attrs:{"order-by-options":t.orderByOptions,"sort-by":t.filter.sort_by,order:t.filter.order},on:{updateSortBy:function(e){t.filter.sort_by=e},updateOrder:function(e){t.filter.order=e}}}),t._v(" "),a("div",{staticClass:"btn-group"},[a("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[a("i",{staticClass:"fas fa-ellipsis-h"}),t._v(" "),a("span",{staticClass:"d-none d-sm-inline"})]),t._v(" "),a("div",{class:["dropdown-menu","ltr"==t.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[a("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.print}},[a("i",{staticClass:"fas fa-print"}),t._v(" "+t._s(t.trans("general.print")))]),t._v(" "),a("button",{staticClass:"dropdown-item custom-dropdown",on:{click:t.pdf}},[a("i",{staticClass:"fas fa-file-pdf"}),t._v(" "+t._s(t.trans("general.generate_pdf")))])])]),t._v(" "),a("help-button",{on:{clicked:function(e){t.help_topic="configuration.exam.observation"}}})],1)])])]),t._v(" "),a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"card"},[a("div",{staticClass:"card-body"},[t.observations.total?a("div",{staticClass:"table-responsive"},[a("table",{staticClass:"table table-sm"},[a("thead",[a("tr",[a("th",[t._v(t._s(t.trans("exam.observation_name")))]),t._v(" "),a("th",[t._v(t._s(t.trans("exam.observation_type")))]),t._v(" "),a("th",[t._v(t._s(t.trans("exam.observation_description")))]),t._v(" "),a("th",{staticClass:"table-option"},[t._v(t._s(t.trans("general.action")))])])]),t._v(" "),a("tbody",t._l(t.observations.data,(function(e){return a("tr",[a("td",{domProps:{textContent:t._s(e.name)}}),t._v(" "),a("td",[a("ul",{staticStyle:{"list-style":"none",padding:"0",margin:"0"}},t._l(e.details,(function(e){return a("li",[t._v("\n                                            "+t._s(e.name)+" ("+t._s(t.trans("exam.observation_detail",{max_mark:e.max_mark}))+")\n                                        ")])})),0)]),t._v(" "),a("td",{domProps:{textContent:t._s(e.description)}}),t._v(" "),a("td",{staticClass:"table-option"},[a("div",{staticClass:"btn-group"},[e.details?a("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("exam.reorder_observation"),expression:"trans('exam.reorder_observation')"}],staticClass:"btn btn-success btn-sm",on:{click:function(a){return a.preventDefault(),t.showReorderAction(e)}}},[a("i",{staticClass:"fas fa-arrows-alt"})]):t._e(),t._v(" "),a("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:t.trans("exam.edit_observation"),expression:"trans('exam.edit_observation')"}],staticClass:"btn btn-info btn-sm",on:{click:function(a){return a.preventDefault(),t.editObservation(e)}}},[a("i",{staticClass:"fas fa-edit"})]),t._v(" "),a("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:t.confirmDelete(e)},expression:"{ok: confirmDelete(observation)}"},{name:"tooltip",rawName:"v-tooltip",value:t.trans("exam.delete_observation"),expression:"trans('exam.delete_observation')"}],key:e.id,staticClass:"btn btn-danger btn-sm"},[a("i",{staticClass:"fas fa-trash"})])])])])})),0)])]):t._e(),t._v(" "),t.observations.total?t._e():a("module-info",{attrs:{module:"exam",title:"observation_module_title",description:"observation_module_description",icon:"list"}},[a("div",{attrs:{slot:"btn"},slot:"btn"},[a("button",{staticClass:"btn btn-info btn-md",on:{click:function(e){return t.$router.push("/configuration/exam/observation/create")}}},[a("i",{staticClass:"fas fa-plus"}),t._v(" "+t._s(t.trans("general.add_new")))])])]),t._v(" "),a("pagination-record",{attrs:{"page-length":t.filter.page_length,records:t.observations},on:{"update:pageLength":function(e){return t.$set(t.filter,"page_length",e)},"update:page-length":function(e){return t.$set(t.filter,"page_length",e)},updateRecords:t.getObservations},nativeOn:{change:function(e){return t.getObservations.apply(null,arguments)}}})],1)])]),t._v(" "),t.showReorderModal?a("transition",{attrs:{name:"modal"}},[a("div",{staticClass:"modal-mask"},[a("div",{staticClass:"modal-wrapper"},[a("div",{staticClass:"modal-container modal-lg"},[a("div",{staticClass:"modal-header"},[t._t("header",(function(){return[t._v("\n                            "+t._s(t.trans("exam.reorder_observation"))+"\n                            "),a("span",{staticClass:"float-right pointer",on:{click:function(e){t.showReorderModal=!1}}},[t._v("x")])]}))],2),t._v(" "),a("div",{staticClass:"modal-body"},[t._t("body",(function(){return[a("draggable",{staticClass:"list-group",on:{start:function(e){t.drag=!0},end:function(e){t.drag=!1}},model:{value:t.observation_detail_list,callback:function(e){t.observation_detail_list=e},expression:"observation_detail_list"}},t._l(t.observation_detail_list,(function(e){return a("div",{key:e.id,staticClass:"list-group-item pointer"},[a("i",{staticClass:"fas fa-arrows-alt"}),t._v(" "+t._s(e))])})),0),t._v(" "),a("button",{staticClass:"btn btn-info pull-right m-t-10",attrs:{type:"button"},on:{click:t.reorderObservation}},[t._v(t._s(t.trans("general.save")))])]}))],2)])])])]):t._e(),t._v(" "),a("right-panel",{attrs:{topic:t.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=ae9806d0421101413703