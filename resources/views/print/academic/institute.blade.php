@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.institute').' '.trans('general.total_result_count',['count' => count($institutes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.institute_name')}}</th>
                <th>{{trans('academic.institute_contact_number')}}</th>
                <th>{{trans('academic.institute_alternate_contact_number')}}</th>
                <th>{{trans('academic.institute_principal_name')}}</th>
                <th>{{trans('academic.institute_website')}}</th>
                <th>{{trans('academic.institute_address')}}</th>
                <th>{{trans('academic.institute_remarks')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($institutes as $institute)
        		<tr>
        			<td>{{$institute->name}}</td>
                    <td>{{$institute->contact_number}}</td>
                    <td>{{$institute->alternate_contact_number}}</td>
                    <td>{{$institute->principal_name}}</td>
                    <td>{{$institute->website}}</td>
                    <td>{{$institute->address}}</td>
                    <td>{{$institute->remarks}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')