!function(e,t){function n(){if(t.XMLHttpRequest)return new t.XMLHttpRequest;try{return new t.ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(e){}throw new Error("no xmlhttp request able to be created")}function r(e,t,n){e[t]=e[t]||n}t.nanoajax=e,e.ajax=function(e,t){"string"==typeof e&&(e={url:e});var a=e.headers||{},o=e.body,u=e.method||(o?"POST":"GET"),i=e.withCredentials||!1,s=n();s.withCredentials=i,s.onreadystatechange=function(){4==s.readyState&&t(s.status,s.responseText,s)},o&&(r(a,"X-Requested-With","XMLHttpRequest"),r(a,"Content-Type","application/x-www-form-urlencoded")),s.open(u,e.url,!0);for(var c in a)s.setRequestHeader(c,a[c]);s.send(o)}}({},function(){return this}());
var Tracker = {
	params: '',
	logUrl: '',
	started: [],
	ready: function (options) {
		Tracker.params = options.params || {};
		Tracker.logUrl = options.logUrl || '';
		window.addEventListener("beforeunload", Tracker.pageEnd, false);
	    if (document.addEventListener) {
	        document.addEventListener("DOMContentLoaded", Tracker.pageStart, false);
	    } else if (document.attachEvent) {
	        document.attachEvent("onreadystatechange", function() {
	            if (document.readyState === "complete" ) {
	                Tracker.pageStart();
	  			}
	        });
	    } else {
	    	Tracker.pageStart();
	    }
	},	
	error: function(){
		console.log('error');
	},
	pageStart: function(){
		for	(var i = 0; i < document.forms.length; i++){
			Tracker.formInit(document.forms[i]);
		}
	},
	pageEnd: function(){
		for	(var i = 0; i < document.forms.length; i++){
			if(document.forms[i].getAttribute('data-trackabandoned') === 'true' && Tracker.started.indexOf(document.forms[i].getAttribute('data-trackerhash')) != -1){
				Tracker.formAbandoned(document.forms[i]);
			}
		}
	},
	formInit: function(f){
		Tracker.setHash(f)
		f.setAttribute('data-trackabandoned', true);
		f.addEventListener("submit", Tracker.formSubmission, false);
		for(var i =0; i< f.elements.length; i++) {
			f.elements[i].setAttribute('data-trackparent', f.getAttribute('data-trackerhash'));
			f.elements[i].addEventListener('input', Tracker.fieldInput, false);
		}
	},
	formSubmission: function(el){
		this.setAttribute('data-trackabandoned', false);
	},
	formAbandoned: function(f){
		Tracker.log(f)
	},
	fieldInput: function(){
		Tracker.started.push(this.getAttribute('data-trackparent'));
	},
	log: function(f) {
		for (var i =0; i < f.elements.length; i++) { 
			Tracker.params[f.elements[i].getAttribute('name')] = f.elements[i];
		}
		console.log(Tracker.logUrl);
		nanoajax.ajax({url: Tracker.logUrl, method: 'POST', body: Tracker.params}, function (code, responseText, request) {
			//just a handoff, not checking for resposne
		})
	},
	setHash: function(f){
		var hash =  f.getAttribute('data-trackerhash') || f.getAttribute('name') || f.getAttribute('id') || Math.random().toString(36).substr(2,9);
		f.setAttribute('data-trackerhash', hash);
		return hash;
	}
}

window.Tracker = Tracker;
