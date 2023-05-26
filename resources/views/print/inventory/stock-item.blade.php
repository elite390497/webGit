@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('inventory.stock_item').' '.trans('general.total_result_count',['count' => count($stock_items)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('inventory.stock_item_name')}}</th>
                <th>{{trans('inventory.stock_item_code')}}</th>
                <th>{{trans('inventory.stock_item_opening_quantity')}}</th>
                <th>{{trans('inventory.stock_item_quantity')}}</th>
                <th>{{trans('inventory.stock_item_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($stock_items as $stock_item)
        		<tr>
        			<td>{{$stock_item->name}}</td>
                    <td>{{$stock_item->code}}</td>
                    <td>{{$stock_item->opening_quantity}}</td>
                    <td>{{$stock_item->quantity}}</td>
                    <td>{{$stock_item->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')