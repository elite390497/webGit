@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_allocation').' '.trans('general.total_result_count',['count' => count($fee_allocations)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.batch')}}</th>
                <th>{{trans('finance.fee_group')}}</th>
                <th>{{trans('general.created_at')}}</th>
                <th>{{trans('general.updated_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($fee_allocations as $fee_allocation)
        		<tr>
        			<td>{{$fee_allocation->Batch->batch_with_course}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($fee_allocation->FeeAllocationGroups as $fee_allocation_group)
                                <li>{{$fee_allocation_group->FeeGroup->name.' ('.$fee_allocation_group->FeeInstallments->count().trans('finance.installment').')'}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{showDateTime($fee_allocation->created_at)}}</td>
                    <td>{{showDateTime($fee_allocation->updated_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')