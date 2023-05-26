@include('print.print-layout.header')
    <h2 style="text-align: center;">{{trans('reception.gate_pass')}}</h2>
	<table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>{{'#'.$gate_pass->id}}</td><td style="text-align: right;">{{trans('general.date').': '.showDate($gate_pass->date).' '.showTime($gate_pass->time)}}</td></tr></table>
	<table class="fancy-detail">
	    <tbody>
	        <tr>
	            <td valign="top"><strong>{{trans('reception.gate_pass_detail')}}</strong></td>
	            <td valign="top">
	            	@if($gate_pass->type == 'student')
                        {{trans('student.name').': '.$gate_pass->Student->name}} <br />
                        {{trans('student.father_name').': '.$gate_pass->Student->Parent->father_name}} <br />
                        {{trans('student.mother_name').': '.$gate_pass->Student->Parent->mother_name}} <br />
                        {{trans('student.contact_number').': '.$gate_pass->Student->contact_number}} <br />
                    @else
                        {{$gate_pass->Employee->name}} <br />
                        {{getEmployeeDesignationName($gate_pass->Employee)}}
                    @endif
	            </td>
	            <td valign="top"><strong>{{trans('general.entry_by')}}</strong></td>
	            <td valign="top">
	            	{{$gate_pass->User->Employee->name}} <br />
                    {{getEmployeeDesignationName($gate_pass->User->Employee)}}
	            </td>
	        </tr>
	        <tr>
	            <td><strong>{{trans('reception.gate_pass_reason')}}</strong></td>
	            <td colspan="3">
	            	{{$gate_pass->reason}}
	            </td>
	        </tr>
	    </tbody>
	</table>
@include('print.print-layout.signatory')