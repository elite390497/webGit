<template>
    <div>
        <template v-if="meeting.audience == 'selected_course'">
            {{trans('academic.course')}} <br />
            <ul style="list-style:none;padding:0;margin:0;">
                <li v-for="course in meeting.courses">{{course.name+'('+course.course_group.name+')'}}</li>
            </ul>
        </template>
        <template v-else-if="meeting.audience == 'selected_batch'">
            {{trans('academic.batch')}} <br />
            <ul style="list-style:none;padding:0;margin:0;">
                <li v-for="batch in meeting.batches">{{batch.name+'('+batch.course.name+')'}}</li>
            </ul>
        </template>
        <template v-else-if="meeting.audience == 'selected_department'">
            {{trans('employee.department')}} <br />
            <ul style="list-style:none;padding:0;margin:0;">
                <li v-for="department in meeting.departments">{{department.name}}</li>
            </ul>
        </template>
        <template v-else-if="meeting.audience == 'selected_employee_category'">
            {{trans('employee.category')}} <br />
            <ul style="list-style:none;padding:0;margin:0;">
                <li v-for="employee_category in meeting.employee_categorys">{{employee_category.name}}</li>
            </ul>
        </template>
        <template v-if="meeting.options.individual_students && meeting.options.individual_students.length">
            <ul style="list-style:none;padding:0;margin:0;">
                <li>{{trans('communication.count_individual_students', {attribute: meeting.options.individual_students.length})}}</li>
            </ul>
        </template>
        <template v-if="meeting.options.individual_employees && meeting.options.individual_employees.length">
            <ul style="list-style:none;padding:0;margin:0;">
                <li>{{trans('communication.count_individual_employees', {attribute: meeting.options.individual_employees.length})}}</li>
            </ul>
        </template>
    </div>
</template>

<script>
export default {
    props: ['meeting']
}
</script>

<style>

</style>