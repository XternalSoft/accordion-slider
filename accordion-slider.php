<?php

/*
	Plugin Name: Accordion Slider
	Plugin URI:  https://bqworks.net/accordion-slider/
	Description: Responsive and touch-enabled accordion slider.
	Version:     1.9.8
	Author:      bqworks
	Author URI:  https://bqworks.net
*/

// if the file is called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

define( 'ACCORDION_SLIDER_DIR_PATH', plugin_dir_path( __FILE__ ) );

require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-accordion-slider.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-accordion-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-panel-renderer-factory.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-dynamic-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-posts-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-posts-ids-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-gallery-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-flickr-panel-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-layer-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-layer-renderer-factory.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-paragraph-layer-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-heading-layer-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-image-layer-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-div-layer-renderer.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'public/class-video-layer-renderer.php' );

require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-accordion-slider-activation.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-accordion-slider-widget.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-accordion-slider-settings.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-accordion-slider-validation.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-flickr.php' );
require_once( ACCORDION_SLIDER_DIR_PATH . 'includes/class-hideable-gallery.php' );

register_activation_hook( __FILE__, array( 'BQW_Accordion_Slider_Activation', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'BQW_Accordion_Slider_Activation', 'deactivate' ) );

add_action( 'plugins_loaded', array( 'BQW_Accordion_Slider', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'BQW_Accordion_Slider_Activation', 'get_instance' ) );
add_action( 'plugins_loaded', array( 'BQW_Hideable_Gallery', 'get_instance' ) );

// register the widget
add_action( 'widgets_init', 'bqw_as_register_widget' );

// Gutenberg block
require_once( ACCORDION_SLIDER_DIR_PATH . 'gutenberg/class-accordion-slider-block.php' );
add_action( 'plugins_loaded', array( 'BQW_Accordion_Slider_Block', 'get_instance' ) );

if ( is_admin() ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
	require_once( ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php' );
	require_once( ACCORDION_SLIDER_DIR_PATH . 'admin/class-accordion-slider-admin.php' );
	require_once( ACCORDION_SLIDER_DIR_PATH . 'admin/class-accordion-slider-add-ons.php' );
	require_once( ACCORDION_SLIDER_DIR_PATH . 'admin/class-accordion-slider-updates.php' );
	add_action( 'plugins_loaded', array( 'BQW_Accordion_Slider_Admin', 'get_instance' ) );
	add_action( 'plugins_loaded', array( 'BQW_Accordion_Slider_Add_Ons', 'get_instance' ) );
	add_action( 'admin_init', array( 'BQW_Accordion_Slider_Updates', 'get_instance' ) );
}