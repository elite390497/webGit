@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('student.document_type').' '.trans('general.total_result_count',['count' => count($student_document_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('student.document_type_name')}}</th>
                <th>{{trans('student.document_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($student_document_types as $student_document_type)
        		<tr>
        			<td>{{$student_document_type->name}}</td>
                    <td>{{$student_document_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')