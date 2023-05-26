@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('resource.lesson_plan').' '.trans('general.total_result_count',['count' => count($lesson_plans)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.subject')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('resource.lesson_plan_topic')}}</th>
                <th>{{trans('resource.lesson_plan_start_date')}}</th>
                <th>{{trans('resource.lesson_plan_end_date')}}</th>
                <th>{{trans('resource.lesson_plan_created_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($lesson_plans as $lesson_plan)
        		<tr>
                    <td>{{$lesson_plan->subject->name_with_code}}</td>
                    <td>{{$lesson_plan->subject->batch->batch_with_course}}</td>
                    <td>{{$lesson_plan->topic}}</td>
        			<td>{{showDate($lesson_plan->start_date)}}</td>
                    <td>{{showDate($lesson_plan->end_date)}}</td>
                    <td>{{$lesson_plan->employee->name}} <br /> {{getEmployeeDesignationName($lesson_plan->employee, $lesson_plan->start_date)}}</td>
                    <td>{{showDateTime($lesson_plan->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')