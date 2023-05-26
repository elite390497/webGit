(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[1987],{80246:(t,s,o)=>{"use strict";o.r(s),o.d(s,{default:()=>r});const e={components:{bookPublisherForm:o(64241).Z},data:function(){return{id:this.$route.params.id}},mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/dashboard"))}};const r=(0,o(51900).Z)(e,(function(){var t=this,s=t.$createElement,o=t._self._c||s;return o("div",[o("div",{staticClass:"page-titles"},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("library.edit_book_publisher")))])]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"action-buttons pull-right"},[o("button",{staticClass:"btn btn-info btn-sm",on:{click:function(s){return t.$router.push("/configuration/library/book/publisher")}}},[o("i",{staticClass:"fas fa-list"}),t._v(" "),o("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("library.book_publisher")))])])])])])]),t._v(" "),o("div",{staticClass:"container-fluid"},[o("div",{staticClass:"card card-form"},[o("div",{staticClass:"card-body p-t-20"},[o("book-publisher-form",{attrs:{id:t.id}})],1)])])])}),[],!1,null,null,null).exports},64241:(t,s,o)=>{"use strict";o.d(s,{Z:()=>r});const e={data:function(){return{bookPublisherForm:new Form({name:"",description:""})}},props:["id"],mounted:function(){this.id&&this.get()},methods:{proceed:function(){this.id?this.update():this.store()},store:function(){var t=this,s=this.$loading.show();this.bookPublisherForm.post("/api/library/book/publisher").then((function(o){toastr.success(o.message),t.$emit("completed"),s.hide()})).catch((function(t){s.hide(),helper.showErrorMsg(t)}))},get:function(){var t=this,s=this.$loading.show();axios.get("/api/library/book/publisher/"+this.id).then((function(o){t.bookPublisherForm.name=o.name,t.bookPublisherForm.description=o.description,s.hide()})).catch((function(o){s.hide(),helper.showErrorMsg(o),t.$router.push("/configuration/library/book/publisher")}))},update:function(){var t=this,s=this.$loading.show();this.bookPublisherForm.patch("/api/library/book/publisher/"+this.id).then((function(o){toastr.success(o.message),s.hide(),t.$router.push("/configuration/library/book/publisher")})).catch((function(t){s.hide(),helper.showErrorMsg(t)}))}}};const r=(0,o(51900).Z)(e,(function(){var t=this,s=t.$createElement,o=t._self._c||s;return o("form",{on:{submit:function(s){return s.preventDefault(),t.proceed.apply(null,arguments)},keydown:function(s){return t.bookPublisherForm.errors.clear(s.target.name)}}},[o("div",{staticClass:"row"},[o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("library.book_publisher_name")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.bookPublisherForm.name,expression:"bookPublisherForm.name"}],staticClass:"form-control",attrs:{type:"text",name:"name",placeholder:t.trans("library.book_publisher_name")},domProps:{value:t.bookPublisherForm.name},on:{input:function(s){s.target.composing||t.$set(t.bookPublisherForm,"name",s.target.value)}}}),t._v(" "),o("show-error",{attrs:{"form-name":t.bookPublisherForm,"prop-name":"name"}})],1)]),t._v(" "),o("div",{staticClass:"col-12 col-sm-6"},[o("div",{staticClass:"form-group"},[o("label",{attrs:{for:""}},[t._v(t._s(t.trans("library.book_publisher_description")))]),t._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.bookPublisherForm.description,expression:"bookPublisherForm.description"}],staticClass:"form-control",attrs:{type:"text",name:"description",placeholder:t.trans("library.book_publisher_description")},domProps:{value:t.bookPublisherForm.description},on:{input:function(s){s.target.composing||t.$set(t.bookPublisherForm,"description",s.target.value)}}}),t._v(" "),o("show-error",{attrs:{"form-name":t.bookPublisherForm,"prop-name":"description"}})],1)])]),t._v(" "),o("div",{staticClass:"card-footer text-right"},[o("router-link",{directives:[{name:"show",rawName:"v-show",value:t.id,expression:"id"}],staticClass:"btn btn-danger waves-effect waves-light ",attrs:{to:"/configuration/library/book/publisher"}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),t.id?t._e():o("button",{staticClass:"btn btn-danger waves-effect waves-light ",attrs:{type:"button"},on:{click:function(s){return t.$emit("cancel")}}},[t._v(t._s(t.trans("general.cancel")))]),t._v(" "),o("button",{staticClass:"btn btn-info waves-effect waves-light",attrs:{type:"submit"}},[t.id?o("span",[t._v(t._s(t.trans("general.update")))]):o("span",[t._v(t._s(t.trans("general.save")))])])],1)])}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=edit.js.map?id=3ef7a59da90d14f46cbe