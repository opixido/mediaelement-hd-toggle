(function ($) {
    $.extend(mejs.MepDefaults, {
        /**
         * Is it HD by default ?
         */
        hdToggleOn: true,
        /**
         * List of qualities as specified in data-quality on <source tag>
         * Highest must be first
         */
        hdToggleBetween: ["high", "low"],

        /**
         * Title of the button
         */
        hdToggleTitle: 'Change video quality',

        /**
         * Label inside the button (can be removed to replace by IMG)
         */
        hdToggleLabel: 'HD'

    });

    $.extend(MediaElementPlayer.prototype, {


        /**
         * Searches for the proper sources and adds the button
         *
         * @param player
         * @param controls
         * @param layers
         * @param media
         */
        buildhdtoggle: function (player, controls, layers, media) {

            /**
             * List of playable sources
             * @type {Array}
             */
            player.qualities = [];

            /**
             * List of all sources as declared in HTML
             * @type {*|{}}
             */
            player.sources = $(player.domNode).find("source");

            /**
             * Number of playable sources found (should be 2 max as it's only a toggle)
             * @type {number}
             */
            player.nbPlayableSources = 0;


            /**
             * Looping over all sources
             */
            for (var i = 0; i < player.sources.length; i++) {
                var src = player.sources[i];

                /**
                 * If this source can be played on this browser
                 */
                if ((media.canPlayType(src.type) == 'probably' || media.canPlayType(src.type) == 'maybe')) {

                    /**
                     * Then we loop over our qualities
                     */
                    for (var j = 0; j < player.options.hdToggleBetween.length; j++) {
                        /**
                         * And if the quality of the source matches one of our owns
                         * And the playables sources are not all found (<2)
                         */
                        if (src.getAttribute("data-quality") == player.options.hdToggleBetween[j] && player.nbPlayableSources < 2) {

                            /**
                             * The we add our qualities
                             * @type {*|string}
                             */
                            player.qualities[player.options.hdToggleBetween[j]] = src.getAttribute("src");
                            player.nbPlayableSources++;

                        }
                    }
                }
            }


            /**
             * If less than 2 playable and quality declared sources are found we don't add the button
             * And we let MEJS handle it like usual
             */
            if (player.nbPlayableSources < 2) {
                return;
            }

            /**
             * Let's create the button
             */
            player.hdtoggleButton = $('<div class="mejs-button mejs-hdtoggle-button">' +
                '<button ' +
                '       type="button" ' +
                '       aria-controls="' + player.id + '" ' +
                '       title="' + player.options.hdToggleTitle + '"' +
                '       aria-label="' + player.options.hdToggleTitle + '"' +
                '>' + player.options.hdToggleLabel + '</button>' +
                '</div>').click(
                function () {
                    /**
                     * And add the click action
                     */
                    player.toggleQuality();
                }
            ).appendTo(controls);


            if (player.options.hdToggleOn && player.qualities[player.options.hdToggleBetween[0]] != null) {
                /**
                 * If we were asked to set the HD per default and we found an HD file
                 * Then  let's play the HD file ...
                 */
                player.hdtoggleButton.addClass("mejs-hdtoggle-on");
                player.switchStream(player.qualities[player.options.hdToggleBetween[0]]);
            } else if (player.qualities[player.options.hdToggleBetween[1]] != null) {
                /**
                 * Else if we found an SD file let's play it
                 */
                player.switchStream(player.qualities[player.options.hdToggleBetween[1]]);
            } else {
                /**
                 * No sources found we should'nt be there ...
                 */
                console.log("Did not find " + hdToggleBetween[0] + " and " + hdToggleBetween[1] + " streams");
            }
        },


        /**
         * We clicked on the HD button
         * Let's change our source
         */
        toggleQuality: function () {
            var btn = this.hdtoggleButton;

            if (btn.hasClass("mejs-hdtoggle-on")) {
                /**
                 * If we were in HD
                 * Let's go to SD
                 */
                btn.removeClass("mejs-hdtoggle-on");
                this.switchStream(this.qualities[this.options.hdToggleBetween[1]]);
            } else {
                /**
                 * And vice-versa
                 */
                btn.addClass("mejs-hdtoggle-on");
                this.switchStream(this.qualities[this.options.hdToggleBetween[0]]);
            }
        },

        /**
         * Switches the current played file
         *
         * @param src new media SRC
         */
        switchStream: function (src) {

            /**
             * Our media object
             * @type {Object|string|*}
             */
            var media = this.media;

            /**
             * We do nothing if we are asked to to the same thing
             */
            if (media.currentSrc != src) {

                /**
                 * Storing currentTime
                 */
                var currentTime = media.currentTime;
                /**
                 * And current statu
                 */
                var paused = media.paused;

                /**
                 * Then we pause the video
                 */
                media.pause();

                /**
                 * And change source
                 */
                media.setSrc(src);

                /**
                 * When the new file is preloaded
                 */
                media.addEventListener('loadedmetadata', function (e) {
                    /**
                     * We continue playing where we stopped
                     */
                    media.currentTime = currentTime;
                }, true);


                /**
                 * On canPlay event
                 * @param e
                 */
                var canPlayAfterSourceSwitchHandler = function (e) {
                    /**
                     * If we weren't paused we play
                     */
                    if (!paused) {
                        media.play();
                    }
                    /**github
                     * And remove the listener
                     */
                    media.removeEventListener("canplay", canPlayAfterSourceSwitchHandler, true);
                };

                /**
                 * Whenever we're ready ...
                 */
                media.addEventListener('canplay', canPlayAfterSourceSwitchHandler, true);

                /**
                 * Then last be first of all we load the file
                 */
                media.load();
            }
        }
    });
})(mejs.$);
