<template>
	<div class="row">
        <template v-for="field in customFieldForm.customFields">
    		<div :class="['col-12', getCustomFieldWidth(field)]">
    			<div class="form-group">
        			<label for="">{{field.name}}</label>
        			<template v-if="field.type == 'text_input'">
                    	<input class="form-control" type="text" v-model="field['value']" :name="getCustomFieldName(field)" :placeholder="field.name">
                    </template>
        			<template v-else-if="field.type == 'numeric_input'">
                    	<input class="form-control" type="text" v-model="field['value']" :name="getCustomFieldName(field)" :placeholder="field.name">
                    </template>
                    <template v-else-if="field.type == 'datepicker_input'">
                    	<datepicker v-model="field['value']" :bootstrapStyling="true" :placeholder="field.name" @selected="customFieldForm.errors.clear(getCustomFieldName(field))"></datepicker>
                    </template>
                    <template v-else-if="field.type == 'multi_line_input'">
                    	<autosize-textarea v-model="field['value']" rows="2" :name="getCustomFieldName(field)"  :placeholder="field.name"></autosize-textarea>
                    </template>
                    <template v-else-if="field.type == 'checkbox_input'">
                    	<label class="custom-control custom-checkbox m-t-20" v-for="value in field.values">
                            <input type="checkbox" class="custom-control-input" v-model="field['value']" :value="value" @click="customFieldForm.errors.clear(getCustomFieldName(field))">
                            <span class="custom-control-label">{{value}}</span>
                        </label>
                    </template>
                    <template v-else-if="field.type == 'radio_input'">
                    	<div class="radio radio-info p-l-0">
                            <div class="form-check form-check-inline " v-for="value in field.values">
                                <input class="form-check-input" type="radio" :value="value" :id="value" v-model="field['value']" :checked="field['value'] == value" :name="getCustomFieldName(field)" @click="customFieldForm.errors.clear(getCustomFieldName(field))">
                                <label class="form-check-label" :for="value"> {{value}}</label>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="field.type == 'dropdown_input'">
    					<select v-model="field['value']" class="custom-select col-12" :name="getCustomFieldName(field)" @click="customFieldForm.errors.clear(getCustomFieldName(field))">
    						<option value=null>{{trans('general.select_one')}}</option>
    						<option v-for="value in field.values" v-bind:value="value">
    							{{ value }}
    						</option>
    					</select>
                    </template>
                    <show-error :form-name="customFieldForm" :prop-name="getCustomFieldName(field)"></show-error>
                </div>
    		</div>
        </template>
	</div>
</template>

<script>
	export default {
		props: {
			fields: {
				type: Array,
                default: []
			},
            clear: {
                type: Boolean,
                default: false
            },
            formErrors: {
                type: Object,
                default: {}
            },
            customValues: {
                type: Array,
                default: []
            }
		},
		data() {
			return {
                customFieldForm: new Form({
                    customFields: []
                })
			}
		},
		mounted() {
		},
		methods: {
			getCustomFieldName(field)
			{
				return 'custom_field_'+field.id;
			},
            getCustomFieldWidth(field) {
                if (field.width == 'half') {
                    return 'col-sm-6';
                } else if (field.width == 'one_third') {
                    return 'col-sm-4';
                } else if (field.width == 'one_fourth') {
                    return 'col-sm-3';
                } else {
                    return;
                }
            }
		},
        watch: {
            fields(v) {
                this.customFieldForm.customFields = v.map(field => {
                    let customValue = this.customValues.find(o => o.id == field.id);

                    let value = field.type == 'checkbox_input' ? [] : null;
                    if (customValue !== undefined) {
                        value = field.type == 'checkbox_input' ? customValue.value.split(",") : customValue.value;
                    }

                    return { ...field, value: value }
                })
            },
            'customFieldForm.customFields': {
                deep: true,
                handler(val, oldVal) {
                    this.$emit('updateCustomValues', this.customFieldForm.customFields);
                }
            },
            formErrors(v) {
                this.customFieldForm.errors.errors = v;
            },
            clear(v) {
                if (v === false) {
                    return;
                }

                this.customFieldForm.customFields = [];
                this.customFieldForm.customFields = this.fields.map(field => {
                    let value = field.type == 'checkbox_input' ? [] : null;
                    return { ...field, value: value }
                })
            }
        }
	}
</script>