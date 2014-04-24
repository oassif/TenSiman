$(document).bind('fbInit',function(){
    alert('FB script loaded!');
});

function isPhoneGap() {
	return (window.cordova || window.PhoneGap || window.phonegap)
			&& /^file:\/{3}[^\/]/i.test(window.location.href)
			&& /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

if (!isPhoneGap() ) {
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-connect-script').appendChild(script);
}

	
window.fbAsyncInit = function() {
    FB.init({
        appId  : 609521172430311,
        status: true, 
        cookie: true, 
        xfbml: true, 
        oauth: true, 
        channelUrl: 'http//:localhost:8383' 
    });

    $(document).trigger('fbInit'); 
};

