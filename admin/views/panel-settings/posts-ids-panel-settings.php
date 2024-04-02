<tr>
	<td class="label-cell">
		<label for="posts-maximum"><?php _e( 'Post IDs', 'accordion-slider' ); ?>:</label>
	</td>
	<td class="setting-cell">
		<input id="posts-ids" class="panel-setting" type="text" name="posts_ids" value="<?php echo isset( $panel_settings['posts_ids'] ) ? esc_attr( $panel_settings['posts_ids'] ) : esc_attr( $panel_default_settings['posts_ids']['default_value'] ); ?>" />
        <p class="description"><?php echo $panel_default_settings['posts_ids']['description']; ?></p>
	</td>
</tr>
