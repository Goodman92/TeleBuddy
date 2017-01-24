<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessLines extends Model
{
	protected $table = 'businesslines';
	protected $fillable = ['name', 'id'];
	protected $primaryKey = 'id';
	public $timestamps = false;

	public function Company() {
		return $this->belongsTo('App\Models\Company', 'businessLine', 'id');
	}
}
