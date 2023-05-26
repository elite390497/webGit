@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.visitor_log').' '.trans('general.total_result_count',['count' => count($visitor_logs)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.visiting_purpose')}}</th>
                <th>{{trans('reception.visitor_detail')}}</th>
                <th>{{trans('reception.visitor_count')}}</th>
                <th>{{trans('reception.date_of_visit')}}</th>
                <th>{{trans('reception.entry_time')}}</th>
                <th>{{trans('reception.exit_time')}}</th>
                <th>{{trans('reception.whom_to_meet')}}</th>
                <th>{{trans('reception.visitor_remarks')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($visitor_logs as $visitor_log)
        		<tr>
                    <td>{{$visitor_log->id}}</td>
                    <td>{{$visitor_log->VisitingPurpose->name}}</td>
                    <td>
                        @if($visitor_log->type == 'parent')
                            {{trans('reception.visitor_name').': '.$visitor_log->name}} <br />
                            {{trans('reception.relation_with_student').': '.$visitor_log->relation_with_student}} <br />

                            {{trans('student.name').': '.$visitor_log->Student->name}} <br />
                            {{trans('student.first_guardian_name').': '.$visitor_log->Student->Parent->first_guardian_name}} <br />
                            {{trans('student.mother_name').': '.$visitor_log->Student->Parent->mother_name}} <br />
                            {{trans('student.contact_number').': '.$visitor_log->Student->contact_number}} <br />
                        @else
                            {{trans('reception.visitor_name').': '.$visitor_log->name}} <br />
                            {{trans('reception.visitor_company_name').': '.$visitor_log->company_name}} <br />
                            {{trans('reception.visitor_contact_number').': '.$visitor_log->contact_number}} <br />
                            {{trans('reception.visitor_address').': '.$visitor_log->address}}
                        @endif
                    </td>
                    <td>{{$visitor_log->visitor_count}}</td>
                    <td>{{showDate($visitor_log->date_of_visit)}}</td>
                    <td>{{showTime($visitor_log->entry_time)}}</td>
                    <td>{{showTime($visitor_log->exit_time)}}</td>
        			<td>
                        @if($visitor_log->employee_id)         
                            {{$visitor_log->Employee->name}} <br />
                            {{getEmployeeDesignationName($visitor_log->Employee)}}
                        @endif
                    </td>
                    <td>{{$visitor_log->remarks}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')