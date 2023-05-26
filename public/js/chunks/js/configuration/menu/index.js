(self.webpackChunkInstiKit=self.webpackChunkInstiKit||[]).push([[3917],{41819:(t,i,s)=>{"use strict";s.d(i,{Z:()=>n});const e={props:{setupWizard:{default:!1},configurations:{required:!1}},components:{},data:function(){return{configForm:new Form({config_type:"menu",modules:[]},!1),menus:[],help_topic:""}},mounted:function(){helper.hasPermission("access-configuration")||(helper.notAccessibleMsg(),this.$router.push("/home")),this.getPreRequisite()},methods:{getPreRequisite:function(){var t=this,i=this.$loading.show();axios.get("/api/configuration/variable?type=menu").then((function(s){t.configForm.modules=s.modules,t.menus=s.menus,t.configForm.modules.forEach((function(t){s.menus.findIndex((function(i){return i===t.menu.name}))>=0?t.menu.visibility=!0:t.menu.visibility=!1,t.menu.submenu.forEach((function(t){s.menus.findIndex((function(i){return i===t.name}))>=0?t.visibility=!0:t.visibility=!1}))})),i.hide()})).catch((function(t){i.hide(),helper.showErrorMsg(t)}))},getMenuName:function(t){return"show_"+t+"_menu"},updateSubMenu:function(t){t.visibility?t.submenu.forEach((function(t){t.visibility=!0})):t.submenu.forEach((function(t){t.visibility=!1}))},submit:function(){var t=this,i=this.$loading.show();return this.configForm.post("/api/configuration").then((function(s){return i.hide(),t.$store.dispatch("setConfig",{loaded:!1}),toastr.success(s.message),!0})).catch((function(t){return i.hide(),helper.showErrorMsg(t),!1}))}}};const n=(0,s(51900).Z)(e,(function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",{staticClass:"row"},[s("div",{staticClass:"col-12"},[s("div",{staticClass:"card"},[s("div",{staticClass:"card-body p-4"},[s("form",{on:{submit:function(i){return i.preventDefault(),t.submit.apply(null,arguments)},keydown:function(i){return t.configForm.errors.clear(i.target.name)}}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 offset-md-1"},[t._l(t.configForm.modules,(function(i){return[s("h4",{staticClass:"card-title"},[t._v(t._s(t.trans(i.translation)))]),t._v(" "),s("div",{staticClass:"form-group"},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:i.menu.visibility,expression:"module.menu.visibility"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1",name:t.getMenuName(i.menu.name)},domProps:{checked:Array.isArray(i.menu.visibility)?t._i(i.menu.visibility,"1")>-1:i.menu.visibility},on:{change:[function(s){var e=i.menu.visibility,n=s.target,o=!!n.checked;if(Array.isArray(e)){var a=t._i(e,"1");n.checked?a<0&&t.$set(i.menu,"visibility",e.concat(["1"])):a>-1&&t.$set(i.menu,"visibility",e.slice(0,a).concat(e.slice(a+1)))}else t.$set(i.menu,"visibility",o)},function(s){return t.updateSubMenu(i.menu)}]}}),t._v(" "),s("span",{staticClass:"custom-control-label"},[t._v(t._s(t.trans(i.menu.translation)))])])]),t._v(" "),t._l(i.menu.submenu,(function(e){return s("div",{directives:[{name:"show",rawName:"v-show",value:i.menu.visibility,expression:"module.menu.visibility"}],staticClass:"form-group",staticStyle:{"padding-left":"40px"}},[s("label",{staticClass:"custom-control custom-checkbox"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.visibility,expression:"submenu.visibility"}],staticClass:"custom-control-input",attrs:{type:"checkbox",value:"1",name:t.getMenuName(e.name)},domProps:{checked:Array.isArray(e.visibility)?t._i(e.visibility,"1")>-1:e.visibility},on:{change:function(i){var s=e.visibility,n=i.target,o=!!n.checked;if(Array.isArray(s)){var a=t._i(s,"1");n.checked?a<0&&t.$set(e,"visibility",s.concat(["1"])):a>-1&&t.$set(e,"visibility",s.slice(0,a).concat(s.slice(a+1)))}else t.$set(e,"visibility",o)}}}),t._v(" "),s("span",{staticClass:"custom-control-label"},[t._v(t._s(t.trans(e.translation)))])])])}))]}))],2)]),t._v(" "),t.setupWizard?t._e():s("button",{staticClass:"btn btn-info waves-effect waves-light pull-right m-t-10",attrs:{type:"submit"}},[t._v(t._s(t.trans("general.save")))])])])])])])}),[],!1,null,null,null).exports},98502:(t,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>n});const e={components:{menuForm:s(41819).Z},data:function(){return{help_topic:""}}};const n=(0,s(51900).Z)(e,(function(){var t=this,i=t.$createElement,s=t._self._c||i;return s("div",[s("div",{staticClass:"page-titles"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-12 col-sm-6"},[s("h3",{staticClass:"text-themecolor"},[t._v(t._s(t.trans("configuration.menu_configuration")))])]),t._v(" "),s("div",{staticClass:"col-12 col-sm-6"},[s("div",{staticClass:"action-buttons pull-right"},[s("button",{staticClass:"btn btn-info btn-sm",on:{click:function(i){return t.$router.push("/dashboard")}}},[s("i",{staticClass:"fas fa-home"}),t._v(" "),s("span",{staticClass:"d-none d-sm-inline"},[t._v(t._s(t.trans("general.home")))])]),t._v(" "),s("help-button",{on:{clicked:function(i){t.help_topic="configuration.menu"}}})],1)])])]),t._v(" "),s("div",{staticClass:"container-fluid"},[s("menu-form")],1),t._v(" "),s("right-panel",{attrs:{topic:t.help_topic}})],1)}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=index.js.map?id=31f105ce50c61207f073