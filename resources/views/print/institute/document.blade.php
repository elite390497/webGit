@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('institute.document').' '.trans('general.total_result_count',['count' => count($institute_documents)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('institute.document_title')}}</th>
                <th>{{trans('institute.document_date_of_expiry')}}</th>
                <th>{{trans('institute.document_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($institute_documents as $institute_document)
        		<tr>
                    <td>{{$institute_document->title}}</td>
                    <td>
                        @if($institute_document->date_of_expiry)
                            {{showDate($institute_document->date_of_expiry)}}
                        @endif
                    </td>
                    <td>{{$institute_document->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')