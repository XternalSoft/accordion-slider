<div class="modal-overlay"></div>
<div class="modal-window-container export-window">
	<div class="modal-window">
		<span class="close-x"></span>
		
		<textarea><?php echo isset( $export_string ) ? $export_string : ''; ?></textarea>

		<div class="inline-info export-info">
            <input type="checkbox" id="show-hide-info" class="show-hide-info">
            <label for="show-hide-info" class="show-info"><?php _e( 'Show info', 'accordion-slider' ); ?></label>
            <label for="show-hide-info" class="hide-info"><?php _e( 'Hide info', 'accordion-slider' ); ?></label>
            
            <div class="info-content">
                <p><?php _e( 'The text above represents the data of the accordion. Please copy the text and then paste it in the import accordion window, by clicking on the <i>Import Accordion</i> button in the <i>Accordion Slider</i> installation where you want to import the accordion.', 'accordion-slider' ); ?></p>
            </div>
        </div>
	</div>
</div>