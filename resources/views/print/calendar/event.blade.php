@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('calendar.event').' '.trans('general.total_result_count',['count' => count($events)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('calendar.event_type')}}</th>
                <th>{{trans('calendar.event_title')}}</th>
                <th>{{trans('calendar.event_venue')}}</th>
                <th>{{trans('calendar.event_duration')}}</th>
                <th>{{trans('calendar.event_audience')}}</th>
                <th>{{trans('calendar.event_posted_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($events as $event)
        		<tr>
                    <td>{{$event->eventType->name}}</td>
                    <td>{{$event->title}}</td>
                    <td>{{$event->venue}}</td>
                    <td>
                        {{showDate($event->start_date)}} @if($event->start_time) {{showTime($event->start_time)}} @endif <br /> {{trans('general.to')}} <br />
                        {{showDate($event->end_date)}} @if($event->end_time) {{showTime($event->end_time)}} @endif
                    </td>
                    <td>
                        @if($event->audience == 'everyone') 
                            {{trans('calendar.event_for_everyone')}}
                        @elseif($event->audience == 'selected_course')
                            {{trans('academic.course')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($event->courses as $course)
                                    <li>{{$course->name.' '.$course->CourseGroup->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($event->audience == 'selected_batch')
                            {{trans('academic.batch')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($event->batches as $batch)
                                    <li>{{$batch->Course->name.' '.$batch->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($event->audience == 'selected_department')
                            {{trans('employee.department')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($event->departments as $department)
                                    <li>{{$department->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($event->audience == 'selected_employee_category')
                            {{trans('employee.employee_category')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($event->employeeCategories as $employee_category)
                                    <li>{{$employee_category->name}}</li>
                                @endforeach
                            </ul>
                        @endif
                    </td>
        			<td>{{$event->User->Employee->name}} <br /> {{getEmployeeDesignationName($event->User->Employee, $event->start_date)}} </td>
                    <td>{{showDateTime($event->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')