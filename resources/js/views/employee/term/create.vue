<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('employee.add_new_term')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <term-form :uuid="employee.uuid" @completed="complete"></term-form>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import termForm from './form'

    export default {
        components: {termForm},
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