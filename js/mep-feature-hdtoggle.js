(function($) {
        $.extend(mejs.MepDefaults, {
		hdToggleLabel: "HD",
		hdToggleOn: true,
                hdToggleBetween: ["high", "medium"]
        });

        $.extend(MediaElementPlayer.prototype, {

                buildhdtoggle: function(player, controls, layers, media) {
			player.qualities = [];
			player.sources = $(player.domNode).find("source");
			for (var i = 0; i < player.sources.length; i++) {
				var src = player.sources[i];
				if (src.getAttribute("data-plugin-type") == player.media.pluginType) {
					for (var j = 0; j < player.options.hdToggleBetween.length; j++) {
						if (src.getAttribute("data-quality") == player.options.hdToggleBetween[j]) {
							player.qualities[j] = src.getAttribute("src");
						}
					}
				}
			}

			player.hdtoggleButton = $('<div class="mejs-button mejs-hdtoggle-button">'+
					'<button type="button" aria-controls="' + player.id + '" title="Toggle between HD and SD quality">' + player.options.hdToggleLabel + '</button>'+
				'</div>').click(function(){
					player.toggleQuality();
				}).appendTo(controls);

			if (player.options.hdToggleOn && player.qualities[0] != null) {
				player.hdtoggleButton.addClass("mejs-hdtoggle-on");
				player.switchStream(player.qualities[0]);
			} else if (player.qualities[1] != null) {
				player.switchStream(player.qualities[1]);
			} else {
				alert("Did not find " + hdToggleBetween[0] + " and " + hdToggleBetween[1] + " streams");
			}
		},

		toggleQuality: function() {
			var btn = this.hdtoggleButton;
			if (btn.hasClass("mejs-hdtoggle-on")) {
				btn.removeClass("mejs-hdtoggle-on");
				this.switchStream(this.qualities[1]);
			} else {
				btn.addClass("mejs-hdtoggle-on");
				this.switchStream(this.qualities[0]);
			}
		}
	});
})(mejs.$);

