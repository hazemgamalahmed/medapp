<?php

namespace App\Http\Middleware;

use Closure;

class medical
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!auth()->user()){
            return view('index');
        }
        return $next($request);
    }
}
