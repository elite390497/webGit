@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.payment_method').' '.trans('general.total_result_count',['count' => count($payment_methods)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('finance.payment_method_name')}}</th>
                <th>{{trans('finance.payment_method_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($payment_methods as $payment_method)
        		<tr>
        			<td>{{$payment_method->name}}</td>
                    <td>{{$payment_method->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')