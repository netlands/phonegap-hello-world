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

            // avoid reload when back-button is pressed
            document.addEventListener("backbutton", function (e) {
                e.preventDefault();
            }, false);
        }
        if (cordova.platformId === 'ios') {
            platformId = "ios";
            document.body.style.marginTop = "20px";
            StatusBar.backgroundColorByHexString("#00BCD4");
        }

        // Mock device.platform property if not available
        if (!window.device) {
            window.device = {
                platform: 'Browser'
            };
        }

        handleExternalURLs();

    }
};


app.initialize();

function init() {
    "use strict";
    console.log("initialize page");
}