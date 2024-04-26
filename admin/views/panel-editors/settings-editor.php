<div class="modal-overlay"></div>
<div class="modal-window-container settings-editor">
	<div class="modal-window">
		<span class="close-x"></span>
		
		<table>
			<thead>
				<tr>
					<th class="label-cell">
						<label for="content-type"><?php _e( 'Content Type', 'accordion-slider' ); ?>:</label>
					</th>
					<th class="setting-cell">
						<select id="content-type" class="panel-setting" name="content_type">
							<?php
								foreach ( $panel_default_settings['content_type']['available_values'] as $value_name => $value_label ) {
									$selected = ( $content_type === $value_name ) ? ' selected="selected"' : '';
									echo '<option value="' . esc_attr( $value_name ) . '"' . $selected . '>' . esc_html( $value_label ) . '</option>';
		                        }
							?>
						</select>
					</th>
				</tr>
			</thead>
			<tbody class="content-type-settings">
				<?php
					$this->load_content_type_settings( $content_type, $panel_default_settings, $panel_settings );
				?>
			</tbody>
		</table>
	</div>
</div>