@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.student_group').' '.trans('general.total_result_count',['count' => count($student_groups)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('student.student_group_name')}}</th>
                <th>{{trans('student.student_group_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($student_groups as $student_group)
        		<tr>
        			<td>{{$student_group->name}}</td>
                    <td>{{$student_group->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')