@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('resource.assignment').' '.trans('general.total_result_count',['count' => count($assignments)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.subject')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('resource.assignment_title')}}</th>
                <th>{{trans('resource.date_of_assignment')}}</th>
                <th>{{trans('resource.due_date_of_assignment')}}</th>
                <th>{{trans('resource.assignment_posted_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($assignments as $assignment)
        		<tr>
                    <td>{{$assignment->subject->name_with_code}}</td>
                    <td>{{$assignment->subject->batch->batch_with_course}}</td>
                    <td>{{$assignment->title}}</td>
        			<td>{{showDate($assignment->date_of_assignment)}}</td>
                    <td>{{showDate($assignment->due_date)}}</td>
                    <td>{{$assignment->employee->name}} <br /> {{getEmployeeDesignationName($assignment->employee, $assignment->date_of_assignment)}}</td>
                    <td>{{showDateTime($assignment->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')