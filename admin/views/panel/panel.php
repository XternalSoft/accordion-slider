<div class="panel<?php echo ( $panel_type === 'posts' || $panel_type === 'posts_ids' || $panel_type === 'gallery' || $panel_type === 'flickr' ) ? ' dynamic-panel' : '' ; ?>">
	<span class="spinner panel-spinner"></span>
	
	<div class="panel-preview">
		<?php 
			if ( $panel_type === 'custom' ) {
				if ( $panel_image !== '' ) {
					echo '<img src="' . esc_url( $panel_image ) . '" />';
				} else {
					echo '<p class="no-image">' . __( 'Click to add image', 'accordion-slider' ) . '</p>';
				}
			} else if ( $panel_type === 'posts' ) {
				echo '<p>[ ' . __( 'Posts Panels', 'accordion-slider' ) . ' ]</p>';
			} else if ( $panel_type === 'posts_ids' ) {
				echo '<p>[ ' . __( 'Posts IDs Panels', 'accordion-slider' ) . ' ]</p>';
			} else if ( $panel_type === 'gallery' ) {
				echo '<p>[ ' . __( 'Gallery Panels', 'accordion-slider' ) . ' ]</p>';
			} else if ( $panel_type === 'flickr' ) {
				echo '<p>[ ' . __( 'Flickr Panels', 'accordion-slider' ) . ' ]</p>';
			}
		?>
	</div>

	<div class="panel-controls">
		<a class="delete-panel" href="#" title="Delete Panel">Delete</a>
		<a class="duplicate-panel" href="#" title="Duplicate Panel">Duplicate</a>
	</div>

	<div class="panel-buttons"> 
		<a class="edit-background-image" href="#" title="Edit Background Image">Image</a>
		<a class="edit-layers" href="#" title="Edit Layers">Layers</a>
		<a class="edit-html" href="#" title="Edit HTML">HTML</a>
		<a class="edit-settings" href="#" title="Edit Settings">Settings</a>
	</div>
</div>
