(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[4306],{30534:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});var a=s(94015),l=s.n(a),n=s(23645),r=s.n(n)()(l());r.push([e.id,".loading-overlay.is-full-page{z-index:1060}","",{version:3,sources:["webpack://./resources/js/views/resource/syllabus/form.vue"],names:[],mappings:"AAuUA,8BACA,YACA",sourcesContent:['<template>\n    <div>\n        <form @submit.prevent="proceed" @keydown="syllabusForm.errors.clear($event.target.name)">\n            <div class="row">\n                <div class="col-12 col-sm-3">\n                    <div class="form-group">\n                        <label for="">{{trans(\'academic.batch\')}} </label>\n                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans(\'academic.select_batch\')" @select="onBatchSelect" @close="syllabusForm.errors.clear(\'batch_id\')" @remove="syllabusForm.batch_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="syllabusForm" prop-name="batch_id"></show-error>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-3">\n                    <div class="form-group" v-if="syllabusForm.batch_id">\n                        <label for="">{{trans(\'academic.subject\')}} </label>\n                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans(\'resource.select_subject\')" @select="onSubjectSelect" @close="syllabusForm.errors.clear(\'subject_id\')" @remove="syllabusForm.subject_id = \'\'">\n                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">\n                                {{trans(\'general.no_option_found\')}}\n                            </div>\n                        </v-select>\n                        <show-error :form-name="syllabusForm" prop-name="subject_id"></show-error>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-6">\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.syllabus_title\')}}</label>\n                        <input class="form-control" type="text" v-model="syllabusForm.title" name="title" :placeholder="trans(\'resource.syllabus_title\')">\n                        <show-error :form-name="syllabusForm" prop-name="title"></show-error>\n                    </div>\n                </div>\n                <div class="col-12">\n                    <div class="form-group">\n                        <label for="">{{trans(\'resource.syllabus_description\')}}</label>\n                        <autosize-textarea v-model="syllabusForm.description" rows="2" name="description" :placeholder="trans(\'resource.syllabus_description\')"></autosize-textarea>\n                        <show-error :form-name="syllabusForm" prop-name="description"></show-error>\n                    </div>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-12 col-sm-6">\n                    <h4 class="card-title">{{trans(\'resource.syllabus_detail\')}}</h4>\n                    <template v-for="(detail,index) in syllabusForm.details">\n                        <div class="form-group">\n                            <label for="">{{trans(\'resource.syllabus_detail_title\')}} \n                            <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans(\'general.delete\')"><i class="fas fa-times"></i></button></label>\n                            <input class="form-control" type="text" v-model="detail.title" :name="getDetailTitleName(index)" :placeholder="trans(\'resource.syllabus_detail_title\')">\n                            <show-error :form-name="syllabusForm" :prop-name="getDetailTitleName(index)"></show-error>\n                        </div>\n                        <div class="form-group">\n                            <label for="">{{trans(\'resource.syllabus_detail_description\')}}</label>\n                            <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans(\'resource.syllabus_detail_description\')"></autosize-textarea>\n                            <show-error :form-name="syllabusForm" :prop-name="getDetailDescriptionName(index)"></show-error>\n                        </div>\n                    </template>\n                    <div class="form-group">\n                        <button type="button" @click="addDetailRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans(\'resource.syllabus_add_new_detail\')}}</button>\n                    </div>\n                </div>\n                <div class="col-12 col-sm-6">\n                    <h4 class="card-title">{{trans(\'resource.syllabus_topic\')}}</h4>\n                    <template v-for="(topic,index) in syllabusForm.topics">\n                        <div class="form-group">\n                            <label for="">{{trans(\'resource.syllabus_topic_title\')}} \n                                <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_topic`" v-confirm="{ok: confirmDeleteTopic(index)}" v-tooltip="trans(\'general.delete\')"><i class="fas fa-times"></i></button></label>\n                            <input class="form-control" type="text" v-model="topic.title" :name="getTopicTitleName(index)" :placeholder="trans(\'resource.syllabus_topic_title\')">\n                            <show-error :form-name="syllabusForm" :prop-name="getTopicTitleName(index)"></show-error>\n                        </div>\n                        <div class="row">\n                            <div class="col-12 col-sm-6">\n                                <div class="form-group">\n                                    <label for="">{{trans(\'resource.syllabus_topic_start_date\')}}</label>\n                                    <datepicker v-model="topic.start_date" :bootstrapStyling="true" @selected="syllabusForm.errors.clear(getTopicStartDateName(index))" :placeholder="trans(\'resource.syllabus_start_date\')"></datepicker>\n                                    <show-error :form-name="syllabusForm" :prop-name="getTopicStartDateName(index)"></show-error>\n                                </div>\n                            </div>\n                            <div class="col-12 col-sm-6">\n                                <div class="form-group">\n                                    <label for="">{{trans(\'resource.syllabus_topic_end_date\')}}</label>\n                                    <datepicker v-model="topic.end_date" :bootstrapStyling="true" @selected="syllabusForm.errors.clear(getTopicEndDateName(index))" :placeholder="trans(\'resource.syllabus_end_date\')"></datepicker>\n                                    <show-error :form-name="syllabusForm" :prop-name="getTopicEndDateName(index)"></show-error>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="form-group">\n                            <label for="">{{trans(\'resource.syllabus_topic_description\')}}</label>\n                            <autosize-textarea v-model="topic.description" rows="2" :name="getTopicDescriptionName(index)" :placeholder="trans(\'resource.syllabus_topic_description\')"></autosize-textarea>\n                            <show-error :form-name="syllabusForm" :prop-name="getTopicDescriptionName(index)"></show-error>\n                        </div>\n                    </template>\n                    <div class="form-group">\n                        <button type="button" @click="addTopicRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans(\'resource.syllabus_add_new_topic\')}}</button>\n                    </div>\n                </div>\n                <div class="col-12">\n                    <div class="form-group">\n                        <file-upload-input :button-text="trans(\'general.upload_document\')" :token="syllabusForm.upload_token" module="syllabus" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>\n                    </div>\n                </div>\n            </div>\n            <div class="card-footer text-right">\n                <router-link to="/resource/syllabus" class="btn btn-danger waves-effect waves-light ">{{trans(\'general.cancel\')}}</router-link>\n                <button type="submit" class="btn btn-info waves-effect waves-light">\n                    <span v-if="uuid">{{trans(\'general.update\')}}</span>\n                    <span v-else>{{trans(\'general.save\')}}</span>\n                </button>\n            </div>\n        </form>\n    </div>\n</template>\n\n\n<script>\n\n    export default {\n        components: {},\n        data() {\n            return {\n                syllabusForm: new Form({\n                    title: \'\',\n                    description: \'\',\n                    batch_id: \'\',\n                    subject_id: \'\',\n                    details: [],\n                    topics: [],\n                    upload_token: \'\'\n                }),\n                batches: [],\n                selected_batch: null,\n                subjects: [],\n                selected_subject: null,\n                subject_detail: [],\n                module_id: \'\',\n                clearAttachment: true\n            };\n        },\n        props: [\'uuid\'],\n        mounted() {\n            if(!helper.hasPermission(\'create-syllabus\') && !helper.hasPermission(\'edit-syllabus\')){\n                helper.notAccessibleMsg();\n                this.$router.push(\'/dashboard\');\n            }\n\n            if(this.uuid)\n                this.get();\n            else {\n                this.addDetailRow();\n                this.addTopicRow();\n                this.syllabusForm.upload_token = this.$uuid.v4();\n            }\n\n            this.getPreRequisite();\n        },\n        methods: {\n            hasPermission(permission){\n                return helper.hasPermission(permission);\n            },\n            addDetailRow(){\n                let new_index = this.syllabusForm.details.push({\n                    title: \'\',\n                    description: \'\'\n                })\n            },\n            confirmDeleteDetail(index){\n                return dialog => this.deleteDetail(index);\n            },\n            deleteDetail(index){\n                this.syllabusForm.details.splice(index, 1);\n            },\n            getDetailTitleName(index){\n                return index+\'_detail_title\';\n            },\n            getDetailDescriptionName(index){\n                return index+\'_detail_description\';\n            },\n            addTopicRow(){\n                let new_index = this.syllabusForm.topics.push({\n                    title: \'\',\n                    start_date: \'\',\n                    end_date: \'\',\n                    description: \'\'\n                })\n            },\n            confirmDeleteTopic(index){\n                return dialog => this.deleteTopic(index);\n            },\n            deleteTopic(index){\n                this.syllabusForm.topics.splice(index, 1);\n            },\n            getTopicTitleName(index){\n                return index+\'_topic_title\';\n            },\n            getTopicDescriptionName(index){\n                return index+\'_topic_description\';\n            },\n            getTopicStartDateName(index){\n                return index+\'_topic_start_date\';\n            },\n            getTopicEndDateName(index){\n                return index+\'_topic_end_date\';\n            },\n            getPreRequisite(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/syllabus/pre-requisite\')\n                    .then(response => {\n                        this.batches = response.batches;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            getSubjects(){\n                if (!this.uuid) {\n                    this.syllabusForm.subject_id = \'\';\n                    this.selected_subject = null;\n                }\n                let loader = this.$loading.show();\n                axios.post(\'/api/batch/\'+this.syllabusForm.batch_id+\'/subjects\')\n                    .then(response => {\n                        this.subjects = response.subjects;\n                        this.subject_details = response.subject_details;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    })\n            },\n            proceed(){\n                if(this.uuid)\n                    this.update();\n                else\n                    this.store();\n            },\n            store(){\n                let loader = this.$loading.show();\n                this.syllabusForm.post(\'/api/syllabus\')\n                    .then(response => {\n                        toastr.success(response.message);\n                        this.clearAttachment = !this.clearAttachment;\n                        this.syllabusForm.upload_token = this.$uuid.v4();\n                        this.selected_batch = null;\n                        this.selected_subject = null;\n                        this.syllabusForm.details = [];\n                        this.syllabusForm.topics = [];\n                        this.addRow();\n                        this.$emit(\'completed\');\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            get(){\n                let loader = this.$loading.show();\n                axios.get(\'/api/syllabus/\'+this.uuid)\n                    .then(response => {\n                        let syllabus = response.syllabus;\n                        this.syllabusForm.title = syllabus.title;\n                        this.syllabusForm.description = syllabus.description;\n                        this.syllabusForm.batch_id = syllabus.subject.batch_id;\n                        this.syllabusForm.subject_id = syllabus.subject_id;\n                        this.selected_batch = this.syllabusForm.batch_id ? {id: syllabus.subject.batch_id, name: syllabus.subject.batch.course.name+\' \'+syllabus.subject.batch.name} : null;\n                        this.selected_subject = syllabus.subject_id ? {id: syllabus.subject_id, name: syllabus.subject.name+\' (\'+syllabus.subject.code+\')\'} : null;\n                        this.syllabusForm.upload_token = syllabus.upload_token;\n\n                        syllabus.syllabus_details.forEach(syllabus_detail => {\n                            this.syllabusForm.details.push({\n                                title: syllabus_detail.title,\n                                description: syllabus_detail.description\n                            });\n                        });\n                        \n                        syllabus.syllabus_topics.forEach(syllabus_topic => {\n                            this.syllabusForm.topics.push({\n                                title: syllabus_topic.title,\n                                start_date: syllabus_topic.start_date,\n                                end_date: syllabus_topic.end_date,\n                                description: syllabus_topic.description\n                            });\n                        });\n                        \n                        this.module_id = syllabus.id;\n                        loader.hide();\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                        this.$router.push(\'/resource/syllabus\');\n                    });\n            },\n            update(){\n                let loader = this.$loading.show();\n                this.syllabusForm.patch(\'/api/syllabus/\'+this.uuid)\n                    .then(response => {\n                        toastr.success(response.message);\n                        loader.hide();\n                        this.$router.push(\'/resource/syllabus\');\n                    })\n                    .catch(error => {\n                        loader.hide();\n                        helper.showErrorMsg(error);\n                    });\n            },\n            onBatchSelect(selectedOption){\n                this.syllabusForm.batch_id = selectedOption.id;\n            },\n            onSubjectSelect(selectedOption){\n                this.syllabusForm.subject_id = selectedOption.id;\n            }\n        },\n        watch: {\n            \'syllabusForm.batch_id\': function(val) {\n                if (val) {\n                    this.getSubjects();\n                }\n            }\n        }\n    }\n<\/script>\n\n<style>\n.loading-overlay.is-full-page{\n    z-index: 1060;\n}\n</style>'],sourceRoot:""}]);const o=r},12233:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});const a={components:{syllabusForm:s(98888).Z},data:function(){return{uuid:this.$route.params.uuid}},mounted:function(){helper.hasPermission("edit-syllabus")||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const l=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("resource.edit_syllabus")))])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){return e.$router.push("/resource/syllabus")}}},[s("i",{staticClass:"fas fa-list"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("resource.syllabus")))])])])])])]),e._v(" "),s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body p-t-20"},[s("syllabus-form",{attrs:{uuid:e.uuid}})],1)])])])}),[],!1,null,null,null).exports},98888:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});const a={components:{},data:function(){return{syllabusForm:new Form({title:"",description:"",batch_id:"",subject_id:"",details:[],topics:[],upload_token:""}),batches:[],selected_batch:null,subjects:[],selected_subject:null,subject_detail:[],module_id:"",clearAttachment:!0}},props:["uuid"],mounted:function(){helper.hasPermission("create-syllabus")||helper.hasPermission("edit-syllabus")||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.uuid?this.get():(this.addDetailRow(),this.addTopicRow(),this.syllabusForm.upload_token=this.$uuid.v4()),this.getPreRequisite()},methods:{hasPermission:function(e){return helper.hasPermission(e)},addDetailRow:function(){this.syllabusForm.details.push({title:"",description:""})},confirmDeleteDetail:function(e){var t=this;return function(s){return t.deleteDetail(e)}},deleteDetail:function(e){this.syllabusForm.details.splice(e,1)},getDetailTitleName:function(e){return e+"_detail_title"},getDetailDescriptionName:function(e){return e+"_detail_description"},addTopicRow:function(){this.syllabusForm.topics.push({title:"",start_date:"",end_date:"",description:""})},confirmDeleteTopic:function(e){var t=this;return function(s){return t.deleteTopic(e)}},deleteTopic:function(e){this.syllabusForm.topics.splice(e,1)},getTopicTitleName:function(e){return e+"_topic_title"},getTopicDescriptionName:function(e){return e+"_topic_description"},getTopicStartDateName:function(e){return e+"_topic_start_date"},getTopicEndDateName:function(e){return e+"_topic_end_date"},getPreRequisite:function(){var e=this,t=this.$loading.show();axios.get("/api/syllabus/pre-requisite").then((function(s){e.batches=s.batches,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getSubjects:function(){var e=this;this.uuid||(this.syllabusForm.subject_id="",this.selected_subject=null);var t=this.$loading.show();axios.post("/api/batch/"+this.syllabusForm.batch_id+"/subjects").then((function(s){e.subjects=s.subjects,e.subject_details=s.subject_details,t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},proceed:function(){this.uuid?this.update():this.store()},store:function(){var e=this,t=this.$loading.show();this.syllabusForm.post("/api/syllabus").then((function(s){toastr.success(s.message),e.clearAttachment=!e.clearAttachment,e.syllabusForm.upload_token=e.$uuid.v4(),e.selected_batch=null,e.selected_subject=null,e.syllabusForm.details=[],e.syllabusForm.topics=[],e.addRow(),e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},get:function(){var e=this,t=this.$loading.show();axios.get("/api/syllabus/"+this.uuid).then((function(s){var a=s.syllabus;e.syllabusForm.title=a.title,e.syllabusForm.description=a.description,e.syllabusForm.batch_id=a.subject.batch_id,e.syllabusForm.subject_id=a.subject_id,e.selected_batch=e.syllabusForm.batch_id?{id:a.subject.batch_id,name:a.subject.batch.course.name+" "+a.subject.batch.name}:null,e.selected_subject=a.subject_id?{id:a.subject_id,name:a.subject.name+" ("+a.subject.code+")"}:null,e.syllabusForm.upload_token=a.upload_token,a.syllabus_details.forEach((function(t){e.syllabusForm.details.push({title:t.title,description:t.description})})),a.syllabus_topics.forEach((function(t){e.syllabusForm.topics.push({title:t.title,start_date:t.start_date,end_date:t.end_date,description:t.description})})),e.module_id=a.id,t.hide()})).catch((function(s){t.hide(),helper.showErrorMsg(s),e.$router.push("/resource/syllabus")}))},update:function(){var e=this,t=this.$loading.show();this.syllabusForm.patch("/api/syllabus/"+this.uuid).then((function(s){toastr.success(s.message),t.hide(),e.$router.push("/resource/syllabus")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},onBatchSelect:function(e){this.syllabusForm.batch_id=e.id},onSubjectSelect:function(e){this.syllabusForm.subject_id=e.id}},watch:{"syllabusForm.batch_id":function(e){e&&this.getSubjects()}}};var l=s(93379),n=s.n(l),r=s(30534),o={insert:"head",singleton:!1};n()(r.Z,o);r.Z.locals;const i=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.syllabusForm.errors.clear(t.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-3"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.batch"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name","group-values":"batches","group-label":"course_group","group-select":!1,name:"batch_id",id:"batch_id",options:e.batches,placeholder:e.trans("academic.select_batch")},on:{select:e.onBatchSelect,close:function(t){return e.syllabusForm.errors.clear("batch_id")},remove:function(t){e.syllabusForm.batch_id=""}},model:{value:e.selected_batch,callback:function(t){e.selected_batch=t},expression:"selected_batch"}},[e.batches.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":"batch_id"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[e.syllabusForm.batch_id?s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("academic.subject"))+" ")]),e._v(" "),s("v-select",{attrs:{label:"name",name:"subject_id",id:"subject_id",options:e.subjects,placeholder:e.trans("resource.select_subject")},on:{select:e.onSubjectSelect,close:function(t){return e.syllabusForm.errors.clear("subject_id")},remove:function(t){e.syllabusForm.subject_id=""}},model:{value:e.selected_subject,callback:function(t){e.selected_subject=t},expression:"selected_subject"}},[e.subjects.length?e._e():s("div",{staticClass:"multiselect__option",attrs:{slot:"afterList"},slot:"afterList"},[e._v("\n                            "+e._s(e.trans("general.no_option_found"))+"\n                        ")])]),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":"subject_id"}})],1):e._e()]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_title")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.syllabusForm.title,expression:"syllabusForm.title"}],staticClass:"form-control",attrs:{type:"text",name:"title",placeholder:e.trans("resource.syllabus_title")},domProps:{value:e.syllabusForm.title},on:{input:function(t){t.target.composing||e.$set(e.syllabusForm,"title",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":"title"}})],1)]),e._v(" "),s("div",{staticClass:"col-12"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_description")))]),e._v(" "),s("autosize-textarea",{attrs:{rows:"2",name:"description",placeholder:e.trans("resource.syllabus_description")},model:{value:e.syllabusForm.description,callback:function(t){e.$set(e.syllabusForm,"description",t)},expression:"syllabusForm.description"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":"description"}})],1)])]),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("resource.syllabus_detail")))]),e._v(" "),e._l(e.syllabusForm.details,(function(t,a){return[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_detail_title"))+" \n                        "),s("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDeleteDetail(a)},expression:"{ok: confirmDeleteDetail(index)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.delete"),expression:"trans('general.delete')"}],key:a+"_delete_detail",staticClass:"btn btn-xs btn-danger m-l-20",attrs:{type:"button"}},[s("i",{staticClass:"fas fa-times"})])]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"detail.title"}],staticClass:"form-control",attrs:{type:"text",name:e.getDetailTitleName(a),placeholder:e.trans("resource.syllabus_detail_title")},domProps:{value:t.title},on:{input:function(s){s.target.composing||e.$set(t,"title",s.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getDetailTitleName(a)}})],1),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_detail_description")))]),e._v(" "),s("autosize-textarea",{attrs:{rows:"2",name:e.getDetailDescriptionName(a),placeholder:e.trans("resource.syllabus_detail_description")},model:{value:t.description,callback:function(s){e.$set(t,"description",s)},expression:"detail.description"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getDetailDescriptionName(a)}})],1)]})),e._v(" "),s("div",{staticClass:"form-group"},[s("button",{staticClass:"btn btn-info btn-sm waves-effect waves-light",attrs:{type:"button"},on:{click:e.addDetailRow}},[e._v(e._s(e.trans("resource.syllabus_add_new_detail")))])])],2),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("h4",{staticClass:"card-title"},[e._v(e._s(e.trans("resource.syllabus_topic")))]),e._v(" "),e._l(e.syllabusForm.topics,(function(t,a){return[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_topic_title"))+" \n                            "),s("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDeleteTopic(a)},expression:"{ok: confirmDeleteTopic(index)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.delete"),expression:"trans('general.delete')"}],key:a+"_delete_topic",staticClass:"btn btn-xs btn-danger m-l-20",attrs:{type:"button"}},[s("i",{staticClass:"fas fa-times"})])]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"topic.title"}],staticClass:"form-control",attrs:{type:"text",name:e.getTopicTitleName(a),placeholder:e.trans("resource.syllabus_topic_title")},domProps:{value:t.title},on:{input:function(s){s.target.composing||e.$set(t,"title",s.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getTopicTitleName(a)}})],1),e._v(" "),s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_topic_start_date")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.syllabus_start_date")},on:{selected:function(t){e.syllabusForm.errors.clear(e.getTopicStartDateName(a))}},model:{value:t.start_date,callback:function(s){e.$set(t,"start_date",s)},expression:"topic.start_date"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getTopicStartDateName(a)}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_topic_end_date")))]),e._v(" "),s("datepicker",{attrs:{bootstrapStyling:!0,placeholder:e.trans("resource.syllabus_end_date")},on:{selected:function(t){e.syllabusForm.errors.clear(e.getTopicEndDateName(a))}},model:{value:t.end_date,callback:function(s){e.$set(t,"end_date",s)},expression:"topic.end_date"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getTopicEndDateName(a)}})],1)])]),e._v(" "),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("resource.syllabus_topic_description")))]),e._v(" "),s("autosize-textarea",{attrs:{rows:"2",name:e.getTopicDescriptionName(a),placeholder:e.trans("resource.syllabus_topic_description")},model:{value:t.description,callback:function(s){e.$set(t,"description",s)},expression:"topic.description"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.syllabusForm,"prop-name":e.getTopicDescriptionName(a)}})],1)]})),e._v(" "),s("div",{staticClass:"form-group"},[s("button",{staticClass:"btn btn-info btn-sm waves-effect waves-light",attrs:{type:"button"},on:{click:e.addTopicRow}},[e._v(e._s(e.trans("resource.syllabus_add_new_topic")))])])],2),e._v(" "),s("div",{staticClass:"col-12"},[s("div",{staticClass:"form-group"},[s("file-upload-input",{attrs:{"button-text":e.trans("general.upload_document"),token:e.syllabusForm.upload_token,module:"syllabus","clear-file":e.clearAttachment,"module-id":e.module_id}})],1)])]),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("router-link",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/resource/syllabus"}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e.uuid?s("span",[e._v(e._s(e.trans("general.update")))]):s("span",[e._v(e._s(e.trans("general.save")))])])],1)])])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=8c5cfefa3343b6ab2cae