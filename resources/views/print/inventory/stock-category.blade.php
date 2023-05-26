@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('inventory.stock_category').' '.trans('general.total_result_count',['count' => count($stock_categories)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('inventory.stock_category_name')}}</th>
                <th>{{trans('inventory.stock_category_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($stock_categories as $stock_category)
        		<tr>
        			<td>{{$stock_category->name}}</td>
                    <td>{{$stock_category->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')