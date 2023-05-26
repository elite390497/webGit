@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.course').' '.trans('general.total_result_count',['count' => count($courses)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.course_name')}}</th>
                <th>{{trans('academic.course_group')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('student.attendance_type')}}</th>
                <th>{{trans('general.option')}}</th>
                <th>{{trans('academic.course_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($courses as $course)
        		<tr>
        			<td>{{$course->name}}</td>
                    <td>{{$course->CourseGroup->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($course->batches as $batch)
                                <li>{{$batch->name}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>
                        @if($course->options)
                            {{trans('student.'.$course->getOption('attendance_type'))}}
                        @else
                            {{trans('student.'.config('default_attendance_type'))}}
                        @endif
                    </td>
        			<td>
                        @if($course->options)
                            @if($course->getOption('enable_registration'))
                                {{trans('student.registration_enabled')}}
                            @endif

                            @if($course->getOption('enable_registration_fee'))
                                <br />
                                {{trans('student.registration_fee_enabled')}} ({{currency($course->getOption('registration_fee'),1)}})
                            @endif
                        @else
                            @if(config('enable_registration'))
                                {{trans('student.registration_enabled')}}
                            @endif

                            @if(config('enable_registration_fee'))
                                <br />
                                {{trans('student.registration_fee_enabled')}} ({{currency($course->getOption('registration_fee'),1)}})
                            @endif
                        @endif
                    </td>
                    <td>{{$course->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')