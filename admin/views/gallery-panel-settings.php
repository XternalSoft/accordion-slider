<tr>
	<td colspan="2">
		<?php
            $show_info = get_option( 'accordion_slider_show_inline_info', true );

            if ( $show_info === true ) {
        ?>
            <div class="inline-info panel-settings-info">
                <input type="checkbox" id="show-hide-info" class="show-hide-info">
                <label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'accordion-slider' ); ?></label>
                <label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'accordion-slider' ); ?></label>
                
                <div class="info-content">
                    <p><?php _e( 'Multiple panels will be dynamically generated, one panel for each image from the <i>[gallery]</i> shortcode.', 'accordion-slider' ); ?></p>
                    <p><?php _e( 'You just need to drop the accordion slider shortcode in a post that contains a <i>[gallery]</i> shortcode, and the images from the <i>[gallery]</i> will automatically be loaded in the accordion.', 'accordion-slider' ); ?></p>
                    <p><?php _e( 'The images and their data can be fetched through <i>dynamic tags</i>, which are enumerated in the Background, Layers and HTML editors.', 'accordion-slider' ); ?></p>
                </div>
            </div>
        <?php
            }
        ?>
	</td>
</tr>