(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[5965,5413],{24128:(e,t,s)=>{"use strict";s.d(t,{Z:()=>r});var n=s(94015),a=s.n(n),o=s(23645),l=s.n(o)()(a());l.push([e.id,".loading-overlay.is-full-page{z-index:1060}","",{version:3,sources:["webpack://./resources/js/views/resource/lesson-plan/form.vue"],names:[],mappings:"AAyQA,8BACA,YACA",sourcesContent:['<template>\n    <div>\n        <form @submit.prevent="proceed" @keydown="lessonPlanForm.errors.clear($event.target.name)">\n            <div class="row">\n                <div class="col-12 col-sm-3">\n                    <div class="form-group">\n                        <label for="">{{trans(\'academic.batch\')}} </label>\n                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans(\'academic.select_batch\')" @select="onBatchSelect" @close="lessonPlanForm.errors.clear(\'batch_id\')" @remove="lessonPlanForm.batch_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="lessonPlanForm" prop-name="batch_id"></show-error>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-3">\n                    <div class="form-group" v-if="lessonPlanForm.batch_id">\n                        <label for="">{{trans(\'academic.subject\')}} </label>\n                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans(\'resource.select_subject\')" @select="onSubjectSelect" @close="lessonPlanForm.errors.clear(\'subject_id\')" @remove="lessonPlanForm.subject_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="lessonPlanForm" prop-name="subject_id"></show-error>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-3">\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.lesson_plan_start_date\')}}</label>\n                        <datepicker v-model="lessonPlanForm.start_date" :bootstrapStyling="true" @selected="lessonPlanForm.errors.clear(\'start_date\')" :placeholder="trans(\'resource.lesson_plan_start_date\')"></datepicker>\n                        <show-error :form-name="lessonPlanForm" prop-name="start_date"></show-error>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-3">\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.lesson_plan_end_date\')}}</label>\n                        <datepicker v-model="lessonPlanForm.end_date" :bootstrapStyling="true" @selected="lessonPlanForm.errors.clear(\'end_date\')" :placeholder="trans(\'resource.lesson_plan_end_date\')"></datepicker>\n                        <show-error :form-name="lessonPlanForm" prop-name="end_date"></show-error>\n                    </div>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-12">\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.lesson_plan_topic\')}}</label>\n                        <input class="form-control" type="text" v-model="lessonPlanForm.topic" name="topic" :placeholder="trans(\'resource.lesson_plan_topic\')">\n                        <show-error :form-name="lessonPlanForm" prop-name="topic"></show-error>\n                    </div>\n                    <template v-for="(detail,index) in lessonPlanForm.details">\n                        <div class="row">\n                            <div class="col-12 col-sm-6">\n                                <div class="form-group">\n                                    <label for="">{{trans(\'resource.lesson_plan_detail_title\')}} \n                                    <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans(\'general.delete\')"><i class="fas fa-times"></i></button></label>\n                                    <input class="form-control" type="text" v-model="detail.title" :name="getDetailTitleName(index)" :placeholder="trans(\'resource.lesson_plan_detail_title\')">\n                                    <show-error :form-name="lessonPlanForm" :prop-name="getDetailTitleName(index)"></show-error>\n                                </div>\n                            </div>\n                            <div class="col-12 col-sm-6">\n                                <div class="form-group">\n                                    <label for="">{{trans(\'resource.lesson_plan_detail_description\')}}</label>\n                                    <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans(\'resource.lesson_plan_detail_description\')"></autosize-textarea>\n                                    <show-error :form-name="lessonPlanForm" :prop-name="getDetailDescriptionName(index)"></show-error>\n                                </div>\n                            </div>\n                        </div>\n                    </template>\n                    <div class="form-group">\n                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans(\'resource.lesson_plan_add_new_detail\')}}</button>\n                    </div>\n                    <div class="form-group">\n                        <file-upload-input :button-text="trans(\'general.upload_document\')" :token="lessonPlanForm.upload_token" module="lesson_plan" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>\n                    </div>\n                </div>\n            </div>\n            <div class="card-footer text-right">\n                <router-link to="/resource/lesson/plan" class="btn btn-danger waves-effect waves-light ">{{trans(\'general.cancel\')}}</router-link>\n                <button type="submit" class="btn btn-info waves-effect waves-light">\n                    <span v-if="uuid">{{trans(\'general.update\')}}</span>\n                    <span v-else>{{trans(\'general.save\')}}</span>\n                </button>\n            </div>\n        </form>\n    </div>\n</template>\n\n\n<script>\n\n    export default {\n        components: {},\n        data() {\n            return {\n                lessonPlanForm: new Form({\n                    batch_id: \'\',\n                    subject_id: \'\',\n                    topic: \'\',\n                    start_date: \'\',\n                    end_date: \'\',\n                    details: [],\n                    upload_token: \'\'\n                }),\n                batches: [],\n                selected_batch: null,\n                subjects: [],\n                selected_subject: null,\n                subject_detail: [],\n                module_id: \'\',\n                clearAttachment: true\n            };\n        },\n        props: [\'uuid\'],\n        mounted() {\n            if(!helper.hasPermission(\'create-lesson-plan\') && !helper.hasPermission(\'edit-lesson-plan\')){\n                helper.notAccessibleMsg();\n                this.$router.push(\'/dashboard\');\n            }\n\n            if(this.uuid)\n                this.get();\n            else {\n                this.addRow();\n                this.lessonPlanForm.upload_token = this.$uuid.v4();\n            }\n\n            this.getPreRequisite();\n        },\n        methods: {\n            hasPermission(permission){\n                return helper.hasPermission(permission);\n            },\n            addRow(){\n                let new_index = this.lessonPlanForm.details.push({\n                    title: \'\',\n                    description: \'\'\n                })\n            },\n            confirmDeleteDetail(index){\n                return dialog => this.deleteDetail(index);\n            },\n            deleteDetail(index){\n                this.lessonPlanForm.details.splice(index, 1);\n            },\n            getDetailTitleName(index){\n                return index+\'_detail_title\';\n            },\n            getDetailDescriptionName(index){\n                return index+\'_detail_description\';\n            },\n            getPreRequisite(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/lesson/plan/pre-requisite\')\n                    .then(response => {\n                        this.batches = response.batches;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            getSubjects(){\n                if (!this.uuid) {\n                    this.lessonPlanForm.subject_id = \'\';\n                    this.selected_subject = null;\n                }\n                let loader = this.$loading.show();\n                axios.post(\'/api/batch/\'+this.lessonPlanForm.batch_id+\'/subjects\')\n                    .then(response => {\n                        this.subjects = response.subjects;\n                        this.subject_details = response.subject_details;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            proceed(){\n                if(this.uuid)\n                    this.update();\n                else\n                    this.store();\n            },\n            store(){\n                let loader = this.$loading.show();\n                this.lessonPlanForm.post(\'/api/lesson/plan\')\n                    .then(response => {\n                        toastr.success(response.message);\n                        this.clearAttachment = !this.clearAttachment;\n                        this.lessonPlanForm.upload_token = this.$uuid.v4();\n                        this.selected_batch = null;\n                        this.selected_subject = null;\n                        this.lessonPlanForm.details = [];\n                        this.addRow();\n                        this.$emit(\'completed\');\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            get(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/lesson/plan/\'+this.uuid)\n                    .then(response => {\n                        let lesson_plan = response.lesson_plan;\n                        this.lessonPlanForm.title = lesson_plan.title;\n                        this.lessonPlanForm.topic = lesson_plan.topic;\n                        this.lessonPlanForm.start_date = lesson_plan.start_date;\n                        this.lessonPlanForm.end_date = lesson_plan.end_date;\n                        this.lessonPlanForm.batch_id = lesson_plan.subject.batch_id;\n                        this.lessonPlanForm.subject_id = lesson_plan.subject_id;\n                        this.selected_batch = this.lessonPlanForm.batch_id ? {id: lesson_plan.subject.batch_id, name: lesson_plan.subject.batch.course.name+\' \'+lesson_plan.subject.batch.name} : null;\n                        this.selected_subject = lesson_plan.subject_id ? {id: lesson_plan.subject_id, name: lesson_plan.subject.name+\' (\'+lesson_plan.subject.code+\')\'} : null;\n                        this.lessonPlanForm.upload_token = lesson_plan.upload_token;\n\n                        lesson_plan.lesson_plan_details.forEach(lesson_plan_detail => {\n                            this.lessonPlanForm.details.push({\n                                title: lesson_plan_detail.title,\n                                description: lesson_plan_detail.description\n                            });\n                        });\n                        \n                        this.module_id = lesson_plan.id;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                        this.$router.push(\'/resource/lesson/plan\');\n                    });\n            },\n            update(){\n                let loader = this.$loading.show();\n                this.lessonPlanForm.patch(\'/api/lesson/plan/\'+this.uuid)\n                    .then(response => {\n                        toastr.success(response.message);\n                        loader.hide();\n                        this.$router.push(\'/resource/lesson/plan\');\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            onBatchSelect(selectedOption){\n                this.lessonPlanForm.batch_id = selectedOption.id;\n            },\n            onSubjectSelect(selectedOption){\n                this.lessonPlanForm.subject_id = selectedOption.id;\n            }\n        },\n        watch: {\n            \'lessonPlanForm.batch_id\': function(val) {\n                if (val) {\n                    this.getSubjects();\n                }\n            }\n        }\n    }\n<\/script>\n\n<style>\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n</style>'],sourceRoot:""}]);const r=l},92167:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});const n={components:{},data:function(){return{lessonPlanForm:new Form({batch_id:"",subject_id:"",topic:"",start_date:"",end_date:"",details:[],upload_token:""}),batches:[],selected_batch:null,subjects:[],selected_subject:null,subject_detail:[],module_id:"",clearAttachment:!0}},props:["uuid"],mounted:function(){helper.hasPermission("create-lesson-plan")||helper.hasPermission("edit-lesson-plan")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.uuid?this.get():(this.addRow(),this.lessonPlanForm.upload_token=this.$uuid.v4()),this.getPreRequisite()},methods:{hasPermission:function(e){return helper.hasPermission(e)},addRow:function(){this.lessonPlanForm.details.push({title:"",description:""})},confirmDeleteDetail:function(e){var t=this;return function(s){return t.deleteDetail(e)}},deleteDetail:function(e){this.lessonPlanForm.details.splice(e,1)},getDetailTitleName:function(e){return e+"_detail_title"},getDetailDescriptionName:function(e){return e+"_detail_description"},getPreRequisite:function(){var e=this,t=this.$loading.show();axios.get("/api/lesson/plan/pre-requisite").then((function(s){e.batches=s.batches,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getSubjects:function(){var e=this;this.uuid||(this.lessonPlanForm.subject_id="",this.selected_subject=null);var t=this.$loading.show();axios.post("/api/batch/"+this.lessonPlanForm.batch_id+"/subjects").then((function(s){e.subjects=s.subjects,e.subject_details=s.subject_details,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},proceed:function(){this.uuid?this.update():this.store()},store:function(){var e=this,t=this.$loading.show();this.lessonPlanForm.post("/api/lesson/plan").then((function(s){toastr.success(s.message),e.clearAttachment=!e.clearAttachment,e.lessonPlanForm.upload_token=e.$uuid.v4(),e.selected_batch=null,e.selected_subject=null,e.lessonPlanForm.details=[],e.addRow(),e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},get:function(){var e=this,t=this.$loading.show();axios.get("/api/lesson/plan/"+this.uuid).then((function(s){var n=s.lesson_plan;e.lessonPlanForm.title=n.title,e.lessonPlanForm.topic=n.topic,e.lessonPlanForm.start_date=n.start_date,e.lessonPlanForm.end_date=n.end_date,e.lessonPlanForm.batch_id=n.subject.batch_id,e.lessonPlanForm.subject_id=n.subject_id,e.selected_batch=e.lessonPlanForm.batch_id?{id:n.subject.batch_id,name:n.subject.batch.course.name+" "+n.subject.batch.name}:null,e.selected_subject=n.subject_id?{id:n.subject_id,name:n.subject.name+" ("+n.subject.code+")"}:null,e.lessonPlanForm.upload_token=n.upload_token,n.lesson_plan_details.forEach((function(t){e.lessonPlanForm.details.push({title:t.title,description:t.description})})),e.module_id=n.id,t.hide()})).catch((function(s){t.hide(),helper.showErrorMsg(s),e.$router.push("/resource/lesson/plan")}))},update:function(){var e=this,t=this.$loading.show();this.lessonPlanForm.patch("/api/lesson/plan/"+this.uuid).then((function(s){toastr.success(s.message),t.hide(),e.$router.push("/resource/lesson/plan")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onBatchSelect:function(e){this.lessonPlanForm.batch_id=e.id},onSubjectSelect:function(e){this.lessonPlanForm.subject_id=e.id}},watch:{"lessonPlanForm.batch_id":function(e){e&&this.getSubjects()}}};var a=s(93379),o=s.n(a),l=s(24128),r={insert:"head",singleton:!1};o()(l.Z,r);l.Z.locals;const i=(0,s(51900).Z)(n,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.lessonPlanForm.errors.clear(t.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.batch"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name","group-values":"batches","group-label":"course_group","group-select":!1,name:"batch_id",id:"batch_id",options:e.batches,placeholder:e.trans("academic.select_batch")},on:{select:e.onBatchSelect,close:function(t){return e.lessonPlanForm.errors.clear("batch_id")},remove:function(t){e.lessonPlanForm.batch_id=""}},model:{value:e.selected_batch,callback:function(t){e.selected_batch=t},expression:"selected_batch"}},[e.batches.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":"batch_id"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[e.lessonPlanForm.batch_id?s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.subject"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name",name:"subject_id",id:"subject_id",options:e.subjects,placeholder:e.trans("resource.select_subject")},on:{select:e.onSubjectSelect,close:function(t){return e.lessonPlanForm.errors.clear("subject_id")},remove:function(t){e.lessonPlanForm.subject_id=""}},model:{value:e.selected_subject,callback:function(t){e.selected_subject=t},expression:"selected_subject"}},[e.subjects.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":"subject_id"}})],1):e._e()]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_start_date")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.lesson_plan_start_date")},on:{selected:function(t){return e.lessonPlanForm.errors.clear("start_date")}},model:{value:e.lessonPlanForm.start_date,callback:function(t){e.$set(e.lessonPlanForm,"start_date",t)},expression:"lessonPlanForm.start_date"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":"start_date"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_end_date")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.lesson_plan_end_date")},on:{selected:function(t){return e.lessonPlanForm.errors.clear("end_date")}},model:{value:e.lessonPlanForm.end_date,callback:function(t){e.$set(e.lessonPlanForm,"end_date",t)},expression:"lessonPlanForm.end_date"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":"end_date"}})],1)])]),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_topic")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.lessonPlanForm.topic,expression:"lessonPlanForm.topic"}],staticClass:"form-control",attrs:{type:"text",name:"topic",placeholder:e.trans("resource.lesson_plan_topic")},domProps:{value:e.lessonPlanForm.topic},on:{input:function(t){t.target.composing||e.$set(e.lessonPlanForm,"topic",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":"topic"}})],1),e._v(" "),e._l(e.lessonPlanForm.details,(function(t,n){return[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_detail_title"))+" \n                                "),s("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDeleteDetail(n)},expression:"{ok: confirmDeleteDetail(index)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.delete"),expression:"trans('general.delete')"}],key:n+"_delete_detail",staticClass:"btn btn-xs btn-danger m-l-20",attrs:{type:"button"}},[s("i",{staticClass:"fas fa-times"})])]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"detail.title"}],staticClass:"form-control",attrs:{type:"text",name:e.getDetailTitleName(n),placeholder:e.trans("resource.lesson_plan_detail_title")},domProps:{value:t.title},on:{input:function(s){s.target.composing||e.$set(t,"title",s.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":e.getDetailTitleName(n)}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_detail_description")))]),e._v(" "),s("autosize-textarea",{attrs:{rows:"2",name:e.getDetailDescriptionName(n),placeholder:e.trans("resource.lesson_plan_detail_description")},model:{value:t.description,callback:function(s){e.$set(t,"description",s)},expression:"detail.description"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.lessonPlanForm,"prop-name":e.getDetailDescriptionName(n)}})],1)])])]})),e._v(" "),s("div",{staticClass:"form-group"},[s("button",{staticClass:"btn btn-info btn-sm waves-effect waves-light",attrs:{type:"button"},on:{click:e.addRow}},[e._v(e._s(e.trans("resource.lesson_plan_add_new_detail")))])]),e._v(" "),s("div",{staticClass:"form-group"},[s("file-upload-input",{attrs:{"button-text":e.trans("general.upload_document"),token:e.lessonPlanForm.upload_token,module:"lesson_plan","clear-file":e.clearAttachment,"module-id":e.module_id}})],1)],2)]),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("router-link",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/resource/lesson/plan"}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e.uuid?s("span",[e._v(e._s(e.trans("general.update")))]):s("span",[e._v(e._s(e.trans("general.save")))])])],1)])])}),[],!1,null,null,null).exports},43685:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});var n=s(92167),a=s(51833);const o={components:{lessonPlanForm:n.Z,lessonPlanDetail:a.default},data:function(){return{lesson_plans:{total:0,data:[]},filter:{sort_by:"start_date",order:"desc",topic:"",batch_id:[],page_length:helper.getConfig("page_length")},orderByOptions:[{value:"start_date",translation:i18n.resource.lesson_plan_start_date},{value:"topic",translation:i18n.resource.lesson_plan_topic}],batches:[],selected_batches:null,showFilterPanel:!1,showCreatePanel:!1,help_topic:"",showUuid:"",showModal:!1}},mounted:function(){helper.hasPermission("list-lesson-plan")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.getLessonPlans(),helper.showDemoNotification(["resource"])},methods:{hasPermission:function(e){return helper.hasPermission(e)},showAction:function(e){this.showUuid=e.uuid,this.showModal=!0},getEmployeeName:function(e){return helper.getEmployeeName(e)},getEmployeeDesignationOnDate:function(e,t){return helper.getEmployeeDesignationOnDate(e,t)},getLessonPlans:function(e){var t=this,s=this.$loading.show();"number"!=typeof e&&(e=1);var n=helper.getFilterURL(this.filter);axios.get("/api/lesson/plan?page="+e+n).then((function(e){t.lesson_plans=e.lesson_plans,t.batches=e.filters.batches,s.hide()})).catch((function(e){s.hide(),helper.showErrorMsg(e)}))},editLessonPlan:function(e){this.$router.push("/resource/lesson/plan/"+e.uuid+"/edit")},confirmDelete:function(e){var t=this;return function(s){return t.deleteLessonPlan(e)}},deleteLessonPlan:function(e){var t=this,s=this.$loading.show();axios.delete("/api/lesson/plan/"+e.uuid).then((function(e){toastr.success(e.message),t.getLessonPlans(),s.hide()})).catch((function(e){s.hide(),helper.showErrorMsg(e)}))},getConfig:function(e){return helper.getConfig(e)},print:function(){var e=this.$loading.show();axios.post("/api/lesson/plan/print",{filter:this.filter}).then((function(t){var s=window.open("/print");e.hide(),s.document.write(t)})).catch((function(t){e.hide(),helper.showErrorMsg(t)}))},pdf:function(){var e=this,t=this.$loading.show();axios.post("/api/lesson/plan/pdf",{filter:this.filter}).then((function(s){t.hide(),window.open("/download/report/"+s+"?token="+e.authToken)})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onBatchSelect:function(e){this.filter.batch_id.push(e.id)},onBatchRemove:function(e){this.filter.batch_id.splice(this.filter.batch_id.indexOf(e.id),1)}},filters:{moment:function(e){return helper.formatDate(e)},momentDateTime:function(e){return helper.formatDateTime(e)}},watch:{"filter.sort_by":function(e){this.getLessonPlans()},"filter.order":function(e){this.getLessonPlans()},"filter.page_length":function(e){this.getLessonPlans()}},computed:{authToken:function(){return helper.getAuthToken()}}};const l=(0,s(51900).Z)(o,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("resource.lesson_plan"))+" \n                    "),e.lesson_plans.total?s("span",{staticClass:"card-subtitle d-none d-sm-inline"},[e._v(e._s(e.trans("general.total_result_found",{count:e.lesson_plans.total,from:e.lesson_plans.from,to:e.lesson_plans.to})))]):s("span",{staticClass:"card-subtitle d-none d-sm-inline"},[e._v(e._s(e.trans("general.no_result_found")))])])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[e.lesson_plans.total&&e.hasPermission("create-lesson-plan")?s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.add_new"),expression:"trans('general.add_new')"}],staticClass:"btn btn-info btn-sm",on:{click:function(t){return e.$router.push("/resource/lesson/plan/create")}}},[s("i",{staticClass:"fas fa-plus"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("resource.add_new_lesson_plan")))])]):e._e(),e._v(" "),e.showFilterPanel?e._e():s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){e.showFilterPanel=!e.showFilterPanel}}},[s("i",{staticClass:"fas fa-filter"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("general.filter")))])]),e._v(" "),s("sort-by",{attrs:{"order-by-options":e.orderByOptions,"sort-by":e.filter.sort_by,order:e.filter.order},on:{updateSortBy:function(t){e.filter.sort_by=t},updateOrder:function(t){e.filter.order=t}}}),e._v(" "),s("div",{staticClass:"btn-group"},[s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.more_option"),expression:"trans('general.more_option')"}],staticClass:"btn btn-info btn-sm dropdown-toggle no-caret ",attrs:{type:"button",role:"menu",id:"moreOption","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"}},[s("i",{staticClass:"fas fa-ellipsis-h"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"})]),e._v(" "),s("div",{class:["dropdown-menu","ltr"==e.getConfig("direction")?"dropdown-menu-right":""],attrs:{"aria-labelledby":"moreOption"}},[s("button",{staticClass:"dropdown-item custom-dropdown",on:{click:e.print}},[s("i",{staticClass:"fas fa-print"}),e._v(" "+e._s(e.trans("general.print")))]),e._v(" "),s("button",{staticClass:"dropdown-item custom-dropdown",on:{click:e.pdf}},[s("i",{staticClass:"fas fa-file-pdf"}),e._v(" "+e._s(e.trans("general.generate_pdf")))])])]),e._v(" "),s("help-button",{on:{clicked:function(t){e.help_topic="resource.lesson_plan"}}})],1)])])]),e._v(" "),s("div",{staticClass:"container-fluid"},[s("transition",{attrs:{name:"fade"}},[e.showFilterPanel?s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body"},[s("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("general.filter")))]),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.batch")))]),e._v(" "),s("v-select",{attrs:{label:"name","track-by":"id","group-values":"batches","group-label":"course_group","group-select":!1,name:"batch_id",id:"batch_id",options:e.batches,placeholder:e.trans("academic.select_batch"),multiple:!0,"close-on-select":!1,"clear-on-select":!1,"hide-selected":!0,selected:e.selected_batches},on:{select:e.onBatchSelect,remove:e.onBatchRemove},model:{value:e.selected_batches,callback:function(t){e.selected_batches=t},expression:"selected_batches"}},[e.batches.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                                        "+e._s(e.trans("general.no_option_found"))+"\n                                    ")])])],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.lesson_plan_topic")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.filter.topic,expression:"filter.topic"}],staticClass:"form-control",attrs:{name:"topic"},domProps:{value:e.filter.topic},on:{input:function(t){t.target.composing||e.$set(e.filter,"topic",t.target.value)}}})])])]),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(t){e.showFilterPanel=!1}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"button"},on:{click:e.getLessonPlans}},[e._v(e._s(e.trans("general.filter")))])])])]):e._e()]),e._v(" "),s("div",{staticClass:"card"},[s("div",{staticClass:"card-body"},[e.lesson_plans.total?s("div",{staticClass:"table-responsive"},[s("table",{staticClass:"table table-sm"},[s("thead",[s("tr",[s("th",[e._v(e._s(e.trans("academic.subject")))]),e._v(" "),s("th",[e._v(e._s(e.trans("academic.batch")))]),e._v(" "),s("th",[e._v(e._s(e.trans("resource.lesson_plan_topic")))]),e._v(" "),s("th",[e._v(e._s(e.trans("resource.lesson_plan_start_date")))]),e._v(" "),s("th",[e._v(e._s(e.trans("resource.lesson_plan_end_date")))]),e._v(" "),s("th",[e._v(e._s(e.trans("resource.lesson_plan_created_by")))]),e._v(" "),s("th",[e._v(e._s(e.trans("general.created_at")))]),e._v(" "),s("th",{staticClass:"table-option"},[e._v(e._s(e.trans("general.action")))])])]),e._v(" "),s("tbody",e._l(e.lesson_plans.data,(function(t){return s("tr",[s("td",{domProps:{textContent:e._s(t.subject.name+" ("+t.subject.code+")")}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.subject.batch.course.name+" "+t.subject.batch.name)}}),e._v(" "),s("td",{domProps:{textContent:e._s(t.topic)}}),e._v(" "),s("td",[e._v(e._s(e._f("moment")(t.start_date)))]),e._v(" "),s("td",[e._v(e._s(e._f("moment")(t.end_date)))]),e._v(" "),s("td",[e._v(e._s(e.getEmployeeName(t.employee))+" "),s("br"),e._v(" "+e._s(e.getEmployeeDesignationOnDate(t.employee,t.start_date)))]),e._v(" "),s("td",[e._v(e._s(e._f("momentDateTime")(t.created_at)))]),e._v(" "),s("td",{staticClass:"table-option"},[s("div",{staticClass:"btn-group"},[s("a",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.print"),expression:"trans('general.print')"}],staticClass:"btn btn-secondary btn-sm",attrs:{target:"_blank",href:"/resource/lesson/plan/"+t.uuid+"/print?token="+e.authToken}},[s("i",{staticClass:"fas fa-print"})]),e._v(" "),s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("resource.view_lesson_plan"),expression:"trans('resource.view_lesson_plan')"}],staticClass:"btn btn-success btn-sm",on:{click:function(s){return s.preventDefault(),e.showAction(t)}}},[s("i",{staticClass:"fas fa-arrow-circle-right"})]),e._v(" "),e.hasPermission("edit-lesson-plan")?s("button",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.trans("resource.edit_lesson_plan"),expression:"trans('resource.edit_lesson_plan')"}],staticClass:"btn btn-info btn-sm",on:{click:function(s){return s.preventDefault(),e.editLessonPlan(t)}}},[s("i",{staticClass:"fas fa-edit"})]):e._e(),e._v(" "),e.hasPermission("delete-lesson-plan")?s("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDelete(t)},expression:"{ok: confirmDelete(lesson_plan)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("resource.delete_lesson_plan"),expression:"trans('resource.delete_lesson_plan')"}],key:t.id,staticClass:"btn btn-danger btn-sm"},[s("i",{staticClass:"fas fa-trash"})]):e._e()])])])})),0)])]):e._e(),e._v(" "),e.lesson_plans.total?e._e():s("module-info",{attrs:{module:"resource",title:"lesson_plan_module_title",description:"lesson_plan_module_description",icon:"list"}},[s("div",{attrs:{slot:"btn"},slot:"btn"},[e.hasPermission("create-lesson-plan")?s("button",{staticClass:"btn btn-info btn-md",on:{click:function(t){return e.$router.push("/resource/lesson/plan/create")}}},[s("i",{staticClass:"fas fa-plus"}),e._v(" "+e._s(e.trans("general.add_new")))]):e._e()])]),e._v(" "),s("pagination-record",{attrs:{"page-length":e.filter.page_length,records:e.lesson_plans},on:{"update:pageLength":function(t){return e.$set(e.filter,"page_length",t)},"update:page-length":function(t){return e.$set(e.filter,"page_length",t)},updateRecords:e.getLessonPlans}})],1)])],1),e._v(" "),e.showModal?s("lesson-plan-detail",{attrs:{uuid:e.showUuid},on:{close:function(t){e.showModal=!1}}}):e._e(),e._v(" "),s("right-panel",{attrs:{topic:e.help_topic}})],1)}),[],!1,null,null,null).exports},51833:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});const n={components:{},props:["uuid","url"],mounted:function(){this.uuid&&this.get()},data:function(){return{lesson_plan:[],attachments:[]}},methods:{get:function(){var e=this,t=this.$loading.show();axios.get("/api/lesson/plan/"+this.uuid).then((function(s){e.lesson_plan=s.lesson_plan,e.attachments=s.attachments,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getEmployeeName:function(e){return helper.getEmployeeName(e)},getEmployeeDesignation:function(e,t){return helper.getEmployeeDesignation(e,t)}},computed:{authToken:function(){return helper.getAuthToken()}},filters:{momentDateTime:function(e){return helper.formatDateTime(e)},moment:function(e){return helper.formatDate(e)}}};const a=(0,s(51900).Z)(n,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("transition",{attrs:{name:"modal"}},[s("div",{staticClass:"modal-mask"},[s("div",{staticClass:"modal-wrapper"},[s("div",{staticClass:"modal-container modal-lg"},[e.lesson_plan.id?s("div",{staticClass:"modal-header"},[e._t("header",(function(){return[s("span",[e._v(e._s(e.lesson_plan.topic))]),e._v(" "),s("span",{staticClass:"float-right pointer",on:{click:function(t){return e.$emit("close")}}},[e._v("x")])]}))],2):e._e(),e._v(" "),e.lesson_plan.id?s("div",{staticClass:"modal-body"},[e._t("body",(function(){return[s("h6",{staticClass:"card-title"},[s("strong",[e._v(e._s(e.trans("academic.subject"))+":")]),e._v(" "+e._s(e.lesson_plan.subject.name+" ("+e.lesson_plan.subject.code+")")+" \n                            "),s("br"),e._v(" "),s("strong",[e._v(e._s(e.trans("academic.batch"))+":")]),e._v(" "+e._s(e.lesson_plan.subject.batch.course.name+" "+e.lesson_plan.subject.batch.name)+" \n                            "),s("br"),e._v(" "),s("strong",[e._v(e._s(e.trans("resource.lesson_plan_start_date"))+":")]),e._v(" "+e._s(e._f("moment")(e.lesson_plan.start_date))+" \n                            "),s("br"),e._v(" "),s("strong",[e._v(e._s(e.trans("resource.lesson_plan_end_date"))+":")]),e._v(" "+e._s(e._f("moment")(e.lesson_plan.end_date))+" \n                            "),e.lesson_plan.employee?s("p",{staticClass:"pull-right"},[s("strong",[e._v(e._s(e.trans("resource.lesson_plan_created_by"))+":")]),e._v(" "+e._s(e.getEmployeeName(e.lesson_plan.employee))+" "+e._s(e.getEmployeeDesignation(e.lesson_plan.employee,e.lesson_plan.start_date))+"\n                            ")]):e._e()]),e._v(" "),e._l(e.lesson_plan.lesson_plan_details,(function(t){return s("div",{staticClass:"m-t-20"},[s("h6",{staticClass:"card-title"},[e._v(e._s(t.title))]),e._v(" "),s("p",{staticClass:"font-90pc",domProps:{textContent:e._s(t.description)}}),e._v(" "),e.$last(t,e.lesson_plan.lesson_plan_details)?e._e():s("hr")])})),e._v(" "),e.attachments.length?s("div",[s("ul",{staticClass:"m-t-10 upload-file-list"},e._l(e.attachments,(function(t){return s("li",{staticClass:"upload-file-list-item"},[s("a",{staticClass:"no-link-color",attrs:{href:"/resource/lesson/plan/"+e.lesson_plan.uuid+"/attachment/"+t.uuid+"/download?token="+e.authToken}},[s("i",{class:["file-icon","fas","fa-lg",t.file_info.icon]}),e._v(" "),s("span",{staticClass:"upload-file-list-item-size"},[e._v(e._s(t.file_info.size))]),e._v(" "+e._s(t.user_filename))])])})),0)]):e._e(),e._v(" "),s("hr"),e._v(" "),s("p",[s("i",{staticClass:"far fa-clock"}),e._v(" "),s("small",[e._v(e._s(e.trans("general.created_at"))+" "+e._s(e._f("momentDateTime")(e.lesson_plan.created_at)))]),e._v(" "),s("span",{staticClass:"pull-right"},[s("i",{staticClass:"far fa-clock"}),e._v(" "),s("small",[e._v(e._s(e.trans("general.updated_at"))+" "+e._s(e._f("momentDateTime")(e.lesson_plan.updated_at)))])])])]}))],2):e._e()])])])])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=e27fe96f9a962d84ec95