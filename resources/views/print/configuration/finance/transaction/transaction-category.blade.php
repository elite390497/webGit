@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.transaction_category').' '.trans('general.total_result_count',['count' => count($transaction_categories)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('finance.transaction_category_name')}}</th>
                <th>{{trans('finance.transaction_category_type')}}</th>
                <th>{{trans('finance.transaction_category_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($transaction_categories as $transaction_category)
        		<tr>
        			<td>{{$transaction_category->name}}</td>
                    <td>{{trans('finance.'.$transaction_category->type)}}</td>
                    <td>{{$transaction_category->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')