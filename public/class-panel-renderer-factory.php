<?php
/**
 * Factory for panel renderers.
 *
 * Implements the appropriate functionality for each panel, depending on the panel's type.
 *
 * @since  1.0.0
 */
class BQW_AS_Panel_Renderer_Factory {

	/**
	 * List of panel types and the associated panel renderer class name.
	 *
	 * @since 1.0.0
	 * 
	 * @var array
	 */
	protected static $registered_types = array(
		'custom' => 'BQW_AS_Panel_Renderer',
		'posts' => 'BQW_AS_Posts_Panel_Renderer',
		'posts_ids' => 'BQW_AS_Posts_Ids_Panel_Renderer',
		'gallery' => 'BQW_AS_Gallery_Panel_Renderer',
		'flickr' => 'BQW_AS_Flickr_Panel_Renderer'
	);

	/**
	 * Default panel type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected static $default_type = null;

	/**
	 * Return an instance of the renderer class based on the type of the panel.
	 *
	 * @since 1.0.0
	 * 
	 * @param  array  $data The data of the panel.
	 * @return object       An instance of the appropriate renderer class.
	 */
	public static function create_panel( $data ) {
		if ( is_null( self::$default_type ) ) {
			$default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();
			self::$default_type = $default_settings['content_type']['default_value'];
		}

		$type = isset( $data['settings']['content_type'] ) ? $data['settings']['content_type'] : self::$default_type;

		foreach( self::$registered_types as $registered_type_name => $registered_type_class ) {
			if ( $type === $registered_type_name ) {
				return new $registered_type_class();
			}
		}
	}
}