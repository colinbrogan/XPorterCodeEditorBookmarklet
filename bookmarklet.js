    function loadScript(url, callback) {

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js", function () {

         //jQuery loaded
         console.log('ace loaded');
	var $advanced_editor = $([
	"<div id='advanced-editor-wrap' style='position:fixed; bottom: 0; right: 0; background: black; color: white; width: 100%; display: inline-block;'>",
		'<a href="#" id="toggle-pane" style="float: right; font-size: 20px; margin-right: 1rem; color: white; font-weight: 900;">-</a>',
		'<div id="advanced-editor" style="width: 100%; height: 10rem;" />',
/*	"<textarea name='advanced-editor' style='background: black; color: white; width: 15rem;'  rows='15' cols='100'  />", */
	"</div>",
	].join(""));
	$('body').append($advanced_editor);
		var editor = ace.edit("advanced-editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/html");
		$("#toggle-pane").click(function() {
			$(this).toggleClass("open");
			if($(this).hasClass("open")) {
				$(this).text("-");
				$("#advanced-editor").css("height","10rem");
			} else {
				$(this).text("+");
				$("#advanced-editor").css("height","0rem");
			}

		});
		$('input[name="liquid-value"]').focus(function() {
		     var thisID = $(this).attr("id");
		     $('#edit-title').remove();
		     $("toggle-pane").after("<strong id='edit-title'>Editing "+thisID+"</strong>");
		     $advanced_editor.data("changing",thisID);
		     editor.getSession().on('change', function(e) {
				var theChangeID = $advanced_editor.data("changing");
				var lb_map = "";
				var value = editor.getValue();
				var i = value.indexOf("\n");
				while(i >= 0) {
					lb_map += i+"-";
					i = value.indexOf('\n', i+1);
				}
				console.log('setCookie("lb_map_#"'+theChangeID+','+lb_map+','+'365);');
				setCookie("lb_map_#"+theChangeID,lb_map,365);
				var lbEncodedValue = value.replace(/\n/g,"");
				$("#"+theChangeID).val(lbEncodedValue);
			});
		     var lb_map = getCookie("lb_map_#"+thisID);
			 var new_contents = $(this).val();
			 console.log("lb_map");
			 console.log(lb_map);
		     if(lb_map) {
			     var map_array = lb_map.split('-');
			     for(var i in map_array) {
			     	if(Number(map_array[i]) > 0) {
			     		var startIndex = Number(map_array[i]);
			     		var nextIndex = Number(map_array[i]) + Number(i) + 1;
			     		console.log("Attempted to add lb at "+Number(map_array[i])+" on i "+i);
				     	new_contents = new_contents.slice(0, startIndex) + "\n" + new_contents.slice(startIndex);
				     	console.log("new_contents.slice(0, "+startIndex+") + '\n' + new_contents.slice("+startIndex+");");
				     	console.log(new_contents);
			     	}
			     }
		     }

		     editor.setValue(new_contents);
		});
    });


	function getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return false;
	}
	function setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    var path = "path=/";
	    document.cookie = cname + "=" + cvalue + "; " + expires + ';' + path + ';';
	}



