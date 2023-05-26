<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentList extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'   => $this->id,
            'name' => $this->getStudentName()
        ];
    }

    private function getStudentName()
    {
        return $this->student->name.' '.$this->batch->getOption('roll_number_prefix').str_pad($this->roll_number, $this->batch->getOption('roll_number_digit'), '0', STR_PAD_LEFT);
    }
}