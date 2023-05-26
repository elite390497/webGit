@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.pay_head').' '.trans('general.total_result_count',['count' => count($pay_heads)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.pay_head_name')}}</th>
                <th>{{trans('employee.pay_head_alias')}}</th>
                <th>{{trans('employee.pay_head_type')}}</th>
                <th>{{trans('employee.pay_head_status')}}</th>
                <th>{{trans('employee.pay_head_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($pay_heads as $pay_head)
        		<tr>
                    <td>{{$pay_head->name}}</td>
                    <td>{{$pay_head->alias}}</td>
        			<td>{{trans('employee.pay_head_type_'.$pay_head->type)}}</td>
                    <td>
                        {{trans('employee.pay_head_status_'.($pay_head->is_active ? 'active' : 'inactive'))}}
                    </td>
                    <td>{{$pay_head->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')