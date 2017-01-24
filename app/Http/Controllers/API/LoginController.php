<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

use JWTAuth;
use Tymon\JWTAuthExceptions\JWTAuthExceptions;


class LoginController extends Controller {

	public function __construct() {
		$this->middleware('jwt.auth', ['except' => ['login']]);
	}

	public function login(Request $request) {
		Log::debug($request);
		Log::debug("custom login controller 123");
		//onko logged in?
		/*
		
        if (Auth::attempt(['email' => $email, 'password' => $password])) {
            // Authentication passed...
            return redirect()->intended('dashboard');
        }
		*/
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

	public function test() {

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
        //return response()->json(compact('user'));
        return response()->json(['login' => true], 200);
	}
}