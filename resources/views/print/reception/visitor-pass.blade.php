@include('print.print-layout.header')
    <h2 style="text-align: center;">{{trans('reception.visitor_pass')}}</h2>
	<table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>{{'#'.$visitor_log->id}}</td><td style="text-align: right;">{{trans('general.date').': '.showDate($visitor_log->date_of_visit).' '.showTime($visitor_log->entry_time)}}</td></tr></table>
	<table class="fancy-detail">
	    <tbody>
	        <tr>
	            <td valign="top"><strong>{{trans('reception.visiting_purpose')}}</strong></td>
	            <td valign="top">{{$visitor_log->visitingPurpose->name}}</td>
	            <td valign="top"><strong>{{trans('reception.visitor_detail')}}</strong></td>
	            <td valign="top">
	            	@if($visitor_log->type == 'parent')
	            		@if($visitor_log->name)
	                    	{{trans('reception.visitor_name').': '.$visitor_log->name}} <br />
	                    @endif
	                    @if($visitor_log->relation_with_student)
							{{trans('reception.relation_with_student').': '.$visitor_log->relation_with_student}} <br />
	                    @endif
	                    {{trans('student.name').': '.$visitor_log->student->name}} <br />
	                    {{trans('student.father_name').': '.$visitor_log->student->parent->father_name}} <br />
	                    {{trans('student.mother_name').': '.$visitor_log->student->parent->mother_name}} <br />
	                    {{trans('student.contact_number').': '.$visitor_log->student->contact_number}} <br />
	                @else
	                    {{trans('reception.visitor_name').': '.$visitor_log->name}} <br />
	                    {{trans('reception.visitor_company_name').': '.$visitor_log->company_name}} <br />
	                    {{trans('reception.visitor_contact_number').': '.$visitor_log->contact_number}} <br />
	                    {{trans('reception.visitor_address').': '.$visitor_log->address}}
	                @endif
	            </td>
	        </tr>
	        <tr>
	            <td><strong>{{trans('reception.visitor_count')}}</strong></td>
	            <td>{{$visitor_log->visitor_count}}</td>
	            <td><strong>{{trans('reception.whom_to_meet')}}</strong></td>
	            <td>
	            	@if($visitor_log->employee_id)
						{{$visitor_log->employee->name}} <br />
                        {{getEmployeeDesignationName($visitor_log->employee)}}
					@else
						-
	            	@endif
	            </td>
	        </tr>
	        <tr>
				<td colspan="4">{{$visitor_log->description}}</td>
	        </tr>
	    </tbody>
	</table>
@include('print.print-layout.signatory')