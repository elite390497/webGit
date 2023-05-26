@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_head').' '.trans('general.total_result_count',['count' => count($fee_heads)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('finance.fee_head_name')}}</th>
                <th>{{trans('finance.fee_group')}}</th>
                <th>{{trans('finance.fee_head_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($fee_heads as $fee_head)
        		<tr>
        			<td>{{$fee_head->name}}</td>
                    <td>{{$fee_head->FeeGroup->name}}</td>
                    <td>{{$fee_head->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')