@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('inventory.stock_purchase').' '.trans('general.total_result_count',['count' => count($stock_purchases)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('inventory.vendor')}}</th>
                <th>{{trans('inventory.stock_purchase_number')}}</th>
                <th>{{trans('inventory.stock_purchase_date')}}</th>
                <th>{{trans('inventory.stock_purchase_total')}}</th>
                <th>{{trans('inventory.stock_purchase_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($stock_purchases as $stock_purchase)
        		<tr>
        			<td>{{$stock_purchase->vendor->name}}</td>
                    <td>{{$stock_purchase->number}}</td>
                    <td>{{showDate($stock_purchase->date)}}</td>
                    <td>{{currency($stock_purchase->total,1)}}</td>
                    <td>{{$stock_purchase->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')