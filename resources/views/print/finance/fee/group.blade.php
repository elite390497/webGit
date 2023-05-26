@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_group').' '.trans('general.total_result_count',['count' => count($fee_groups)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('finance.fee_group_name')}}</th>
                <th>{{trans('finance.fee_head')}}</th>
                <th>{{trans('transport.has_transport')}}</th>
                <th>{{trans('finance.fee_group_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($fee_groups as $fee_group)
        		<tr>
        			<td>{{$fee_group->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($fee_group->FeeHeads as $fee_head)
                                <li>{{$fee_head->name}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>
                        @if($fee_group->getOption('has_transport'))
                            {{trans('list.yes')}}
                        @else
                            {{trans('list.no')}}
                        @endif
                    </td>
                    <td>{{$fee_group->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')