@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_concession').' '.trans('general.total_result_count',['count' => count($fee_concessions)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('finance.fee_concession_name')}}</th>
                <th>{{trans('finance.fee_head')}}</th>
                <th>{{trans('finance.fee_concession_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($fee_concessions as $fee_concession)
        		<tr>
        			<td>{{$fee_concession->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($fee_concession->FeeConcessionDetails as $fee_concession_detail)
                                <li>{{$fee_concession_detail->FeeHead->head_with_group.' ('.
                                    (($fee_concession_detail->type == 'amount') ? currency($fee_concession_detail->amount,1) : ($fee_concession_detail->amount.'%'))
                                .')'}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$fee_concession->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')