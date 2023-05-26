<?php

namespace App\Http\Resources\Academic;

use App\Helper\Cal;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Academic\SubjectSummaryCollection;
use App\Http\Resources\Academic\CourseSummary as CourseSummaryResource;

class BatchSummary extends JsonResource
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
            'position'  => $this->position,
            'name'      => $this->name,
            'full_name' => $this->course->name.' - '.$this->name,
            'course'    => new CourseSummaryResource($this->whenLoaded('course')),
            'subjects'  => new SubjectSummaryCollection($this->whenLoaded('subjects'))
        ];
    }
}