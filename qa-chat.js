/* Timeago 0.11.4 - timeago.yarp.com */
(function(d){function i(){var a;a=d(this);if(!a.data("timeago")){a.data("timeago",{datetime:e.datetime(a)});var b=d.trim(a.text());0<b.length&&(!e.isTime(a)||!a.attr("title"))&&a.attr("title",b)}a=a.data("timeago");isNaN(a.datetime)||d(this).text(f(a.datetime));return this}function f(a){return e.inWords((new Date).getTime()-a.getTime())}d.timeago=function(a){return a instanceof Date?f(a):"string"===typeof a?f(d.timeago.parse(a)):"number"===typeof a?f(new Date(a)):f(d.timeago.datetime(a))};var e=d.timeago;
d.extend(d.timeago,{settings:{refreshMillis:6E4,allowFuture:!1,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(a){function b(b,e){return(d.isFunction(b)?b(e,a):b).replace(/%d/i,c.numbers&&c.numbers[e]||
e)}var c=this.settings.strings,e=c.prefixAgo,f=c.suffixAgo;this.settings.allowFuture&&0>a&&(e=c.prefixFromNow,f=c.suffixFromNow);var g=Math.abs(a)/1E3,j=g/60,k=j/60,h=k/24,i=h/365,g=45>g&&b(c.seconds,Math.round(g))||90>g&&b(c.minute,1)||45>j&&b(c.minutes,Math.round(j))||90>j&&b(c.hour,1)||24>k&&b(c.hours,Math.round(k))||42>k&&b(c.day,1)||30>h&&b(c.days,Math.round(h))||45>h&&b(c.month,1)||365>h&&b(c.months,Math.round(h/30))||1.5>i&&b(c.year,1)||b(c.years,Math.round(i));return d.trim([e,g,f].join(void 0===
c.wordSeparator?" ":c.wordSeparator))},parse:function(a){a=d.trim(a);a=a.replace(/\.\d+/,"");a=a.replace(/-/,"/").replace(/-/,"/");a=a.replace(/T/," ").replace(/Z/," UTC");a=a.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2");return new Date(a)},datetime:function(a){a=e.isTime(a)?d(a).attr("datetime"):d(a).attr("title");return e.parse(a)},isTime:function(a){return"time"===d(a).get(0).tagName.toLowerCase()}});d.fn.timeago=function(){var a=this;a.each(i);var b=e.settings;0<b.refreshMillis&&setInterval(function(){a.each(i)},
b.refreshMillis);return a};document.createElement("abbr");document.createElement("time")})(jQuery);

/* alternate locales available at http://github.com/rmm5t/jquery-timeago/tree/master/locales */
jQuery.timeago.settings.allowFuture = true;
jQuery.timeago.settings.strings = {
  prefixAgo: "vor",
  prefixFromNow: null,
  suffixAgo: null,
  suffixFromNow: "jetzt gerade",
  seconds: "%d Sekunden",
  minute: "einer Minute",
  minutes: "%d Minuten",
  hour: "einer Stunde",
  hours: "%d Stunden",
  day: "einem Tag",
  days: "%d Tagen",
  month: "einem Monat",
  months: "%d Monaten",
  year: "einem Jahr",
  years: "%d Jahren",
  wordSeparator: " ",
  numbers: []
};

// all content is returned from database HTML-encoded so we use this to unencode stuff when needed (e.g. URLs)
function unescapeHtml(str)
{
	return str
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, "\"")
		.replace(/&#039;/g, "'")
		.replace(/&amp;/g, "&");
}

// current user
var cUser =
{
	id: 0,
	idle: false
}

var Tmpl =
{
	message: function( post )
	{
		var html = '';
		var service_class = post.userid == 0 ? 'qa-chat-service' : '';

		html += '<li id="qa-chat-id-' + post.postid + '" class="qa-chat-item ' + service_class + '" style="display:none">';
		html += '  <div class="qa-chat-item-avatar">';
		html += '     <img class="chat-avatar-img" src="/?qa=image&qa_blobid='+post.avatarblobid+'&qa_size=30" alt="Avatar" />';
		html += '  </div>';
		html += '  <div class="qa-chat-item-meta">';
		html += '    <span class="qa-chat-item-who">';
		if(post.userid > 0)
		{
			html += '      <a class="qa-user-link" target="_blank" href="/user/' + encodeURIComponent( unescapeHtml(post.username) ) + '">' + post.username + '</a>';
		}
		else
		{
			html += 'KICKBOT';				
		}
		html += '    </span><br>';
		html += '    <span class="qa-chat-item-when" data-utc="' + post.posted_utc + '" title="' + post.posted_utc + '">' + post.posted + '</span>';
		html += '  </div>';
		html += '  <div class="qa-chat-item-data">' + post.message + '</div>';
		html += '</li>';

		return html;
	},

	user_list_wrapper: function( total )
	{
		var html = '<div id="qa-chat-sidebar" class="sidebar"><h2>Online (' + total + ')</h2> <ul id="qa-chat-user-list"></ul></div>';
		return html;
	},

	user_list: function( users )
	{
		var html = '';

		for ( var i in users )
		{
			var user_class = '', user_status = '';

			if ( users[i].idle == 1 )
			{
				user_class = 'qa-chat-idle';
				user_status = '(inaktiv)';
			}

			if ( users[i].kicked == 0 )
			{
				var link_html = ' <a target="_blank" href="./user/' + encodeURIComponent( unescapeHtml(users[i].username) ) + '">' + users[i].username + '</a> ';
				var kick_button = (users[i].kickable == 1 && users[i].userid != cUser.id) ? ' <span class="qa-chat-kick"></span> ' : '';
				html += '<li data-userid="' + users[i].userid + '" class="qa-chat-user-item ' + user_class + '">' + kick_button + link_html + ' ' + user_status + '</li>';
			}

			if ( users[i].userid == cUser.id )
				cUser.idle = (users[i].idle == 1);
		}

		return html;
	}
}

/* YOUTUBE thumbnail */
$.extend({
  jYoutube: function( url, size ){
    if(url === null){ return ""; }

    size = (size === null) ? "big" : size;
    var vid;
    var results;

    results = url.match("[\\?&amp;]v=([^&amp;#]*)");

    vid = ( results === null ) ? url : results[1];

    if(size == "small"){
      return "//img.youtube.com/vi/"+vid+"/2.jpg";
    }else {
      return "//img.youtube.com/vi/"+vid+"/0.jpg";
    }
  }
});


/* Q2A chat */

$(document).ready(function(){ 
	var lastid = 0;
	var $chat_sidebar = null;
	var firstLoad = true; 
	var startEventsVisible = true;
	var startEventsCount = 0;
	var pagetitle = 'Community-Chat';
	var userPostsMessage = false; 
	var userPostsCount = 0;
	var soundactive = false;
	
	// add a message to the list
	function qa_chat_add_message( post )
	{
		var $ex_post = $( '#qa-chat-id-'+post.postid );
		if ( $ex_post.length == 0 )
		{
			var $msg = $( Tmpl.message( post ) );
			$('.qa-chat-item-when', $msg).timeago();
			$('#qa-chat-list').prepend($msg);
			$msg.slideDown('fast');
			// q2apro: added features
			parse_url_to_img();
			// add_youtube_thumbnail();
			parse_youtube_links();
			parse_soundcloud_links();
			// $('.qa-chat-item-data a').attr('target', '_blank');
			
			// write count of new chat messages in page title if post is not by user himself
			if(userPostsMessage) {
				// reset counter as user has read the other messages, nothing new!
				$('title').text('(0) '+ pagetitle);
				startEventsCount = $('ul#qa-chat-list li:visible').length - userPostsCount;
			}
			else {
				var rowCount = $('ul#qa-chat-list li:visible').length - userPostsCount;
				if(startEventsVisible) { rowCount = $('ul#qa-chat-list li:visible').length - startEventsCount - userPostsCount; }
				// console.log('rowCount = '+ $('ul#qa-chat-list li:visible').length + ' - startEventsCount: ' + startEventsCount + ' - userPosts: '+userPostsCount+' = '+rowCount);
				$('title').text('('+rowCount+') '+ pagetitle);

				// console.log("# "+firstLoad);
				if(!firstLoad && soundactive) {
					$('#chatAudio')[0].play(); // plays <audio> embedded mp3 file
				}
			}
		}

		/*if ( $('.qa-chat-item').length > 80 )
			$('.qa-chat-item:nth-child(n+81)').remove();
		*/
	}
	
	// eetv: parse img-URL to img tag
	function parse_url_to_img() {
		$('.qa-chat-item-data a').each( function() { 
			var regexr = "(https?:\/\/.*\.(?:png|jp?g|gif))";
			if( $(this).attr('href').match(regexr) != null ) {
				// $(this).empty();
				$(this).replaceWith("<img src='" + $(this).attr('href') + "' />"); // append
			}
		});
	}
	
	// eetv: add youtube-URL to thumbnail img
	function add_youtube_thumbnail() {
		$('.qa-chat-item-data a').each( function() { 
			if( ytVidId($(this).attr('href')) && !$(this).find('img').length) {
				var ytThumbnail = $.jYoutube('//www.youtube.com/watch?v='+ytVidId($(this).attr('href')), 'big');
				$(this).prepend("<img src='" + ytThumbnail + "' /><br />Video: ");
			}
		});
	}
	function ytVidId(url) {
		var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		return (url.match(p)) ? RegExp.$1 : false;
	}

	function parse_youtube_links() {
		$('.qa-chat-item-data a').each( function() { 
			if( ytVidId($(this).attr('href')) ) {
				$(this).replaceWith('<br /><iframe width="420" height="345" src="//www.youtube.com/embed/'+ytVidId($(this).attr('href'))+'" frameborder="0" allowfullscreen></iframe>');
			}
		});
	}
	
	// eetv: parse soundcloud link to embed widget
	function parse_soundcloud_links() {
		$('a[href*="soundcloud.com"]').each(function(){
			var $link = $(this);
			$.getJSON('//soundcloud.com/oembed?format=js&url=' + $link.attr('href') + '&iframe=true&callback=?', function(response){
			$link.replaceWith(response.html);
			});
		});
	}
	
	function qa_chat_update_users( users )
	{
		if ( !$chat_sidebar ) {
			$('.qa-sidepanel:last').prepend( '<div id="qa-chat-sidebar"></div>' );
		}

		$chat_sidebar = $('#qa-chat-sidebar');
		$user_list = $( Tmpl.user_list_wrapper( users.length ) );
		$user_list.find('#qa-chat-user-list').html( Tmpl.user_list(users) );
		$chat_sidebar.replaceWith( $user_list )
	}

	// fetch all new messages
	function qa_chat_fetch_messages()
	{
		$.ajax({
			type: 'post',
			data: { ajax_get_messages: lastid },
			success: function(response) {
				var lines = response.split("\n");
				if ( (lines[0]).trim() != 'QA_AJAX_RESPONSE' || lines[1] == 0 ) {
					return false;					
				}

				cUser.id = lines[1];

				var posts = $.parseJSON( lines[2] ).reverse();
				for ( var i in posts ) {
					qa_chat_add_message( posts[i] );
					lastid = posts[i].postid;
				}

				// update active users
				if ( lines[3] ) {
					var users = $.parseJSON( lines[3] );
					qa_chat_update_users( users );
				}
				
				if(firstLoad) {
					startEventsCount = $('ul#qa-chat-list li:visible').length;
					$('title').text('(0) '+ pagetitle);
					firstLoad = false;
				}

			}
		});

		// if user is inactive, increase timeout
		if ( cUser.idle ) {
			setTimeout( function() { qa_chat_fetch_messages(); }, 30000 );			
		}
		else {
			setTimeout( function() { qa_chat_fetch_messages(); }, 12000 ); // interval was 8000			
		}
	}

	// adding a message to the chat
	$('#qa-chat-form').submit( function() {
		var message = $('#message').val();
		if ( message.length == 0 )
			return false;

		$('#qa-chat-form input').attr({ disabled: 'disabled' });

		$.ajax({
			type: 'post',
			data: { ajax_add_message: message, ajax_add_lastid: '0' },
			success: function(response) {
				$('#qa-chat-form input').removeAttr('disabled');
				$('#message').val('').focus();

				var lines = response.split("\n");
				if ( (lines[0]).trim() != 'QA_AJAX_RESPONSE' ) {
					console.log(lines);
					alert("There was a server error, please try again in a few minutes");
					return false;
				}
				if ( lines[1] == 0 ) {
					alert("Error: "+lines[2]);
					return false;
				}

				userPostsMessage = true;
				userPostsCount++;
				console.log('userPosts (after ajax): '+userPostsCount);
				var post = $.parseJSON( lines[2] );
				qa_chat_add_message( post );
				userPostsMessage = false;
				cUser.idle = false;
			}
		});

		return false;
	} );

	// page setup
	qa_chat_fetch_messages();
	
	$('.qa-sidepanel').on('click', '.qa-chat-kick', function() {
		var $li = $(this).parent();
		var userid = $li.attr('data-userid');
		var username = $('a', $li).text();

		if ( window.confirm('Nominate this user for kicking?') )
		{
			$.ajax({
				type: 'post',
				data: { ajax_kick_userid: userid, ajax_kick_username: username },
				success: function(response) {
					var lines = response.split("\n");
					if ( (lines[0]).trim() != 'QA_AJAX_RESPONSE' ) {
						alert("There was a server error, please try again in a few minutes");
						return false;
					}
					if ( lines[1] == 0 ) {
						alert("Error: "+lines[2]);
						return false;
					}
				}
			});
		}
	});

	
	// eetv: hide recent chat items
	$("#hideRecentChats").click( function() {
		$('ul#qa-chat-list li').hide();
		$('.tipsy:last').remove();
		startEventsVisible = false;
		userPostsCount = 0;
		$('title').text('(0) '+ pagetitle);
	});
	$("#soundToggle").click( function() {
		soundactive = !soundactive;
		if(soundactive) {
			$(this).html('Sound ist an');
		}
		else {
			$(this).html('Sound ist aus');
		}
	});
	
	
	if($("#agentIsMobile").length == 0) {
		// eetv: tipsy for buttons, not for mobiles
		$('#hideRecentChats').tipsy( {gravity: 's', offset:10 });
		$('#soundToggle').tipsy( {gravity: 's', offset:10 });
	}

});
