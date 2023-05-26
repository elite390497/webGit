(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[8131],{46854:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});const n={components:{},props:["uuid"],data:function(){return{enquiryForm:new Form({first_guardian_name:"",first_guardian_relation:"",second_guardian_name:"",second_guardian_relation:"",third_guardian_name:"",third_guardian_relation:"",date_of_enquiry:"",enquiry_type_id:"",enquiry_source_id:"",contact_number:"",alternate_contact_number:"",email:"",remarks:"",students:[]}),guardian_relations:[],enquiry_types:[],enquiry_sources:[],courses:[],institutes:[],genders:[],selected_enquiry_type:null,selected_enquiry_source:null}},mounted:function(){this.uuid||this.addRow(),this.uuid&&this.get(),this.getPreRequisite()},methods:{proceed:function(){this.uuid?this.update():this.store()},getPreRequisite:function(){var e=this,t=this.$loading.show();axios.get("/api/enquiry/pre-requisite").then((function(r){e.enquiry_types=r.enquiry_types,e.enquiry_sources=r.enquiry_sources,e.courses=r.courses,e.institutes=r.institutes,e.genders=r.genders,e.guardian_relations=r.guardian_relations,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},addRow:function(){this.enquiryForm.students.push({uuid:this.$uuid.v4(),student_name:"",date_of_birth:"",gender:"",course_id:"",institute_id:"",remarks:"",selected_course:null,selected_institute:null})},getStudentName:function(e){return e+"_student_name"},getRemarkName:function(e){return e+"_remarks"},getDateOfBirthName:function(e){return e+"_date_of_birth"},getCourseName:function(e){return e+"_course_id"},getCurrentInstituteName:function(e){return e+"_institute_id"},getGenderName:function(e){return e+"_gender"},getGenderId:function(e,t){return e+"_"+t+"_gender"},get:function(){var e=this,t=this.$loading.show();axios.get("/api/enquiry/"+this.uuid).then((function(r){e.enquiryForm.date_of_enquiry=r.enquiry.date_of_enquiry,e.enquiryForm.first_guardian_name=r.enquiry.first_guardian_name,e.enquiryForm.second_guardian_name=r.enquiry.second_guardian_name,e.enquiryForm.third_guardian_name=r.enquiry.third_guardian_name,e.enquiryForm.first_guardian_relation=r.enquiry.first_guardian_relation,e.enquiryForm.second_guardian_relation=r.enquiry.second_guardian_relation,e.enquiryForm.third_guardian_relation=r.enquiry.third_guardian_relation,e.enquiryForm.contact_number=r.enquiry.contact_number,e.enquiryForm.alternate_contact_number=r.enquiry.alternate_contact_number,e.enquiryForm.email=r.enquiry.email,e.enquiryForm.remarks=r.enquiry.remarks,e.enquiryForm.enquiry_type_id=r.enquiry.enquiry_type_id,e.selected_enquiry_type=r.enquiry.enquiry_type_id?{id:r.enquiry.enquiry_type_id,name:r.enquiry.enquiry_type.name}:null,e.enquiryForm.enquiry_source_id=r.enquiry.enquiry_source_id,e.selected_enquiry_source=r.enquiry.enquiry_source_id?{id:r.enquiry.enquiry_source_id,name:r.enquiry.enquiry_source.name}:null,r.enquiry.enquiry_details.forEach((function(t){e.enquiryForm.students.push({uuid:t.uuid,student_name:t.student_name,gender:t.gender,date_of_birth:t.date_of_birth,course_id:t.course_id,selected_course:t.course_id?{id:t.course_id,name:t.course.name}:null,institute_id:t.institute_id,selected_institute:t.institute_id?{id:t.institute_id,name:t.institute.name}:null,remarks:t.remarks})})),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},store:function(){var e=this,t=this.$loading.show();this.enquiryForm.post("/api/enquiry").then((function(r){toastr.success(r.message),e.enquiryForm.selected_enquiry_type=null,e.enquiryForm.selected_enquiry_source=null,e.enquiryForm.students=[],e.addRow(),e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},update:function(){var e=this,t=this.$loading.show();this.enquiryForm.patch("/api/enquiry/"+this.uuid).then((function(r){toastr.success(r.message),t.hide(),e.$router.push("/reception/enquiry")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onEnquiryTypeSelect:function(e){this.enquiryForm.enquiry_type_id=e.id},onEnquirySourceSelect:function(e){this.enquiryForm.enquiry_source_id=e.id},confirmDelete:function(e){var t=this;return function(r){return t.deleteStudent(e)}},deleteStudent:function(e){this.enquiryForm.students.splice(e,1)},onCourseSelect:function(e,t){var r=t.split("_")[0];this.enquiryForm.students[r].course_id=e.id},onCourseRemove:function(e,t){var r=t.split("_")[0];this.enquiryForm.students[r].course_id=""},onInstituteSelect:function(e,t){var r=t.split("_")[0];this.enquiryForm.students[r].institute_id=e.id},onInstituteRemove:function(e,t){var r=t.split("_")[0];this.enquiryForm.students[r].institute_id=""}},computed:{getDefaultAcademicSession:function(){return helper.getDefaultAcademicSession()}}};const s=(0,r(51900).Z)(n,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.enquiryForm.errors.clear(t.target.name)}}},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.date_of_enquiry")))]),e._v(" "),r("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("reception.date_of_enquiry")},on:{selected:function(t){return e.enquiryForm.errors.clear("date_of_enquiry")}},model:{value:e.enquiryForm.date_of_enquiry,callback:function(t){e.$set(e.enquiryForm,"date_of_enquiry",t)},expression:"enquiryForm.date_of_enquiry"}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"date_of_enquiry"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_type")))]),e._v(" "),r("v-select",{attrs:{label:"name",name:"enquiry_type_id",id:"enquiry_type_id",options:e.enquiry_types,placeholder:e.trans("reception.select_enquiry_type")},on:{select:e.onEnquiryTypeSelect,close:function(t){return e.enquiryForm.errors.clear("enquiry_type_id")},remove:function(t){e.enquiryForm.enquiry_type_id=""}},model:{value:e.selected_enquiry_type,callback:function(t){e.selected_enquiry_type=t},expression:"selected_enquiry_type"}},[e.enquiry_types.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                "+e._s(e.trans("general.no_option_found"))+"\n                            ")])]),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"enquiry_type_id"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_source")))]),e._v(" "),r("v-select",{attrs:{label:"name",name:"enquiry_source_id",id:"enquiry_source_id",options:e.enquiry_sources,placeholder:e.trans("reception.select_enquiry_source")},on:{select:e.onEnquirySourceSelect,close:function(t){return e.enquiryForm.errors.clear("enquiry_source_id")},remove:function(t){e.enquiryForm.enquiry_source_id=""}},model:{value:e.selected_enquiry_source,callback:function(t){e.selected_enquiry_source=t},expression:"selected_enquiry_source"}},[e.enquiry_sources.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                "+e._s(e.trans("general.no_option_found"))+"\n                            ")])]),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"enquiry_source_id"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.email")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.email,expression:"enquiryForm.email"}],staticClass:"form-control",attrs:{type:"text",name:"email",placeholder:e.trans("student.email")},domProps:{value:e.enquiryForm.email},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"email",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"email"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.contact_number")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.contact_number,expression:"enquiryForm.contact_number"}],staticClass:"form-control",attrs:{type:"text",name:"contact_number",placeholder:e.trans("student.contact_number")},domProps:{value:e.enquiryForm.contact_number},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"contact_number",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"contact_number"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.alternate_contact_number")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.alternate_contact_number,expression:"enquiryForm.alternate_contact_number"}],staticClass:"form-control",attrs:{type:"text",name:"alternate_contact_number",placeholder:e.trans("student.alternate_contact_number")},domProps:{value:e.enquiryForm.alternate_contact_number},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"alternate_contact_number",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"alternate_contact_number"}})],1)])]),e._v(" "),r("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("student.guardian")))]),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.first_guardian_name")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.first_guardian_name,expression:"enquiryForm.first_guardian_name"}],staticClass:"form-control",attrs:{type:"text",name:"first_guardian_name",placeholder:e.trans("student.first_guardian_name")},domProps:{value:e.enquiryForm.first_guardian_name},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"first_guardian_name",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"first_guardian_name"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("general.relation")))]),e._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.first_guardian_relation,expression:"enquiryForm.first_guardian_relation"}],staticClass:"custom-select col-12",attrs:{name:"first_guardian_relation"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.$set(e.enquiryForm,"first_guardian_relation",t.target.multiple?r:r[0])},function(t){return e.enquiryForm.errors.clear("first_guardian_relation")}]}},[r("option",{attrs:{value:""}},[e._v(e._s(e.trans("general.select_one")))]),e._v(" "),e._l(e.guardian_relations,(function(t){return r("option",{domProps:{value:t.id}},[e._v("\n                            "+e._s(t.name)+"\n                          ")])}))],2),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"first_guardian_relation"}})],1)])]),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.second_guardian_name")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.second_guardian_name,expression:"enquiryForm.second_guardian_name"}],staticClass:"form-control",attrs:{type:"text",name:"second_guardian_name",placeholder:e.trans("student.second_guardian_name")},domProps:{value:e.enquiryForm.second_guardian_name},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"second_guardian_name",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"second_guardian_name"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("general.relation")))]),e._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.second_guardian_relation,expression:"enquiryForm.second_guardian_relation"}],staticClass:"custom-select col-12",attrs:{name:"second_guardian_relation"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.$set(e.enquiryForm,"second_guardian_relation",t.target.multiple?r:r[0])},function(t){return e.enquiryForm.errors.clear("second_guardian_relation")}]}},[r("option",{attrs:{value:""}},[e._v(e._s(e.trans("general.select_one")))]),e._v(" "),e._l(e.guardian_relations,(function(t){return r("option",{domProps:{value:t.id}},[e._v("\n                            "+e._s(t.name)+"\n                          ")])}))],2),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"second_guardian_relation"}})],1)])]),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.third_guardian_name")))]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.third_guardian_name,expression:"enquiryForm.third_guardian_name"}],staticClass:"form-control",attrs:{type:"text",name:"third_guardian_name",placeholder:e.trans("student.third_guardian_name")},domProps:{value:e.enquiryForm.third_guardian_name},on:{input:function(t){t.target.composing||e.$set(e.enquiryForm,"third_guardian_name",t.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"third_guardian_name"}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("general.relation")))]),e._v(" "),r("select",{directives:[{name:"model",rawName:"v-model",value:e.enquiryForm.third_guardian_relation,expression:"enquiryForm.third_guardian_relation"}],staticClass:"custom-select col-12",attrs:{name:"third_guardian_relation"},on:{change:[function(t){var r=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.$set(e.enquiryForm,"third_guardian_relation",t.target.multiple?r:r[0])},function(t){return e.enquiryForm.errors.clear("third_guardian_relation")}]}},[r("option",{attrs:{value:""}},[e._v(e._s(e.trans("general.select_one")))]),e._v(" "),e._l(e.guardian_relations,(function(t){return r("option",{domProps:{value:t.id}},[e._v("\n                            "+e._s(t.name)+"\n                          ")])}))],2),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"third_guardian_relation"}})],1)])]),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-9"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_remarks")))]),e._v(" "),r("autosize-textarea",{attrs:{rows:"1",name:"remarks",placeholder:e.trans("reception.enquiry_remarks")},model:{value:e.enquiryForm.remarks,callback:function(t){e.$set(e.enquiryForm,"remarks",t)},expression:"enquiryForm.remarks"}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":"remarks"}})],1)])]),e._v(" "),r("div",{staticClass:"p-t-20 border-top"},[e._l(e.enquiryForm.students,(function(t,n){return r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v("\n                                "+e._s(e.trans("student.name"))+"\n                                "),r("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDelete(n)},expression:"{ok: confirmDelete(index)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("student.delete_student"),expression:"trans('student.delete_student')"}],key:n+"_delete_student",staticClass:"btn btn-xs btn-danger",attrs:{type:"button"}},[r("i",{staticClass:"fas fa-times"})])]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:t.student_name,expression:"student.student_name"}],staticClass:"form-control",attrs:{type:"text",name:e.getStudentName(n),placeholder:e.trans("student.name")},domProps:{value:t.student_name},on:{input:function(r){r.target.composing||e.$set(t,"student_name",r.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getStudentName(n)}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.gender")))]),e._v(" "),r("div",{staticClass:"radio radio-info p-l-0"},e._l(e.genders,(function(s){return r("div",{staticClass:"form-check form-check-inline "},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.gender,expression:"student.gender"}],staticClass:"form-check-input",attrs:{type:"radio",id:e.getGenderId(n,s.id),name:e.getGenderName(n)},domProps:{value:s.id,checked:t.gender==s.id,checked:e._q(t.gender,s.id)},on:{click:function(t){e.enquiryForm.errors.clear(e.getGenderName(n))},change:function(r){return e.$set(t,"gender",s.id)}}}),e._v(" "),r("label",{staticClass:"form-check-label",attrs:{for:e.getGenderId(n,s.id)}},[e._v(" "+e._s(e.trans("list."+s.id)))])])})),0),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getGenderName(n)}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("student.date_of_birth")))]),e._v(" "),r("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("student.date_of_birth")},on:{selected:function(t){e.enquiryForm.errors.clear(e.getDateOfBirthName(n))}},model:{value:t.date_of_birth,callback:function(r){e.$set(t,"date_of_birth",r)},expression:"student.date_of_birth"}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getDateOfBirthName(n)}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.course")+" "+e.getDefaultAcademicSession.name))]),e._v(" "),r("v-select",{attrs:{label:"name","group-values":"courses","group-label":"course_group","group-select":!1,name:e.getCourseName(n),id:e.getCourseName(n),options:e.courses,placeholder:e.trans("academic.select_course")},on:{select:e.onCourseSelect,close:function(t){e.enquiryForm.errors.clear(e.getCourseName(n))},remove:e.onCourseRemove},model:{value:t.selected_course,callback:function(r){e.$set(t,"selected_course",r)},expression:"student.selected_course"}},[e.courses.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                    "+e._s(e.trans("general.no_option_found"))+"\n                                ")])]),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getCourseName(n)}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.current_institute")))]),e._v(" "),r("v-select",{attrs:{label:"name",name:e.getCurrentInstituteName(n),id:e.getCurrentInstituteName(n),options:e.institutes,placeholder:e.trans("academic.select_institute")},on:{select:e.onInstituteSelect,close:function(t){e.enquiryForm.errors.clear(e.getCurrentInstituteName(n))},remove:e.onInstituteRemove},model:{value:t.selected_institute,callback:function(r){e.$set(t,"selected_institute",r)},expression:"student.selected_institute"}},[e.institutes.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                    "+e._s(e.trans("general.no_option_found"))+"\n                                ")])]),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getCurrentInstituteName(n)}})],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-2"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v("\n                                "+e._s(e.trans("student.remarks"))+"\n                            ")]),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:t.remarks,expression:"student.remarks"}],staticClass:"form-control",attrs:{type:"text",name:e.getRemarkName(n),placeholder:e.trans("student.remarks")},domProps:{value:t.remarks},on:{input:function(r){r.target.composing||e.$set(t,"remarks",r.target.value)}}}),e._v(" "),r("show-error",{attrs:{"form-name":e.enquiryForm,"prop-name":e.getRemarkName(n)}})],1)])])})),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12"},[r("div",{staticClass:"form-group"},[r("button",{staticClass:"btn btn-info btn-sm waves-effect waves-light",attrs:{type:"button"},on:{click:e.addRow}},[e._v(e._s(e.trans("student.add_new_student")))])])])])],2),e._v(" "),r("div",{staticClass:"card-footer text-right"},[r("button",{directives:[{name:"show",rawName:"v-show",value:e.uuid,expression:"uuid"}],staticClass:"btn btn-danger ",attrs:{type:"button"},on:{click:function(t){return e.$router.push("/reception/enquiry")}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),e.uuid?e._e():r("button",{staticClass:"btn btn-danger ",attrs:{type:"button"},on:{click:function(t){return e.$emit("cancel")}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),r("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e._v(e._s(e.trans("general.save")))])])])])}),[],!1,null,null,null).exports},47321:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});const n={components:{enquiryForm:r(46854).Z},data:function(){return{enquiries:{total:0,data:[]},filter:{sort_by:"date_of_enquiry",order:"desc",enquiry_type_id:[],enquiry_source_id:[],enquiry_status:[],institute_id:[],date_of_enquiry_start_date:"",date_of_enquiry_end_date:"",page_length:helper.getConfig("page_length")},orderByOptions:[{value:"date_of_enquiry",translation:i18n.reception.date_of_enquiry},{value:"created_at",translation:i18n.general.created_at}],showFilterPanel:!1,showCreatePanel:!1,enquiry_types:[],selected_enquiry_types:null,enquiry_sources:[],selected_enquiry_sources:null,enquiry_statuses:[],selected_enquiry_statuses:null,institutes:[],selected_institutes:null,help_topic:""}},mounted:function(){helper.hasPermission("list-enquiry")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getEnquiries(),helper.showDemoNotification(["reception"])},methods:{hasPermission:function(e){return helper.hasPermission(e)},getEmployeeName:function(e){return helper.getEmployeeName(e)},getEnquiries:function(e){var t=this,r=this.$loading.show();"number"!=typeof e&&(e=1),this.filter.date_of_enquiry_start_date=helper.toDate(this.filter.date_of_enquiry_start_date),this.filter.date_of_enquiry_end_date=helper.toDate(this.filter.date_of_enquiry_end_date);var n=helper.getFilterURL(this.filter);axios.get("/api/enquiry?page="+e+n).then((function(e){t.enquiries=e.enquiries,t.enquiry_types=e.filters.enquiry_types,t.enquiry_sources=e.filters.enquiry_sources,t.enquiry_statuses=e.filters.enquiry_statuses,t.institutes=e.filters.institutes,r.hide()})).catch((function(e){r.hide(),helper.showErrorMsg(e)}))},editEnquiry:function(e){this.$router.push("/reception/enquiry/"+e.uuid+"/edit")},confirmDelete:function(e){var t=this;return function(r){return t.deleteEnquiry(e)}},deleteEnquiry:function(e){var t=this,r=this.$loading.show();axios.delete("/api/enquiry/"+e.uuid).then((function(e){toastr.success(e.message),t.getEnquiries(),r.hide()})).catch((function(e){r.hide(),helper.showErrorMsg(e)}))},getConfig:function(e){return helper.getConfig(e)},print:function(){var e=this.$loading.show();axios.post("/api/enquiry/print",{filter:this.filter}).then((function(t){var r=window.open("/print");e.hide(),r.document.write(t)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},pdf:function(){var e=this,t=this.$loading.show();axios.post("/api/enquiry/pdf",{filter:this.filter}).then((function(r){t.hide(),window.open("/download/report/"+r+"?token="+e.authToken)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onEnquiryTypeSelect:function(e){this.filter.enquiry_type_id.push(e.id)},onEnquiryTypeRemove:function(e){this.filter.enquiry_type_id.splice(this.filter.enquiry_type_id.indexOf(e.id),1)},onEnquirySourceSelect:function(e){this.filter.enquiry_source_id.push(e.id)},onEnquirySourceRemove:function(e){this.filter.enquiry_source_id.splice(this.filter.enquiry_source_id.indexOf(e.id),1)},onEnquiryStatusSelect:function(e){this.filter.enquiry_status.push(e.id)},onEnquiryStatusRemove:function(e){this.filter.enquiry_status.splice(this.filter.enquiry_status.indexOf(e.id),1)},onInstituteSelect:function(e){this.filter.institute_id.push(e.id)},onInstituteRemove:function(e){this.filter.institute_id.splice(this.filter.institute_id.indexOf(e.id),1)},getEnquiryStatus:function(e){return helper.getEnquiryStatus(e)}},filters:{moment:function(e){return helper.formatDate(e)},momentDateTime:function(e){return helper.formatDateTime(e)},momentTime:function(e){return helper.formatTime(e)}},watch:{"filter.sort_by":function(e){this.getEnquiries()},"filter.order":function(e){this.getEnquiries()},"filter.page_length":function(e){this.getEnquiries()}},computed:{authToken:function(){return helper.getAuthToken()}}};const s=(0,r(51900).Z)(n,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"page-titles"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-6"},[r("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("reception.admission_enquiry"))+"\n                    "),e.enquiries.total?r("span",{staticClass:"card-subtitle d-none d-sm-inline"},[e._v(e._s(e.trans("general.total_result_found",{count:e.enquiries.total,from:e.enquiries.from,to:e.enquiries.to})))]):r("span",{staticClass:"card-subtitle d-none d-sm-inline"},[e._v(e._s(e.trans("general.no_result_found")))])])]),e._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("div",{staticClass:"action-buttons pull-right"},[e.enquiries.total&&!e.showCreatePanel&&e.hasPermission("create-enquiry")?r("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(t){e.showCreatePanel=!e.showCreatePanel}}},[r("i",{staticClass:"fas fa-plus"}),e._v(" "),r("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("reception.add_new_enquiry")))])]):e._e(),e._v(" "),e.showFilterPanel?e._e():r("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){e.showFilterPanel=!e.showFilterPanel}}},[r("i",{staticClass:"fas fa-filter"}),e._v(" "),r("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("general.filter")))])]),e._v(" "),r("sort-by",{attrs:{"order-by-options":e.orderByOptions,"sort-by":e.filter.sort_by,order:e.filter.order},on:{updateSortBy:function(t){e.filter.sort_by=t},updateOrder:function(t){e.filter.order=t}}}),e._v(" "),r("div",{staticClass:"btn-group"},[r("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[r("i",{staticClass:"fas fa-ellipsis-h"}),e._v(" "),r("span",{staticClass:"d-none d-sm-inline"})]),e._v(" "),r("div",{class:["dropdown-menu","ltr"==e.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[r("button",{staticClass:"dropdown-item custom-dropdown",on:{click:e.print}},[r("i",{staticClass:"fas fa-print"}),e._v(" "+e._s(e.trans("general.print")))]),e._v(" "),r("button",{staticClass:"dropdown-item custom-dropdown",on:{click:e.pdf}},[r("i",{staticClass:"fas fa-file-pdf"}),e._v(" "+e._s(e.trans("general.generate_pdf")))])])]),e._v(" "),r("help-button",{on:{clicked:function(t){e.help_topic="reception.enquiry"}}})],1)])])]),e._v(" "),r("div",{staticClass:"container-fluid"},[r("transition",{attrs:{name:"fade"}},[e.showFilterPanel?r("div",{staticClass:"card card-form"},[r("div",{staticClass:"card-body"},[r("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("general.filter")))]),e._v(" "),r("div",{staticClass:"row"},[r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_type")))]),e._v(" "),r("v-select",{attrs:{label:"name","track-by":"id",name:"enquiry_type_id",id:"enquiry_type_id",options:e.enquiry_types,placeholder:e.trans("reception.select_enquiry_type"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:e.selected_enquiry_types},on:{select:e.onEnquiryTypeSelect,remove:e.onEnquiryTypeRemove},model:{value:e.selected_enquiry_types,callback:function(t){e.selected_enquiry_types=t},expression:"selected_enquiry_types"}},[e.enquiry_types.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                        "+e._s(e.trans("general.no_option_found"))+"\n                                    ")])])],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_source")))]),e._v(" "),r("v-select",{attrs:{label:"name","track-by":"id",name:"enquiry_source_id",id:"enquiry_source_id",options:e.enquiry_sources,placeholder:e.trans("reception.select_enquiry_source"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:e.selected_enquiry_sources},on:{select:e.onEnquirySourceSelect,remove:e.onEnquirySourceRemove},model:{value:e.selected_enquiry_sources,callback:function(t){e.selected_enquiry_sources=t},expression:"selected_enquiry_sources"}},[e.enquiry_sources.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                        "+e._s(e.trans("general.no_option_found"))+"\n                                    ")])])],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.institute")))]),e._v(" "),r("v-select",{attrs:{label:"name","track-by":"id",name:"institute_id",id:"institute_id",options:e.institutes,placeholder:e.trans("academic.select_institute"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:e.selected_institutes},on:{select:e.onInstituteSelect,remove:e.onInstituteRemove},model:{value:e.selected_institutes,callback:function(t){e.selected_institutes=t},expression:"selected_institutes"}},[e.institutes.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                        "+e._s(e.trans("general.no_option_found"))+"\n                                    ")])])],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-3"},[r("div",{staticClass:"form-group"},[r("label",{attrs:{for:""}},[e._v(e._s(e.trans("reception.enquiry_status")))]),e._v(" "),r("v-select",{attrs:{label:"name","track-by":"id",name:"enquiry_status",id:"enquiry_status",options:e.enquiry_statuses,placeholder:e.trans("reception.select_enquiry_status"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:e.selected_enquiry_statuses},on:{select:e.onEnquiryStatusSelect,remove:e.onEnquiryStatusRemove},model:{value:e.selected_enquiry_statuses,callback:function(t){e.selected_enquiry_statuses=t},expression:"selected_enquiry_statuses"}},[e.enquiry_statuses.length?e._e():r("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                        "+e._s(e.trans("general.no_option_found"))+"\n                                    ")])])],1)]),e._v(" "),r("div",{staticClass:"col-12 col-sm-6"},[r("date-range-picker",{attrs:{"start-date":e.filter.date_of_enquiry_start_date,"end-date":e.filter.date_of_enquiry_end_date,label:e.trans("general.date_between")},on:{"update:startDate":function(t){return e.$set(e.filter,"date_of_enquiry_start_date",t)},"update:start-date":function(t){return e.$set(e.filter,"date_of_enquiry_start_date",t)},"update:endDate":function(t){return e.$set(e.filter,"date_of_enquiry_end_date",t)},"update:end-date":function(t){return e.$set(e.filter,"date_of_enquiry_end_date",t)}}})],1)]),e._v(" "),r("div",{staticClass:"card-footer text-right"},[r("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(t){e.showFilterPanel=!1}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),r("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"button"},on:{click:e.getEnquiries}},[e._v(e._s(e.trans("general.filter")))])])])]):e._e()]),e._v(" "),e.hasPermission("create-enquiry")?r("transition",{attrs:{name:"fade"}},[e.showCreatePanel?r("div",{staticClass:"card card-form"},[r("div",{staticClass:"card-body"},[r("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("reception.add_new_enquiry")))]),e._v(" "),r("enquiry-form",{on:{completed:e.getEnquiries,cancel:function(t){e.showCreatePanel=!e.showCreatePanel}}})],1)]):e._e()]):e._e(),e._v(" "),r("div",{staticClass:"card"},[r("div",{staticClass:"card-body"},[e.enquiries.total?r("div",{staticClass:"table-responsive"},[r("table",{staticClass:"table table-sm"},[r("thead",[r("tr",[r("th",[e._v("#")]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.enquirer")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.enquiry_type")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.enquiry_source")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.date_of_enquiry")))]),e._v(" "),r("th",[e._v(e._s(e.trans("student.contact_number")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.no_of_students")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.enquiry_status")))]),e._v(" "),r("th",[e._v(e._s(e.trans("reception.enquiry_remarks")))]),e._v(" "),r("th",{staticClass:"table-option"},[e._v(e._s(e.trans("general.action")))])])]),e._v(" "),r("tbody",e._l(e.enquiries.data,(function(t){return r("tr",[r("td",{domProps:{textContent:e._s(t.id)}}),e._v(" "),r("td",[t.first_guardian_name&&t.first_guardian_relation?r("span",[e._v(e._s(e.trans("list."+t.first_guardian_relation)+": "+t.first_guardian_name)+" "),r("br")]):e._e(),e._v(" "),t.second_guardian_name&&t.second_guardian_relation?r("span",[e._v(e._s(e.trans("list."+t.second_guardian_relation)+": "+t.second_guardian_name)+" "),r("br")]):e._e(),e._v(" "),t.third_guardian_name&&t.third_guardian_relation?r("span",[e._v(e._s(e.trans("list."+t.third_guardian_relation)+": "+t.third_guardian_name)+" "),r("br")]):e._e()]),e._v(" "),r("td",{domProps:{textContent:e._s(t.enquiry_type.name)}}),e._v(" "),r("td",{domProps:{textContent:e._s(t.enquiry_source.name)}}),e._v(" "),r("td",[e._v(e._s(e._f("moment")(t.date_of_enquiry)))]),e._v(" "),r("td",[t.contact_number?r("span",[e._v(e._s(e.trans("student.contact_number")+": "+t.contact_number)+" "),r("br")]):e._e(),e._v(" "),t.alternate_contact_number?r("span",[e._v(e._s(e.trans("student.alternate_contact_number")+": "+t.alternate_contact_number)+" "),r("br")]):e._e(),e._v(" "),t.email?r("span",[e._v(e._s(e.trans("student.email")+": "+t.email)+" "),r("br")]):e._e()]),e._v(" "),r("td",{domProps:{textContent:e._s(t.enquiry_details_count)}}),e._v(" "),r("td",e._l(e.getEnquiryStatus(t),(function(t){return r("span",{class:["label","label-"+t.color,"m-r-5"]},[e._v(e._s(t.label))])})),0),e._v(" "),r("td",{domProps:{textContent:e._s(t.remarks)}}),e._v(" "),r("td",{staticClass:"table-option"},[r("div",{staticClass:"btn-group"},[r("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("reception.enquiry_detail"),expression:"trans('reception.enquiry_detail')"}],staticClass:"btn btn-success btn-sm",on:{click:function(r){return e.$router.push("/reception/enquiry/"+t.uuid)}}},[r("i",{staticClass:"fas fa-arrow-circle-right"})]),e._v(" "),e.hasPermission("edit-enquiry")?r("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("reception.edit_enquiry"),expression:"trans('reception.edit_enquiry')"}],staticClass:"btn btn-info btn-sm",on:{click:function(r){return r.preventDefault(),e.editEnquiry(t)}}},[r("i",{staticClass:"fas fa-edit"})]):e._e(),e._v(" "),e.hasPermission("delete-enquiry")?r("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDelete(t)},expression:"{ok: confirmDelete(enquiry)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("reception.delete_enquiry"),expression:"trans('reception.delete_enquiry')"}],key:t.id,staticClass:"btn btn-danger btn-sm"},[r("i",{staticClass:"fas fa-trash"})]):e._e()])])])})),0)])]):e._e(),e._v(" "),e.enquiries.total?e._e():r("module-info",{attrs:{module:"reception",title:"enquiry_module_title",description:"enquiry_module_description",icon:"list"}},[r("div",{attrs:{slot:"btn"},slot:"btn"},[!e.showCreatePanel&&e.hasPermission("create-enquiry")?r("button",{staticClass:"btn btn-info btn-md",on:{click:function(t){e.showCreatePanel=!e.showCreatePanel}}},[r("i",{staticClass:"fas fa-plus"}),e._v(" "+e._s(e.trans("general.add_new")))]):e._e()])]),e._v(" "),r("pagination-record",{attrs:{"page-length":e.filter.page_length,records:e.enquiries},on:{"update:pageLength":function(t){return e.$set(e.filter,"page_length",t)},"update:page-length":function(t){return e.$set(e.filter,"page_length",t)},updateRecords:e.getEnquiries}})],1)])],1),e._v(" "),r("right-panel",{attrs:{topic:e.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=b4bc7bc170b78a578b7f