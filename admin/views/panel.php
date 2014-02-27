<div class="panel">
	<span class="spinner panel-spinner"></span>
	
	<div class="panel-preview">
		<?php 
			if ( isset ( $panel_image ) && $panel_image !== '' ) {
				echo '<img src="' . esc_url( $panel_image ) . '" />';
			} else {
				echo '<p class="no-image">' . __( 'Click to add image', 'accordion-slider' ) . '</p>';
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
