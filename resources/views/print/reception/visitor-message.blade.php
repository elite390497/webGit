@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.visitor_message').' '.trans('general.total_result_count',['count' => count($visitor_messages)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.visitor_message_name')}}</th>
                <th>{{trans('reception.visitor_message_email')}}</th>
                <th>{{trans('reception.visitor_message_contact_number')}}</th>
                <th>{{trans('reception.visitor_message_message')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($visitor_messages as $visitor_message)
        		<tr>
                    <td>{{$visitor_message->id}}</td>
                    <td>{{$visitor_message->name}}</td>
                    <td>{{$visitor_message->email}}</td>
                    <td>{{$visitor_message->contact_number}}</td>
                    <td>{{$visitor_message->message}}</td>
                    <td>{{showDateTime($visitor_message->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')