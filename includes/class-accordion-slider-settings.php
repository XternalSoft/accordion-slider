<?php
/**
 * Contains the default settings for the accordion, panels, layers etc.
 * 
 * @since 1.0.0
 */
class BQW_Accordion_Slider_Settings {

	/**
	 * The accordion's settings.
	 * 
	 * The array contains the name, label, type, default value, 
	 * JavaScript name and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $settings = array();

	/**
	 * The groups of accordion settings panels.
	 *
	 * The settings are grouped for the purpose of generating
	 * the accordion's admin sidebar panels.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $accordion_settings_panels = array();

	/**
	 * Layer settings.
	 *
	 * The array contains the name, label, type, default value
	 * and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $layer_settings = array();

	/**
	 * Panel settings.
	 *
	 * The array contains the name, label, type, default value
	 * and description of the setting.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $panel_settings = array();

	/**
	 * List of settings that can be used for breakpoints.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $breakpoint_settings = array(
		'width',
		'height',
		'responsive',
		'responsive_mode',
		'aspect_ratio',
		'orientation',
		'panel_distance',
		'visible_panels'
	);

	/**
	 * Hold the state (opened or closed) of the sidebar panels.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $panels_state = array(
		'appearance' => '',
		'animations' => 'closed',
		'autoplay' => 'closed',
		'mouse_wheel' => 'closed',
		'keyboard' => 'closed',
		'swap_background' => 'closed',
		'touch_swipe' => 'closed',
		'lightbox' => 'closed',
		'video' => 'closed',
		'miscellaneous' => 'closed',
		'breakpoints'  => 'closed'
	);

	/**
	 * Holds the plugin settings.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $plugin_settings = array();

	/**
	 * Return the accordion settings.
	 *
	 * @since 1.0.0
	 * 
	 * @param  string      $name The name of the setting. Optional.
	 * @return array|mixed       The array of settings or the value of the setting.
	 */
	public static function getSettings( $name = null ) {
		if ( empty( self::$settings ) ) {
			self::$settings = array(
				'width' => array(
					'js_name' => 'width',
					'label' => __( 'Width', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => 800,
					'description' => __( 'Sets the width of the accordion. Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like 100%. In order to make the accordion responsive, it\'s not necessary to use percentage values. More about this in the description of the Responsive option.', 'accordion-slider' )
				),
				'height' => array(
					'js_name' => 'height',
					'label' => __( 'Height', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => 400,
					'description' => __( 'Sets the height of the accordion. Can be set to a fixed value, like 400 (indicating 400 pixels). It\'s not recommended to set this to a percentage value, and it\'s not usually needed, as the accordion will be responsive even with a fixed value set for the height.', 'accordion-slider' )
				),
				'responsive' => array(
					'js_name' => 'responsive',
					'label' => __( 'Responsive', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Makes the accordion responsive. The accordion can be responsive even if the Width and/or Height options are set to fixed values. In this situation, the Width and Height will act as the maximum width and height of the accordion.', 'accordion-slider' )
				),
				'responsive_mode' => array(
					'js_name' => 'responsiveMode',
					'label' => __( 'Responsive Mode', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'auto',
					'available_values' => array(
						'auto' => __( 'Auto', 'accordion-slider' ),
						'custom' => __( 'Custom', 'accordion-slider' )
					),
					'description' => __( '\'Auto\' resizes the accordion and all of its elements (e.g., layers, videos) automatically, while \'Custom\' resizes only the accordion container and panels, and you are given flexibility over the way inner elements (e.g., layers, videos) will respond to smaller sizes. For example, you could use CSS media queries to define different text sizes or to hide certain elements when the accordion becomes smaller, ensuring that all content remains readable without having to zoom in. It\'s important to note that, if \'Auto\' responsiveness is used, the \'Width\' and \'Height\' need to be set to fixed values, so that the accordion can calculate correctly how much it needs to scale.', 'accordion-slider' )
				),
				'aspect_ratio' => array(
					'js_name' => 'aspectRatio',
					'label' => __( 'Aspect Ratio', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => __( 'Sets the aspect ratio of the accordion. The accordion will set its height depending on what value its width has, so that this ratio is maintained. For this reason, the set \'Height\' might be overridden. This property can be used only when \'Responsive Mode\' is set to \'Custom\'. When it\'s set to \'Auto\', the \'Aspect Ratio\' needs to remain -1.', 'accordion-slider' )
				),
				'orientation' => array(
					'js_name' => 'orientation',
					'label' => __( 'Orientation', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'horizontal',
					'available_values' => array(
						'horizontal' => __( 'Horizontal', 'accordion-slider' ),
						'vertical' => __( 'Vertical', 'accordion-slider' )
					),
					'description' => __( 'Sets the orientation of the panels.', 'accordion-slider' )
				),
				'shadow' => array(
					'js_name' => 'shadow',
					'label' => __( 'Shadow', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the panels will have a drop shadow effect.', 'accordion-slider' )
				),
				'panel_distance' => array(
					'js_name' => 'panelDistance',
					'label' => __( 'Panel Distance', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 0,
					'description' => __( 'Sets the distance between consecutive panels. Can be set to a percentage or fixed value.', 'accordion-slider' )
				),
				'panel_overlap' => array(
					'js_name' => 'panelOverlap',
					'label' => __( 'Panel Overlap', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the panels will be overlapped. If set to false, the panels will have their width or height set so that they are next to each other, but not overlapped.', 'accordion-slider' )
				),
				'visible_panels' => array(
					'js_name' => 'visiblePanels',
					'label' => __( 'Visible Panels', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => __( 'Indicates the number of panels visible per page. If set to -1, all the panels will be displayed on one page.', 'accordion-slider' )
				),
				'start_panel' => array(
					'js_name' => 'startPanel',
					'label' => __( 'Start Panel', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => -1,
					'description' => __( 'Indicates which panel will be opened when the accordion loads (0 for the first panel, 1 for the second panel, etc.). If set to -1, no panel will be opened.', 'accordion-slider' )
				),
				'start_page' => array(
					'js_name' => 'startPage',
					'label' => __( 'Start Page', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 0,
					'description' => __( 'Indicates which page will be opened when the accordion loads, if the panels are displayed on more than one page.', 'accordion-slider' )
				),
				'shuffle' => array(
					'js_name' => 'shuffle',
					'label' => __( 'Shuffle', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the panels will be randomized.', 'accordion-slider' )
				),
				'custom_class' => array(
					'label' => __( 'Custom Class', 'accordion-slider' ),
					'type' => 'text',
					'default_value' => '',
					'description' => __( 'Adds a custom class to the accordion, for use in custom css. Add the class name without the dot, i.e., you need to add <i>my-accordion</i>, not <i>.my-accordion</i>.', 'accordion-slider' )
				),

				'opened_panel_size' => array(
					'js_name' => 'openedPanelSize',
					'label' => __( 'Opened Panel Size', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => 'max',
					'description' => __( 'Sets the size (width if the accordion\'s Orientation is Horizontal; height if the accordion\'s Orientation is Vertical) of the opened panel. Possible values are: \'max\', which will open the panel to its maximum size, so that all the inner content is visible, a percentage value, like \'50%\', which indicates the percentage of the total size (width or height, depending on the Orientation) of the accordion, or a fixed value.', 'accordion-slider' )
				),
				'max_opened_panel_size' => array(
					'js_name' => 'maxOpenedPanelSize',
					'label' => __( 'Max Opened Panel Size', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => '80%',
					'description' => __( 'Sets the maximum allowed size of the opened panel. This should be used when the \'Opened Panel Size\' is set to \'max\', because sometimes the maximum size of the panel might be too big and we want to set a limit. The property can be set to a percentage (of the total size of the accordion) or to a fixed value.', 'accordion-slider' )
				),
				'open_panel_on' => array(
					'js_name' => 'openPanelOn',
					'label' => __( 'Open Panel On', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'hover',
					'available_values' => array(
						'hover' => __( 'Hover', 'accordion-slider' ),
						'click' => __( 'Click', 'accordion-slider' ),
						'never' => __( 'Never', 'accordion-slider' )
					),
					'description' => __( 'If set to \'Hover\', the panels will be opened by moving the mouse pointer over them; if set to \'Click\', the panels will open when clicked. Can also be set to \'never\' to disable the opening of the panels.', 'accordion-slider' )
				),
				'close_panels_on_mouse_out' => array(
					'js_name' => 'closePanelsOnMouseOut',
					'label' => __( 'Close Panels On Mouse Out', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Determines whether the opened panel closes or remains open when the mouse pointer is moved away.', 'accordion-slider' )
				),
				'mouse_delay' => array(
					'js_name' => 'mouseDelay',
					'label' => __( 'Mouse Delay', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 200,
					'description' => __( 'Sets the delay in milliseconds between the movement of the mouse pointer and the opening of the panel. Setting a delay ensures that panels are not opened if the mouse pointer only moves over them without an intent to open the panel.', 'accordion-slider' )
				),
				'open_panel_duration' => array(
					'js_name' => 'openPanelDuration',
					'label' => __( 'Open Panel Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 700,
					'description' => __( 'Determines the duration in milliseconds for the opening animation of the panel.', 'accordion-slider' )
				),
				'close_panel_duration' => array(
					'js_name' => 'closePanelDuration',
					'label' => __( 'Close Panel Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 700,
					'description' => __( 'Determines the duration in milliseconds for the closing animation of the panel.', 'accordion-slider' )
				),
				'page_scroll_duration' => array(
					'js_name' => 'pageScrollDuration',
					'label' => __( 'Page Scroll Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 500,
					'description' => __( 'Indicates the duration of the page scrolling animation.', 'accordion-slider' )
				),
				'page_scroll_easing' => array(
					'js_name' => 'pageScrollEasing',
					'label' => __( 'Page Scroll Easing', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'swing',
					'available_values' => array(
						'swing' => 'Swing',
						'easeInQuad' => 'Quad In',
						'easeOutQuad' => 'Quad Out',
						'easeInOutQuad' => 'Quad In Out',
						'easeInCubic' => 'Cubic In',
						'easeOutCubic' => 'Cubic Out',
						'easeInOutCubic' => 'Cubic In Out',
						'easeInQuart' => 'Quart In',
						'easeOutQuart' => 'Quart Out',
						'easeInOutQuart' => 'Quart In Out',
						'easeInQuint' => 'Quint In',
						'easeOutQuint' => 'Quint Out',
						'easeInOutQuint' => 'Quint In Out',
						'easeInSine' => 'Sine In',
						'easeOutSine' => 'Sine Out',
						'easeInOutSine' => 'Sine In Out',
						'easeInExpo' => 'Expo In',
						'easeOutExpo' => 'Expo Out',
						'easeInOutExpo' => 'Expo In Out',
						'easeInCirc' => 'Circ In',
						'easeOutCirc' => 'Circ Out',
						'easeInOutCirc' => 'Circ In Out',
						'easeInElastic' => 'Elastic In',
						'easeOutElastic' => 'Elastic Out',
						'easeInOutElastic' => 'Elastic In Out',
						'easeInBack' => 'Back In',
						'easeOutBack' => 'Back Out',
						'easeInOutBack' => 'Back In Out',
						'easeInBounce' => 'Bounce In',
						'easeOutBounce' => 'Bounce Out',
						'easeInOutBounce' => 'Bounce In Out'
					),
					'description' => __( 'Indicates the easing type of the page scrolling animation.', 'accordion-slider' )
				),

				'autoplay' => array(
					'js_name' => 'autoplay',
					'label' => __( 'Autoplay', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the autoplay will be enabled.', 'accordion-slider' )
				),
				'autoplay_delay' => array(
					'js_name' => 'autoplayDelay',
					'label' => __( 'Autoplay Delay', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 5000,
					'description' => __( 'Sets the delay, in milliseconds, of the autoplay cycle.', 'accordion-slider' )
				),
				'autoplay_direction' => array(
					'js_name' => 'autoplayDirection',
					'label' => __( 'Autoplay Direction', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'normal',
					'available_values' => array(
						'normal' =>  __( 'Normal', 'accordion-slider' ),
						'backwards' =>  __( 'Backwards', 'accordion-slider' )
					),
					'description' => __( 'Sets the direction in which the panels will be opened. Can be set to \'Normal\' (ascending order) or \'Backwards\' (descending order).', 'accordion-slider' )
				),
				'autoplay_on_hover' => array(
					'js_name' => 'autoplayOnHover',
					'label' => __( 'Autoplay On Hover', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'pause',
					'available_values' => array(
						'pause' => __( 'Pause', 'accordion-slider' ),
						'stop' => __( 'Stop', 'accordion-slider' ),
						'none' => __( 'None', 'accordion-slider' )
					),
					'description' => __( 'Indicates if the autoplay will be paused when the accordion is hovered.', 'accordion-slider' )
				),

				'mouse_wheel' => array(
					'js_name' => 'mouseWheel',
					'label' => __( 'Mouse Wheel', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the accordion will respond to mouse wheel input.', 'accordion-slider' )
				),
				'mouse_wheel_sensitivity' => array(
					'js_name' => 'mouseWheelSensitivity',
					'label' => __( 'Mouse Wheel Sensitivity', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => __( 'Sets how sensitive the accordion will be to mouse wheel input. Lower values indicate stronger sensitivity.', 'accordion-slider' )
				),
				'mouse_wheel_target' => array(
					'js_name' => 'mouseWheelTarget',
					'label' => __( 'Mouse Wheel Target', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'panel',
					'available_values' => array(
						'panel' => __( 'Panel', 'accordion-slider' ),
						'page' => __( 'Page', 'accordion-slider' )
					),
					'description' => __( 'Sets what elements will be targeted by the mouse wheel input. Can be set to \'Panel\' or \'Page\'. Setting it to \'Panel\' will indicate that the panels will be scrolled, while setting it to \'Page\' indicate that the pages will be scrolled.', 'accordion-slider' )
				),

				'keyboard' => array(
					'js_name' => 'keyboard',
					'label' => __( 'Keyboard', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the accordion will respond to keyboard input.', 'accordion-slider' )
				),

				'keyboard_only_on_focus' => array(
					'js_name' => 'keyboardOnlyOnFocus',
					'label' => __( 'Keyboard Only On Focus', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the accordion will respond to keyboard input only if the accordion has focus.', 'accordion-slider' )
				),

				'keyboard_target' => array(
					'js_name' => 'keyboardTarget',
					'label' => __( 'Keyboard Target', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'panel',
					'available_values' => array(
						'panel' => __( 'Panel', 'accordion-slider' ),
						'page' => __( 'Page', 'accordion-slider' )
					),
					'description' => __( 'Sets what elements will be targeted by the keyboard input. Can be set to \'Panel\' or \'Page\'. Setting it to \'Panel\' will indicate that the panels will be scrolled, while setting it to \'Page\' indicate that the pages will be scrolled.', 'accordion-slider' )
				),

				'swap_background_duration' => array(
					'js_name' => 'swapBackgroundDuration',
					'label' => __( 'Swap Background Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 700,
					'description' => __( 'Sets the duration, in milliseconds, of the transition effect.', 'accordion-slider' )
				),
				'fade_out_background' => array(
					'js_name' => 'fadeOutBackground',
					'label' => __( 'Fade Out Background', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the main image background will be faded out when the opened/alternative background fades in.', 'accordion-slider' )
				),

				'touch_swipe' => array(
					'js_name' => 'touchSwipe',
					'label' => __( 'Touch Swipe', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the touch swipe functionality will be enabled.', 'accordion-slider' )
				),
				'touch_swipe_threshold' => array(
					'js_name' => 'touchSwipeThreshold',
					'label' => __( 'Touch Swipe Threshold', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => __( 'Sets how many pixels the distance of the swipe gesture needs to be in order to trigger a page change.', 'accordion-slider' )
				),

				'lightbox' => array(
					'js_name' => 'lightbox',
					'label' => __( 'Lightbox', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the links specified to the background images will be opened in a lightbox.', 'accordion-slider' )
				),

				'open_panel_video_action' => array(
					'js_name' => 'openPanelVideoAction',
					'label' => __( 'Open Panel Video Action', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'playVideo',
					'available_values' => array(
						'playVideo' => __( 'Play Video', 'accordion-slider' ),
						'none' => __( 'None', 'accordion-slider' )
					),
					'description' => __( 'Sets what the video will do when the panel is opened. Can be set to \'Play Video\' or \'None\'.', 'accordion-slider' )
				),
				'close_panel_video_action' => array(
					'js_name' => 'closePanelVideoAction',
					'label' => __( 'Close Panel Video Action', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'pauseVideo',
					'available_values' => array(
						'pauseVideo' => __( 'Pause Video', 'accordion-slider' ),
						'stopVideo' => __( 'Stop Video', 'accordion-slider' )
					),
					'description' => __( 'Sets what the video will do when the panel is closed. Can be set to \'Pause Video\' or \'Stop Video\'.', 'accordion-slider' )
				),
				'play_video_action' => array(
					'js_name' => 'playVideoAction',
					'label' => __( 'Play Video Action', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'stopAutoplay',
					'available_values' => array(
						'stopAutoplay' => __( 'Stop Autoplay', 'accordion-slider' ),
						'none' => __( 'None', 'accordion-slider' )
					),
					'description' => __( 'Sets what the accordion will do when a video starts playing. Can be set to \'Stop Autoplay\' or \'None\'.', 'accordion-slider' )
				),
				'pause_video_action' => array(
					'js_name' => 'pauseVideoAction',
					'label' => __( 'Pause Video Action', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'startAutoplay' => __( 'Start Autoplay', 'accordion-slider' ),
						'none' => 'None'
					),
					'description' => __( 'Sets what the accordion will do when a video is paused. Can be set to \'Start Autoplay\' or \'None\'.', 'accordion-slider' )
				),
				'end_video_action' => array(
					'js_name' => 'endVideoAction',
					'label' => __( 'End Video Action', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'none',
					'available_values' => array(
						'startAutoplay' => __( 'Start Autoplay', 'accordion-slider' ),
						'nextPanel' => __( 'Next Panel', 'accordion-slider' ),
						'replayVideo' => __( 'Replay Video', 'accordion-slider' ),
						'none' => 'None'
					),
					'description' => __( 'Sets what the accordion will do when a video ends. Can be set to \'Start Autoplay\', \'Next Panel\', \'Replay Video\' or \'None\'.', 'accordion-slider' )
				),

				'lazy_loading' => array(
					'label' => __( 'Lazy Loading', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => false,
					'description' => __( 'Indicates if the background images will be loaded only when they are visible. Images from accordion pages that are not visible, will not be loaded.', 'accordion-slider' )
				),
				'hide_image_title' => array(
					'label' => __( 'Hide Image Title', 'accordion-slider' ),
					'type' => 'boolean',
					'default_value' => true,
					'description' => __( 'Indicates if the title tag will be removed from images in order to prevent the title to show up in a tooltip when the image is hovered.', 'accordion-slider' )
				),
				'link_target' => array(
					'js_name' => 'linkTarget',
					'label' => __( 'Link Target', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => '_self',
					'available_values' => array(
						'_self' => __( 'Self', 'accordion-slider' ),
						'_blank' => __( 'Blank', 'accordion-slider' ),
						'_parent' => __( 'Parent', 'accordion-slider' ),
						'_top' => __( 'Top', 'accordion-slider' )
					),
					'description' => __( 'Sets the location where the slide links will be opened.', 'accordion-slider' )
				)
			);

			self::$settings = apply_filters( 'accordion_slider_default_settings', self::$settings );
		}

		if ( is_null( $name ) ) {
			return self::$settings;
		}

		if ( is_null( self::$settings[ $name ] ) ) {
			return null;
		}

		return self::$settings[ $name ];
	}

	/**
	 * Return the accordion settings panels.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of settings panels.
	 */
	public static function getAccordionSettingsPanels() {
		if ( empty( self::$accordion_settings_panels ) ) {
			self::$accordion_settings_panels = array(
				'appearance' => array(
					'label' => __( 'Appearance', 'accordion-slider' ),
					'list' => array(
						'width',
						'height',
						'responsive',
						'responsive_mode',
						'aspect_ratio',
						'orientation',
						'shadow',
						'panel_distance',
						'panel_overlap',
						'visible_panels',
						'start_panel',
						'start_page',
						'shuffle',
						'custom_class'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'animations' => array(
					'label' => __( 'Animations', 'accordion-slider' ),
					'list' => array(
						'opened_panel_size',
						'max_opened_panel_size',
						'open_panel_on',
						'close_panels_on_mouse_out',
						'mouse_delay',
						'open_panel_duration',
						'close_panel_duration',
						'page_scroll_duration',
						'page_scroll_easing'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'autoplay' => array(
					'label' => __( 'Autoplay', 'accordion-slider' ),
					'list' => array(
						'autoplay',
						'autoplay_delay',
						'autoplay_direction',
						'autoplay_on_hover'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'mouse_wheel' => array(
					'label' => __( 'Mouse Wheel', 'accordion-slider' ),
					'list' => array(
						'mouse_wheel',
						'mouse_wheel_sensitivity',
						'mouse_wheel_target'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'keyboard' => array(
					'label' => __( 'Keyboard', 'accordion-slider' ),
					'list' => array(
						'keyboard',
						'keyboard_only_on_focus',
						'keyboard_target'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'swap_background' => array(
					'label' => __( 'Swap Background', 'accordion-slider' ),
					'list' => array(
						'swap_background_duration',
						'fade_out_background'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'touch_swipe' => array(
					'label' => __( 'Touch Swipe', 'accordion-slider' ),
					'list' => array(
						'touch_swipe',
						'touch_swipe_threshold'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'lightbox' => array(
					'label' => __( 'Lightbox', 'accordion-slider' ),
					'list' => array(
						'lightbox'
					),
					'inline_info' => array(
						__( 'By default, the accordion will open the background image in the lightbox, but at its full size.' , 'accordion-slider' ),
						__( 'If you want to open a different image or other content, you need to specify the custom content in the <i>Background Image</i> editor, in the <i>Link</i> field.' , 'accordion-slider' )
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'video' => array(
					'label' => __( 'Video', 'accordion-slider' ),
					'list' => array(
						'open_panel_video_action',
						'close_panel_video_action',
						'play_video_action',
						'pause_video_action',
						'end_video_action'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'miscellaneous' => array(
					'label' => __( 'Miscellaneous', 'accordion-slider' ),
					'list' => array(
						'lazy_loading',
						'hide_image_title',
						'link_target'
					),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/default-panel.php'
				),

				'breakpoints' => array(
					'label' => __( 'Breakpoints', 'accordion-slider' ),
					'renderer' => ACCORDION_SLIDER_DIR_PATH . 'admin/views/accordion-settings/breakpoints-panel.php'
				)
			);
		}

		self::$accordion_settings_panels = apply_filters( 'accordion_slider_accordion_settings_panels', self::$accordion_settings_panels );

		return self::$accordion_settings_panels;
	}
	
	/**
	 * Return the breakpoint settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of breakpoint settings.
	 */
	public static function getBreakpointSettings() {
		return apply_filters( 'accordion_slider_breakpoint_settings', self::$breakpoint_settings );
	}

	/**
	 * Return the default panels state.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of panels state.
	 */
	public static function getPanelsState() {
		return self::$panels_state;
	}

	/**
	 * Return the layer settings.
	 *
	 * @since 1.0.0
	 * 
	 * @param  string $name The name of the setting. Optional.
	 * @return array        The array of layer settings.
	 */
	public static function getLayerSettings( $name = null ) {
		if ( empty( self::$layer_settings ) ) {
			self::$layer_settings = array(
				'type' => array(
					'label' => __( 'Type', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'div',
					'available_values' => array(
						'paragraph' => __( 'Paragraph', 'accordion-slider' ),
						'heading' => __( 'Heading', 'accordion-slider' ),
						'image' => __( 'Image', 'accordion-slider' ),
						'video' => __( 'Video', 'accordion-slider' ),
						'div' => __( 'DIV', 'accordion-slider' )
					),
					'description' => ''
				),
				'heading_type' => array(
					'label' => __( 'Heading Type', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'h3',
					'available_values' => array(
						'h1' => __( 'H1', 'accordion-slider' ),
						'h2' => __( 'H2', 'accordion-slider' ),
						'h3' => __( 'H3', 'accordion-slider' ),
						'h4' => __( 'H4', 'accordion-slider' ),
						'h5' => __( 'H5', 'accordion-slider' ),
						'h6' => __( 'H6', 'accordion-slider' )
					),
					'description' => ''
				),
				'display' => array(
					'label' => __( 'Display', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'always',
					'available_values' => array(
						'always' => __( 'Always', 'accordion-slider' ),
						'opened' => __( 'When opened', 'accordion-slider' ),
						'closed' => __( 'When closed', 'accordion-slider' )
					),
					'description' => ''
				),
				'position' => array(
					'label' => __( 'Position', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'topLeft',
					'available_values' => array(
						'topLeft' => __( 'Top Left', 'accordion-slider' ),
						'topRight' => __( 'Top Right', 'accordion-slider' ),
						'bottomLeft' => __( 'Bottom Left', 'accordion-slider' ),
						'bottomRight' => __( 'Bottom Right', 'accordion-slider' )
					),
					'description' => ''
				),
				'width' => array(
					'label' => __( 'Width', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => 'auto',
					'description' => ''
				),
				'height' => array(
					'label' => __( 'Height', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => 'auto',
					'description' => ''
				),
				'horizontal' => array(
					'label' => __( 'Horizontal', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => '0',
					'description' => ''
				),
				'vertical' => array(
					'label' => __( 'Vertical', 'accordion-slider' ),
					'type' => 'mixed',
					'default_value' => '0',
					'description' => ''
				),
				'preset_styles' => array(
					'label' => __( 'Preset Styles', 'accordion-slider' ),
					'type' => 'multiselect',
					'default_value' => array( 'as-black', 'as-padding' ),
					'available_values' => array(
						'as-black' => __( 'Black', 'accordion-slider' ),
						'as-white' => __( 'White', 'accordion-slider' ),
						'as-padding' => __( 'Padding', 'accordion-slider' ),
						'as-rounded' => __( 'Round Corners', 'accordion-slider' ),
						'as-vertical' => __( 'Vertical', 'accordion-slider' )
					),
					'description' => ''
				),
				'custom_class' => array(
					'label' => __( 'Custom Class', 'accordion-slider' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'show_transition' => array(
					'label' => __( 'Show Transition', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'fade',
					'available_values' => array(
						'fade' => __( 'Fade', 'accordion-slider' ),
						'left' => __( 'Left', 'accordion-slider' ),
						'right' => __( 'Right', 'accordion-slider' ),
						'up' => __( 'Up', 'accordion-slider' ),
						'down' => __( 'Down', 'accordion-slider' )
					),
					'description' => ''
				),
				'show_offset' => array(
					'label' => __( 'Show Offset', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => ''
				),
				'show_delay' => array(
					'label' => __( 'Show Delay', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'show_duration' => array(
					'label' => __( 'Show Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 400,
					'description' => ''
				),
				'hide_transition' => array(
					'label' => __( 'Hide Transition', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'fade',
					'available_values' => array(
						'fade' => __( 'Fade', 'accordion-slider' ),
						'left' => __( 'Left', 'accordion-slider' ),
						'right' => __( 'Right', 'accordion-slider' ),
						'up' => __( 'Up', 'accordion-slider' ),
						'down' => __( 'Down', 'accordion-slider' )
					),
					'description' => ''
				),
				'hide_offset' => array(
					'label' => __( 'Hide Offset', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 50,
					'description' => ''
				),
				'hide_delay' => array(
					'label' => __( 'Hide Delay', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'hide_duration' => array(
					'label' => __( 'Hide Duration', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 400,
					'description' => ''
				)
			);

			self::$layer_settings = apply_filters( 'accordion_slider_default_layer_settings', self::$layer_settings );
		}

		if ( is_null( $name ) ) {
			return self::$layer_settings;
		}

		if ( is_null( self::$layer_settings[ $name ] ) ) {
			return null;
		}

		return self::$layer_settings[ $name ];
	}

	/**
	 * Return the panel settings.
	 *
	 * @since 1.0.0
	 * 
	 * @param  string $name The name of the setting. Optional.
	 * @return array        The array of panel settings.
	 */
	public static function getPanelSettings( $name = null ) {
		if ( empty( self::$panel_settings ) ) {
			self::$panel_settings = array(
				'content_type' => array(
					'label' => __( 'Content Type', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'custom',
					'available_values' => array(
						'custom' => __( 'Custom Content', 'accordion-slider' ),
						'posts' => __( 'Content from posts', 'accordion-slider' ),
						'posts_ids' => __( 'Content from defined posts IDs', 'accordion-slider' ),
						'gallery' => __( 'Images from post\'s gallery', 'accordion-slider' ),
						'flickr' => __( 'Flickr images', 'accordion-slider' )
					),
					'description' => ''
				),
				'posts_post_types' => array(
					'label' => __( 'Post Types', 'accordion-slider' ),
					'type' => 'multiselect',
					'default_value' => array( 'post' ),
					'description' => ''
				),
				'posts_taxonomies' => array(
					'label' => __( 'Taxonomies', 'accordion-slider' ),
					'type' => 'multiselect',
					'default_value' => array(),
					'description' => ''
				),
				'posts_relation' => array(
					'label' => __( 'Match', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'OR',
					'available_values' => array(
						'OR' => __( 'At least one', 'accordion-slider' ),
						'AND' => __( 'All', 'accordion-slider' )
					),
					'description' => ''
				),
				'posts_operator' => array(
					'label' => __( 'With selected', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'IN',
					'available_values' => array(
						'IN' => __( 'Include', 'accordion-slider' ),
						'NOT IN' => __( 'Exclude', 'accordion-slider' )
					),
					'description' => ''
				),
				'posts_order_by' => array(
					'label' => __( 'Order By', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'date',
					'available_values' => array(
						'date' => __( 'Date', 'accordion-slider' ),
						'comment_count' => __( 'Comments', 'accordion-slider' ),
						'title' => __( 'Title', 'accordion-slider' ),
						'rand' => __( 'Random', 'accordion-slider' )
					),
					'description' => ''
				),
				'posts_order' => array(
					'label' => __( 'Order', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'DESC',
					'available_values' => array(
						'DESC' => __( 'Descending', 'accordion-slider' ),
						'ASC' => __( 'Ascending', 'accordion-slider' )
					),
					'description' => ''
				),
                'posts_ids' => array(
					'label' => __( 'Post IDs', 'accordion-slider' ),
					'type' => 'text',
					'default_value' => '',
					'description' => __('Comma separated list of post IDs.', 'accordion-slider' )
				),
				'posts_maximum' => array(
					'label' => __( 'Limit', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				),
				'flickr_api_key' => array(
					'label' => __( 'API Key', 'accordion-slider' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'flickr_load_by' => array(
					'label' => __( 'Load By', 'accordion-slider' ),
					'type' => 'select',
					'default_value' => 'set_id',
					'available_values' => array(
						'set_id' => __( 'Set ID', 'accordion-slider' ),
						'user_id' => __( 'User ID', 'accordion-slider' )
					),
					'description' => ''
				),
				'flickr_id' => array(
					'label' => __( 'ID', 'accordion-slider' ),
					'type' => 'text',
					'default_value' => '',
					'description' => ''
				),
				'flickr_per_page' => array(
					'label' => __( 'Limit', 'accordion-slider' ),
					'type' => 'number',
					'default_value' => 10,
					'description' => ''
				)
			);

			self::$panel_settings = apply_filters( 'accordion_slider_default_panel_settings', self::$panel_settings );
		}

		if ( is_null( $name ) ) {
			return self::$panel_settings;
		}

		if ( is_null( self::$panel_settings[ $name ] ) ) {
			return null;
		}
		
		return self::$panel_settings[ $name ];
	}

	/**
	 * Return the plugin settings.
	 *
	 * @since 1.0.0
	 * 
	 * @return array The array of plugin settings.
	 */
	public static function getPluginSettings() {
		if ( empty( self::$plugin_settings ) ) {
			self::$plugin_settings = array(
				'load_stylesheets' => array(
					'label' => __( 'Load stylesheets', 'accordion-slider' ),
					'default_value' => 'automatically',
					'available_values' => array(
						'automatically' => __( 'Automatically', 'accordion-slider' ),
						'homepage' => __( 'On homepage', 'accordion-slider' ),
						'all' => __( 'On all pages', 'accordion-slider' )
					),
					'description' => __( 'The plugin can detect the presence of the accordion in a post, page or widget, and will automatically load the necessary stylesheets. However, when the accordion is loaded in PHP code, like in the theme\'s header or another template file, you need to manually specify where the stylesheets should load. If you load the accordion only on the homepage, select <i>On homepage</i>, or if you load it in the header or another section that is visible on multiple pages, select <i>On all pages</i>.' , 'accordion-slider' )
				),
				'load_unminified_scripts' => array(
					'label' => __( 'Load unminified scripts', 'accordion-slider' ),
					'default_value' => false,
					'description' => __( 'Check this option if you want to load the unminified/uncompressed CSS and JavaScript files for the accordion. This is useful for debugging purposes.', 'accordion-slider' )
				),
				'cache_expiry_interval' => array(
					'label' => __( 'Cache expiry interval', 'accordion-slider' ),
					'default_value' => 24,
					'description' => __( 'Indicates the time interval after which a slider\'s cache will expire. If the cache of a slider has expired, the slider will be rendered again and cached the next time it is viewed.', 'accordion-slider' )
				),
				'hide_inline_info' => array(
					'label' => __( 'Hide inline info', 'accordion-slider' ),
					'default_value' => false,
					'description' => __( 'Indicates whether the inline information will be displayed in admin panels and wherever it\'s available.', 'accordion-slider' )
				),
				'hide_getting_started_info' => array(
					'label' => __( 'Hide <i>Getting Started</i> info', 'accordion-slider' ),
					'default_value' => false,
					'description' => __( 'Indicates whether the <i>Getting Started</i> information will be displayed in the <i>All Accordions</i> page, above the list of accordions. This setting will be disabled if the <i>Close</i> button is clicked in the information box.', 'accordion-slider' )
				),
				'hide_image_size_warning' => array(
					'label' => __( 'Hide image size warning', 'accordion-slider' ),
					'default_value' => false,
					'description' => __( 'Indicates whether a warning will be displayed if the size of the background images is smaller than the size of the panels.', 'accordion-slider' )
				),
				'access' => array(
					'label' => __( 'Access', 'accordion-slider' ),
					'default_value' => 'manage_options',
					'available_values' => array(
						'manage_options' => __( 'Administrator', 'accordion-slider' ),
						'publish_pages' => __( 'Editor', 'accordion-slider '),
						'publish_posts' => __( 'Author', 'accordion-slider' ),
						'edit_posts' => __( 'Contributor', 'accordion-slider' )
					),
					'description' => __( 'Sets what category of users will have access to the plugin\'s admin area.', 'accordion-slider' )
				)
			);
		}

		return self::$plugin_settings;
	}
}