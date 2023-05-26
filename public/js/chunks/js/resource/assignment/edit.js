(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[3276],{32034:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var n=s(94015),a=s.n(n),i=s(23645),r=s.n(i)()(a());r.push([e.id,".loading-overlay.is-full-page{z-index:1060}","",{version:3,sources:["webpack://./resources/js/views/resource/assignment/form.vue"],names:[],mappings:"AAkNA,8BACA,YACA",sourcesContent:['<template>\n    <div>\n        <form @submit.prevent="proceed" @keydown="assignmentForm.errors.clear($event.target.name)">\n            <div class="row">\n                <div class="col-12 col-sm-6">\n                    <div class="form-group">\n                        <label for="">{{trans(\'academic.batch\')}} </label>\n                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans(\'academic.select_batch\')" @select="onBatchSelect" @close="assignmentForm.errors.clear(\'batch_id\')" @remove="assignmentForm.batch_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="assignmentForm" prop-name="batch_id"></show-error>\n                    </div>\n                    <div class="form-group" v-if="assignmentForm.batch_id">\n                        <label for="">{{trans(\'academic.subject\')}} </label>\n                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans(\'resource.select_subject\')" @select="onSubjectSelect" @close="assignmentForm.errors.clear(\'subject_id\')" @remove="assignmentForm.subject_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="assignmentForm" prop-name="subject_id"></show-error>\n                    </div>\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.assignment_title\')}}</label>\n                        <input class="form-control" type="text" v-model="assignmentForm.title" name="title" :placeholder="trans(\'resource.assignment_title\')">\n                        <show-error :form-name="assignmentForm" prop-name="title"></show-error>\n                    </div>\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.date_of_assignment\')}}</label>\n                        <datepicker v-model="assignmentForm.date_of_assignment" :bootstrapStyling="true" @selected="assignmentForm.errors.clear(\'date_of_assignment\')" :placeholder="trans(\'resource.date_of_assignment\')"></datepicker>\n                        <show-error :form-name="assignmentForm" prop-name="date_of_assignment"></show-error>\n                    </div>\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.due_date_of_assignment\')}}</label>\n                        <datepicker v-model="assignmentForm.due_date" :bootstrapStyling="true" @selected="assignmentForm.errors.clear(\'due_date\')" :placeholder="trans(\'resource.due_date_of_assignment\')"></datepicker>\n                        <show-error :form-name="assignmentForm" prop-name="due_date"></show-error>\n                    </div>\n                    <div class="form-group">\n                        <file-upload-input :button-text="trans(\'general.upload_document\')" :token="assignmentForm.upload_token" module="assignment" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-6">\n                    <div class="form-group">\n                        <html-editor name="description" :model.sync="assignmentForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="assignmentForm.errors.clear(\'description\')"></html-editor>\n                        <show-error :form-name="assignmentForm" prop-name="description"></show-error>\n                    </div>\n                </div>\n            </div>\n            <div class="card-footer text-right">\n                <router-link to="/resource/assignment" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans(\'general.cancel\')}}</router-link>\n                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit(\'cancel\')">{{trans(\'general.cancel\')}}</button>\n                <button type="submit" class="btn btn-info waves-effect waves-light">\n                    <span v-if="uuid">{{trans(\'general.update\')}}</span>\n                    <span v-else>{{trans(\'general.save\')}}</span>\n                </button>\n            </div>\n        </form>\n    </div>\n</template>\n\n\n<script>\n\n    export default {\n        components: {},\n        data() {\n            return {\n                assignmentForm: new Form({\n                    batch_id: \'\',\n                    subject_id: \'\',\n                    title: \'\',\n                    date_of_assignment: \'\',\n                    due_date: \'\',\n                    description: \'\',\n                    upload_token: \'\'\n                }),\n                batches: [],\n                selected_batch: null,\n                subjects: [],\n                selected_subject: null,\n                subject_detail: [],\n                module_id: \'\',\n                clearAttachment: true\n            };\n        },\n        props: [\'uuid\'],\n        mounted() {\n            if(!helper.hasPermission(\'create-assignment\') && !helper.hasPermission(\'edit-assignment\')){\n                helper.notAccessibleMsg();\n                this.$router.push(\'/dashboard\');\n            }\n\n            if(this.uuid)\n                this.get();\n            else\n                this.assignmentForm.upload_token = this.$uuid.v4();\n\n            this.getPreRequisite();\n        },\n        methods: {\n            hasPermission(permission){\n                return helper.hasPermission(permission);\n            },\n            getPreRequisite(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/assignment/pre-requisite\')\n                    .then(response => {\n                        this.batches = response.batches;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            getSubjects(){\n                if (!this.uuid) {\n                    this.assignmentForm.subject_id = \'\';\n                    this.selected_subject = null;\n                }\n                let loader = this.$loading.show();\n                axios.post(\'/api/batch/\'+this.assignmentForm.batch_id+\'/subjects\')\n                    .then(response => {\n                        this.subjects = response.subjects;\n                        this.subject_details = response.subject_details;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            proceed(){\n                if(this.uuid)\n                    this.update();\n                else\n                    this.store();\n            },\n            store(){\n                let loader = this.$loading.show();\n                this.assignmentForm.post(\'/api/assignment\')\n                    .then(response => {\n                        toastr.success(response.message);\n                        this.clearAttachment = !this.clearAttachment;\n                        this.assignmentForm.upload_token = this.$uuid.v4();\n                        this.selected_batch = null;\n                        this.selected_subject = null;\n                        this.$emit(\'completed\');\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            get(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/assignment/\'+this.uuid)\n                    .then(response => {\n                        let assignment = response.assignment;\n                        this.assignmentForm.title = assignment.title;\n                        this.assignmentForm.date_of_assignment = assignment.date_of_assignment;\n                        this.assignmentForm.due_date = assignment.due_date;\n                        this.assignmentForm.description = assignment.description;\n                        this.assignmentForm.batch_id = assignment.subject.batch_id;\n                        this.assignmentForm.subject_id = assignment.subject_id;\n                        this.selected_batch = this.assignmentForm.batch_id ? {id: assignment.subject.batch_id, name: assignment.subject.batch.course.name+\' \'+assignment.subject.batch.name} : null;\n                        this.selected_subject = assignment.subject_id ? {id: assignment.subject_id, name: assignment.subject.name+\' (\'+assignment.subject.code+\')\'} : null;\n                        this.assignmentForm.upload_token = assignment.upload_token;\n                        this.module_id = assignment.id;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                        this.$router.push(\'/resource/assignment\');\n                    });\n            },\n            update(){\n                let loader = this.$loading.show();\n                this.assignmentForm.patch(\'/api/assignment/\'+this.uuid)\n                    .then(response => {\n                        toastr.success(response.message);\n                        loader.hide();\n                        this.$router.push(\'/resource/assignment\');\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            onBatchSelect(selectedOption){\n                this.assignmentForm.batch_id = selectedOption.id;\n            },\n            onSubjectSelect(selectedOption){\n                this.assignmentForm.subject_id = selectedOption.id;\n            }\n        },\n        watch: {\n            \'assignmentForm.batch_id\': function(val) {\n                if (val) {\n                    this.getSubjects();\n                }\n            }\n        }\n    }\n<\/script>\n\n<style>\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n</style>'],sourceRoot:""}]);const o=r},41896:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});const n={components:{assignmentForm:s(55114).Z},data:function(){return{uuid:this.$route.params.uuid}},mounted:function(){helper.hasPermission("edit-assignment")||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const a=(0,s(51900).Z)(n,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("resource.edit_assignment")))])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){return e.$router.push("/resource/assignment")}}},[s("i",{staticClass:"fas fa-list"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("resource.assignment")))])])])])])]),e._v(" "),s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body p-t-20"},[s("assignment-form",{attrs:{uuid:e.uuid}})],1)])])])}),[],!1,null,null,null).exports},55114:(e,t,s)=>{"use strict";s.d(t,{Z:()=>c});const n={components:{},data:function(){return{assignmentForm:new Form({batch_id:"",subject_id:"",title:"",date_of_assignment:"",due_date:"",description:"",upload_token:""}),batches:[],selected_batch:null,subjects:[],selected_subject:null,subject_detail:[],module_id:"",clearAttachment:!0}},props:["uuid"],mounted:function(){helper.hasPermission("create-assignment")||helper.hasPermission("edit-assignment")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.uuid?this.get():this.assignmentForm.upload_token=this.$uuid.v4(),this.getPreRequisite()},methods:{hasPermission:function(e){return helper.hasPermission(e)},getPreRequisite:function(){var e=this,t=this.$loading.show();axios.get("/api/assignment/pre-requisite").then((function(s){e.batches=s.batches,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getSubjects:function(){var e=this;this.uuid||(this.assignmentForm.subject_id="",this.selected_subject=null);var t=this.$loading.show();axios.post("/api/batch/"+this.assignmentForm.batch_id+"/subjects").then((function(s){e.subjects=s.subjects,e.subject_details=s.subject_details,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},proceed:function(){this.uuid?this.update():this.store()},store:function(){var e=this,t=this.$loading.show();this.assignmentForm.post("/api/assignment").then((function(s){toastr.success(s.message),e.clearAttachment=!e.clearAttachment,e.assignmentForm.upload_token=e.$uuid.v4(),e.selected_batch=null,e.selected_subject=null,e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},get:function(){var e=this,t=this.$loading.show();axios.get("/api/assignment/"+this.uuid).then((function(s){var n=s.assignment;e.assignmentForm.title=n.title,e.assignmentForm.date_of_assignment=n.date_of_assignment,e.assignmentForm.due_date=n.due_date,e.assignmentForm.description=n.description,e.assignmentForm.batch_id=n.subject.batch_id,e.assignmentForm.subject_id=n.subject_id,e.selected_batch=e.assignmentForm.batch_id?{id:n.subject.batch_id,name:n.subject.batch.course.name+" "+n.subject.batch.name}:null,e.selected_subject=n.subject_id?{id:n.subject_id,name:n.subject.name+" ("+n.subject.code+")"}:null,e.assignmentForm.upload_token=n.upload_token,e.module_id=n.id,t.hide()})).catch((function(s){t.hide(),helper.showErrorMsg(s),e.$router.push("/resource/assignment")}))},update:function(){var e=this,t=this.$loading.show();this.assignmentForm.patch("/api/assignment/"+this.uuid).then((function(s){toastr.success(s.message),t.hide(),e.$router.push("/resource/assignment")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onBatchSelect:function(e){this.assignmentForm.batch_id=e.id},onSubjectSelect:function(e){this.assignmentForm.subject_id=e.id}},watch:{"assignmentForm.batch_id":function(e){e&&this.getSubjects()}}};var a=s(93379),i=s.n(a),r=s(32034),o={insert:"head",singleton:!1};i()(r.Z,o);r.Z.locals;const c=(0,s(51900).Z)(n,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.assignmentForm.errors.clear(t.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.batch"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name","group-values":"batches","group-label":"course_group","group-select":!1,name:"batch_id",id:"batch_id",options:e.batches,placeholder:e.trans("academic.select_batch")},on:{select:e.onBatchSelect,close:function(t){return e.assignmentForm.errors.clear("batch_id")},remove:function(t){e.assignmentForm.batch_id=""}},model:{value:e.selected_batch,callback:function(t){e.selected_batch=t},expression:"selected_batch"}},[e.batches.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"batch_id"}})],1),e._v(" "),e.assignmentForm.batch_id?s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.subject"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name",name:"subject_id",id:"subject_id",options:e.subjects,placeholder:e.trans("resource.select_subject")},on:{select:e.onSubjectSelect,close:function(t){return e.assignmentForm.errors.clear("subject_id")},remove:function(t){e.assignmentForm.subject_id=""}},model:{value:e.selected_subject,callback:function(t){e.selected_subject=t},expression:"selected_subject"}},[e.subjects.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"subject_id"}})],1):e._e(),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.assignment_title")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.assignmentForm.title,expression:"assignmentForm.title"}],staticClass:"form-control",attrs:{type:"text",name:"title",placeholder:e.trans("resource.assignment_title")},domProps:{value:e.assignmentForm.title},on:{input:function(t){t.target.composing||e.$set(e.assignmentForm,"title",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"title"}})],1),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.date_of_assignment")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.date_of_assignment")},on:{selected:function(t){return e.assignmentForm.errors.clear("date_of_assignment")}},model:{value:e.assignmentForm.date_of_assignment,callback:function(t){e.$set(e.assignmentForm,"date_of_assignment",t)},expression:"assignmentForm.date_of_assignment"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"date_of_assignment"}})],1),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.due_date_of_assignment")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.due_date_of_assignment")},on:{selected:function(t){return e.assignmentForm.errors.clear("due_date")}},model:{value:e.assignmentForm.due_date,callback:function(t){e.$set(e.assignmentForm,"due_date",t)},expression:"assignmentForm.due_date"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"due_date"}})],1),e._v(" "),s("div",{staticClass:"form-group"},[s("file-upload-input",{attrs:{"button-text":e.trans("general.upload_document"),token:e.assignmentForm.upload_token,module:"assignment","clear-file":e.clearAttachment,"module-id":e.module_id}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("html-editor",{attrs:{name:"description",model:e.assignmentForm.description,height:"300",isUpdate:!!e.uuid},on:{"update:model":function(t){return e.$set(e.assignmentForm,"description",t)},clearErrors:function(t){return e.assignmentForm.errors.clear("description")}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.assignmentForm,"prop-name":"description"}})],1)])]),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("router-link",{directives:[{name:"show",rawName:"v-show",value:e.uuid,expression:"uuid"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/resource/assignment"}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),e.uuid?e._e():s("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(t){return e.$emit("cancel")}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e.uuid?s("span",[e._v(e._s(e.trans("general.update")))]):s("span",[e._v(e._s(e.trans("general.save")))])])],1)])])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=3330e2c0b8b27dcd980d