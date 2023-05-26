@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('transport.fee').' '.trans('general.total_result_count',['count' => count($fees)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('transport.fee_name')}}</th>
                <th>{{trans('transport.range')}}</th>
                <th>{{trans('transport.fee_description')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($fees as $fee)
        		<tr>
        			<td>{{$fee->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($fee->TransportFeeDetails as $fee_detail)
                                <li>
                                    <table width="100%" border="0">
                                        <tr>
                                            <td style="width:50%;">{{$fee_detail->TransportCircle->name}}</td>
                                            <td>{{currency($fee_detail->amount,1)}}</td>
                                        </tr>
                                    </table>
                                </li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$fee->description}}</td>
                    <td>{{showDateTime($fee->created_at)}}</td>
                    <td>{{showDateTime($fee->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')