<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('employee.add_new_qualification')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <qualification-form :uuid="employee.uuid" @completed="complete"></qualification-form>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import qualificationForm from './form'

    export default {
        components: {qualificationForm},
        props: ['employee'],
        methods:{
            complete(){
                this.$emit('completed');
                this.$emit('close');
            }
        }
    }
</script>

<style>
    .loading-overlay{
        z-index: 1060;
    }
</style>