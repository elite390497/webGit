<?php

namespace App\Http\Resources\Employee;

use App\Helper\Cal;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Config\Employee\Designation as DesignationResource;

class Summary extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $designation = $this->getCurrentDesignation();
        $employee_term = $this->getJoiningDate();

        return [
            'first_name'     => $this->first_name,
            'middle_name'    => $this->middle_name,
            'last_name'      => $this->last_name,
            'name'           => $this->name,
            'father_name'    => $this->father_name,
            'gender'         => $this->gender,
            'photo'          => $this->photo,
            'code'           => $this->employee_code,
            'designation'    => $designation,
            'date_of_birth'  => $this->date_of_birth,
            'contact_number' => $this->contact_number,
            'date_of_joining'=> $employee_term ? $employee_term->date_of_joining : null,
            'created_at'     => $this->when(request('q') === 'all', $this->created_at->format(Cal::getSysDateTimeFormat())),
            'updated_at'     => $this->when(request('q') === 'all', $this->updated_at->format(Cal::getSysDateTimeFormat()))
        ];
    }

    /**
     * Get current designation of employee
     * @return Designation|null
     */
    private function getCurrentDesignation()
    {
        $date = request('date');

        return getEmployeeDesignationName($this, $date);
    }

    /**
     * Get date of joining of employee
     * @return date
     */
    private function getJoiningDate()
    {
        $date = request('date');

        return getEmployeeTerm($this, $date);
    }
}