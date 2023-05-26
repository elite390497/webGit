<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-lg">
                    <div class="modal-header">
                        <slot name="header">
                            {{trans('student.add_new_account')}}
                            <span class="float-right pointer" @click="$emit('close')">x</span>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            <account-form :uuid="student.uuid" @completed="complete"></account-form>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import accountForm from './form'

    export default {
        components: {accountForm},
        props: ['student'],
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