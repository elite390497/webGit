<?php

namespace App\Http\Resources\Academic;

use App\Helper\Cal;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Academic\ClassTeacher as ClassTeacherResource;
use App\Http\Resources\Academic\CourseSummary as CourseSummaryResource;

class ClassTeacherBatchWise extends JsonResource
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
            'name'          => $this->name,
            'full_name'     => $this->course->name.' - '.$this->name,
            'course'        => new CourseSummaryResource($this->whenLoaded('course')),
            'class_teacher' => $this->getCurrentClassTeacher()
        ];
    }

    /**
     * Get current class teacher
     * @return array
     */
    private function getCurrentClassTeacher()
    {
        return new ClassTeacherResource($this->classTeachers->sortByDesc('date_effective')->filter(function ($class_teacher) {
            return ($class_teacher->date_effective <= Cal::today());
        })->first());
    }
}