@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('inventory.vendor').' '.trans('general.total_result_count',['count' => count($vendors)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('inventory.vendor_name')}}</th>
                <th>{{trans('inventory.vendor_phone')}}</th>
                <th>{{trans('inventory.vendor_email')}}</th>
                <th>{{trans('inventory.vendor_contact_person')}}</th>
                <th>{{trans('inventory.vendor_address')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($vendors as $vendor)
        		<tr>
        			<td>
                        {{$vendor->name}}
                        @if($vendor->tax_id)
                            <br /> {{trans('inventory.vendor_tax_id')}} {{$vendor->tax_id}}
                        @endif
                    </td>
                    <td>
                        {{$vendor->phone}}
                        @if($vendor->alternate_phone)
                            <br /> {{$vendor->alternate_phone}}
                        @endif
                    </td>
                    <td>
                        {{$vendor->email}}
                    </td>
                    <td>
                        {{$vendor->contact_person}}
                        @if($vendor->contact_person_phone)
                            <br /> {{$vendor->contact_person_phone}}
                        @endif
                        @if($vendor->contact_person_email)
                            <br /> {{$vendor->contact_person_email}}
                        @endif
                    </td>
                    <td>
                        {{$vendor->address_line_1}}
                        @if($vendor->address_line_2)
                            <br /> {{$vendor->address_line_2}}
                        @endif
                        @if($vendor->city)
                            <br /> {{$vendor->city}}
                        @endif
                        @if($vendor->state)
                            <br /> {{$vendor->state}}
                        @endif
                        @if($vendor->zipcode)
                            <br /> {{$vendor->zipcode}}
                        @endif
                        @if($vendor->country)
                            <br /> {{$vendor->country}}
                        @endif
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')