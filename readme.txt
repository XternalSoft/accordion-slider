=== Accordion Slider ===
Contributors: bqworks
Donate link: https://bqworks.net/premium-add-ons/
Tags: accordion slider, responsive slider, responsive accordion, post accordion, image accordion, accordion plugin, vertical accordion, animated layers, accordion lightbox
Requires at least: 4.0
Tested up to: 6.5.2
Stable tag: 1.9.9
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Accordion Slider is a responsive accordion plugin that offers Premium features for FREE, like animated layers, post content, full width layout.

== Description ==

Accordion Slider combines the look and functionality of a slider with that of an accordion, allowing you to create horizontal or vertical accordion sliders which are fully responsive and mobile-friendly.

Features:

* Fully responsive on any device
* Touch support for touch-enabled screens
* Animated and static layers, which can contain text, images or any HTML content
* Horizontal and Vertical orientation
* Possibility to change the aspect of the accordion for different screen sizes (using breakpoints)
* Pagination (break the panels into multiple accordion pages)
* Keyboard navigation
* Mouse wheel navigation
* Retina support
* Lazy loading for images
* Deep linking (link to specific slide inside the accordion)
* Lightbox integration
* Load images (e.g., featured images) and content dynamically, from posts (including custom post types), WordPress galleries and Flickr
* Preview accordion sliders directly in the admin area
* Drag and drop panel sorting for easy management of the panels' order
* Publish accordion sliders in any post (including pages and custom post types), in PHP code, and widget areas
* Caching system for quick loading times
* Action and filter hooks to extend the functionality of the accordion slider
* Import and export accordion sliders between different plugin installations

[These videos](https://bqworks.net/accordion-slider/screencasts/) demonstrate the full capabilities of the plugin.

[Premium Add-ons](https://bqworks.net/premium-add-ons/#accordion-slider) allow you to further extend the functionality of the accordion slider:

* [Custom CSS and JavaScript](https://bqworks.net/premium-add-ons/#custom-css-js-for-accordion-slider): Allows you to add custom CSS and JavaScript code to your accordion sliders in a syntax highlighting code editor. It also features a revisions system that will backup all your code edits, allow you to compare between multiple revisions and restore a certain revision.
* [Revisions](https://bqworks.net/premium-add-ons/#revisions-for-accordion-slider): Automatically stores a record of each edit/update of your accordions, for comparison or backup purposes. Each accordion will have its own list of revisions, allowing you to easily preview a revision, analyze its settings, compare it to other revisions or restore it.

== Installation ==

To install the plugin:

1. Install the plugin through Plugins > Add New > Upload or by copying the unzipped package to wp-content/plugins/.
2. Activate the Accordion Slider plugin through the 'Plugins > Installed Plugins' menu in WordPress.

To create accordion sliders:

1. Go to Accordion Slider > Add New and click the 'Add Panels' button.
2. Select one or more images from the Media Library and click 'Insert into post'. 
3. After you customized the accordion slider, click the 'Create' button.

To publish accordion sliders:

Copy the [accordion_slider id="1"] shortcode in the post or page where you want the accordion to appear. You can also insert it in PHP code by using <?php do_shortcode( '[accordion_slider id="1"]' ); ?>, or in the widgets area by using the built-in Accordion Slider widget.

== Frequently Asked Questions ==

= How can I set the size of the images? =

When you select an image from the Media Library, in the right columns, under 'ATTACHMENT DISPLAY SETTINGS', you can use the 'Size' option to select the most appropriate size for the images.

== Screenshots ==

1. Accordion slider with text layers.
2. Simple accordion slider.
3. Vertical accordion slider.
4. Accordion slider with mixed content.
5. The admin interface for creating and editing an accordion.
6. The preview window in the admin area.
7. The layer editor in the admin area.
8. The background image editor in the admin area.
9. Adding dynamic tags for accordions generated from posts.

== Changelog ==

= 1.9.9 =
* fix panel content settings loading in admin

= 1.9.8 =
* fix deprecation notice regarding optional parameter in php 8

= 1.9.7 =
* minor security hardening
* other minor fixes

= 1.9.6 =
* improve support for gallery slides
* add support for deferred loading of scripts

= 1.9.5 =
* modify user capabilities requirements for editing sliders

= 1.9.4 =
* add possiblity to extend the sidebar settings panels
* other fixes and improvements

= 1.9.3 =
* add Gutenberg block

= 1.9.2 =
* some fixes and improvements

= 1.9.1 =
* added code mirror editor to HTML textareas
* add filter for allowed HTML tags
* other fixes and improvements

= 1.9.0 =
* added the add-ons installation interface

= 1.8.4 =
* added the possiblity to remove the existing custom CSS and Js

= 1.8.3 =
* fixed the inline CSS width and height of the accordion

= 1.8.2 =
* fixed the saving/updating functionality

= 1.8.1 =
* fixed type of Width and Height from 'number' to 'mixed' to address validation issue

= 1.8.0 =
* initial WordPress.org release