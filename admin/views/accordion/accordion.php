<div class="wrap accordion-slider-admin">
	<h2><?php echo isset( $_GET['action'] ) && $_GET['action'] === 'edit' ? __( 'Edit Accordion', 'accordion-slider' ) : __( 'Add New Accordion', 'accordion-slider' ); ?></h2>

	<form action="" method="post">
    	<div class="metabox-holder has-right-sidebar">
            <div class="editor-wrapper">
                <div class="editor-body">
                    <div id="titlediv">
                    	<input name="name" id="title" type="text" value="<?php echo esc_attr( $accordion_name ); ?>" />
                    </div>

                    <?php
                        if ( get_option( 'accordion_slider_hide_image_size_warning' ) != true ) {
                    ?>
                            <div class="image-size-warning">
                                <p><?php _e( 'Some of the background images are smaller than the size of the panel, so they might appear blurred when viewed in the accordion.', 'accordion-slider' ); ?></p>
                                <p><?php _e( 'When you select images to insert them into the panels, you can set their size from the right column of the Media Library window, as you can see in <a href="https://bqworks.net/accordion-slider/screencasts/#simple-accordion" target="_blank">this video</a> at 0:05.', 'accordion-slider' ); ?></p>
                                <a href="#" class="image-size-warning-close"><?php _e( 'Don\'t show this again.', 'accordion-slider' ); ?></a>
                            </div>
                    <?php
                        }
                    ?>
					
					<div class="panels-container">
                    	<?php
                    		if ( isset( $panels ) ) {
                    			if ( $panels !== false ) {
                    				foreach ( $panels as $panel ) {
                    					$this->create_panel( $panel );
                    				}
                    			}
                    		} else {
                    			$this->create_panel( false );
                    		}
	                    ?>
                    </div>

                    <div class="add-panel-group">
                        <a class="button add-panel" href="#"><?php _e( 'Add Panels', 'accordion-slider' ); ?> <span class="add-panel-arrow">&#9660</span></a>
                        <ul class="panel-type">
                            <li><a href="#" data-type="image"><?php _e( 'Image Panels', 'accordion-slider' ); ?></a></li>
                            <li><a href="#" data-type="posts"><?php _e( 'Posts Panels', 'accordion-slider' ); ?></a></li>
                            <li><a href="#" data-type="posts_ids"><?php _e( 'Posts IDs Panels', 'accordion-slider' ); ?></a></li>
                            <li><a href="#" data-type="gallery"><?php _e( 'Gallery Panels', 'accordion-slider' ); ?></a></li>
                            <li><a href="#" data-type="flickr"><?php _e( 'Flickr Panels', 'accordion-slider' ); ?></a></li>
                            <li><a href="#" data-type="empty"><?php _e( 'Empty Panel', 'accordion-slider' ); ?></a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="inner-sidebar meta-box-sortables ui-sortable">
				<div class="postbox action">
					<div class="inside">
						<input type="submit" name="submit" class="button-primary" value="<?php echo isset( $_GET['action'] ) && $_GET['action'] === 'edit' ? __( 'Update', 'accordion-slider' ) : __( 'Create', 'accordion-slider' ); ?>" />
                        <span class="spinner update-spinner"></span>
						<a class="button preview-accordion" href="#"><?php _e( 'Preview', 'accordion-slider' ); ?></a>
                        <span class="spinner preview-spinner"></span>
					</div>
				</div>
                
                <div class="sidebar-settings">
                    <?php 
                        $settings_panels = BQW_Accordion_Slider_Settings::getAccordionSettingsPanels();
                        $default_panels_state = BQW_Accordion_Slider_Settings::getPanelsState();

                        foreach ( $settings_panels as $panel_name => $panel ) {
                            $panel_state_class = isset( $panels_state ) && isset( $panels_state[ $panel_name ] ) ? $panels_state[ $panel_name ] : ( isset( $default_panels_state[ $panel_name ] ) ? $default_panels_state[ $panel_name ] : 'closed' );
                    ?>
                            <div class="postbox <?php echo esc_attr( $panel_name . '-panel' ) . ' ' . esc_attr( $panel_state_class ); ?>" data-name="<?php echo esc_attr( $panel_name ); ?>">
                                <div class="handlediv"></div>
                                <h3 class="hndle"><?php echo esc_html( $panel['label'] ); ?></h3>
                                <div class="inside">
                                    <?php  include( $panel['renderer'] ); ?>
                                </div>
                            </div>
                    <?php
                        }
                    ?>
                </div>
            </div>
        </div>
	</form>
</div>