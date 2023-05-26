(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[2623],{44970:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});const a={components:{examForm:s(34819).Z},data:function(){return{id:this.$route.params.id}},mounted:function(){helper.hasPermission("edit-exam")||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const r=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("exam.edit_exam")))])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){return e.$router.push("/exam")}}},[s("i",{staticClass:"fas fa-list"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("exam.edit_exam")))])])])])])]),e._v(" "),s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body p-t-20"},[s("exam-form",{attrs:{id:e.id}})],1)])])])}),[],!1,null,null,null).exports},34819:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});const a={components:{},data:function(){return{examForm:new Form({name:"",exam_term_id:"",description:""}),exam_terms:[],selected_exam_term:null}},props:["id"],mounted:function(){helper.hasPermission("create-exam")||helper.hasPermission("edit-exam")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getPreRequisite()},methods:{proceed:function(){this.id?this.update():this.store()},getPreRequisite:function(){var e=this,t=this.$loading.show();axios.get("/api/exam/pre-requisite").then((function(s){e.exam_terms=s.exam_terms,e.id&&e.get(),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},store:function(){var e=this,t=this.$loading.show();this.examForm.post("/api/exam").then((function(s){toastr.success(s.message),e.selected_exam_term=null,e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},get:function(){var e=this,t=this.$loading.show();axios.get("/api/exam/"+this.id).then((function(s){e.examForm.name=s.name,e.examForm.exam_term_id=s.exam_term_id,e.selected_exam_term=s.exam_term_id?{id:s.exam_term_id,name:s.term.name+" ("+s.term.course_group.name+")"}:null,e.examForm.description=s.description,t.hide()})).catch((function(s){t.hide(),helper.showErrorMsg(s),e.$router.push("/exam")}))},update:function(){var e=this,t=this.$loading.show();this.examForm.patch("/api/exam/"+this.id).then((function(s){toastr.success(s.message),t.hide(),e.$router.push("/exam")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getConfig:function(e){return helper.getConfig(e)},onExamTermSelect:function(e){this.examForm.exam_term_id=e.id}}};const r=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.examForm.errors.clear(t.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-4"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("exam.term"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name",name:"exam_term_id",id:"exam_term_id",options:e.exam_terms,placeholder:e.trans("exam.select_term")},on:{select:e.onExamTermSelect,close:function(t){return e.examForm.errors.clear("exam_term_id")},remove:function(t){e.examForm.exam_term_id=""}},model:{value:e.selected_exam_term,callback:function(t){e.selected_exam_term=t},expression:"selected_exam_term"}},[e.exam_terms.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                        "+e._s(e.trans("general.no_option_found"))+"\n                    ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.examForm,"prop-name":"exam_term_id"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-4"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("exam.exam_name")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.examForm.name,expression:"examForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:e.trans("exam.exam_name")},domProps:{value:e.examForm.name},on:{input:function(t){t.target.composing||e.$set(e.examForm,"name",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.examForm,"prop-name":"name"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-4"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("exam.exam_description")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.examForm.description,expression:"examForm.description"}],staticClass:"form-control",attrs:{type:"text",name:"description",placeholder:e.trans("exam.exam_description")},domProps:{value:e.examForm.description},on:{input:function(t){t.target.composing||e.$set(e.examForm,"description",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.examForm,"prop-name":"description"}})],1)])]),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("router-link",{directives:[{name:"show",rawName:"v-show",value:e.id,expression:"id"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/exam"}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),e.id?e._e():s("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(t){return e.$emit("cancel")}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e.id?s("span",[e._v(e._s(e.trans("general.update")))]):s("span",[e._v(e._s(e.trans("general.save")))])])],1)])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=95c5ea493c890ba8ab1a