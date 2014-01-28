<div class="panel">
	<div class="panel-image"> 
		<?php 
			if ( isset ( $panel_image ) && $panel_image !== '' ) {
				echo '<img src="' . esc_url( $panel_image ) . '" />';
			} else {
				echo '<p class="no-image">' . __( 'Click to add image', 'accordion-slider' ) . '</p>';
			}
		?>
	</div>

	<div class="panel-controls">
		<a class="delete-panel" href="#"><?php _e( 'Delete', 'accordion-slider' ); ?></a>
		<a class="duplicate-panel" href="#"><?php _e( 'Duplicate', 'accordion-slider' ); ?></a>
		<a class="toggle-visibility" href="#"><?php _e( 'Visibility', 'accordion-slider' ); ?></a>
	</div>

	<div class="panel-buttons"> 
		<a class="button-secondary edit-background-image" href="#"><?php _e( 'Image', 'accordion-slider' ); ?></a>
		<a class="button-secondary edit-html-content" href="#"><?php _e( 'HTML', 'accordion-slider' ); ?></a>
		<a class="button-secondary edit-layers" href="#"><?php _e( 'Layers', 'accordion-slider' ); ?></a>
		<a class="button-secondary edit-settings" href="#"><?php _e( 'Settings', 'accordion-slider' ); ?></a>
	</div>
</div>
