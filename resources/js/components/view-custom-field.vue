<template>
	<div class="row">
        <template v-for="field in customFields">
    		<div :class="['col-12', getCustomFieldWidth(field)]">
                <view-label :label="field.name" :value="field['value']" :type="field.type == 'datepicker_input' ? 'date' : 'string'" />
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
            customValues: {
                type: Array,
                default: []
            }
		},
		data() {
			return {
                customFields: []
			}
		},
		mounted() {
		},
		methods: {
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
                this.customFields = v.map(field => {
                    let customValue = this.customValues.find(o => o.id == field.id);

                    let value = field.type == 'checkbox_input' ? [] : null;
                    if (customValue !== undefined) {
                        value = customValue.value;
                    }

                    return { ...field, value: value }
                })
            }
        }
	}
</script>