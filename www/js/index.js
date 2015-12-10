/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var platformId = "browser";

var fileObj;

function handleExternalURLs() {
    "use strict";
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, {
                openExternal: true
            });
            e.preventDefault();
        });
    } else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    } else {
        // Leave standard behaviour
    }
}

function onConfirm(button) {
    if (button == 2) { //If User selected No, then we just do nothing
        return;
    } else {
        navigator.app.exitApp(); // Otherwise we quit the app.
    }
}

/*var exitApp = false,
    intval = setInterval(function () {
        exitApp = false;
    }, 1000);*/

var app = {
    // Application Constructor
    initialize: function () {
        "use strict";
        console.log("initialize app");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        "use strict";
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        "use strict";
        console.log("Device ready");
        console.log(StatusBar);
        if (cordova.platformId === 'android') {
            platformId = "android";
            // light: #B2EBF2, main: #00BCD4, darker: #0097A7
            StatusBar.backgroundColorByHexString("#0097A7");

            // catch back button click events
            document.addEventListener("backbutton", function (e) {

                // "exit" on double click only
                /*if (exitApp) {
                    clearInterval(intval)
                        (navigator.app && navigator.app.exitApp()) || (device && device.exitApp())
                } else {
                    exitApp = true
                    history.back(1);
                }*/

                // Prompt the user with the choice
                navigator.notification.confirm("Are you sure you want to exit?", onConfirm, "Confirmation", "Yes,No");

                e.preventDefault();
            }, false);
        }
        if (cordova.platformId === 'ios') {
            platformId = "ios";
            // document.body.style.marginTop = "20px";
            document.getElementsByTagName('body')[0].className += ' ios-background';
            StatusBar.backgroundColorByHexString("#00BCD4");
        }

        // Mock device.platform property if not available
        if (!window.device) {
            window.device = {
                platform: 'Browser'
            };
        }

        handleExternalURLs();

		// Data file related
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
			dir.getFile("data.txt", {create:true}, function(file) {
				fileObj = file;
				writeToFile("hello world!");			
			});
		});		
		alert(cordova.file.dataDirectory);
		readFromFile();
		alert("YAY!");
    }
};


app.initialize();

function init() {
    "use strict";
    console.log("initialize page");
}

function listItemClicked(element) {
    // for iOS app only
    if (platformId == 'ios') {
        Array.prototype.filter.call(document.getElementsByClassName('mdl-layout__obfuscator'), function (testElement) {
            testElement.setAttribute("style", "visibility: hidden");
            testElement.setAttribute("style", "background-color: rgba(0, 0, 0, 0.498039)");
        });
    }
    $("#drawer").toggleClass("is-visible", false);
    alert(element.id);
}

// File system helpers

function writeToFile(str) {
	if(!fileObj) return;
	var log = str + "\n";
	fileObj.createWriter(function(fileWriter) {
		
		fileWriter.seek(fileWriter.length);
		
		var blob = new Blob([log], {type:'text/plain'});
		fileWriter.write(blob);
		alert
	}, fail);
}

function readFromFile() {
	fileObj.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			alert(this.result);
		};

		reader.readAsText(file);
	}, fail);

}

function fail(error) {
    alert("Error: " + error.code);
}

function removefile(filename){
    fileSystem.root.getFile(filename, {create: false, exclusive: false}, gotRemoveFileEntry, fail);
}

function success(entry) {
    alert("File deleted");
}

function gotRemoveFileEntry(fileEntry){
    fileEntry.remove(success, fail);
}