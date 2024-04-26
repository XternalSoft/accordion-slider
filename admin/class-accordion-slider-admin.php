<?php
/**
 * Accordion Slider admin class.
 *
 * @since 1.0.0
 */
class BQW_Accordion_Slider_Admin {

    /**
     * Current class instance.
     *
     * @since 1.0.0
     *
     * @var object
     */
    protected static $instance = null;

    /**
     * Stores the hook suffixes for the plugin's admin pages.
     *
     * @since 1.0.0
     *
     * @var array
     */
    protected $plugin_screen_hook_suffixes = array();

    /**
     * Current class instance of the public Accordion Slider class.
     *
     * @since 1.0.0
     *
     * @var object
     */
    protected $plugin = null;

    /**
     * Plugin slug.
     *
     * @since 1.0.0
     *
     * @var string
     */
    protected $plugin_slug = '';

    /**
     * Initialize the admin by registering the required actions.
     *
     * @since 1.0.0
     */
    private function __construct() {
        $this->plugin = BQW_Accordion_Slider::get_instance();
        $this->plugin_slug = $this->plugin->get_plugin_slug();

        // load the admin CSS and JavaScript
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );

        add_action( 'wp_ajax_accordion_slider_get_accordion_data', array( $this, 'ajax_get_accordion_data' ) );
        add_action( 'wp_ajax_accordion_slider_save_accordion', array( $this, 'ajax_save_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_preview_accordion', array( $this, 'ajax_preview_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_delete_accordion', array( $this, 'ajax_delete_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_duplicate_accordion', array( $this, 'ajax_duplicate_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_export_accordion', array( $this, 'ajax_export_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_import_accordion', array( $this, 'ajax_import_accordion' ) );
        add_action( 'wp_ajax_accordion_slider_add_panels', array( $this, 'ajax_add_panels' ) );
        add_action( 'wp_ajax_accordion_slider_load_background_image_editor', array( $this, 'ajax_load_background_image_editor' ) );
        add_action( 'wp_ajax_accordion_slider_load_html_editor', array( $this, 'ajax_load_html_editor' ) );
        add_action( 'wp_ajax_accordion_slider_load_layers_editor', array( $this, 'ajax_load_layers_editor' ) );
        add_action( 'wp_ajax_accordion_slider_add_layer_settings', array( $this, 'ajax_add_layer_settings' ) );
        add_action( 'wp_ajax_accordion_slider_load_settings_editor', array( $this, 'ajax_load_settings_editor' ) );
        add_action( 'wp_ajax_accordion_slider_load_content_type_settings', array( $this, 'ajax_load_content_type_settings' ) );
        add_action( 'wp_ajax_accordion_slider_add_breakpoint', array( $this, 'ajax_add_breakpoint' ) );
        add_action( 'wp_ajax_accordion_slider_add_breakpoint_setting', array( $this, 'ajax_add_breakpoint_setting' ) );
        add_action( 'wp_ajax_accordion_slider_get_taxonomies', array( $this, 'ajax_get_taxonomies' ) );
        add_action( 'wp_ajax_accordion_slider_clear_all_cache', array( $this, 'ajax_clear_all_cache' ) );
        add_action( 'wp_ajax_accordion_slider_getting_started_close', array( $this, 'ajax_getting_started_close' ) );
        add_action( 'wp_ajax_accordion_slider_close_image_size_warning', array( $this, 'ajax_close_image_size_warning' ) );
        add_action( 'wp_ajax_accordion_slider_close_custom_css_js_warning', array( $this, 'ajax_close_custom_css_js_warning' ) );
    }

    /**
     * Return the current class instance.
     *
     * @since 1.0.0
     *
     * @return object The instance of the current class.
     */
    public static function get_instance() {
        if ( self::$instance == null ) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Returns the hook suffixes for the plugin's admin pages.
     *
     * @since 4.8.0
     */
    public function get_plugin_screen_hook_suffixes() {
        return $this->plugin_screen_hook_suffixes;
    }

    /**
     * Adds to the list of screen hook suffixes.
     *
     * @since 4.8.0
     */
    public function add_plugin_screen_hook_suffix( $screen_hook_suffix ) {
        return $this->plugin_screen_hook_suffixes[] = $screen_hook_suffix;
    }

    /**
     * Loads the admin CSS files.
     *
     * It loads the public and admin CSS, and also the public custom CSS.
     *
     * @since 1.0.0
     */
    public function enqueue_admin_styles() {
        if ( ! isset( $this->plugin_screen_hook_suffixes ) ) {
            return;
        }

        $screen = get_current_screen();

        if ( in_array( $screen->id, $this->plugin_screen_hook_suffixes ) ) {
            if ( get_option( 'accordion_slider_load_unminified_scripts' ) == true ) {
                wp_enqueue_style( $this->plugin_slug . '-admin-style', plugins_url( 'admin/assets/css/accordion-slider-admin.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
                wp_enqueue_style( $this->plugin_slug . '-plugin-style', plugins_url( 'public/assets/css/accordion-slider.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
                wp_enqueue_style( $this->plugin_slug . '-lightbox-style', plugins_url( 'public/assets/libs/fancybox/jquery.fancybox.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
            } else {
                wp_enqueue_style( $this->plugin_slug . '-admin-style', plugins_url( 'admin/assets/css/accordion-slider-admin.min.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
                wp_enqueue_style( $this->plugin_slug . '-plugin-style', plugins_url( 'public/assets/css/accordion-slider.min.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
                wp_enqueue_style( $this->plugin_slug . '-lightbox-style', plugins_url( 'public/assets/libs/fancybox/jquery.fancybox.min.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
            }

            wp_enqueue_style( $this->plugin_slug . '-video-js-style', plugins_url( 'public/assets/libs/video-js/video-js.min.css', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );

            $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : -1;

            if ( strpos( $screen->id, $this->plugin_slug . '-new' ) || $id !== -1 ) {
                wp_enqueue_style( 'wp-codemirror' );
            }

            if ( get_option( 'accordion_slider_is_custom_css') == true ) {
                wp_add_inline_style( $this->plugin_slug . '-plugin-style', stripslashes( get_option( 'accordion_slider_custom_css' ) ) );
            }
        }
    }

    /**
     * Loads the admin JS files.
     *
     * It loads the public and admin JS.
     * Also, it passes the PHP variables to the admin JS file.
     *
     * @since 1.0.0
     */
    public function enqueue_admin_scripts() {
        if ( ! isset( $this->plugin_screen_hook_suffixes ) ) {
            return;
        }

        $screen = get_current_screen();

        if ( in_array( $screen->id, $this->plugin_screen_hook_suffixes ) ) {
            if ( function_exists( 'wp_enqueue_media' ) ) {
                wp_enqueue_media();
            }

            if ( get_option( 'accordion_slider_load_unminified_scripts' ) == true ) {
                wp_enqueue_script( $this->plugin_slug . '-admin-script', plugins_url( 'admin/assets/js/accordion-slider-admin.js', dirname( __FILE__ ) ), array( 'jquery' ), BQW_Accordion_Slider::VERSION );
                wp_enqueue_script( $this->plugin_slug . '-plugin-script', plugins_url( 'public/assets/js/jquery.accordionSlider.js', dirname( __FILE__ ) ), array( 'jquery' ), BQW_Accordion_Slider::VERSION );
                wp_enqueue_script( $this->plugin_slug . '-lightbox-script', plugins_url( 'public/assets/libs/fancybox/jquery.fancybox.js', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
            } else {
                wp_enqueue_script( $this->plugin_slug . '-admin-script', plugins_url( 'admin/assets/js/accordion-slider-admin.min.js', dirname( __FILE__ ) ), array( 'jquery' ), BQW_Accordion_Slider::VERSION );
                wp_enqueue_script( $this->plugin_slug . '-plugin-script', plugins_url( 'public/assets/js/jquery.accordionSlider.min.js', dirname( __FILE__ ) ), array( 'jquery' ), BQW_Accordion_Slider::VERSION );
                wp_enqueue_script( $this->plugin_slug . '-lightbox-script', plugins_url( 'public/assets/libs/fancybox/jquery.fancybox.min.js', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
            }

            wp_enqueue_script( $this->plugin_slug . '-easing-script', plugins_url( 'public/assets/libs/easing/jquery.easing.1.3.min.js', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );
            wp_enqueue_script( $this->plugin_slug . '-video-js-script', plugins_url( 'public/assets/libs/video-js/video.js', dirname( __FILE__ ) ), array(), BQW_Accordion_Slider::VERSION );

            $id = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : -1;

            if ( strpos( $screen->id, $this->plugin_slug . '-new' ) || $id !== -1 ) {
                wp_enqueue_code_editor( array( 'type' => 'text/html' ) );
            }

            wp_localize_script( $this->plugin_slug . '-admin-script', 'as_js_vars', array(
                'admin' => admin_url( 'admin.php' ),
                'ajaxurl' => admin_url( 'admin-ajax.php' ),
                'plugin' => plugins_url( '', dirname( __FILE__ ) ),
                'page' => isset( $_GET['page'] ) && ( $_GET['page'] === 'accordion-slider-new' || ( isset( $_GET['id'] ) && isset( $_GET['action'] ) && $_GET['action'] === 'edit' ) ) ? 'single' : 'all',
                'id' => $id,
                'lad_nonce' => wp_create_nonce( 'load-accordion-data' . $id ),
                'sa_nonce' => wp_create_nonce( 'save-accordion' . $id ),
                'cp_nonce' => wp_create_nonce( 'close-panel' ),
                'remove_custom_css_js_warning' => __( 'Are you sure you want to remove the existing custom CSS and/or JavaScript? <br/> Only do this after you\'ve copied the existing code in another place.', 'accordion-slider' ),
                'no_image' => __( 'Click to add image', 'accordion-slider' ),
                'posts_panels' => __( 'Posts panels', 'accordion-slider' ),
                'gallery_panels' => __( 'Gallery panels', 'accordion-slider' ),
                'flickr_panels' => __( 'Flickr panels', 'accordion-slider' ),
                'accordion_delete' => __( 'Are you sure you want to delete this accordion?', 'accordion-slider' ),
                'panel_delete' => __( 'Are you sure you want to delete this panel?', 'accordion-slider' ),
                'yes' => __( 'Yes', 'accordion-slider' ),
                'cancel' => __( 'Cancel', 'accordion-slider' ),
                'accordion_update' => __( 'Accordion slider updated.', 'accordion-slider' ),
                'accordion_create' => __( 'Accordion slider created.', 'accordion-slider' )
            ) );
        }
    }

    /**
     * Create the plugin menu.
     *
     * @since 1.0.0
     */
    public function add_admin_menu() {
        $plugin_settings = BQW_Accordion_Slider_Settings::getPluginSettings();
        $access = get_option( 'accordion_slider_access', $plugin_settings['access']['default_value'] );

        $restricted_pages = apply_filters( 'accordion_slider_restricted_pages' , array() );

        add_menu_page(
            'Accordion Slider',
            'Accordion Slider',
            $access,
            $this->plugin_slug,
            array( $this, 'render_accordion_page' ),
            plugins_url( 'admin/assets/css/images/as-icon.png', dirname( __FILE__ ) )
        );

        if ( ! in_array( $this->plugin_slug, $restricted_pages ) ) {
            $this->plugin_screen_hook_suffixes['all_accordions'] = add_submenu_page(
                $this->plugin_slug,
                __( 'Accordion Slider', 'accordion-slider' ),
                __( 'All Accordions', 'accordion-slider' ),
                $access,
                $this->plugin_slug,
                array( $this, 'render_accordion_page' )
            );
        }

        if ( ! in_array( $this->plugin_slug . '-new', $restricted_pages ) ) {
            $this->plugin_screen_hook_suffixes['add_new'] = add_submenu_page(
                $this->plugin_slug,
                __( 'Add New Accordion', 'accordion-slider' ),
                __( 'Add New', 'accordion-slider' ),
                $access,
                $this->plugin_slug . '-new',
                array( $this, 'render_new_accordion_page' )
            );
        }

        if ( ! in_array( $this->plugin_slug . '-settings', $restricted_pages ) ) {
            $this->plugin_screen_hook_suffixes['plugin_settings'] = add_submenu_page(
                $this->plugin_slug,
                __( 'Plugin Settings', 'accordion-slider' ),
                __( 'Plugin Settings', 'accordion-slider' ),
                $access,
                $this->plugin_slug . '-settings',
                array( $this, 'render_plugin_settings_page' )
            );
        }

        if ( ! in_array( $this->plugin_slug . '-documentation', $restricted_pages ) ) {
            $this->plugin_screen_hook_suffixes['documentation'] = add_submenu_page(
                $this->plugin_slug,
                __( 'Documentation', 'accordion-slider' ),
                __( 'Documentation', 'accordion-slider' ),
                $access,
                $this->plugin_slug . '-documentation',
                array( $this, 'render_documentation_page' )
            );
        }

        do_action('accordion_slider_admin_menu');
    }

    /**
     * Renders the accordion page.
     *
     * Based on the 'action' parameter, it will render
     * either an individual accordion page or the list
     * of all the accordions.
     *
     * If an individual accordion page is rendered, delete
     * the transients that store the post names and posts data,
     * in order to trigger a new fetching of them.
     *
     * @since 1.0.0
     */
    public function render_accordion_page() {
        if ( isset( $_GET['id'] ) && isset( $_GET['action'] ) && $_GET['action'] === 'edit' ) {
            $accordion = $this->plugin->get_accordion( intval( $_GET['id'] ) );

            if ( $accordion !== false ) {
                $accordion_id = $accordion['id'];
                $accordion_name = $accordion['name'];
                $accordion_settings = $accordion['settings'];
                $panels_state = $accordion['panels_state'];

                $panels = isset( $accordion['panels'] ) ? $accordion['panels'] : false;

                delete_transient( 'accordion_slider_post_names' );
                delete_transient( 'accordion_slider_posts_data' );

                include_once( 'views/accordion/accordion.php' );
            } else {
                include_once( 'views/accordions/accordions.php' );
            }
        } else {
            include_once( 'views/accordions/accordions.php' );
        }
    }

    /**
     * Renders the page for a new accordion.
     *
     * Also, delete the transients that store
     * the post names and posts data,
     * in order to trigger a new fetching of them.
     *
     * @since 1.0.0
     */
    public function render_new_accordion_page() {
        $accordion_name = 'My Accordion';

        delete_transient( 'accordion_slider_post_names' );
        delete_transient( 'accordion_slider_posts_data' );

        include_once( 'views/accordion/accordion.php' );
    }

    /**
     * Renders the plugin settings page.
     *
     * It also checks if new data was posted, and saves
     * it in the options table.
     *
     * @since 1.0.0
     */
    public function render_plugin_settings_page() {
        $plugin_settings = BQW_Accordion_Slider_Settings::getPluginSettings();
        $load_stylesheets = get_option( 'accordion_slider_load_stylesheets', $plugin_settings['load_stylesheets']['default_value'] );
        $load_unminified_scripts = get_option( 'accordion_slider_load_unminified_scripts', $plugin_settings['load_unminified_scripts']['default_value'] );
        $cache_expiry_interval = get_option( 'accordion_slider_cache_expiry_interval', $plugin_settings['cache_expiry_interval']['default_value'] );
        $hide_inline_info = get_option( 'accordion_slider_hide_inline_info', $plugin_settings['hide_inline_info']['default_value'] );
        $hide_getting_started_info = get_option( 'accordion_slider_hide_getting_started_info', $plugin_settings['hide_getting_started_info']['default_value'] );
        $hide_image_size_warning = get_option( 'accordion_slider_hide_image_size_warning', $plugin_settings['hide_image_size_warning']['default_value'] );
        $access = get_option( 'accordion_slider_access', $plugin_settings['access']['default_value'] );

        if ( isset( $_POST['plugin_settings_update'] ) && current_user_can( 'customize' ) ) {
            check_admin_referer( 'plugin-settings-update', 'plugin-settings-nonce' );

            if ( isset( $_POST['load_stylesheets'] ) ) {
                $load_stylesheets = sanitize_text_field( $_POST['load_stylesheets'] );

                if ( array_key_exists( $load_stylesheets , $plugin_settings['load_stylesheets']['available_values'] ) ) {
                    update_option( 'accordion_slider_load_stylesheets', $load_stylesheets );
                }
            }

            if ( isset( $_POST['load_unminified_scripts'] ) ) {
                $load_unminified_scripts = true;
                update_option( 'accordion_slider_load_unminified_scripts', true );
            } else {
                $load_unminified_scripts = false;
                update_option( 'accordion_slider_load_unminified_scripts', false );
            }

            if ( isset( $_POST['cache_expiry_interval'] ) ) {
                $cache_expiry_interval = intval( $_POST['cache_expiry_interval'] );
                update_option( 'accordion_slider_cache_expiry_interval', $cache_expiry_interval );
            }

            if ( isset( $_POST['hide_inline_info'] ) ) {
                $hide_inline_info = true;
                update_option( 'accordion_slider_hide_inline_info', true );
            } else {
                $hide_inline_info = false;
                update_option( 'accordion_slider_hide_inline_info', false );
            }

            if ( isset( $_POST['hide_getting_started_info'] ) ) {
                $hide_getting_started_info = true;
                update_option( 'accordion_slider_hide_getting_started_info', true );
            } else {
                $hide_getting_started_info = false;
                update_option( 'accordion_slider_hide_getting_started_info', false );
            }

            if ( isset( $_POST['hide_image_size_warning'] ) ) {
                $hide_image_size_warning = true;
                update_option( 'accordion_slider_hide_image_size_warning', true );
            } else {
                $hide_image_size_warning = false;
                update_option( 'accordion_slider_hide_image_size_warning', false );
            }

            if ( isset( $_POST['access'] ) ) {
                $access = sanitize_text_field( $_POST['access'] );

                if ( array_key_exists( $access, $plugin_settings['access']['available_values'] ) ) {
                    update_option( 'accordion_slider_access', $access );
                }
            }
        }

        include_once( 'views/settings/plugin-settings.php' );
    }

    /**
     * Renders the documentation page.
     *
     * @since 1.0.0
     */
    public function render_documentation_page() {
        echo '<iframe class="accordion-slider-documentation" src="' . plugins_url( 'documentation/documentation.html', dirname( __FILE__ ) ) . '" width="100%" height="100%"></iframe>';
    }

    /**
     * AJAX call for getting the accordion's data.
     *
     * @since 1.0.0
     *
     * @return string The accordion data, as JSON-encoded array.
     */
    public function ajax_get_accordion_data() {
        $nonce = $_GET['nonce'];
        $id = intval( $_GET['id'] );

        if ( ! wp_verify_nonce( $nonce, 'load-accordion-data' . $id ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        $accordion = $this->get_accordion_data( $id );

        echo json_encode( $accordion );

        die();
    }

    /**
     * Return the accordion's data.
     *
     * @since 1.0.0
     *
     * @param  int   $id The id of the accordion.
     * @return array     The accordion data.
     */
    public function get_accordion_data( $id ) {
        return $this->plugin->get_accordion( $id );
    }

    /**
     * AJAX call for saving the accordion.
     *
     * It can be called when the accordion is created, updated
     * or when an accordion is imported. If the accordion is
     * imported, it returns a row in the list of accordions.
     *
     * @since 1.0.0
     */
    public function ajax_save_accordion() {
        $data = json_decode( stripslashes( $_POST['data'] ), true );
        $nonce = $data['nonce'];
        $action = $data['action'];

        $accordion_data = BQW_Accordion_Slider_Validation::validate_accordion_slider_data( $data );
        $id = $accordion_data['id'];

        if ( ! wp_verify_nonce( $nonce, 'save-accordion' . $id ) || ! current_user_can( 'edit_posts' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        $accordion_id = $this->save_accordion( $accordion_data );

        if ( $action === 'save' ) {
            echo json_encode( $accordion_id );
        } else if ( $action === 'import' ) {
            $accordion_name = $accordion_data['name'];
            $accordion_created = date( 'm-d-Y' );
            $accordion_modified = date( 'm-d-Y' );

            include( 'views/accordions/accordions-row.php' );
        }

        die();
    }

    /**
     * Save the accordion.
     *
     * It either creates a new accordion or updates and existing one.
     *
     * For existing accordions, the panels and layers are deleted and
     * re-inserted in the database.
     *
     * The cached accordion is deleted every time the accordion is saved.
     *
     * @since 1.0.0
     *
     * @param  array $accordion_data The data of the accordion that's saved.
     * @return int                   The id of the saved accordion.
     */
    public function save_accordion( $accordion_data ) {
        global $wpdb;

        $id = $accordion_data['id'];
        $panels_data = $accordion_data['panels'];

        if ( $id === -1 ) {
            $wpdb->insert($wpdb->prefix . 'accordionslider_accordions', array( 'name' => $accordion_data['name'],
                'settings' => json_encode( $accordion_data['settings'] ),
                'created' => date( 'm-d-Y' ),
                'modified' => date( 'm-d-Y' ),
                'panels_state' => json_encode( $accordion_data['panels_state'] ) ),
                array( '%s', '%s', '%s', '%s', '%s' ) );

            $id = $wpdb->insert_id;
        } else {
            $wpdb->update( $wpdb->prefix . 'accordionslider_accordions', array( 'name' => $accordion_data['name'],
                'settings' => json_encode( $accordion_data['settings'] ),
                'modified' => date( 'm-d-Y' ),
                'panels_state' => json_encode( $accordion_data['panels_state'] ) ),
                array( 'id' => $id ),
                array( '%s', '%s', '%s', '%s' ),
                array( '%d' ) );

            $wpdb->query( $wpdb->prepare( "DELETE FROM " . $wpdb->prefix . "accordionslider_panels WHERE accordion_id = %d", $id ) );

            $wpdb->query( $wpdb->prepare( "DELETE FROM " . $wpdb->prefix . "accordionslider_layers WHERE accordion_id = %d", $id ) );
        }

        foreach ( $panels_data as $panel_data ) {
            $panel = array('accordion_id' => $id,
                'label' => isset( $panel_data['label'] ) ? $panel_data['label'] : '',
                'position' => isset( $panel_data['position'] ) ? $panel_data['position'] : '',
                'visibility' => isset( $panel_data['visibility'] ) ? $panel_data['visibility'] : '',
                'background_source' => isset( $panel_data['background_source'] ) ? $panel_data['background_source'] : '',
                'background_retina_source' => isset( $panel_data['background_retina_source'] ) ? $panel_data['background_retina_source'] : '',
                'background_alt' => isset( $panel_data['background_alt'] ) ? $panel_data['background_alt'] : '',
                'background_title' => isset( $panel_data['background_title'] ) ? $panel_data['background_title'] : '',
                'background_width' => isset( $panel_data['background_width'] ) ? $panel_data['background_width'] : '',
                'background_height' => isset( $panel_data['background_height'] ) ? $panel_data['background_height'] : '',
                'opened_background_source' => isset( $panel_data['opened_background_source'] ) ? $panel_data['opened_background_source'] : '',
                'opened_background_retina_source' => isset( $panel_data['opened_background_retina_source'] ) ? $panel_data['opened_background_retina_source'] : '',
                'opened_background_alt' => isset( $panel_data['opened_background_alt'] ) ? $panel_data['opened_background_alt'] : '',
                'opened_background_title' => isset( $panel_data['opened_background_title'] ) ? $panel_data['opened_background_title'] : '',
                'opened_background_width' => isset( $panel_data['opened_background_width'] ) ? $panel_data['opened_background_width'] : '',
                'opened_background_height' => isset( $panel_data['opened_background_height'] ) ? $panel_data['opened_background_height'] : '',
                'background_link' => isset( $panel_data['background_link'] ) ? $panel_data['background_link'] : '',
                'background_link_title' => isset( $panel_data['background_link_title'] ) ? $panel_data['background_link_title'] : '',
                'html' => isset( $panel_data['html'] ) ? $panel_data['html'] : '',
                'settings' => isset( $panel_data['settings'] ) ? json_encode( $panel_data['settings'] ) : '');

            $wpdb->insert( $wpdb->prefix . 'accordionslider_panels', $panel, array( '%d', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s', '%s', '%s', '%d', '%d', '%s', '%s', '%s', '%s' ) );

            if ( ! empty( $panel_data[ 'layers' ] ) ) {
                $panel_id = $wpdb->insert_id;
                $layers_data = $panel_data[ 'layers' ];

                foreach ( $layers_data as $layer_data ) {
                    $layer = array('accordion_id' => $id,
                        'panel_id' => $panel_id,
                        'position' => isset( $layer_data['position'] ) ? $layer_data['position'] : 0,
                        'name' => isset( $layer_data['name'] ) ? $layer_data['name'] : '',
                        'type' => isset( $layer_data['type'] ) ? $layer_data['type'] : '',
                        'text' => isset( $layer_data['text'] ) ? $layer_data['text'] : '',
                        'heading_type' => isset( $layer_data['heading_type'] ) ? $layer_data['heading_type'] : '',
                        'image_source' => isset( $layer_data['image_source'] ) ? $layer_data['image_source'] : '',
                        'image_alt' => isset( $layer_data['image_alt'] ) ? $layer_data['image_alt'] : '',
                        'image_link' => isset( $layer_data['image_link'] ) ? $layer_data['image_link'] : '',
                        'image_retina' => isset( $layer_data['image_retina'] ) ? $layer_data['image_retina'] : '',
                        'settings' =>  isset( $layer_data['settings'] ) ? json_encode( $layer_data['settings'] ) : ''
                    );

                    $wpdb->insert( $wpdb->prefix . 'accordionslider_layers', $layer, array( '%d', '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' ) );
                }
            }
        }

        delete_transient( 'accordion_slider_cache_' . $id );

        return $id;
    }

    /**
     * AJAX call for previewing the accordion.
     *
     * Receives the current data from the database (in the accordions page)
     * or from the current settings (in the accordion page) and prints the
     * HTML markup and the inline JavaScript for the accordion.
     *
     * @since 1.0.0
     */
    public function ajax_preview_accordion() {
        $accordion = BQW_Accordion_Slider_Validation::validate_accordion_slider_data( json_decode( stripslashes( $_POST['data'] ), true ) );
        $accordion_output = $this->plugin->output_accordion( $accordion, false ) . $this->plugin->get_inline_scripts();

        echo $accordion_output;

        die();
    }

    /**
     * AJAX call for duplicating an accordion.
     *
     * Loads an accordion from the database and re-saves it with an id of -1,
     * which will determine the save function to add a new accordion in the
     * database.
     *
     * It returns a new accordion row in the list of all accordions.
     *
     * @since 1.0.0
     */
    public function ajax_duplicate_accordion() {
        $nonce = $_POST['nonce'];
        $original_accordion_id = intval( $_POST['id'] );

        if ( ! wp_verify_nonce( $nonce, 'duplicate-accordion' . $original_accordion_id ) || ! current_user_can( 'edit_posts' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        if ( ( $original_accordion = $this->plugin->get_accordion( $original_accordion_id ) ) !== false ) {
            $original_accordion['id'] = -1;
            $accordion_id = $this->save_accordion( $original_accordion );
            $accordion_name = $original_accordion['name'];
            $accordion_created = date( 'm-d-Y' );
            $accordion_modified = date( 'm-d-Y' );

            include( 'views/accordions/accordions-row.php' );
        }

        die();
    }

    /**
     * AJAX call for deleting an accordion.
     *
     * It's called from the list of accordions, when the
     * 'Delete' link is clicked.
     *
     * It calls the 'delete_accordion()' method and passes
     * it the id of the accordion to be deleted.
     *
     * @since 1.0.0
     */
    public function ajax_delete_accordion() {
        $nonce = $_POST['nonce'];
        $id = intval( $_POST['id'] );

        if ( ! wp_verify_nonce( $nonce, 'delete-accordion' . $id ) || ! current_user_can( 'delete_posts' )  ) {
            die( 'This action was stopped for security purposes.' );
        }

        echo $this->delete_accordion( $id );

        die();
    }

    /**
     * Delete the accordion indicated by the id.
     *
     * @since 1.0.0
     *
     * @param  int $id The id of the accordion to be deleted.
     * @return int     The id of the accordion that was deleted.
     */
    public function delete_accordion( $id ) {
        global $wpdb;

        $wpdb->query( $wpdb->prepare( "DELETE FROM " . $wpdb->prefix . "accordionslider_panels WHERE accordion_id = %d", $id ) );

        $wpdb->query( $wpdb->prepare( "DELETE FROM " . $wpdb->prefix . "accordionslider_layers WHERE accordion_id = %d", $id ) );

        $wpdb->query( $wpdb->prepare( "DELETE FROM " . $wpdb->prefix . "accordionslider_accordions WHERE id = %d", $id ) );

        return $id;
    }

    /**
     * AJAX call for exporting an accordion.
     *
     * It loads an accordion from the database and encodes
     * its data as JSON, after removing the id of the accordion.
     *
     * The JSON string created is presented in a modal window.
     *
     * @since 1.0.0
     */
    public function ajax_export_accordion() {
        $nonce = $_POST['nonce'];
        $id = intval( $_POST['id'] );

        if ( ! wp_verify_nonce( $nonce, 'export-accordion' . $id ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        $accordion = $this->plugin->get_accordion( $id );

        if ( $accordion !== false ) {
            unset( $accordion['id'] );
            $export_string = json_encode( $accordion );

            include( 'views/accordions/export-window.php' );
        }

        die();
    }

    /**
     * AJAX call for displaying the modal window
     * for importing an accordion.
     *
     * @since 1.0.0
     */
    public function ajax_import_accordion() {
        include( 'views/accordions/import-window.php' );

        die();
    }

    /**
     * Create a panel from the passed data.
     *
     * Receives some data, like the background image, or
     * the panel's content type. A new panel is created by
     * passing 'false' instead of any data.
     *
     * @since 1.0.0
     *
     * @param  array|bool $data The data of the panel or false, if the panel is new.
     */
    public function create_panel( $data ) {
        $panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();

        $panel_type = $panel_default_settings['content_type']['default_value'];
        $panel_image = '';

        if ( $data !== false ) {
            $panel_type = isset( $data['settings'] ) && isset( $data['settings']['content_type'] ) ? $data['settings']['content_type'] : $panel_type;
            $panel_image = isset( $data['background_source'] ) ? $data['background_source'] : $panel_image;
        }

        include( 'views/panel/panel.php' );
    }

    /**
     * AJAX call for adding multiple or a single panel.
     *
     * If it receives any data, it tries to create multiple
     * panels by passing the data that was received, and if
     * it doesn't receive any data it tries to create a
     * single panel.
     *
     * @since 1.0.0
     */
    public function ajax_add_panels() {
        if ( isset( $_POST['data'] ) ) {
            $panels_data = BQW_Accordion_Slider_Validation::validate_accordion_slider_panels( json_decode( stripslashes( $_POST['data'] ), true ) );

            foreach ( $panels_data as $panel_data ) {
                $this->create_panel( $panel_data );
            }
        } else {
            $this->create_panel( false );
        }

        die();
    }

    /**
     * AJAX call for displaying the background image editor.
     *
     * The aspect of the editor will depend on the panel's
     * content type. Dynamic panels will not have the possibility
     * to load images from the library.
     *
     * @since 1.0.0
     */
    public function ajax_load_background_image_editor() {
        $panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();

        $data = reset( BQW_Accordion_Slider_Validation::validate_accordion_slider_panels( array( json_decode( stripslashes( $_POST['data'] ), true ) ) ) );
        $content_type = isset( $_POST['content_type'] ) && array_key_exists( $_POST['content_type'], $panel_default_settings['content_type']['available_values'] ) ? $_POST['content_type'] : $panel_default_settings['content_type']['default_value'];
        $content_class = $content_type === 'custom' ? 'custom' : 'dynamic';

        include( 'views/panel-editors/background-image-editor.php' );

        die();
    }

    /**
     * AJAX call for displaying the inline HTML editor.
     *
     * @since 1.0.0
     */
    public function ajax_load_html_editor() {
        $panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();
        global $allowedposttags;

        $allowed_html = array_merge(
            $allowedposttags,
            array(
                'iframe' => array(
                    'src' => true,
                    'width' => true,
                    'height' => true,
                    'allow' => true,
                    'allowfullscreen' => true,
                    'class' => true,
                    'id' => true,
                    'data-*' => true
                ),
                'source' => array(
                    'src' => true,
                    'type' => true
                )
            )
        );

        $allowed_html = apply_filters( 'accordion_slider_allowed_html', $allowed_html );

        $html_content = wp_kses( $_POST['data'], $allowed_html );
        $content_type = isset( $_POST['content_type'] ) && array_key_exists( $_POST['content_type'], $panel_default_settings['content_type']['available_values'] ) ? $_POST['content_type'] : $panel_default_settings['content_type']['default_value'];

        include( 'views/panel-editors/html-editor.php' );

        die();
    }

    /**
     * AJAX call for displaying the layers editor.
     *
     * @since 1.0.0
     */
    public function ajax_load_layers_editor() {
        $panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();
        $layer_default_settings = BQW_Accordion_Slider_Settings::getLayerSettings();

        $layers = BQW_Accordion_Slider_Validation::validate_panel_layers( json_decode( stripslashes( $_POST['data'] ), true ) );
        $content_type = isset( $_POST['content_type'] ) && array_key_exists( $_POST['content_type'], $panel_default_settings['content_type']['available_values'] ) ? $_POST['content_type'] : $panel_default_settings['content_type']['default_value'];

        include( 'views/panel-editors/layers-editor.php' );

        die();
    }

    /**
     * AJAX call for adding a new block of layer settings
     *
     * It receives the id and type of the layer, and creates
     * the appropriate setting fields.
     *
     * @since 1.0.0
     */
    public function ajax_add_layer_settings() {
        $layer_default_settings = BQW_Accordion_Slider_Settings::getLayerSettings();
        $layer = array();
        $layer_id = intval( $_POST['id'] );
        $layer_type = isset( $_POST['type'] ) && array_key_exists( $_POST['type'], $layer_default_settings['type']['available_values'] ) ? $_POST['type'] : $layer_default_settings['type']['default_value'];
        $layer_settings;
        global $allowedposttags;

        if ( isset( $_POST['settings'] ) ) {
            $layer_settings = BQW_Accordion_Slider_Validation::validate_layer_settings( json_decode( stripslashes( $_POST['settings'] ), true ) );
        }

        if ( isset( $_POST['text'] ) ) {
            $allowed_html = array_merge(
                $allowedposttags,
                array(
                    'iframe' => array(
                        'src' => true,
                        'width' => true,
                        'height' => true,
                        'allow' => true,
                        'allowfullscreen' => true,
                        'class' => true,
                        'id' => true,
                        'data-*' => true
                    ),
                    'source' => array(
                        'src' => true,
                        'type' => true
                    )
                )
            );

            $allowed_html = apply_filters( 'accordion_slider_allowed_html', $allowed_html );

            $layer['text'] = wp_kses( $_POST['text'], $allowed_html );
        }

        if ( isset( $_POST['heading_type'] ) ) {
            $layer['heading_type'] = array_key_exists( $_POST['heading_type'], $layer_default_settings['heading_type']['available_values'] ) ? $_POST['heading_type'] : $layer_default_settings['heading_type']['default_value'];
        }

        if ( isset( $_POST['image_source'] ) ) {
            $layer['image_source'] = sanitize_text_field( $_POST['image_source'] );
        }

        if ( isset( $_POST['image_alt'] ) ) {
            $layer['image_alt'] = sanitize_text_field( $_POST['image_alt'] );
        }

        if ( isset( $_POST['image_link'] ) ) {
            $layer['image_link'] = sanitize_text_field( $_POST['image_link'] );
        }

        if ( isset( $_POST['image_retina'] ) ) {
            $layer['image_retina'] = sanitize_text_field( $_POST['image_retina'] );
        }

        $layer_default_settings = BQW_Accordion_Slider_Settings::getLayerSettings();

        include( 'views/panel-editors/layer-settings.php' );

        die();
    }

    /**
     * AJAX call for displaying the panel's settings editor.
     *
     * @since 1.0.0
     */
    public function ajax_load_settings_editor() {
        $panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();
        $panel_settings = BQW_Accordion_Slider_Validation::validate_panel_settings( json_decode( stripslashes( $_POST['data'] ), true ) );
        $content_type = isset( $panel_settings['content_type'] ) && array_key_exists( $panel_settings['content_type'], $panel_default_settings['content_type']['available_values'] ) ? $panel_settings['content_type'] : $panel_default_settings['content_type']['default_value'];

        include( 'views/panel-editors/settings-editor.php' );

        die();
    }

	/**
	 * AJAX call for displaying the setting fields associated 
	 * with the current content type of the panel.
	 *
	 * It's called when the content type is changed manually 
	 * in the panel's settings window
	 *
	 * @since 1.0.0
	 */
	public function ajax_load_content_type_settings() {
		$panel_default_settings = BQW_Accordion_Slider_Settings::getPanelSettings();
		$type = isset( $_POST['type'] ) && array_key_exists( $_POST['type'], $panel_default_settings['content_type']['available_values'] ) ? $_POST['type'] : $panel_default_settings['content_type']['default_value'];
		$panel_settings = BQW_Accordion_Slider_Validation::validate_panel_settings( json_decode( stripslashes( $_POST['data'] ), true ) );

		echo $this->load_content_type_settings( $type, $panel_default_settings, $panel_settings );

        die();
    }

	/**
	 * Return the setting fields associated with the content type.
	 *
	 * If the content type is set to 'posts', the names of the
	 * registered post types will be loaded.
	 *
	 * @since 1.0.0
	 * 
	 * @param  string $type           The panel's content type.
	 * @param  array  $panel_settings The panel's settings.
	 */
	public function load_content_type_settings( $type, $panel_default_settings, $panel_settings = NULL ) {
		if ( $type === 'posts' ) {
			$post_names = $this->get_post_names();

            include( 'views/panel-settings/posts-panel-settings.php' );
        } elseif ($type === 'posts_ids') {
            include('views/panel-settings/posts-ids-panel-settings.php');
        } elseif ( $type === 'gallery' ) {
            include( 'views/panel-settings/gallery-panel-settings.php' );
        } elseif ( $type === 'flickr' ) {
            include( 'views/panel-settings/flickr-panel-settings.php' );
        } else {
            include( 'views/panel-settings/custom-panel-settings.php' );
        }
    }

    /**
     * Return the names of all registered post types
     *
     * It arranges the data in an associative array that contains
     * the name of the post type as the key and and an array, containing
     * both the post name and post value, as the value:
     *
     * name => ( name, label )
     *
     * After the data is fetched, it is stored in a transient for 5 minutes.
     * Before fetching the data, the function tries to get the data
     * from the transient.
     *
     * @since 1.0.0
     *
     * @return array The list of names for the registered post types.
     */
    public function get_post_names() {
        $result = array();
        $post_names_transient = get_transient( 'accordion_slider_post_names' );

        if ( $post_names_transient === false ) {
            $post_types = get_post_types( '', 'objects' );

            unset( $post_types['attachment'] );
            unset( $post_types['revision'] );
            unset( $post_types['nav_menu_item'] );

            foreach ( $post_types as $post_type ) {
                $result[ $post_type->name ] = array( 'name' => $post_type->name , 'label' => $post_type->label );
            }

            set_transient( 'accordion_slider_post_names', $result, 5 * 60 );
        } else {
            $result = $post_names_transient;
        }

        return $result;
    }

    /**
     * AJAX call for getting the registered taxonomies.
     *
     * It's called when the post names are selected manually
     * in the panel's settings window.
     *
     * @since 1.0.0
     */
    public function ajax_get_taxonomies() {
        $post_names_raw = json_decode( stripslashes( $_GET['post_names'] ), true );
        $post_names = array();

        foreach ( $post_names_raw as $post_name ) {
            array_push( $post_names, sanitize_text_field( $post_name ) );
        }

        echo json_encode( $this->get_taxonomies_for_posts( $post_names ) );

        die();
    }

    /**
     * Loads the taxonomies associated with the selected post names.
     *
     * It tries to find cached data for post names and their taxonomies,
     * stored in the 'accordion_slider_posts_data' transient. If there is any
     * cached data and if selected post names are in the cached data, those
     * post names and their taxonomy data are added to the result. Post names
     * that are not found in the transient are added to the list of posts to load.
     * After these posts are loaded, the transient is updated to include the
     * newly loaded post names, and their taxonomy data.
     *
     * While the transient will contain all the post names and taxonomies
     * loaded in the past and those requested now, the result will include
     * only post names and taxonomies requested now.
     *
     * @since 1.0.0
     *
     * @param  array $post_names The array of selected post names.
     * @return array             The array of selected post names and their taxonomies.
     */
    public function get_taxonomies_for_posts( $post_names ) {
        $result = array();
        $posts_to_load = array();

        $posts_data_transient = get_transient( 'accordion_slider_posts_data' );

        if ( $posts_data_transient === false || empty( $posts_data_transient ) === true ) {
            $posts_to_load = $post_names;
            $posts_data_transient = array();
        } else {
            foreach ( $post_names as $post_name ) {
                if ( array_key_exists( $post_name, $posts_data_transient ) === true ) {
                    $result[ $post_name ] = $posts_data_transient[ $post_name ];
                } else {
                    array_push( $posts_to_load, $post_name );
                }
            }
        }

        foreach ( $posts_to_load as $post_name ) {
            $taxonomies = get_object_taxonomies( $post_name, 'objects' );

            $result[ $post_name ] = array();

            foreach ( $taxonomies as $taxonomy ) {
                $terms = get_terms( $taxonomy->name, 'objects' );

                if ( ! empty( $terms ) ) {
                    $result[ $post_name ][ $taxonomy->name ] = array(
                        'name' => $taxonomy->name,
                        'label' => $taxonomy->label,
                        'terms' => array()
                    );

                    foreach ( $terms as $term ) {
                        $result[ $post_name ][ $taxonomy->name ]['terms'][ $term->name ] = array(
                            'name' => $term->name,
                            'slug' => $term->slug,
                            'full' => $taxonomy->name . '|' . $term->slug
                        );
                    }
                }
            }

            $posts_data_transient[ $post_name ] = $result[ $post_name ];
        }

        set_transient( 'accordion_slider_posts_data', $posts_data_transient, 5 * 60 );

        return $result;
    }

    /**
     * AJAX call for adding a new breakpoint section.
     *
     * @since 1.0.0
     */
    public function ajax_add_breakpoint() {
        $width = floatval( $_GET['data'] );

        include( 'views/accordion/breakpoint.php' );

        die();
    }

    /**
     * AJAX call for adding a new breakpoint setting.
     *
     * @since 1.0.0
     */
    public function ajax_add_breakpoint_setting() {
        $setting_name = sanitize_text_field( $_GET['data'] );

        echo $this->create_breakpoint_setting( $setting_name, false );

        die();
    }

    /**
     * Return the HTML markup for the breakpoint setting.
     *
     * Generates a unique number that will be attributed to
     * the label and to the input/select field.
     *
     * @since 1.0.0
     *
     * @param  string $name  The name of the setting.
     * @param  mixed  $value The value of the setting. If false, the default setting value will be assigned.
     * @return string        The HTML markup for the setting.
     */
    public function create_breakpoint_setting( $name, $value ) {
        $setting = BQW_Accordion_Slider_Settings::getSettings( $name );
        $setting_value = $value !== false ? $value : $setting['default_value'];
        $setting_html = '';
        $uid = mt_rand();

        if ( $setting['type'] === 'number' || $setting['type'] === 'mixed' ) {
            $setting_html = '
            	<tr>
            		<td>
            			<label data-info="' . wp_kses_post( $setting['description'] ) . '" for="breakpoint-' . esc_attr( $name ) . '-' . $uid . '">' . esc_html( $setting['label'] ) . '</label>
            		</td>
            		<td class="setting-cell">
            			<input id="breakpoint-' . esc_attr( $name ) . '-' . $uid . '" class="breakpoint-setting" type="text" name="' . esc_attr( $name ) . '" value="' . esc_attr( $setting_value ) . '" />
            			<span class="remove-breakpoint-setting"></span>
            		</td>
            	</tr>';
        } else if ( $setting['type'] === 'boolean' ) {
            $setting_html = '
            	<tr>
            		<td>
            			<label data-info="' . wp_kses_post( $setting['description'] ) . '" for="breakpoint-' . esc_attr( $name ) . '-' . $uid . '">' . esc_html( $setting['label'] ) . '</label>
            		</td>
            		<td class="setting-cell">
            			<input id="breakpoint-' . esc_attr( $name ) . '-' . $uid . '" class="breakpoint-setting" type="checkbox" name="' . esc_attr( $name ) . '"' . ( $setting_value === true ? ' checked="checked"' : '' ) . ' />
            			<span class="remove-breakpoint-setting"></span>
            		</td>
            	</tr>';
        } else if ( $setting['type'] === 'select' ) {
            $setting_html ='
            	<tr>
            		<td>
            			<label data-info="' . wp_kses_post( $setting['description'] ) . '" for="breakpoint-' . esc_attr( $name ) . '-' . $uid . '">' . $setting['label'] . '</label>
            		</td>
            		<td class="setting-cell">
            			<select id="breakpoint-' . esc_attr( $name ) . '-' . $uid . '" class="breakpoint-setting" name="' . esc_attr( $name ) . '">';

            foreach ( $setting['available_values'] as $value_name => $value_label ) {
                $setting_html .= '<option value="' . esc_attr( $value_name ) . '"' . ( $setting_value == $value_name ? ' selected="selected"' : '' ) . '>' . esc_html( $value_label ) . '</option>';
            }

            $setting_html .= '
            			</select>
            			<span class="remove-breakpoint-setting"></span>
            		</td>
            	</tr>';
        }

        return $setting_html;
    }

    /**
     * AJAX call for deleting the cached accordions
     * stored using transients.
     *
     * It's called from the Plugin Settings page.
     *
     * @since 1.0.0
     */
    public function ajax_clear_all_cache() {
        $nonce = $_POST['nonce'];

        if ( ! wp_verify_nonce( $nonce, 'clear-all-cache' ) || ! current_user_can( 'edit_posts' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        global $wpdb;

        $wpdb->query( "DELETE FROM " . $wpdb->prefix . "options WHERE option_name LIKE '%accordion_slider_cache_%' AND NOT option_name = 'accordion_slider_cache_expiry_interval'" );

        echo true;

        die();
    }

    /**
     * AJAX call for closing the Getting Started info box.
     *
     * @since 1.0.0
     */
    public function ajax_getting_started_close() {
        $nonce = $_POST['nonce'];

        if ( ! wp_verify_nonce( $nonce, 'close-panel' ) || ! current_user_can( 'manage_options' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        update_option( 'accordion_slider_hide_getting_started_info', true );

        die();
    }

    /**
     * AJAX call for closing the Custom CSS & JS warning box.
     *
     * @since 1.9.0
     */
    public function ajax_close_custom_css_js_warning() {
        $nonce = $_POST['nonce'];

        if ( ! wp_verify_nonce( $nonce, 'close-panel' ) || ! current_user_can( 'manage_options' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        update_option( 'accordion_slider_hide_custom_css_js_warning', true );

        delete_option( 'accordion_slider_custom_css' );
        delete_option( 'accordion_slider_custom_js' );
        delete_option( 'accordion_slider_is_custom_css' );
        delete_option( 'accordion_slider_is_custom_js' );

        die();
    }

    /**
     * AJAX call for closing the image size warning box.
     *
     * @since 1.8.0
     */
    public function ajax_close_image_size_warning() {
        $nonce = $_POST['nonce'];

        if ( ! wp_verify_nonce( $nonce, 'close-panel' ) || ! current_user_can( 'manage_options' ) ) {
            die( 'This action was stopped for security purposes.' );
        }

        update_option( 'accordion_slider_hide_image_size_warning', true );

        die();
    }

}