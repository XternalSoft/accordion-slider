<?php
	class BQW_AS_Accordion_Renderer {

		protected $data = null;

		protected $id = null;

		protected $settings = null;

		protected $default_settings = null;

		protected $lazy_loading = null;

		protected $html_output = '';

		protected $css_dependencies = array();

		protected $js_dependencies = array();

		public function __construct( $data ) {
			$this->data = $data;
			$this->id = $this->data['id'];
			$this->settings = $this->data['settings'];
			$this->default_settings = BQW_Accordion_Slider_Settings::getSettings();

			$this->lazy_loading = isset( $this->settings['lazy_loading'] ) ? $this->settings['lazy_loading'] : $this->default_settings['lazy_loading'];
		}

		public function render() {
			$classes = 'accordion-slider';
			$classes .= isset( $this->settings['custom_class'] ) && $this->settings['custom_class'] !== '' ? ' ' . $this->settings['custom_class'] : '';
			$classes = apply_filters( 'accordion_slider_classes' , $classes, $this->id );

			$this->html_output .= "\r\n" . '<div id="accordion-slider-' . $this->id . '" class="' . $classes . '">';

			if ( $this->has_panels() ) {
				$this->html_output .= "\r\n" . '	<div class="as-panels">';
				$this->html_output .= "\r\n" . '		' . $this->create_panels();
				$this->html_output .= "\r\n" . '	</div>';
			}

			$this->html_output .= "\r\n" . '</div>';

			$this->html_output = apply_filters( 'accordion_slider_markup', $this->html_output, $this->id );

			return $this->html_output;
		}

		protected function has_panels() {
			if ( isset( $this->data['panels'] ) && ! empty( $this->data['panels'] ) ) {
				return true;
			}

			return false;
		}

		protected function create_panels() {
			$panels_output = '';
			$panels = $this->data['panels'];
			$panel_counter = 0;

			foreach ( $panels as $panel ) {
				$panels_output .= $this->create_panel( $panel, $panel_counter );
				$panel_counter++;
			}

			return $panels_output;
		}

		protected function create_panel( $data, $panel_counter ) {
			$panel = BQW_AS_Panel_Renderer_Factory::create_panel( $data );
			$panel->set_data( $data, $this->id, $panel_counter, $this->lazy_loading );
			return $panel->render();
		}

		public function render_js() {
			$js_output = '';
			$settings_js = '';

			foreach ( $this->default_settings as $name => $setting ) {
				if ( ! isset( $setting['js_name'] ) ) {
					continue;
				}

				$setting_default_value = $setting['default_value'];
				$setting_value = isset( $this->settings[ $name ] ) ? $this->settings[ $name ] : $setting_default_value;

				if ( $setting_value != $setting_default_value ) {
					if ( $js_output !== '' ) {
						$settings_js .= ',';
					}

					if ( is_bool( $setting_value ) ) {
						$setting_value = $setting_value === true ? 'true' : 'false';
					} else if ( is_numeric( $setting_value ) === false ) {
						$setting_value = "'" . $setting_value . "'";
					}

					$settings_js .= "\r\n" . '			' . $setting['js_name'] . ' : ' . $setting_value;
				}
			}

			if ( isset ( $this->settings['breakpoints'] ) ) {
				$breakpoints_js = "";

				foreach ( $this->settings['breakpoints'] as $breakpoint ) {
					if ( $breakpoint['breakpoint_width'] === '' ) {
						continue;
					}

					if ( $breakpoints_js !== '' ) {
						$breakpoints_js .= ',';
					}

					$breakpoints_js .= "\r\n" . '				' . $breakpoint['breakpoint_width'] . ': {';

					unset( $breakpoint['breakpoint_width'] );

					if ( ! empty( $breakpoint ) ) {
						$breakpoint_setting_js = '';

						foreach ( $breakpoint as $name => $value ) {
							if ( $breakpoint_setting_js !== '' ) {
								$breakpoint_setting_js .= ',';
							}

							if ( is_bool( $value ) ) {
								$value = $value === true ? 'true' : 'false';
							} else if ( is_numeric( $value ) === false ) {
								$value = "'" . $value . "'";
							}

							$breakpoint_setting_js .= "\r\n" . '					' . $name . ' : ' . $value;
						}

						$breakpoints_js .= $breakpoint_setting_js;
					}

					$breakpoints_js .= "\r\n" . '				}';
				}

				if ( $settings_js !== '' ) {
					$settings_js .= ',';
				}

				$settings_js .= "\r\n" . '			breakpoints: {' . $breakpoints_js . "\r\n" . '			}';
			}

			$this->add_js_dependency( 'plugin' );

			$js_output .= "\r\n" . '		$( "#accordion-slider-' . $this->id . '" ).accordionSlider({' .
												$settings_js .
							"\r\n" . '		});' . "\r\n";

			if ( isset ( $this->settings['lightbox'] ) && $this->settings['lightbox'] === true ) {
				$this->add_js_dependency( 'lightbox' );
				$this->add_css_dependency( 'lightbox' );

				$js_output .= "\r\n" . '		$( \'#accordion-slider-' . $this->id . ' .as-panel > a\' ).on( \'click\', function( event ) {' .
								"\r\n" . '			event.preventDefault();' .
								"\r\n" . '			if ( $( this ).hasClass( \'as-swiping\' ) === false ) {' .
								"\r\n" . '				$.fancybox.open( $( \'#accordion-slider-' .$this->id . ' .as-panel > a\' ), { index: $( this ).parent().index() } );' .
								"\r\n" . '			}' .
								"\r\n" . '		});' . "\r\n";
			}

			if ( isset ( $this->settings['page_scroll_easing'] ) && $this->settings['page_scroll_easing'] !== 'swing' ) {
				$this->add_js_dependency( 'easing' );
			}

			if ( strpos( $this->html_output, 'video-js' ) !== false ) {
				$this->add_js_dependency( 'video-js' );
				$this->add_css_dependency( 'video-js' );
			}

			return $js_output;
		}

		protected function add_css_dependency( $id ) {
			$this->css_dependencies[] = $id;
		}

		protected function add_js_dependency( $id ) {
			$this->js_dependencies[] = $id;
		}

		public function get_css_dependencies() {
			return $this->css_dependencies;
		}

		public function get_js_dependencies() {
			return $this->js_dependencies;
		}
	}
?>