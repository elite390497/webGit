(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[4023],{232:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});const a={components:{pageForm:s(82401).Z},data:function(){return{uuid:this.$route.params.uuid}},mounted:function(){helper.frontendConfigurationAccessible()||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const o=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[e._v(e._s(e.trans("frontend.edit_page")))])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(t){return e.$router.push("/frontend/page")}}},[s("i",{staticClass:"fas fa-list"}),e._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[e._v(e._s(e.trans("frontend.page")))])])])])])]),e._v(" "),s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"card card-form"},[s("div",{staticClass:"card-body p-t-20"},[s("page-form",{attrs:{uuid:e.uuid}})],1)])])])}),[],!1,null,null,null).exports},82401:(e,t,s)=>{"use strict";s.d(t,{Z:()=>o});const a={components:{},data:function(){return{pageForm:new Form({title:"",is_draft:0,show_blocks:0,show_latest_articles:0,body:"",has_slider:0,sliders:[],upload_token:""}),module_id:"",clearAttachment:!0}},props:["uuid"],mounted:function(){helper.frontendConfigurationAccessible()||(helper.notAccessibleMsg(),this.$router.push("/dashboard")),this.uuid?this.get():this.pageForm.upload_token=this.$uuid.v4()},methods:{hasPermission:function(e){return helper.hasPermission(e)},proceed:function(){this.uuid?this.update():this.store()},store:function(){var e=this,t=this.$loading.show();this.pageForm.post("/api/frontend/page").then((function(s){toastr.success(s.message),e.clearAttachment=!e.clearAttachment,e.pageForm.upload_token=e.$uuid.v4(),e.$emit("completed"),t.hide()})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},get:function(){var e=this,t=this.$loading.show();axios.get("/api/frontend/page/"+this.uuid).then((function(s){e.pageForm.title=s.page.title,e.pageForm.body=s.page.body,e.pageForm.is_draft=s.page.is_draft,e.pageForm.show_blocks=s.page.options.show_blocks,e.pageForm.show_latest_articles=s.page.options.show_latest_articles,e.pageForm.has_slider=s.page.options.has_slider,e.pageForm.has_slider&&(e.pageForm.sliders=[],s.page.options.sliders.forEach((function(t){e.pageForm.sliders.push({image:t.image,title:t.title,description:t.description})}))),e.pageForm.upload_token=s.page.upload_token,e.module_id=s.page.id,t.hide()})).catch((function(s){t.hide(),helper.showErrorMsg(s),e.$router.push("/frontend/page")}))},update:function(){var e=this,t=this.$loading.show();this.pageForm.patch("/api/frontend/page/"+this.uuid).then((function(s){toastr.success(s.message),t.hide(),e.$router.push("/frontend/page")})).catch((function(e){t.hide(),helper.showErrorMsg(e)}))},getSliderDescription:function(e){return"slider_description_"+e},getSliderTitle:function(e){return"slider_title_"+e},getSliderId:function(e){return"slider_id_"+e},addNewSliderImage:function(){this.pageForm.sliders.push({image:"",title:"",description:""})},confirmDelete:function(e){var t=this;return function(s){return t.deleteSliderImage(e)}},deleteSliderImage:function(e){this.pageForm.sliders.splice(e,1)},updateImage:function(){}}};const o=(0,s(51900).Z)(a,(function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("form",{on:{submit:function(t){return t.preventDefault(),e.proceed.apply(null,arguments)},keydown:function(t){return e.pageForm.errors.clear(t.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:""}},[e._v(e._s(e.trans("frontend.page_title")))]),e._v(" "),s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageForm.title,expression:"pageForm.title"}],staticClass:"form-control",attrs:{type:"text",name:"title",placeholder:e.trans("frontend.page_title")},domProps:{value:e.pageForm.title},on:{input:function(t){t.target.composing||e.$set(e.pageForm,"title",t.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.pageForm,"prop-name":"title"}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-3"},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageForm.is_draft,expression:"pageForm.is_draft"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1"},domProps:{checked:Array.isArray(e.pageForm.is_draft)?e._i(e.pageForm.is_draft,"1")>-1:e.pageForm.is_draft},on:{change:function(t){var s=e.pageForm.is_draft,a=t.target,o=!!a.checked;if(Array.isArray(s)){var r=e._i(s,"1");a.checked?r<0&&e.$set(e.pageForm,"is_draft",s.concat(["1"])):r>-1&&e.$set(e.pageForm,"is_draft",s.slice(0,r).concat(s.slice(r+1)))}else e.$set(e.pageForm,"is_draft",o)}}}),e._v(" "),s("span",{staticClass:"custom-control-label"},[e._v(e._s(e.trans("frontend.page_is_draft")))])])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageForm.has_slider,expression:"pageForm.has_slider"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1"},domProps:{checked:Array.isArray(e.pageForm.has_slider)?e._i(e.pageForm.has_slider,"1")>-1:e.pageForm.has_slider},on:{change:function(t){var s=e.pageForm.has_slider,a=t.target,o=!!a.checked;if(Array.isArray(s)){var r=e._i(s,"1");a.checked?r<0&&e.$set(e.pageForm,"has_slider",s.concat(["1"])):r>-1&&e.$set(e.pageForm,"has_slider",s.slice(0,r).concat(s.slice(r+1)))}else e.$set(e.pageForm,"has_slider",o)}}}),e._v(" "),s("span",{staticClass:"custom-control-label"},[e._v(e._s(e.trans("frontend.page_has_slider")))])])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageForm.show_blocks,expression:"pageForm.show_blocks"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1"},domProps:{checked:Array.isArray(e.pageForm.show_blocks)?e._i(e.pageForm.show_blocks,"1")>-1:e.pageForm.show_blocks},on:{change:function(t){var s=e.pageForm.show_blocks,a=t.target,o=!!a.checked;if(Array.isArray(s)){var r=e._i(s,"1");a.checked?r<0&&e.$set(e.pageForm,"show_blocks",s.concat(["1"])):r>-1&&e.$set(e.pageForm,"show_blocks",s.slice(0,r).concat(s.slice(r+1)))}else e.$set(e.pageForm,"show_blocks",o)}}}),e._v(" "),s("span",{staticClass:"custom-control-label"},[e._v(e._s(e.trans("frontend.show_blocks")))])])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.pageForm.show_latest_articles,expression:"pageForm.show_latest_articles"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1"},domProps:{checked:Array.isArray(e.pageForm.show_latest_articles)?e._i(e.pageForm.show_latest_articles,"1")>-1:e.pageForm.show_latest_articles},on:{change:function(t){var s=e.pageForm.show_latest_articles,a=t.target,o=!!a.checked;if(Array.isArray(s)){var r=e._i(s,"1");a.checked?r<0&&e.$set(e.pageForm,"show_latest_articles",s.concat(["1"])):r>-1&&e.$set(e.pageForm,"show_latest_articles",s.slice(0,r).concat(s.slice(r+1)))}else e.$set(e.pageForm,"show_latest_articles",o)}}}),e._v(" "),s("span",{staticClass:"custom-control-label"},[e._v(e._s(e.trans("frontend.show_latest_articles")))])])])])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"form-group"},[s("file-upload-input",{attrs:{"button-text":e.trans("general.attachment"),token:e.pageForm.upload_token,module:"frontend-page","clear-file":e.clearAttachment,"module-id":e.module_id}})],1)]),e._v(" "),s("div",{staticClass:"col-12"},[s("div",{staticClass:"form-group"},[s("html-editor",{attrs:{name:"body",model:e.pageForm.body,height:"300",isUpdate:!!e.uuid},on:{"update:model":function(t){return e.$set(e.pageForm,"body",t)},clearErrors:function(t){return e.pageForm.errors.clear("body")}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.pageForm,"prop-name":"body"}})],1)])]),e._v(" "),e._l(e.pageForm.sliders,(function(t,a){return e.pageForm.has_slider?s("div",{key:a,staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-1"},[s("button",{directives:[{name:"confirm",rawName:"v-confirm",value:{ok:e.confirmDelete(a)},expression:"{ok: confirmDelete(index)}"},{name:"tooltip",rawName:"v-tooltip",value:e.trans("general.delete"),expression:"trans('general.delete')"}],key:a,staticClass:"btn btn-danger btn-sm",attrs:{type:"button"}},[s("i",{staticClass:"fas fa-trash"})])]),e._v(" "),s("div",{staticClass:"col-12 col-sm-4"},[s("div",{staticClass:"form-group"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.title,expression:"slider.title"}],staticClass:"form-control",attrs:{type:"text",name:e.getSliderTitle(a),placeholder:e.trans("frontend.slider_image_title")},domProps:{value:t.title},on:{input:function(s){s.target.composing||e.$set(t,"title",s.target.value)}}}),e._v(" "),s("show-error",{attrs:{"form-name":e.pageForm,"prop-name":e.getSliderTitle(a)}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-4"},[s("div",{staticClass:"form-group"},[s("autosize-textarea",{attrs:{rows:"2",name:"getSliderDescription(index)",placeholder:e.trans("frontend.slider_image_description")},model:{value:t.description,callback:function(s){e.$set(t,"description",s)},expression:"slider.description"}}),e._v(" "),s("show-error",{attrs:{"form-name":e.pageForm,"prop-name":e.getSliderDescription(a)}})],1)]),e._v(" "),s("div",{staticClass:"col-12 col-sm-3"},[s("upload-image",{attrs:{id:e.getSliderId(a),"button-text":e.trans("frontend.choose_slider_image"),"upload-path":"/frontend/page/slider/image","remove-path":"/frontend/page/slider/image","image-source":t.image},on:{uploaded:function(e){t.image=e},removed:function(e){t.image=""}}})],1)]):e._e()})),e._v(" "),e.pageForm.has_slider?s("button",{staticClass:"btn btn-info btn-sm mx-4 m-b-20",attrs:{type:"button"},on:{click:e.addNewSliderImage}},[e._v(e._s(e.trans("frontend.add_new_slider_image")))]):e._e(),e._v(" "),s("div",{staticClass:"card-footer text-right"},[s("router-link",{directives:[{name:"show",rawName:"v-show",value:e.uuid,expression:"uuid"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/frontend/page"}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),e.uuid?e._e():s("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(t){return e.$emit("cancel")}}},[e._v(e._s(e.trans("general.cancel")))]),e._v(" "),s("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[e.uuid?s("span",[e._v(e._s(e.trans("general.update")))]):s("span",[e._v(e._s(e.trans("general.save")))])])],1)],2)])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=68caa4329185e0361664