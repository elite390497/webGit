@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.course_group').' '.trans('general.total_result_count',['count' => count($course_groups)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.course_group_name')}}</th>
                <th>{{trans('academic.course')}}</th>
                <th>{{trans('academic.course_group_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($course_groups as $course_group)
        		<tr>
        			<td>{{$course_group->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($course_group->Courses as $course)
                                <li>{{$course->name}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$course_group->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')