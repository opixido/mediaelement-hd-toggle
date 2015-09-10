# Mediaelement::HDToggle
This is a mediaelement.js plugin that adds an HD toggle to the control bar. It allows users to toggle between 2 specified qualities. (ex. HD/SD)

![](https://i.imgur.com/8WXhP4w.png)

## Installation
Download and add the JS and CSS file in your project

## Usage
You need to specify the quality of your sources on each <source> tag via the **data-quality** attribute ex. :

```html
<video >
  <source src="Tc-1.hd.mp4" type="video/mp4" data-quality="high"/>
  <source src="Tc-1.sd.mp4" type="video/mp4" data-quality="low"/>
  <source src="Tc-1.hd.webm" type="video/webm" data-quality="high"/>
  <source src="Tc-1.sd.webm" type="video/webm" data-quality="low"/>
</video>
```

The plugin will determine which type of video the browser can play and the applicable quality. If multiple playable files are found the first ones of each quality are used.

If zero or only one playable files are found with matching "data-quality" attributes, then the HDtoggle button will not be added.

Then just add **hdtoggle** to the features list when instantiating MediaElementJs

ex. :

```javascript
new MediaElementPlayer('#player',{
    features: ['playpause', 'progress', 'hdtoggle']
});
```

## Options
By default the options are:

```javascript
/**
 * Is it HD by default when loading the player or not ?
 */
hdToggleOn: true,
/**
 * List of qualities as specified in data-quality on <source tag>
 * Highest quality must be first for hdToggleOn to work properly
 */
hdToggleBetween: ["high", "low"],

/**
 * Title of the button
 * Added as title attribute and arial-label attribute for accessibility
 */
hdToggleTitle: 'Change video quality',

/**
 * Label inside the button (can be removed to replace by IMG)
 */
hdToggleLabel: 'HD'
```

## Contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
