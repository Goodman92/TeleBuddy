<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

use JWTAuth;
use Tymon\JWTAuthExceptions\JWTAuthExceptions;

use \App\Models\Company;
use \App\Models\BusinessLines;


class CustomerController extends Controller {

	public function __construct() {
		$this->middleware('jwt.auth', ['except' => ['login']]);
	}

	public function index($floor = null, $ceil = null) {
		Log::debug("get Customers");
		Log::debug($floor);
		Log::debug($ceil);
		$companies = Company::with('contactDetails')
							->with('businesslines')
							->has('contactDetails')
							->offset($floor)
							->limit($ceil)
							->get();
		$count = Company::with('contactDetails')->with('businessLines')->has('contactDetails')->count();

		Log::debug("count ".$count);
		$result = array(
			'active' => $count,
			'fields' => 300,
			'called' => 200,
			'testi' => $floor,
			'companies' => $companies
		);
		return response()->json($result, 200);
	}

	public function getCities() {
		Log::debug("cities");
		$cities = Company::select('city')->distinct()->get();
		$result = array(
			'cities' => $cities
		);
		return response()->json($result, 200);	
	}

	public function getLines() {
		Log::debug("lines");
		$lines = BusinessLines::select('name', 'id')->get();
		$result = array(
			'lines' => $lines
		);
		return response()->json($result, 200);
	}

	// optimointi, testi atm
	public function getCustomCompanies(Request $request, $floor = null, $ceil = null) {
		Log::debug("getCustomCompanies");
		$parameters = $request->only('lines_', 'cities_', 'forms_');
		Log::debug($parameters);
		$companies = Company::with('contactDetails')
							->with('businesslines')
							->has('contactDetails')
		->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['forms_']); $i++) {
				if($parameters['forms_'][$i]['checked'] == true)
					$query->orWhere('companyForm', $parameters['forms_'][$i]['name']);
			}
		})->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['cities_']); $i++) {
				$query->orWhere('city', $parameters['cities_'][$i]['city']);
			}
		})->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['lines_']); $i++) {
				$query->orWhere('businessLine', $parameters['lines_'][$i]['id']);
			}
		})->offset($floor)->limit($ceil)->get();

		Log::debug($floor);
		Log::debug($ceil);

		$count = Company::with('contactDetails')
							->with('businesslines')
							->has('contactDetails')
		->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['forms_']); $i++) {
				if($parameters['forms_'][$i]['checked'] == true)
					$query->orWhere('companyForm', $parameters['forms_'][$i]['name']);
			}
		})->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['cities_']); $i++) {
				$query->orWhere('city', $parameters['cities_'][$i]['city']);
			}
		})->Where(function($query) use($parameters) {
			for($i = 0; $i < count($parameters['lines_']); $i++) {
				$query->orWhere('businessLine', $parameters['lines_'][$i]['id']);
			}
		})->count();

		Log::debug("total count ".$count);
		$result = array(
			'companies' => $companies,
			'active' => $count
		);


		return response()->json($result, 200);
	}

	public function getDetails() {
		$companyCount = Company::with('contactDetails')->with('businessLines')->has('contactDetails')->count();
		$lineCount = BusinessLines::count();
		$customerCount = 0;
		$previousUpdate = "10-01-2017";
		$result = array(
			'companies' => $companyCount,
			'lines' => $lineCount,
			'customers' => $customerCount,
			'updated' => $previousUpdate
		);

		return response()->json($result, 200);

	}
}