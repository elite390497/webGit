@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('communication.communication_history').' '.trans('general.total_result_count',['count' => count($communications)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('communication.type')}}</th>
                <th>{{trans('communication.title')}}</th>
                <th>{{trans('communication.audience')}}</th>
                <th>{{trans('communication.recipient_count')}}</th>
                <th>{{trans('communication.sent_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($communications as $communication)
        		<tr>
                    <td>{{trans('communication.'.$communication->type)}}</td>
                    <td>{{$communication->title}}</td>
                    <td>
                        @if($communication->audience == 'everyone') 
                            {{trans('calendar.communication_for_everyone')}}
                        @elseif($communication->audience == 'selected_course')
                            {{trans('academic.course')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($communication->courses as $course)
                                    <li>{{$course->name.' '.$course->CourseGroup->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($communication->audience == 'selected_batch')
                            {{trans('academic.batch')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($communication->batches as $batch)
                                    <li>{{$batch->Course->name.' '.$batch->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($communication->audience == 'selected_department')
                            {{trans('employee.department')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($communication->departments as $department)
                                    <li>{{$department->name}}</li>
                                @endforeach
                            </ul>
                        @elseif($communication->audience == 'selected_employee_category')
                            {{trans('employee.employee_category')}} <br />
                            <ul style="list-style:none;padding:0;margin:0;">
                                @foreach($communication->employeeCategories as $employee_category)
                                    <li>{{$employee_category->name}}</li>
                                @endforeach
                            </ul>
                        @endif
                    </td>
                    <td>{{$communication->recipient_count}}</td>
        			<td>{{$communication->User->Employee->name}} <br /> {{getEmployeeDesignationName($communication->User->Employee, $communication->start_date)}} </td>
                    <td>{{showDateTime($communication->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')