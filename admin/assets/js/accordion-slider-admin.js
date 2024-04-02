/*
 * ======================================================================
 * Accordion Slider Admin
 * ======================================================================
 */
(function( $ ) {

	var AccordionSliderAdmin = {

		/**
		 * Stores the data for all panels in the accordion.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Array}
		 */
		panels: [],

		/**
		 * Keeps a count for the panels in the accordion.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Int}
		 */
		panelCounter: 0,

		/**
		 * Stores all posts names and their taxonomies.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Object}
		 */
		postsData: {},

		/**
		 * Indicates if the preview images from the panels
		 * can be resized.
		 * This prevents resizing the images too often.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Boolean}
		 */
		allowPanelImageResize: true,

		/**
		 * Initializes the functionality for a single accordion page
		 * or for the page that contains all the accordions.
		 *
		 * @since 1.0.0
		 */
		init: function() {
			if ( as_js_vars.page === 'single' ) {
				this.initSingleAccordionPage();
			} else if ( as_js_vars.page === 'all' ) {
				this.initAllAccordionsPage();
			}
		},

		/*
		 * ======================================================================
		 * Accordion functions
		 * ======================================================================
		 */
		
		/**
		 * Initializes the functionality for a single accordion page
		 * by adding all the necessary event listeners.
		 *
		 * @since 1.0.0
		 */
		initSingleAccordionPage: function() {
			var that = this;

			this.initPanels();

			if ( parseInt( as_js_vars.id, 10 ) !== -1 ) {
				this.loadAccordionData( function() {
					that.checkBackgroundImageSize();
					$( '.panels-container' ).attr( 'data-loaded', 'true' );
				});
			}

			$( 'form' ).on( 'submit', function( event ) {
				event.preventDefault();
				that.saveAccordion();
 
				that.checkBackgroundImageSize();
			});

			$( '.preview-accordion' ).on( 'click', function( event ) {
				event.preventDefault();
				that.previewAccordion();
			});

			$( '.add-panel, .panel-type a[data-type="empty"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addEmptyPanel();
			});

			$( '.panel-type a[data-type="image"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addImagePanels();
			});

			$( '.panel-type a[data-type="posts"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addPostsPanels();
			});

			$( '.panel-type a[data-type="posts_ids"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addPostsIDsPanels();
			});

			$( '.panel-type a[data-type="gallery"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addGalleryPanels();
			});

			$( '.panel-type a[data-type="flickr"]' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addFlickrPanels();
			});

			$( '.add-breakpoint' ).on( 'click', function( event ) {
				event.preventDefault();
				that.addBreakpoint();
			});

			$( '.breakpoints' ).on( 'click', '.breakpoint-setting-name a', function( event ) {
				event.preventDefault();

				var name = $( this ).attr( 'data-type' ),
					context = $( this ).parents( '.breakpoint' ).find( '.breakpoint-settings' );

				that.addBreakpointSetting( name, context );
			});

			$( '.breakpoints' ).on( 'click', '.remove-breakpoint', function( event ) {
				$( this ).parents( '.breakpoint' ).remove();
			});

			$( '.breakpoints' ).on( 'click', '.remove-breakpoint-setting', function( event ) {
				$( this ).parents( 'tr' ).remove();
			});

			$( '.breakpoints' ).lightSortable( {
				children: '.breakpoint',
				placeholder: ''
			} );

			$( '.postbox .hndle, .postbox .handlediv' ).on( 'click', function() {
				var postbox = $( this ).parent( '.postbox' );
				
				if ( postbox.hasClass( 'closed' ) === true ) {
					postbox.removeClass( 'closed' );
				} else {
					postbox.addClass( 'closed' );
				}
			});

			$( '.sidebar-settings' ).on( 'mouseover', 'label', function() {
				that.showInfo( $( this ) );
			});

			$( '.image-size-warning-close' ).click(function( event ) {
				event.preventDefault();
 
				$( '.image-size-warning' ).remove();
 
				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { 
						action: 'accordion_slider_close_image_size_warning',
						nonce: as_js_vars.cp_nonce
					}
				});
			});

			$( window ).resize(function() {
				if ( that.allowPanelImageResize === true ) {
					that.resizePanelImages();
					that.allowPanelImageResize = false;

					setTimeout( function() {
						that.resizePanelImages();
						that.allowPanelImageResize = true;
					}, 250 );
				}
			});
		},

		/**
		 * Initializes the functionality for the page that contains
		 * all the accordions by adding all the necessary event listeners.
		 *
		 * @since 1.0.0
		 */
		initAllAccordionsPage: function() {
			var that = this;

			$( '.accordions-list' ).on( 'click', '.preview-accordion', function( event ) {
				event.preventDefault();
				that.previewAccordionAll( $( this ) );
			});

			$( '.accordions-list' ).on( 'click', '.delete-accordion', function( event ) {
				event.preventDefault();
				that.deleteAccordion( $( this ) );
			});

			$( '.accordions-list' ).on( 'click', '.duplicate-accordion', function( event ) {
				event.preventDefault();
				that.duplicateAccordion( $( this ) );
			});

			$( '.accordions-list' ).on( 'click', '.export-accordion', function( event ) {
				event.preventDefault();
				that.exportAccordion( $( this ) );
			});

			$( '.import-accordion' ).on( 'click', function( event ) {
				event.preventDefault();
				ImportWindow.open();
			});

			$( '.clear-all-cache' ).on( 'click', function( event ) {
				event.preventDefault();

				$( '.clear-cache-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

				var nonce = $( this ).attr( 'data-nonce' );

				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { action: 'accordion_slider_clear_all_cache', nonce: nonce },
					complete: function( data ) {
						$( '.clear-cache-spinner' ).css( { 'display': '', 'visibility': '' } );
					}
				});
			});

			$( '.getting-started-close' ).click(function( event ) {
				event.preventDefault();

				$( '.getting-started-info' ).hide();

				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { 
						action: 'accordion_slider_getting_started_close',
						nonce: as_js_vars.cp_nonce
					}
				});
			});

			$( '.custom-css-js-warning-close' ).click(function( event ) {
				event.preventDefault();

				var dialog = $(
					'<div class="modal-overlay"></div>' +
					'<div class="modal-window-container">' +
					'	<div class="modal-window delete-accordion-dialog">' +
					'		<p class="dialog-question">' + as_js_vars.remove_custom_css_js_warning + '</p>' +
					'		<div class="dialog-buttons">' +
					'			<a class="button dialog-ok" href="#">' + as_js_vars.yes + '</a>' +
					'			<a class="button dialog-cancel" href="#">' + as_js_vars.cancel + '</a>' +
					'		</div>' +
					'	</div>' +
					'</div>'
				).appendTo( 'body' );

				dialog.find( '.dialog-ok' ).one( 'click', function( event ) {
					event.preventDefault();

					$( '.custom-css-js-warning' ).hide();

					$.ajax({
						url: as_js_vars.ajaxurl,
						type: 'post',
						data: {
							action: 'accordion_slider_close_custom_css_js_warning',
							nonce: as_js_vars.cp_nonce
						}
					});

					dialog.remove();
				});

				dialog.find( '.dialog-cancel' ).one( 'click', function( event ) {
					event.preventDefault();
					dialog.remove();
				});

				dialog.find( '.modal-overlay' ).one( 'click', function( event ) {
					dialog.remove();
				});
			});
		},

		/**
		 * Load the accordion accordion data.
		 * 
		 * Send an AJAX request with the accordion id and the nonce, and
		 * retrieve all the accordion's database data. Then, assign the
		 * data to the panels.
		 *
		 * @since 1.0.0
		 */
		loadAccordionData: function( callback ) {
			var that = this;

			$( '.panel-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'get',
				data: { action: 'accordion_slider_get_accordion_data', id: as_js_vars.id, nonce: as_js_vars.lad_nonce },
				complete: function( data ) {
					var accordionData = $.parseJSON( data.responseText );

					$.each( accordionData.panels, function( index, panel ) {
						var panelData = {
							background: {},
							layers: panel.layers,
							html: panel.html,
							settings: $.isArray( panel.settings ) ? {} : panel.settings
						};

						$.each( panel, function( settingName, settingValue ) {
							if ( settingName.indexOf( 'background' ) !== -1 ) {
								panelData.background[ settingName ] = settingValue;
							}
						});

						that.getPanel( index ).setData( 'all', panelData );
					});

					$( '.panel-spinner' ).css( { 'display': '', 'visibility': '' } );

					callback();
				}
			});
		},

		/**
		 * Save the accordion's data.
		 * 
		 * Get the accordion's data and send it to the server with AJAX. If
		 * a new accordion was created, redirect to the accordion's edit page.
		 *
		 * @since 1.0.0
		 */
		saveAccordion: function() {
			var accordionData = this.getAccordionData();
			accordionData[ 'nonce' ] = as_js_vars.sa_nonce;
			accordionData[ 'action' ] = 'save';

			var accordionDataString = JSON.stringify( accordionData );

			var spinner = $( '.update-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_save_accordion', data: accordionDataString },
				complete: function( data ) {
					spinner.css( { 'display': '', 'visibility': '' } );

					if ( parseInt( as_js_vars.id, 10 ) === -1 && isNaN( data.responseText ) === false ) {
						$( 'h2' ).after( '<div class="updated"><p>' + as_js_vars.accordion_create + '</p></div>' );

						window.location = as_js_vars.admin + '?page=accordion-slider&id=' + data.responseText + '&action=edit';
					} else if ( $( '.updated' ).length === 0 ) {
						$( 'h2' ).after( '<div class="updated"><p>' + as_js_vars.accordion_update + '</p></div>' );
					}
				}
			});
		},

		/**
		 * Get the accordion's data.
		 * 
		 * Read the value of the sidebar settings, including the breakpoints,
		 * the panels state, the name of the accordion, the id, and get the
		 * data for each panel.
		 *
		 * @since 1.0.0
		 * 
		 * @return {Object} The accordion data.
		 */
		getAccordionData: function() {
			var that = this,
				accordionData = {
					'id': as_js_vars.id,
					'name': $( 'input#title' ).val(),
					'settings': {},
					'panels': [],
					'panels_state': {}
				},
				breakpoints = [];

			$( '.panels-container' ).find( '.panel' ).each(function( index ) {
				var $panel = $( this ),
					panelData = that.getPanel( parseInt( $panel.attr('data-id'), 10 ) ).getData( 'all' );
				
				panelData.position = parseInt( $panel.attr( 'data-position' ), 10 );

				accordionData.panels[ index ] = panelData;
			});

			$( '.sidebar-settings' ).find( '.setting' ).each(function() {
				var setting = $( this );
				accordionData.settings[ setting.attr( 'name' ) ] = setting.attr( 'type' ) === 'checkbox' ? setting.is( ':checked' ) : setting.val();
			});

			$( '.breakpoints' ).find( '.breakpoint' ).each(function() {
				var breakpointGroup = $( this ),
					breakpoint = { 'breakpoint_width': breakpointGroup.find( 'input[name="breakpoint_width"]' ).val() };

				breakpointGroup.find( '.breakpoint-setting' ).each(function() {
					var breakpointSetting = $( this );

					breakpoint[ breakpointSetting.attr( 'name' ) ] = breakpointSetting.attr( 'type' ) === 'checkbox' ? breakpointSetting.is( ':checked' ) : breakpointSetting.val();
				});

				breakpoints.push( breakpoint );
			});

			if ( breakpoints.length > 0 ) {
				accordionData.settings.breakpoints = breakpoints;
			}

			$( '.sidebar-settings' ).find( '.postbox' ).each(function() {
				var panel = $( this );
				accordionData.panels_state[ panel.attr( 'data-name' ) ] = panel.hasClass( 'closed' ) ? 'closed' : '';
			});

			return accordionData;
		},

		/**
		 * Preview the accordion in the accordion's edit page.
		 *
		 * @since 1.0.0
		 */
		previewAccordion: function() {
			PreviewWindow.open( this.getAccordionData() );
		},

		/**
		 * Preview the accordion in the accordions' list page.
		 *
		 * @since 1.0.0
		 */
		previewAccordionAll: function( target ) {
			var url = $.lightURLParse( target.attr( 'href' ) ),
				nonce = url.lad_nonce,
				id = parseInt( url.id, 10 );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'get',
				data: { action: 'accordion_slider_get_accordion_data', id: id, nonce: nonce },
				complete: function( data ) {
					var accordionData = $.parseJSON( data.responseText );

					PreviewWindow.open( accordionData );
				}
			});
		},

		/**
		 * Delete an accordion.
		 *
		 * This is called in the accordions' list page upon clicking
		 * the 'Delete' link.
		 *
		 * It displays a confirmation dialog before sending the request
		 * for deletion to the server.
		 *
		 * The accordion's row is removed after the accordion is deleted
		 * server-side.
		 * 
		 * @since 1.0.0
		 *
		 * @param  {jQuery Object} target The clicked 'Delete' link.
		 */
		deleteAccordion: function( target ) {
			var url = $.lightURLParse( target.attr( 'href' ) ),
				nonce = url.da_nonce,
				id = parseInt( url.id, 10 ),
				row = target.parents( 'tr' );

			var dialog = $(
				'<div class="modal-overlay"></div>' +
				'<div class="modal-window-container">' +
				'	<div class="modal-window delete-accordion-dialog">' +
				'		<p class="dialog-question">' + as_js_vars.accordion_delete + '</p>' +
				'		<div class="dialog-buttons">' +
				'			<a class="button dialog-ok" href="#">' + as_js_vars.yes + '</a>' +
				'			<a class="button dialog-cancel" href="#">' + as_js_vars.cancel + '</a>' +
				'		</div>' +
				'	</div>' +
				'</div>'
			).appendTo( 'body' );

			dialog.find( '.dialog-ok' ).one( 'click', function( event ) {
				event.preventDefault();

				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { action: 'accordion_slider_delete_accordion', id: id, nonce: nonce },
					complete: function( data ) {
						if ( id === parseInt( data.responseText, 10 ) ) {
							row.fadeOut( 300, function() {
								row.remove();
							});
						}
					}
				});

				dialog.remove();
			});

			dialog.find( '.dialog-cancel' ).one( 'click', function( event ) {
				event.preventDefault();
				dialog.remove();
			});

			dialog.find( '.modal-overlay' ).one( 'click', function( event ) {
				dialog.remove();
			});
		},

		/**
		 * Duplicate an accordion.
		 *
		 * This is called in the accordions' list page upon clicking
		 * the 'Duplicate' link.
		 *
		 * A new row is added in the list for the newly created
		 * accordion.
		 * 
		 * @since 1.0.0
		 *
		 * @param  {jQuery Object} target The clicked 'Duplicate' link.
		 */
		duplicateAccordion: function( target ) {
			var url = $.lightURLParse( target.attr( 'href' ) ),
				nonce = url.dua_nonce,
				id = parseInt( url.id, 10 );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_duplicate_accordion', id: id, nonce: nonce },
				complete: function( data ) {
					var row = $( data.responseText ).appendTo( $( '.accordions-list tbody' ) );
					
					row.hide().fadeIn();
				}
			});
		},

		/**
		 * Open the accordion export window.
		 *
		 * This is called in the accordions' list page upon clicking
		 * the 'Export' link.
		 * 
		 * @since 1.0.0
		 *
		 * @param  {jQuery Object} target The clicked 'Export' link.
		 */
		exportAccordion: function( target ) {
			var url = $.lightURLParse( target.attr( 'href' ) ),
				nonce = url.ea_nonce,
				id = parseInt( url.id, 10 );

			ExportWindow.open( id, nonce );
		},

		/*
		 * ======================================================================
		 * Panel functions executed by the accordion
		 * ======================================================================
		 */
		
		/**
		 * Initialize all the existing panels when the page loads.
		 * 
		 * @since 1.0.0
		 */
		initPanels: function() {
			var that = this;

			$( '.panels-container' ).find( '.panel' ).each(function( index ) {
				that.initPanel( $( this ) );
			});

			$( '.panels-container' ).lightSortable( {
				children: '.panel',
				placeholder: 'panel panel-placeholder',
				sortEnd: function( event ) {
					$( '.panel' ).each(function( index ) {
						$( this ).attr( 'data-position', index );
					});
				}
			} );
		},

		/**
		 * Initialize an individual panel.
		 *
		 * Creates a new instance of the Panel object and adds it 
		 * to the array of panels.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {jQuery Object} element The panel element.
		 * @param  {Object}        data    The panel's data.
		 */
		initPanel: function( element, data ) {
			var that = this,
				$panel = element,
				panel = new Panel( $panel, this.panelCounter, data );

			this.panels.push( panel );

			panel.on( 'duplicatePanel', function( event ) {
				that.duplicatePanel( event.panelData );
			});

			panel.on( 'deletePanel', function( event ) {
				that.deletePanel( event.id );
			});

			$panel.attr( 'data-id', this.panelCounter );
			$panel.attr( 'data-position', this.panelCounter );

			this.panelCounter++;
		},

		/**
		 * Return the panel data.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int}    id The id of the panel to retrieve.
		 * @return {Object}    The data of the retrieved panel.
		 */
		getPanel: function( id ) {
			var that = this,
				selectedPanel;

			$.each( that.panels, function( index, panel ) {
				if ( panel.id === id ) {
					selectedPanel = panel;
					return false;
				}
			});

			return selectedPanel;
		},

		/**
		 * Duplicate an individual panel.
		 *
		 * The background image is sent to the server for the purpose
		 * of adding it to the panel preview, while the rest of the data
		 * is passed with JS.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Object} panelData The data of the object to be duplicated.
		 */
		duplicatePanel: function( panelData ) {
			var that = this,
				newPanelData = $.extend( true, {}, panelData ),
				data = [{
					settings: {
						content_type: newPanelData.settings.content_type
					},
					background_source: newPanelData.background.background_source
				}];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( data ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) );

					that.initPanel( panel, newPanelData );
				}
			});
		},

		/**
		 * Delete an individual panel.
		 *
		 * The background image is sent to the server for the purpose
		 * of adding it to the panel preview, while the rest of the data
		 * is passed with JS.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int} id The id of the panel to be deleted.
		 */
		deletePanel: function( id ) {
			var that = this,
				panel = that.getPanel( id ),
				dialog = $(
					'<div class="modal-overlay"></div>' +
					'<div class="modal-window-container">' +
					'	<div class="modal-window delete-panel-dialog">' +
					'		<p class="dialog-question">' + as_js_vars.panel_delete + '</p>' +
					'		<div class="dialog-buttons">' +
					'			<a class="button dialog-ok" href="#">' + as_js_vars.yes + '</a>' +
					'			<a class="button dialog-cancel" href="#">' + as_js_vars.cancel + '</a>' +
					'		</div>' +
					'	</div>' +
					'</div>').appendTo( 'body' );

			dialog.find( '.dialog-ok' ).one( 'click', function( event ) {
				event.preventDefault();

				panel.off( 'duplicatePanel' );
				panel.off( 'deletePanel' );
				panel.remove();
				dialog.remove();

				that.panels.splice( $.inArray( panel, that.panels ), 1 );
			});

			dialog.find( '.dialog-cancel' ).one( 'click', function( event ) {
				event.preventDefault();
				dialog.remove();
			});

			dialog.find( '.modal-overlay' ).one( 'click', function( event ) {
				dialog.remove();
			});
		},

		/**
		 * Add an empty panel.
		 *
		 * @since 1.0.0
		 */
		addEmptyPanel: function() {
			var that = this;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels' },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) );

					that.initPanel( panel );
				}
			});
		},

		/**
		 * Add image panel(s).
		 *
		 * Add one or multiple panels pre-populated with image data.
		 *
		 * @since 1.0.0
		 */
		addImagePanels: function() {
			var that = this;
			
			MediaLoader.open(function( selection ) {
				var images = [];

				$.each( selection, function( index, image ) {
					images.push({
						background_source: image.url,
						background_alt: image.alt,
						background_title: image.title,
						background_width: image.width,
						background_height: image.height
					});
				});

				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { action: 'accordion_slider_add_panels', data: JSON.stringify( images ) },
					complete: function( data ) {
						var lastIndex = $( '.panels-container' ).find( '.panel' ).length - 1,
							panels = $( '.panels-container' ).append( data.responseText ),
							indexes = lastIndex === -1 ? '' : ':gt(' + lastIndex + ')';

						panels.find( '.panel' + indexes ).each(function( index ) {
							var panel = $( this );

							that.initPanel( panel, { background: images[ index ], layers: {}, html: '', settings: {} } );
						});

						AccordionSliderAdmin.checkBackgroundImageSize();
					}
				});
			});
		},

		/**
		 * Add posts panel.
		 *
		 * Add a posts panel and pre-populate it with dynamic tags.
		 *
		 * Also, automatically open the Setting editor to allow the
		 * user to configurate the WordPress query.
		 *
		 * @since 1.0.0
		 */
		addPostsPanels: function() {
			var that = this,
				data =  [{
					settings: {
						content_type: 'posts'
					}
				}];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( data ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) ),
						panelId = that.panelCounter;

					that.initPanel( panel, {
						background: {
							background_source: '[as_image_src]',
							background_alt: '[as_image_alt]',
							background_link: '[as_link_url]'
						},
						layers: [
							{
								id: 1,
								name: 'Layer 1',
								type: 'paragraph',
								text: '[as_title]',
								settings: {
									position: 'bottomLeft',
									horizontal: '0',
									vertical: '0',
									preset_styles: ['as-black', 'as-padding']
								}
							}
						],
						html: '',
						settings: {
							content_type: 'posts'
						}
					});

					SettingsEditor.open( panelId );
				}
			});
		},
		/**
		 * Add posts IDs panel.
		 *
		 * Add a posts IDs panel and pre-populate it with dynamic tags.
		 *
		 * @since 1.9.8
		 */
		addPostsIDsPanels: function() {
			var that = this,
				data =  [{
					settings: {
						content_type: 'posts_ids'
					}
				}];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( data ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) ),
						panelId = that.panelCounter;

					that.initPanel( panel, {
						background: {
							background_source: '[as_image_src]',
							background_alt: '[as_image_alt]',
							background_link: '[as_link_url]'
						},
						layers: [
							{
								id: 1,
								name: 'Layer 1',
								type: 'paragraph',
								text: '[as_title]',
								settings: {
									position: 'bottomLeft',
									horizontal: '0',
									vertical: '0',
									preset_styles: ['as-black', 'as-padding']
								}
							}
						],
						html: '',
						settings: {
							content_type: 'posts_ids'
						}
					});

					SettingsEditor.open( panelId );
				}
			});
		},

		/**
		 * Add gallery panel.
		 *
		 * Add a gallery panel and pre-populate it with dynamic tags.
		 *
		 * Also, automatically open the Setting editor inform the user
		 * on how to use this panel type.
		 *
		 * @since 1.0.0
		 */
		addGalleryPanels: function() {
			var that = this,
				data =  [{
					settings: {
						content_type: 'gallery'
					}
				}];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( data ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) ),
						panelId = that.panelCounter;

					that.initPanel( panel, {
						background: {
							background_source: '[as_image_src]',
							background_alt: '[as_image_alt]'
						},
						layers: {},
						html: '',
						settings: {
							content_type: 'gallery'
						}
					});

					SettingsEditor.open( panelId );
				}
			});
		},

		/**
		 * Add Flickr panel.
		 *
		 * Add a Flickr panel and pre-populate it with dynamic tags.
		 *
		 * Also, automatically open the Setting editor to allow the
		 * user to configurate the Flickr query.
		 *
		 * @since 1.0.0
		 */
		addFlickrPanels: function() {
			var that = this,
				data =  [{
					settings: {
						content_type: 'flickr'
					}
				}];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( data ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) ),
						panelId = that.panelCounter;

					that.initPanel( panel, {
						background: {
							background_source: '[as_image_src]',
							background_link: '[as_image_link]'
						},
						layers: [
							{
								id: 1,
								name: 'Layer 1',
								type: 'paragraph',
								text: '[as_image_description]',
								settings: {
									position: 'bottomLeft',
									horizontal: '0',
									vertical: '0',
									preset_styles: ['as-black', 'as-padding']
								}
							}
						],
						html: '',
						settings: {
							content_type: 'flickr'
						}
					});

					SettingsEditor.open( panelId );
				}
			});
		},

		/*
		 * ======================================================================
		 * More accordion functions
		 * ======================================================================
		 */
		
		/**
		 * Add a breakpoint fieldset.
		 *
		 * Also, try to automatically assigns the width of the breakpoint.
		 * 
		 * @since 1.0.0
		 */
		addBreakpoint: function() {
			var that = this,
				size = '',
				previousWidth = $( 'input[name="breakpoint_width"]' ).last().val();
			
			if ( typeof previousWidth === 'undefined' ) {
				size = '960';
			} else if ( previousWidth !== '' ) {
				size = previousWidth - 190;
			}

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'get',
				data: { action: 'accordion_slider_add_breakpoint', data: size },
				complete: function( data ) {
					$( data.responseText ).appendTo( $( '.breakpoints' ) );
				}
			});
		},

		/**
		 * Add a breakpoint setting.
		 * 
		 * @since 1.0.0
		 */
		addBreakpointSetting: function( name, context) {
			var that = this;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'get',
				data: { action: 'accordion_slider_add_breakpoint_setting', data: name },
				complete: function( data ) {
					$( data.responseText ).appendTo( context );
				}
			});
		},

		/**
		 * Load the taxonomies for the selected post names and 
		 * pass all the returned data to the callback function.
		 *
		 * Only load the taxonomies for a particular post name if
		 * it's not already available in the 'postsData' property,
		 * which stores all the posts data loaded in a session.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Array}    posts    Array of post names.
		 * @param  {Function} callback Function to call after the taxonomies are loaded.
		 */
		getTaxonomies: function( posts, callback ) {
			var that = this,
				postsToLoad = [];

			$.each( posts, function( index, postName ) {
				if ( typeof that.postsData[ postName ] === 'undefined' ) {
					postsToLoad.push( postName );
				}
			});

			if ( postsToLoad.length !== 0 ) {
				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'get',
					data: { action: 'accordion_slider_get_taxonomies', post_names: JSON.stringify( postsToLoad ) },
					complete: function( data ) {
						var response = $.parseJSON( data.responseText );

						$.each( response, function( name, taxonomy ) {
							that.postsData[ name ] = taxonomy;
						});

						callback( that.postsData );
					}
				});
			} else {
				callback( this.postsData );
			}
		},

		/**
		 * Display the informative tooltip.
		 * 
		 * @since 1.0.0
		 * 
		 * @param  {jQuery Object} target The setting label which is hovered.
		 */
		showInfo: function( target ) {
			var label = target,
				info = label.attr( 'data-info' ),
				infoTooltip = null;

			if ( typeof info !== 'undefined' ) {
				infoTooltip = $( '<div class="info-tooltip">' + info + '</div>' ).appendTo( label.parent() );
				infoTooltip.css( { 'left': - infoTooltip.outerWidth( true ) ,'marginTop': - infoTooltip.outerHeight( true ) * 0.5 - 9 } );
			}

			label.on( 'mouseout', function() {
				if ( infoTooltip !== null ) {
					infoTooltip.remove();
				}
			});
		},

		/**
		 * Iterate through all panels and resizes the preview
		 * images based on their aspect ratio and the panel's
		 * current aspect ratio.
		 *
		 * @since 1.0.0
		 */
		resizePanelImages: function() {
			var panelRatio = $( '.panel-preview' ).width() / $( '.panel-preview' ).height();

			$( '.panel-preview > img' ).each(function() {
				var image = $( this );

				if ( image.width() / image.height() > panelRatio ) {
					image.css( { width: 'auto', height: '100%' } );
				} else {
					image.css( { width: '100%', height: 'auto' } );
				}
			});
		},

		/**
		 * Check the size of the background images and, if they are smaller than the size
		 * of the accordion, display a warning.
		 *
		 * Only check images that have a non-zero width and height. Skip slides that
		 * have dynamic images or images from outside the Media Library.
		 *
		 * @since 1.7.0
		 */
		checkBackgroundImageSize: function() {
			if ( $( '.image-size-warning' ).length === 0 ) {
				return;
			}
 
			var showWarning = false,
				accordionWidth = $( '.sidebar-settings' ).find( '.setting[name="width"]' ).val(),
				accordionHeight = $( '.sidebar-settings' ).find( '.setting[name="height"]' ).val(),
				orientation = $( '.sidebar-settings' ).find( '.setting[name="orientation"]' ).val();

			$.each( this.panels, function( index, panel ) {
				var image = panel.getData( 'background' );

				if ( parseInt( image[ 'background_width' ], 10 ) === 0 || parseInt( image[ 'background_height' ], 10 ) === 0 ) {
					return;
				}
				
				if ( ( orientation === 'vertical' && isNaN( accordionWidth ) === false && parseInt( image[ 'background_width' ], 10 ) < parseInt( accordionWidth, 10 ) ) ||
					( orientation === 'horizontal' && isNaN( accordionHeight ) === false && parseInt( image[ 'background_height' ], 10 ) < parseInt( accordionHeight, 10 ) ) ) {
					showWarning = true;
				}
			} );
 
			if ( showWarning === true ) {
				$( '.image-size-warning' ).css( 'display', 'block' );
			} else {
				$( '.image-size-warning' ).css( 'display', '' );
			}
		}
		
	};

	/*
	 * ======================================================================
	 * Export and import functions
	 * ======================================================================
	 */
		
	var ExportWindow = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		exportWindow: null,

		/**
		 * Open the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int}    id    The id of the accordion.
		 * @param  {string} nonce A security nonce.
		 */
		open: function( id, nonce ) {
			var that = this;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_export_accordion', id: id, nonce: nonce },
				complete: function( data ) {
					that.exportWindow = $( data.responseText ).appendTo( $( 'body' ) );
					that.init();
				}
			});
		},

		/**
		 * Add event listeners to the buttons.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.exportWindow.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.close();
			});

			this.exportWindow.find( 'textarea' ).on( 'click', function( event ) {
				event.preventDefault();

				$( this ).focus();
				$( this ).select();
			});
		},

		/**
		 * Handle window closing.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.exportWindow.find( '.close-x' ).off( 'click' );
			this.exportWindow.find( 'textarea' ).off( 'click' );
			this.exportWindow.remove();
		}
	};

	var ImportWindow = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		importWindow: null,

		/**
		 * Open the modal window.
		 *
		 * @since 1.0.0
		 */
		open: function() {
			var that = this;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_import_accordion' },
				complete: function( data ) {
					that.importWindow = $( data.responseText ).appendTo( $( 'body' ) );
					that.init();
				}
			});
		},

		/**
		 * Add event listeners to the buttons.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.importWindow.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.close();
			});

			this.importWindow.find( '.save' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
			});
		},

		/**
		 * Save the entered data.
		 *
		 * The entered JSON string is parsed, and it's sent to the server-side
		 * saving method.
		 *
		 * After the accordion is created, a new row is added to the list.
		 * 
		 * @since 1.0.0
		 */
		save: function() {
			var that = this,
				accordionDataString = this.importWindow.find( 'textarea' ).val();
				
			if ( accordionDataString === '' ) {
				return;
			}

			var accordionData = $.parseJSON( accordionDataString );
			accordionData[ 'id' ] = -1;
			accordionData[ 'nonce' ] = as_js_vars.sa_nonce;
			accordionData[ 'action' ] = 'import';
			accordionDataString = JSON.stringify( accordionData );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_save_accordion', data: accordionDataString },
				complete: function( data ) {
					if ( $( '.accordions-list .no-accordion-row' ).length !== 0 ) {
						$( '.accordions-list .no-accordion-row' ).remove();
					}

					var row = $( data.responseText ).appendTo( $( '.accordions-list tbody' ) );
					
					row.hide().fadeIn();
					that.close();
				}
			});
		},

		/**
		 * Handle window closing.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.importWindow.find( '.close-x' ).off( 'click' );
			this.importWindow.find( '.save' ).off( 'click' );
			this.importWindow.remove();
		}
	};

	/*
	 * ======================================================================
	 * Panel functions
	 * ======================================================================
	 */
	
	/**
	 * Panel object.
	 *
	 * @since 1.0.0
	 * 
	 * @param {jQuery Object} element The jQuery element.
	 * @param {Int}           id      The id of the panel.
	 * @param {Object}        data    The data of the panel.
	 */
	var Panel = function( element, id, data ) {
		this.$panel = element;
		this.id = id;
		this.data = data;
		this.events = $( {} );

		if ( typeof this.data === 'undefined' ) {
			this.data = { background: {}, layers: {}, html: '', settings: {} };
		}

		this.init();
	};

	Panel.prototype = {

		/**
		 * Initialize the panel.
		 * 
		 * Add the necessary event listeners.
		 *
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.$panel.find( '.panel-preview' ).on( 'click', function( event ) {
				var contentType = that.getData( 'settings' )[ 'content_type' ];

				if ( typeof contentType === 'undefined' || contentType === 'custom' ) {
					MediaLoader.open(function( selection ) {
						var image = selection[ 0 ];

						that.setData( 'background', { background_source: image.url, background_alt: image.alt, background_title: image.title, background_width: image.width, background_height: image.height } );
						that.updatePanelPreview();

						AccordionSliderAdmin.checkBackgroundImageSize();
					});
				}
			});

			this.$panel.find( '.edit-background-image' ).on( 'click', function( event ) {
				event.preventDefault();
				BackgroundImageEditor.open( that.id );
			});

			this.$panel.find( '.edit-layers' ).on( 'click', function( event ) {
				event.preventDefault();
				LayersEditor.open( that.id );
			});

			this.$panel.find( '.edit-html' ).on( 'click', function( event ) {
				event.preventDefault();
				HTMLEditor.open( that.id );
			});

			this.$panel.find( '.edit-settings' ).on( 'click', function( event ) {
				event.preventDefault();
				SettingsEditor.open( that.id );
			});

			this.$panel.find( '.delete-panel' ).on( 'click', function( event ) {
				event.preventDefault();
				that.trigger( { type: 'deletePanel', id: that.id } );
			});

			this.$panel.find( '.duplicate-panel' ).on( 'click', function( event ) {
				event.preventDefault();
				that.trigger( { type: 'duplicatePanel', panelData: that.data } );
			});

			this.resizeImage();
		},

		/**
		 * Return the panel's data.
		 *
		 * It can return the background data, or the layers
		 * data, or the HTML data, or the settings data, or
		 * all the data.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} target The type of data to return.
		 * @return {Object}        The requested data.
		 */
		getData: function( target ) {
			if ( target === 'all' ) {
				var allData = {};

				$.each( this.data.background, function( settingName, settingValue ) {
					allData[ settingName ] = settingValue;
				});

				allData[ 'layers' ] = this.data.layers;
				allData[ 'html' ] = this.data.html;
				allData[ 'settings' ] = this.data.settings;

				return allData;
			} else if ( target === 'background' ) {
				return this.data.background;
			} else if ( target === 'layers' ) {
				return this.data.layers;
			} else if ( target === 'html' ) {
				return this.data.html;
			} else if ( target === 'settings' ) {
				return this.data.settings;
			}
		},

		/**
		 * Set the panel's data.
		 *
		 * It can set a specific data type, like the background, 
		 * layers, html, settings, or it can set all the data.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} target The type of data to set.
		 * @param  {Object} data   The data to attribute to the panel.
		 */
		setData: function( target, data ) {
			var that = this;

			if ( target === 'all' ) {
				this.data = data;
			} else if ( target === 'background' ) {
				$.each( data, function( name, value ) {
					that.data.background[ name ] = value;
				});
			} else if ( target === 'layers' ) {
				this.data.layers = data;
			} else if ( target === 'html' ) {
				this.data.html = data;
			} else if ( target === 'settings' ) {
				this.data.settings = data;
			}
		},

		/**
		 * Remove the panel.
		 * 
		 * @since 1.0.0
		 */
		remove: function() {
			this.$panel.find( '.panel-preview' ).off( 'click' );
			this.$panel.find( '.edit-background-image' ).off( 'click' );
			this.$panel.find( '.edit-layers' ).off( 'click' );
			this.$panel.find( '.edit-html' ).off( 'click' );
			this.$panel.find( '.edit-settings' ).off( 'click' );
			this.$panel.find( '.delete-panel' ).off( 'click' );
			this.$panel.find( '.duplicate-panel' ).off( 'click' );

			this.$panel.fadeOut( 500, function() {
				$( this ).remove();
			});
		},

		/**
		 * Update the panel's preview.
		 *
		 * If the content type is custom, the preview will consist
		 * of an image. If the content is dynamic, a text will be 
		 * displayed that indicates the type of content (i.e., posts).
		 *
		 * This is called when the background image is changed or
		 * when the content type is changed.
		 * 
		 * @since 1.0.0
		 */
		updatePanelPreview: function() {
			var panelPreview = this.$panel.find( '.panel-preview' ),
				contentType = this.data.settings[ 'content_type' ];
			
			panelPreview.empty();

			if ( typeof contentType === 'undefined' || contentType === 'custom' ) {
				var backgroundSource = this.data.background[ 'background_source' ];

				if ( typeof backgroundSource !== 'undefined' && backgroundSource !== '' ) {
					$( '<img src="' + backgroundSource + '" />' ).appendTo( panelPreview );
					this.resizeImage();
				} else {
					$( '<p class="no-image">' + as_js_vars.no_image + '</p>' ).appendTo( panelPreview );
				}

				this.$panel.removeClass( 'dynamic-panel' );
			} else if ( contentType === 'posts' ) {
				$( '<p>[ ' + as_js_vars.posts_panels + ' ]</p>' ).appendTo( panelPreview );
				this.$panel.addClass( 'dynamic-panel' );
			} else if ( contentType === 'gallery' ) {
				$( '<p>[ ' + as_js_vars.gallery_panels + ' ]</p>' ).appendTo( panelPreview );
				this.$panel.addClass( 'dynamic-panel' );
			} else if ( contentType === 'flickr' ) {
				$( '<p>[ ' + as_js_vars.flickr_panels + ' ]</p>' ).appendTo( panelPreview );
				this.$panel.addClass( 'dynamic-panel' );
			}
		},

		/**
		 * Resize the preview image, after it has loaded.
		 *
		 * @since 1.0.0
		 */
		resizeImage: function() {
			var panelPreview = this.$panel.find( '.panel-preview' ),
				panelImage = this.$panel.find( '.panel-preview > img' );

			if ( panelImage.length ) {
				var checkImage = setInterval(function() {
					if ( panelImage[0].complete === true ) {
						clearInterval( checkImage );

						if ( panelImage.width() / panelImage.height() > panelPreview.width() / panelPreview.height() ) {
							panelImage.css( { width: 'auto', height: '100%' } );
						} else {
							panelImage.css( { width: '100%', height: 'auto' } );
						}
					}
				}, 100 );
			}
		},

		/**
		 * Add an event listener to the panel.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String}   type    The event name.
		 * @param  {Function} handler The callback function.
		 */
		on: function( type, handler ) {
			this.events.on( type, handler );
		},

		/**
		 * Remove an event listener from the panel.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} type The event name.
		 */
		off: function( type ) {
			this.events.off( type );
		},

		/**
		 * Triggers an event.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} type The event name.
		 */
		trigger: function( type ) {
			this.events.triggerHandler( type );
		}
	};

	/*
	 * ======================================================================
	 * Background Image Editor
	 * ======================================================================
	 */
	
	var BackgroundImageEditor = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		editor: null,

		/**
		 * Reference to panel for which the editor was opened.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Panel}
		 */
		currentPanel: null,

		/**
		 * Indicates whether the panel's preview needs to be updated.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Boolean}
		 */
		needsPreviewUpdate: false,

		/**
		 * Open the modal window.
		 *
		 * It checks the content type set for the panel and passes
		 * that information because the aspect of the editor will
		 * depend on what type the content is. Dynamic panels will
		 * not have the possibility to load images from the library.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int} id The id of the panel
		 */
		open: function( id ) {
			this.currentPanel = AccordionSliderAdmin.getPanel( id );

			var that = this,
				data = this.currentPanel.getData( 'background' ),
				contentType = this.currentPanel.getData( 'settings' )[ 'content_type' ],
				spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

			if ( typeof contentType === 'undefined' ) {
				contentType = 'custom';
			}

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_background_image_editor', data: JSON.stringify( data ), content_type: contentType },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( { 'display': '', 'visibility': '' } );
				}
			});
		},

		/**
		 * Initialize the editor.
		 *
		 * Add the necessary event listeners.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.$editor = $( '.background-image-editor' );

			this.$editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();

				AccordionSliderAdmin.checkBackgroundImageSize();
			});

			this.$editor.find( '.image-loader, .retina-loader' ).on( 'click', function( event ) {
				event.preventDefault();
				that.openMediaLibrary( event );
			});

			this.$editor.find( '.clear-fieldset' ).on( 'click', function( event ) {
				event.preventDefault();
				that.clearFieldset( event );
			});

			this.$editor.find( 'input[name="background_source"]' ).on( 'input', function( event ) {
				that.needsPreviewUpdate = true;
			});

			$( window ).on( 'resize.backgroundImageEditor', function() {
				if ( that.$editor.find( '.modal-window' ).outerWidth() >= $( window ).width() ) {
					that.$editor.addClass( 'modal-window-left' );
				} else {
					that.$editor.removeClass( 'modal-window-left' );
				}

				if ( that.$editor.find( '.modal-window' ).outerHeight() >= $( window ).height() - 60 ) {
					that.$editor.addClass( 'modal-window-top' );
				} else {
					that.$editor.removeClass( 'modal-window-top' );
				}
			});

			this.$editor.find( '.show-hide-info, .show-hide-dynamic-tags' ).on( 'click', function() {
				$( window ).trigger( 'resize' );
			});

			$( window ).trigger( 'resize.backgroundImageEditor' );
		},

		/**
		 * Open the Media library.
		 *
		 * Allows the user to select an image from the library for
		 * the current panel. It checks if the image needs to be added
		 * for the background or for the opened background, and also
		 * if it needs to be added for the main image or for the retina
		 * image.
		 *
		 * It updates the editor's fields with information associated
		 * with the image, like the image's alt, title, width and height.
		 * 
		 * @since 1.0.0
		 * 
		 * @param  {Event Object} event The mouse click event.
		 */
		openMediaLibrary: function( event ) {
			event.preventDefault();

			var that = this,
				target = $( event.target ).parents( '.fieldset' ).hasClass( 'opened-background-image' ) === true ? 'opened-background' : 'background',
				imageLoader = this.$editor.find( '.' + target + '-image .image-loader' ),
				isRetina = $( event.target ).hasClass( 'retina-loader' );

			MediaLoader.open(function( selection ) {
				var image = selection[ 0 ];

				if ( isRetina === true ) {
					if ( target === 'background' ) {
						that.$editor.find( 'input[name="background_retina_source"]' ).val( image.url );
					} else if ( target === 'opened-background' ) {
						that.$editor.find( 'input[name="opened_background_retina_source"]' ).val( image.url );
					}
				} else {
					if ( imageLoader.find( 'img' ).length !== 0 ) {
						imageLoader.find( 'img' ).attr( 'src', image.url );
					} else {
						imageLoader.find( '.no-image' ).remove();
						$( '<img src="' + image.url + '" />' ).appendTo( imageLoader );
					}

					if ( target === 'background' ) {
						that.$editor.find( 'input[name="background_source"]' ).val( image.url );
						that.$editor.find( 'input[name="background_alt"]' ).val( image.alt );
						that.$editor.find( 'input[name="background_title"]' ).val( image.title );
						that.$editor.find( 'input[name="background_width"]' ).val( image.width );
						that.$editor.find( 'input[name="background_height"]' ).val( image.height );

						that.needsPreviewUpdate = true;
					} else if ( target === 'opened-background' ) {
						that.$editor.find( 'input[name="opened_background_source"]' ).val( image.url );
						that.$editor.find( 'input[name="opened_background_alt"]' ).val( image.alt );
						that.$editor.find( 'input[name="opened_background_title"]' ).val( image.title );
						that.$editor.find( 'input[name="opened_background_width"]' ).val( image.width );
						that.$editor.find( 'input[name="opened_background_height"]' ).val( image.height );
					}
				}
			});
		},

		/**
		 * Clear the input fields for the image.
		 * 
		 * @since 1.0.0
		 * 
		 * @param  {Event Object} event The mouse click event.
		 */
		clearFieldset: function( event ) {
			event.preventDefault();

			var target = $( event.target ).parents( '.fieldset' ),
				imageLoader = target.find( '.image-loader' );

			target.find( 'input' ).val( '' );

			if ( imageLoader.find( 'img' ).length !== 0 ) {
				imageLoader.find( 'img' ).remove();
				$( '<p class="no-image">' + as_js_vars.no_image + '</p>' ).appendTo( imageLoader );

				this.needsPreviewUpdate = true;
			}
		},

		/**
		 * Save the data entered in the editor.
		 *
		 * Iterates through all input fields and copies the
		 * data entered in an object, which is then passed
		 * to the panel.
		 *
		 * It also calls the function that updates the panel's
		 * preview, if the main background image was changed.
		 * 
		 * @since 1.0.0
		 */
		save: function() {
			var that = this,
				data = {};

			this.$editor.find( '.field' ).each(function() {
				var field = $( this );
				data[ field.attr('name') ] = field.val();
			});

			this.currentPanel.setData( 'background', data );

			if ( this.needsPreviewUpdate === true ) {
				this.currentPanel.updatePanelPreview();
				this.needsPreviewUpdate = false;
			}
		},

		/**
		 * Close the editor.
		 *
		 * Remove all event listeners.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.$editor.find( '.close-x' ).off( 'click' );
			this.$editor.find( '.image-loader' ).off( 'click' );
			this.$editor.find( '.retina-loader' ).off( 'click' );
			this.$editor.find( '.clear-fieldset' ).off( 'click' );
			this.$editor.find( 'input[name="background_source"]' ).off( 'input' );
			$( window ).off( 'resize.backgroundImageEditor' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	/*
	 * ======================================================================
	 * HTML editor
	 * ======================================================================
	 */
	
	var HTMLEditor = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		editor: null,

		/**
		 * Reference to panel for which the editor was opened.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Panel}
		 */
		currentPanel: null,

		/**
		 * Open the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int} id The id of the panel.
		 */
		open: function( id ) {
			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			
			var that = this,
				data = this.currentPanel.getData( 'html' ),
				spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } ),
				contentType = this.currentPanel.getData( 'settings' )[ 'content_type' ];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_html_editor', data: data, content_type: contentType },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( { 'display': '', 'visibility': '' } );
				}
			});
		},

		/**
		 * Initialize the editor.
		 *
		 * Add the necessary event listeners.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.$editor = $( '.html-editor' );

			this.$editor.find( '.html-code' ).codeEditor();

			this.$editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			$( window ).on( 'resize.htmlEditor', function() {
				if ( that.$editor.find( '.modal-window' ).outerWidth() >= $( window ).width() ) {
					that.$editor.addClass( 'modal-window-left' );
				} else {
					that.$editor.removeClass( 'modal-window-left' );
				}

				if ( that.$editor.find( '.modal-window' ).outerHeight() >= $( window ).height() - 60 ) {
					that.$editor.addClass( 'modal-window-top' );
				} else {
					that.$editor.removeClass( 'modal-window-top' );
				}
			});

			this.$editor.find( '.show-hide-info, .show-hide-dynamic-tags' ).on( 'click', function() {
				$( window ).trigger( 'resize' );
			});

			$( window ).trigger( 'resize' );
		},

		/**
		 * Save the content entered in the editor's textfield.
		 * 
		 * @since 1.0.0
		 */
		save: function() {
			this.currentPanel.setData( 'html', this.$editor.find( '.html-code' ).data('codeEditor').getValue() );
		},

		/**
		 * Close the editor.
		 *
		 * Remove all event listeners.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.$editor.find( '.close-x' ).off( 'click' );
			this.$editor.find( '.html-code' ).codeEditor( 'destroy' );

			$( 'window' ).off( 'resize.htmlEditor' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	/*
	 * ======================================================================
	 * Layers editor
	 * ======================================================================
	 */
	
	var LayersEditor = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		editor: null,

		/**
		 * Reference to panel for which the editor was opened.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Panel}
		 */
		currentPanel: null,

		/**
		 * Array of JavaScript objects, that contain the layer's data.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Array}
		 */
		layersData: null,

		/**
		 * Array of Layer objects.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Array}
		 */
		layers: [],

		/**
		 * Counter for layers.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Int}
		 */
		counter: 0,

		/**
		 * Indicates if a layer is currently being added.
		 *
		 * Stops the addition of new layers if another addition
		 * is being processed.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Boolean}
		 */
		isWorking: false,

		/**
		 * Open the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int} id The id of the panel.
		 */
		open: function( id ) {
			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			this.layersData = this.currentPanel.getData( 'layers' );

			var that = this,
				spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } ),
				contentType = this.currentPanel.getData( 'settings' )[ 'content_type' ];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_layers_editor', data: JSON.stringify( this.layersData ), content_type: contentType },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( { 'display': '', 'visibility': '' } );
				}
			});
		},

		/**
		 * Initialize the editor.
		 *
		 * Adds the necessary event listeners for adding a new layer,
		 * deleting a layer or duplicating a layer.
		 *
		 * It also creates the layers existing in the panel's data,
		 * and initializes the sorting functionality.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.counter = 0;

			this.$editor = $( '.layers-editor' );

			this.$editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			$( window ).on( 'resize.layersEditor', function() {
				if ( that.$editor.find( '.modal-window' ).outerWidth() >= $( window ).width() ) {
					that.$editor.addClass( 'modal-window-left' );
				} else {
					that.$editor.removeClass( 'modal-window-left' );
				}

				if ( that.$editor.find( '.modal-window' ).outerHeight() >= $( window ).height() - 60 ) {
					that.$editor.addClass( 'modal-window-top' );
				} else {
					that.$editor.removeClass( 'modal-window-top' );
				}
			});

			this.$editor.find( '.show-hide-info' ).on( 'click', function() {
				$( window ).trigger( 'resize' );
			});

			this.$editor.find( '.add-layer-group' ).on( 'click', function( event ) {
				event.preventDefault();

				if ( that.isWorking === true ) {
					return;
				}

				var type = 'paragraph';

				if ( typeof $( event.target ).attr( 'data-type' ) !== 'undefined' ) {
					type = $( event.target ).attr( 'data-type' );
				}
				
				that.addNewLayer( type );
			});

			this.$editor.find( '.delete-layer' ).on( 'click', function( event ) {
				event.preventDefault();
				that.deleteLayer();
			});

			this.$editor.find( '.duplicate-layer' ).on( 'click', function( event ) {
				event.preventDefault();

				if ( that.isWorking === true ) {
					return;
				}

				that.duplicateLayer();
			});

			this.initViewport();

			$.each( this.layersData, function( index, layerData ) {
				var data = layerData;
				data.createMode = 'init';
				that.createLayer( data );

				that.counter = Math.max( that.counter, data.id );
			});

			$( '.list-layers' ).lightSortable( {
				children: '.list-layer',
				placeholder: 'list-layer-placeholder',
				sortEnd: function( event ) {
					if ( event.startPosition === event.endPosition ) {
						return;
					}

					var layer = that.layers[ event.startPosition ];
					that.layers.splice( event.startPosition, 1 );
					that.layers.splice( event.endPosition, 0, layer );

					var $viewportLayers = that.$editor.find( '.viewport-layers' ),
						total = $viewportLayers.children().length - 1;

					$( '.list-layers' ).find( '.list-layer' ).each(function( index, element ) {
						$( element ).attr( 'data-position', index );
					});

					var swapLayer = $viewportLayers.find( '.viewport-layer' ).eq( total - event.startPosition ).detach();

					if ( total - event.startPosition < total - event.endPosition ) {
						swapLayer.insertAfter( $viewportLayers.find( '.viewport-layer' ).eq( total - 1 - event.endPosition ) );
					} else {
						swapLayer.insertBefore( $viewportLayers.find( '.viewport-layer' ).eq( total - event.endPosition ) );
					}
				}
			} );

			$( '.list-layers' ).find( '.list-layer' ).each(function( index, element ) {
				$( element ).attr( 'data-position', index );
			});

			if ( this.layers.length !== 0 ) {
				this.layers[ 0 ].triggerSelect();
			}

			$( window ).trigger( 'resize.layersEditor' );
		},

		/**
		 * Initialize the viewport.
		 *
		 * The viewport will have the same size as the current image, 
		 * or, if the panel doesn't have a background image, it will
		 * have the same size as the maximum panel size.
		 *
		 * The viewport will contain the image and on top of the image,
		 * a container that will hold the layers.
		 *
		 * @since 1.0.0
		 */
		initViewport: function() {
			var accordionWidth = $( '.sidebar-settings' ).find( '.setting[name="width"]' ).val(),
				accordionHeight = $( '.sidebar-settings' ).find( '.setting[name="height"]' ).val(),
				orientation = $( '.sidebar-settings' ).find( '.setting[name="orientation"]' ).val(),
				customClass = $( '.sidebar-settings' ).find( '.setting[name="custom_class"]' ).val(),
				backgroundSource = this.currentPanel.getData( 'background' )[ 'background_source' ],
				$viewport = this.$editor.find( '.layer-viewport' ),
				$viewportLayers = $( '<div class="accordion-slider viewport-layers"></div>' ).appendTo( $viewport );

			if ( isNaN( accordionWidth ) ) {
				accordionWidth = $( window ).width() * ( parseInt( accordionWidth, 10 ) / 100 );
			} else {
				accordionWidth = parseInt( accordionWidth, 10 );
			}

			if ( isNaN( accordionHeight ) ) {
				accordionHeight = $( window ).height() * ( parseInt( accordionHeight, 10 ) / 100 );
			} else {
				accordionHeight = parseInt( accordionHeight, 10 );
			}

			if ( orientation === 'horizontal' ) {
				$viewport.css( 'height', accordionHeight );
			} else {
				$viewport.css( 'width', accordionWidth );
			}

			if ( customClass !== '' ) {
				$viewportLayers.addClass( customClass );
			}

			if ( typeof backgroundSource!== 'undefined' && backgroundSource !== '' && backgroundSource.indexOf( '[' ) === -1 ) {
				var $viewportImage = $( '<img class="viewport-image" src="' + backgroundSource + '" />' ).prependTo( $viewport );

				if ( orientation === 'horizontal' ) {
					$viewportImage.css( 'height', '100%' );
				} else {
					$viewportImage.css( 'width', '100%' );
				}

				// set the size of the layer's container after the image has
				// loaded and its size can be retrieved
				var checkImageLoaded = setInterval( function() {
					if ( $viewportImage[0].complete === true ) {
						clearInterval( checkImageLoaded );
						$viewportLayers.css( {
							'width': $viewportImage.width(),
							'height': $viewportImage.height()
						});
					}
				}, 10 );
			} else {
				var panelSize = $( '.sidebar-settings' ).find( '.setting[name="opened_panel_size"]' ).val(),
					maxPanelSize = $( '.sidebar-settings' ).find( '.setting[name="max_opened_panel_size"]' ).val(),
					accordionSize = orientation === 'horizontal' ? accordionWidth : accordionHeight,
					viewportSize;

				// calculate the maximum allowed size for the panels
				if ( panelSize === 'max' ) {
					viewportSize = isNaN( maxPanelSize ) ? ( parseInt( maxPanelSize, 10 ) / 100 ) * accordionSize : parseInt( maxPanelSize, 10 );
				} else {
					viewportSize = isNaN( panelSize ) ? ( parseInt( panelSize, 10 ) / 100 ) * accordionSize : parseInt( panelSize, 10 );
				}

				if ( orientation === 'horizontal' ) {
					$viewportLayers.css( 'width', viewportSize );
					$viewport.css( 'width', viewportSize );
				} else {
					$viewportLayers.css( 'height', viewportSize );
					$viewport.css( 'height', viewportSize );
				}
			}

			$( '.layers-editor-info' ).css( 'maxWidth', $viewport.width() );
		},

		/**
		 * Create a layer.
		 *
		 * Based on the type of the layer, information which is
		 * available in the passed data, a certain subclass of the
		 * Layer object will be instantiated.
		 *
		 * It also checks if the created layer is a new/duplicate layer or
		 * an existing layer, and adds it either at the beginning or the 
		 * end of the list. New layers always need to be added before the 
		 * existing layers.
		 * 
		 * @since 1.0.0
		 * 
		 * @param  {Object} data The layer's data.
		 */
		createLayer: function( data ) {
			var that = this,
				layer;

			if ( data.type === 'paragraph' ) {
				layer =	new ParagraphLayer( data );
			} else if ( data.type === 'heading' ) {
				layer =	new HeadingLayer( data );
			} else if ( data.type === 'image' ) {
				layer =	new ImageLayer(data );
			} else if ( data.type === 'div' ) {
				layer =	new DivLayer( data );
			} else if ( data.type === 'video' ) {
				layer =	new VideoLayer( data );
			}

			if ( data.createMode === 'new' || data.createMode === 'duplicate' ) {
				this.layers.unshift( layer );
			} else {
				this.layers.push( layer );
			}

			layer.on( 'select', function( event ) {
				$.each( that.layers, function( index, layer ) {
					if ( layer.isSelected() === true ) {
						layer.deselect();
					}

					if (layer.getID() === event.id) {
						layer.select();
					}
				});
			});

			layer.triggerSelect();

			this.isWorking = false;

			this.$editor.removeClass( 'no-layers' );
		},

		/**
		 * Add a new layer on runtime.
		 * 
		 * Sends an AJAX request to load the layer's settings editor and
		 * also adds the layer panel in the list of layers.
		 *
		 * @since 1.0.0
		 * 
		 * @param {String} type The type of layer.
		 */
		addNewLayer: function( type ) {
			var that = this;

			this.isWorking = true;

			this.counter++;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_add_layer_settings', id: this.counter, type: type },
				complete: function( data ) {
					$( data.responseText ).appendTo( $( '.layers-settings' ) );
					$( '<li class="list-layer" data-id="' + that.counter + '" data-position="' + that.layers.length + '">Layer ' + that.counter + '</li>' ).prependTo( that.$editor.find( '.list-layers' ) );

					that.createLayer( { id: that.counter, type: type, createMode: 'new' } );

					$( window ).trigger( 'resize.layersEditor' );
				}
			});
		},

		/**
		 * Delete the selected layer.
		 *
		 * Iterates through the layers and detects the selected
		 * one, then calls its 'destroy' method.
		 *
		 * @since 1.0.0
		 */
		deleteLayer: function() {
			var that = this,
				removedIndex;

			$.each( this.layers, function( index, layer ) {
				if ( layer.isSelected() === true ) {
					layer.destroy();
					that.layers.splice( index, 1 );
					removedIndex = index;

					return false;
				}
			});

			if ( this.layers.length === 0 ) {
				this.$editor.addClass( 'no-layers' );
				return;
			}

			if ( removedIndex === 0 ) {
				this.layers[ 0 ].triggerSelect();
			} else {
				this.layers[ removedIndex - 1 ].triggerSelect();
			}
		},
		
		/**
		 * Duplicate the selected layer.
		 *
		 * Iterates through the layers and detects the selected
		 * one, then copies its data and sends an AJAX request 
		 * with the copied data.
		 *
		 * @since 1.0.0
		 */
		duplicateLayer: function() {
			var that = this,
				layerData;

			$.each( this.layers, function( index, layer ) {
				if ( layer.isSelected() === true ) {
					layerData = layer.getData();
				}
			});

			if ( typeof layerData === 'undefined' ) {
				return;
			}

			this.isWorking = true;

			this.counter++;

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: {
					action: 'accordion_slider_add_layer_settings',
					id: this.counter,
					type: layerData.type,
					text: layerData.text,
					heading_type: layerData.heading_type,
					image_source: layerData.image_source,
					image_alt: layerData.image_alt,
					image_link: layerData.image_link,
					image_retina: layerData.image_retina,
					settings: JSON.stringify( layerData.settings )
				},
				complete: function( data ) {
					$( data.responseText ).appendTo( $( '.layers-settings' ) );
					$( '<li class="list-layer" data-id="' + that.counter + '">Layer ' + that.counter + '</li>' ).prependTo( that.$editor.find( '.list-layers' ) );

					layerData.id = that.counter;
					layerData.createMode = 'duplicate';
					that.createLayer( layerData );

					$( window ).trigger( 'resize.layersEditor' );
				}
			});
		},

		/**
		 * Save the data from the editor.
		 *
		 * Iterate through the array of Layer objects, get their 
		 * data and send all the data to the panel.
		 * 
		 * @since 1.0.0
		 */
		save: function() {
			var data = [];

			$.each( this.layers, function( index, layer ) {
				data.push( layer.getData() );
			});

			this.currentPanel.setData( 'layers', data );
		},

		/**
		 * Close the editor.
		 *
		 * Remove all event listeners and and destroy objects.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.$editor.find( '.close-x' ).off( 'click' );
			this.$editor.find( '.add-layer-group' ).off( 'click' );
			this.$editor.find( '.delete-layer' ).off( 'click' );
			this.$editor.find( '.duplicate-layer' ).off( 'click' );
			$( window ).off( 'resize.layersEditor' );

			$( '.list-layers' ).lightSortable( 'destroy' );

			$.each( this.layers, function( index, layer ) {
				layer.destroy();
			});

			this.layers.length = 0;

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	/*
	 * ======================================================================
	 * Layer functions
	 * ======================================================================
	 */
	
	/**
	 * Layer object.
	 *
	 * Parent/Base object for all layer types.
	 *
	 * Each layer has a representation in the viewport, in the list of layers
	 * and in the settings.
	 *
	 * @since 1.0.0
	 * 
	 * @param {Object} data The layer's data.
	 */
	var Layer = function( data ) {
		this.data = data;
		this.id = this.data.id;

		this.selected = false;
		this.events = $( {} );

		this.$editor = $( '.layers-editor' );
		this.$viewportLayers = this.$editor.find( '.viewport-layers' );

		this.$viewportLayer = null;
		this.$listLayer = this.$editor.find( '.list-layer[data-id="' + this.id + '"]' );
		this.$layerSettings = this.$editor.find( '.layer-settings[data-id="' + this.id + '"]' );

		this.init();
	};

	Layer.prototype = {

		/**
		 * Initialize the layer.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			this.initLayerContent();
			this.initLayerSettings();
			this.initViewportLayer();
			this.initLayerDragging();
			this.initListLayer();
		},

		/**
		 * Return the layer's data: id, name, position and settings.
		 *
		 * Iterates through the layer's associated setting fields 
		 * and copies the settings (name and value).
		 *
		 * @since 1.0.0
		 * 
		 * @return {Object} The layer's data.
		 */
		getData: function() {
			var data = {};

			data.id = this.id;
			data.position = parseInt( this.$listLayer.attr( 'data-position' ), 10 );
			data.name = this.$listLayer.text();
			
			data.settings = {};

			this.$layerSettings.find( '.setting' ).each(function() {
				var settingField = $( this ),
					type = settingField.attr( 'type' );

				if ( type === 'radio' ) {
					if ( settingField.is( ':checked' ) ) {
						data.settings[ settingField.attr( 'name' ).split( '-' )[ 0 ] ] = settingField.val();
					}
				} else if ( type === 'checkbox' ) {
					data.settings[ settingField.attr( 'name' ) ] = settingField.is( ':checked' );
				} else if ( settingField.is( 'select' ) && typeof settingField.attr( 'multiple' ) !== 'undefined' ) {
					data.settings[ settingField.attr( 'name' ) ] = settingField.val() === null ? [] : settingField.val();
				} else {
					data.settings[ settingField.attr( 'name' ) ] = settingField.val();
				}
			});

			return data;
		},

		/**
		 * Return the id of the layer.
		 *
		 * @since 1.0.0
		 * 
		 * @return {Int} The id.
		 */
		getID: function() {
			return this.id;
		},

		/**
		 * Select the layer.
		 *
		 * Adds classes to the layer item from the list and to the 
		 * settings in order to highlight/show them.
		 * 
		 * @since 1.0.0
		 */
		select: function() {
			this.selected = true;

			this.$listLayer.addClass( 'selected-list-layer' );
			this.$layerSettings.addClass( 'selected-layer-settings' );
		},

		/**
		 * Deselect the layer by removing the added classes.
		 * 
		 * @since 1.0.0
		 */
		deselect: function() {
			this.selected = false;

			this.$listLayer.removeClass( 'selected-list-layer' );
			this.$layerSettings.removeClass( 'selected-layer-settings' );
		},

		/**
		 * Trigger the selection event.
		 *
		 * Used for programatically selecting the layer.
		 * 
		 * @since 1.0.0
		 */
		triggerSelect: function() {
			this.trigger( { type: 'select', id: this.id } );
		},

		/**
		 * Check if the layer is selected.
		 *
		 * @since 1.0.0
		 * 
		 * @return {Boolean} Whether the layer is selected.
		 */
		isSelected: function() {
			return this.selected;
		},

		/**
		 * Destroy the layer
		 *
		 * Removes all event listeners and elements associated with the layer.
		 * 
		 * @since 1.0.0
		 */
		destroy: function() {
			this.$viewportLayer.off( 'mousedown' );
			this.$viewportLayer.off( 'mouseup' );
			this.$viewportLayer.off( 'click' );

			this.$listLayer.off( 'click' );
			this.$listLayer.off( 'dblclick' );
			this.$listLayer.off( 'selectstart' );

			this.$editor.off( 'mousemove.layer' + this.id );
			this.$editor.off( 'click.layer' + this.id );

			this.$layerSettings.find( 'select[name="preset_styles"]' ).multiCheck( 'destroy' );

			this.$layerSettings.find( '.setting[name="width"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="height"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="position"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="horizontal"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="vertical"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="preset_styles"]' ).off( 'change' );
			this.$layerSettings.find( '.setting[name="custom_class"]' ).off( 'change' );

			this.$viewportLayer.remove();
			this.$listLayer.remove();
			this.$layerSettings.remove();
		},

		/**
		 * Add an event listener to the layer.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String}   type    The event name.
		 * @param  {Function} handler The callback function.
		 */
		on: function( type, handler ) {
			this.events.on( type, handler );
		},

		/**
		 * Remove an event listener from the layer.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} type The event name.
		 */
		off: function( type ) {
			this.events.off( type );
		},

		/**
		 * Triggers an event.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} type The event name.
		 */
		trigger: function( type ) {
			this.events.triggerHandler( type );
		},

		/**
		 * Initialize the viewport layer.
		 *
		 * This is the layer's representation in the viewport and its
		 * role is to give a preview of how the layer will look like
		 * in the front-end. 
		 *
		 * If the layer is a newly created one, add some default styling
		 * to it (black background and padding), and if it's an existing
		 * layer or a duplicated one, set its style according to the
		 * layer's data.
		 * 
		 * @since 1.0.0
		 */
		initViewportLayer: function() {
			var that = this;

			this.$viewportLayer.attr( 'data-id', this.id );

			// append the layer before or after the other layers
			if ( this.data.createMode === 'new' || this.data.createMode === 'duplicate' ) {
				this.$viewportLayer.appendTo( this.$viewportLayers );
			} else if ( this.data.createMode === 'init' ) {
				this.$viewportLayer.prependTo( this.$viewportLayers );
			}

			if ( this.data.createMode === 'new' ) {

				// set the position of the layer
				this.$viewportLayer.css( { 'width': 'auto', 'height': 'auto', 'left': 0, 'top': 0 } );

				// set the style of the layer
				if ( this.$viewportLayer.hasClass( 'as-layer' ) ) {
					this.$viewportLayer.addClass( 'as-black as-padding' );
				} else {
					this.$viewportLayer.find( '.as-layer' ).addClass( 'as-black as-padding' );
				}
			} else if ( this.data.createMode === 'init' || this.data.createMode === 'duplicate' ) {
				
				// set the style of the layer
				var classes = this.data.settings.preset_styles !== null ? this.data.settings.preset_styles.join( ' ' ) : '';
				classes += ' ' + this.data.settings.custom_class;
				
				if ( this.$viewportLayer.hasClass( 'as-layer' ) ) {
					this.$viewportLayer.addClass( classes );
				} else {
					this.$viewportLayer.find( '.as-layer' ).addClass( classes );
				}

				// set the size of the layer
				this.$viewportLayer.css( { 'width': this.data.settings.width, 'height': this.data.settings.height } );

				// set the position of the layer
				var position = this.data.settings.position.toLowerCase(),
					horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left',
					verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

				if ( this.data.settings.horizontal === 'center' ) {
					this.$viewportLayer.css( { 'width': this.$viewportLayer.outerWidth( true ), 'marginLeft': 'auto', 'marginRight': 'auto', 'left': 0, 'right': 0 } );
				} else {
					suffix = this.data.settings.horizontal.indexOf( 'px' ) === -1 && this.data.settings.horizontal.indexOf( '%' ) === -1 ? 'px' : '';
					this.$viewportLayer.css( horizontalPosition, this.data.settings.horizontal + suffix );
				}

				if ( this.data.settings.vertical === 'center' ) {
					this.$viewportLayer.css( { 'height': this.$viewportLayer.outerHeight( true ),  'marginTop': 'auto', 'marginBottom': 'auto', 'top': 0, 'bottom': 0 } );
				} else {
					suffix = this.data.settings.vertical.indexOf( 'px' ) === -1 && this.data.settings.vertical.indexOf( '%' ) === -1 ? 'px' : '';
					this.$viewportLayer.css( verticalPosition, this.data.settings.vertical + suffix );
				}
			}

			// select the layer after it was added
			this.$viewportLayer.on( 'mousedown', function() {
				that.triggerSelect();
			});

			// prevent link navigation for links inside layers
			this.$viewportLayer.on( 'click', 'a', function( event ) {
				event.preventDefault();
			});
		},

		/**
		 * Initialize the layer's dragging functionality.
		 *
		 * This is for the viewport representation of the layer.
		 * 
		 * @since 1.0.0
		 */
		initLayerDragging: function() {
			var that = this,
				mouseX = 0,
				mouseY = 0,
				layerX = 0,
				layerY = 0,
				hasFocus = false,
				autoRightBottom = false,
				hasMoved = false;

			this.$viewportLayer.on( 'mousedown', function( event ) {
				event.preventDefault();

				// Store the position of the mouse pointer
				// and the position of the layer
				mouseX = event.pageX;
				mouseY = event.pageY;
				layerX = that.$viewportLayer[ 0 ].offsetLeft;
				layerY = that.$viewportLayer[ 0 ].offsetTop;

				hasFocus = true;
				hasMoved = false;
			});

			this.$editor.find( '.viewport-layers' ).on( 'mousemove.layer' + this.id, function( event ) {
				event.preventDefault();

				hasMoved = true;

				if ( hasFocus === true ) {
					that.$viewportLayer.css( { 'left': layerX + event.pageX - mouseX, 'top': layerY + event.pageY - mouseY } );

					// While moving the layer, disable the right and bottom properties
					// so that the layer will be positioned using the left and top
					// properties.
					if ( autoRightBottom === false ) {
						autoRightBottom = true;
						that.$viewportLayer.css( { 'right': 'auto', 'bottom': 'auto' } );
					}
				}
			});

			// Set the layer's position settings based on Position setting and the
			// position to which the layer was dragged.
			this.$viewportLayer.on( 'mouseup', function( event ) {
				event.preventDefault();

				hasFocus = false;
				autoRightBottom = false;

				if ( hasMoved === false ) {
					return;
				}

				var position = that.$layerSettings.find( '.setting[name="position"]' ).val().toLowerCase(),
					horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left',
					verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

				if ( horizontalPosition === 'left' ) {
					that.$layerSettings.find( '.setting[name="horizontal"]' ).val( that.$viewportLayer.position().left );
				} else if ( horizontalPosition === 'right' ) {
					var right = that.$editor.find( '.viewport-layers' ).width() - that.$viewportLayer.position().left - that.$viewportLayer.outerWidth( true );

					that.$layerSettings.find( '.setting[name="horizontal"]' ).val( right );
					that.$viewportLayer.css( { 'left': 'auto', 'right': right } );
				}

				if ( verticalPosition === 'top' ) {
					that.$layerSettings.find( '.setting[name="vertical"]' ).val( that.$viewportLayer.position().top );
				} else if ( verticalPosition === 'bottom' ) {
					var bottom = that.$editor.find( '.viewport-layers' ).height() - that.$viewportLayer.position().top - that.$viewportLayer.outerHeight( true );

					that.$layerSettings.find( '.setting[name="vertical"]' ).val( bottom );
					that.$viewportLayer.css( { 'top': 'auto', 'bottom': bottom } );
				}
			});
		},

		/**
		 * Initialize the layer's list item.
		 *
		 * This is the layer's representation in the list of layers.
		 *
		 * Implements functionality for selecting the layer and
		 * changing its name.
		 * 
		 * @since 1.0.0
		 */
		initListLayer: function() {
			var that = this,
				isEditingLayerName = false;

			this.$listLayer.on( 'click', function( event ) {
				that.trigger( { type: 'select', id: that.id } );
			});

			this.$listLayer.on( 'dblclick', function( event ) {
				if ( isEditingLayerName === true ) {
					return;
				}

				isEditingLayerName = true;

				var name = that.$listLayer.text();

				var input = $( '<input type="text" value="' + name + '" />' ).appendTo( that.$listLayer );

				input.on( 'change', function() {
					isEditingLayerName = false;
					var layerName = input.val() !== '' ? input.val() : 'Layer ' + that.id;
					that.$listLayer.text( layerName );
					input.remove();
				});
			});

			this.$listLayer.on( 'selectstart', function( event ) {
				event.preventDefault();
			});

			this.$editor.on( 'click.layer' + this.id, function( event ) {
				if ( ! $( event.target ).is( 'input' ) && isEditingLayerName === true ) {
					isEditingLayerName = false;

					var input = that.$listLayer.find( 'input' ),
						layerName = input.val() !== '' ? input.val() : 'Layer ' + that.id;

					that.$listLayer.text( layerName );
					input.remove();
				}
			});
		},

		/**
		 * Initialize the viewport layer's content.
		 *
		 * This is overridden by child objects, based on the
		 * specific of the content type.
		 * 
		 * @since 1.0.0
		 */
		initLayerContent: function() {

		},

		/**
		 * Initialize the layer's settings.
		 *
		 * It listens for changes in the setting fields and applies the
		 * changes to the viewport representation of the layer.
		 * 
		 * @since 1.0.0
		 */
		initLayerSettings: function() {
			var that = this,
				position = this.$layerSettings.find( '.setting[name="position"]' ).val().toLowerCase(),
				horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left',
				verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

			this.$layerSettings.find( 'select[name="preset_styles"]' ).multiCheck( { width: 120} );

			// listen for size changes
			this.$layerSettings.find( '.setting[name="width"]' ).on( 'change', function() {
				that.$viewportLayer.css( 'width', $( this ).val() );
			});

			this.$layerSettings.find( '.setting[name="height"]' ).on( 'change', function() {
				that.$viewportLayer.css( 'height', $( this ).val() );
			});

			// listen for position changes
			this.$layerSettings.find( '.setting[name="position"], .setting[name="horizontal"], .setting[name="vertical"]' ).on( 'change', function() {
				var horizontal = that.$layerSettings.find( '.setting[name="horizontal"]' ).val(),
					vertical = that.$layerSettings.find( '.setting[name="vertical"]' ).val();

				position = that.$layerSettings.find( '.setting[name="position"]' ).val().toLowerCase();
				horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left';
				verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

				that.$viewportLayer.css( { 'top': 'auto', 'bottom': 'auto', 'left': 'auto', 'right': 'auto' } );

				if ( horizontal === 'center' ) {
					that.$viewportLayer.css( { 'width': that.$viewportLayer.outerWidth( true ), 'marginLeft': 'auto', 'marginRight': 'auto', 'left': 0, 'right': 0 } );
				} else {
					suffix = ( horizontal.indexOf( 'px' ) === -1 && horizontal.indexOf( '%' ) === -1 ) ? 'px' : '';
					that.$viewportLayer.css( horizontalPosition, horizontal + suffix );
				}

				if ( vertical === 'center' ) {
					that.$viewportLayer.css( { 'height': that.$viewportLayer.outerHeight( true ),  'marginTop': 'auto', 'marginBottom': 'auto', 'top': 0, 'bottom': 0 } );
				} else {
					suffix = vertical.indexOf( 'px' ) === -1 && vertical.indexOf( '%' ) === -1 ? 'px' : '';
					that.$viewportLayer.css( verticalPosition, vertical + suffix );
				}
			});
			
			// listen for style changes
			this.$layerSettings.find( '.setting[name="preset_styles"], .setting[name="custom_class"]' ).on( 'change', function() {
				var classes = '',
					selectedStyles = that.$layerSettings.find( '.setting[name="preset_styles"]' ).val(),
					customClass = that.$layerSettings.find( '.setting[name="custom_class"]' ).val();

				classes += selectedStyles !== null ? ' ' + selectedStyles.join( ' ' ) : '';
				classes += customClass !== '' ? ' ' + customClass : '';

				if ( that.$viewportLayer.hasClass( 'as-layer' ) ) {
					that.$viewportLayer.attr( 'class', 'viewport-layer as-layer' + classes );
				} else {
					that.$viewportLayer.find( '.as-layer' ).attr( 'class', 'as-layer' + classes );
				}
			});
		}
	};

	/*
	 * ======================================================================
	 * Paragraph layer
	 * ======================================================================
	 */
	
	var ParagraphLayer = function( data ) {
		Layer.call( this, data );
	};

	ParagraphLayer.prototype = Object.create( Layer.prototype );
	ParagraphLayer.prototype.constructor = ParagraphLayer;

	ParagraphLayer.prototype.initLayerContent = function() {
		var that = this;

		this.text = this.data.createMode === 'new' ? this.$layerSettings.find( 'textarea[name="text"]' ).val() : this.data.text;

		this.$layerSettings.find( 'textarea[name="text"]' ).on( 'input', function() {
			that.text = $( this ).val();
			that.$viewportLayer.html( that.text );
		});
	};

	ParagraphLayer.prototype.initViewportLayer = function() {
		this.$viewportLayer = $( '<p class="viewport-layer as-layer">' + this.text + '</p>' );
		Layer.prototype.initViewportLayer.call( this );
	};

	ParagraphLayer.prototype.getData = function() {
		var data = Layer.prototype.getData.call( this );
		data.type = 'paragraph';
		data.text = this.text;

		return data;
	};

	ParagraphLayer.prototype.destroy = function() {
		this.$layerSettings.find( 'textarea[name="text"]' ).off( 'input' );

		Layer.prototype.destroy.call( this );
	};

	/*
	 * ======================================================================
	 * Heading layer
	 * ======================================================================
	 */
	
	var HeadingLayer = function( data ) {
		Layer.call( this, data );
	};

	HeadingLayer.prototype = Object.create( Layer.prototype );
	HeadingLayer.prototype.constructor = HeadingLayer;

	HeadingLayer.prototype.initLayerContent = function() {
		var that = this;

		this.headingType = this.data.createMode === 'new' ? 'h3' : this.data.heading_type;
		this.headingText = this.data.createMode === 'new' ? this.$layerSettings.find( 'textarea[name="text"]' ).val() : this.data.text;

		this.$layerSettings.find( 'select[name="heading_type"]' ).on( 'change', function() {
			that.headingType = $( this ).val();
			
			var classes = that.$viewportLayer.find( '.as-layer' ).attr( 'class' );
			that.$viewportLayer.html( '<' + that.headingType + ' class="' + classes + '">' + that.headingText + '</' + that.headingType + '>' );
		});

		this.$layerSettings.find( 'textarea[name="text"]' ).on( 'input', function() {
			that.headingText = $( this ).val();
			
			that.$viewportLayer.find( '.as-layer' ).html( that.headingText );
		});
	};

	HeadingLayer.prototype.initViewportLayer = function() {
		this.$viewportLayer = $( '<div class="viewport-layer"><' + this.headingType + ' class="as-layer">' + this.headingText + '</' + this.headingType + '></div>' );
		Layer.prototype.initViewportLayer.call( this );
	};

	HeadingLayer.prototype.getData = function() {
		var data = Layer.prototype.getData.call( this );
		data.type = 'heading';
		data.heading_type = this.headingType;
		data.text = this.headingText;

		return data;
	};

	HeadingLayer.prototype.destroy = function() {
		this.$layerSettings.find( 'select[name="heading_type"]' ).off( 'change' );
		this.$layerSettings.find( 'textarea[name="text"]' ).off( 'input' );

		Layer.prototype.destroy.call( this );
	};

	/*
	 * ======================================================================
	 * Image layer
	 * ======================================================================
	 */
	
	var ImageLayer = function( data ) {
		Layer.call( this, data );
	};

	ImageLayer.prototype = Object.create( Layer.prototype );
	ImageLayer.prototype.constructor = ImageLayer;

	ImageLayer.prototype.initLayerContent = function() {
		var that = this,
			placehoderPath = as_js_vars.plugin + '/admin/assets/css/images/image-placeholder.png';

		this.imageSource = this.data.createMode === 'new' ? placehoderPath : this.data.image_source;
		this.hasPlaceholder = this.data.createMode === 'new' ? true : false;

		this.$layerSettings.find( 'input[name="image_source"]' ).on( 'change', function() {
			that.imageSource = $( this ).val();

			if ( that.imageSource !== '' ) {
				that.$viewportLayer.attr( 'src', that.imageSource )
									.removeClass( 'has-placeholder' );

				that.hasPlaceholder = false;
			} else {
				that.$viewportLayer.attr( 'src', placehoderPath )
									.addClass( 'has-placeholder' );

				that.hasPlaceholder = true;
			}
		});

		this.$layerSettings.find( '.layer-image-loader' ).on( 'click', function( event ) {
			var target = $( event.target ).siblings( 'input' ).attr( 'name' ) === 'image_source' ? 'default' : 'retina';

			MediaLoader.open(function( selection ) {
				var image = selection[ 0 ];

				if ( target === 'default' ) {
					that.$layerSettings.find( 'input[name="image_source"]' ).val( image.url ).trigger( 'change' );
					that.$layerSettings.find( 'input[name="image_alt"]' ).val( image.alt );
				} else if ( target === 'retina' ) {
					that.$layerSettings.find( 'input[name="image_retina"]' ).val( image.url );
				}
			});
		});
	};

	ImageLayer.prototype.initLayerSettings = function() {
		Layer.prototype.initLayerSettings.call( this );

		var that = this;

		this.$layerSettings.find( '.setting[name="preset_styles"], .setting[name="custom_class"]' ).on( 'change', function() {
			if ( that.hasPlaceholder === true ) {
				that.$viewportLayer.addClass( 'has-placeholder' );
			} else {
				that.$viewportLayer.removeClass( 'has-placeholder' );
			}
		});
	};

	ImageLayer.prototype.initViewportLayer = function() {
		this.$viewportLayer = $( '<img class="viewport-layer as-layer" src="' + this.imageSource + '" />' );

		if ( this.hasPlaceholder === true ) {
			this.$viewportLayer.addClass( 'has-placeholder' );
		} else {
			this.$viewportLayer.removeClass( 'has-placeholder' );
		}

		Layer.prototype.initViewportLayer.call( this );
	};

	ImageLayer.prototype.getData = function() {
		var data = Layer.prototype.getData.call( this );
		data.type = 'image';
		data.image_source = this.imageSource;
		data.image_alt = this.$layerSettings.find( 'input[name="image_alt"]' ).val();
		data.image_link = this.$layerSettings.find( 'input[name="image_link"]' ).val();
		data.image_retina = this.$layerSettings.find( 'input[name="image_retina"]' ).val();

		return data;
	};

	ImageLayer.prototype.destroy = function() {
		this.$layerSettings.find( 'input[name="image_source"]' ).off( 'change' );
		this.$layerSettings.find( '.layer-image-loader' ).off( 'click' );

		Layer.prototype.destroy.call( this );
	};

	/*
	 * ======================================================================
	 * DIV layer
	 * ======================================================================
	 */
	
	var DivLayer = function( data ) {
		Layer.call( this, data );

		var that = this;

		this.on( 'select', function() {
			setTimeout( function() {
				that.$layerSettings.find( '.div-layer-html-code' ).codeEditor( 'refresh' );
			}, 1 );
		});

		this.$layerSettings.find( '.layer-settings-tab-label' ).on( 'click', function() {
			setTimeout( function() {
				that.$layerSettings.find( '.div-layer-html-code' ).codeEditor( 'refresh' );
			}, 1 );
		});
	};

	DivLayer.prototype = Object.create( Layer.prototype );
	DivLayer.prototype.constructor = DivLayer;

	DivLayer.prototype.initLayerContent = function() {
		var that = this;

		this.text = this.data.createMode === 'new' ? this.$layerSettings.find( 'textarea[name="text"]' ).val() : this.data.text;

		that.$layerSettings.find( '.div-layer-html-code' ).codeEditor()
			.on( 'edit', function( event ) {
				that.text = event.value;
				that.$viewportLayer.html( that.text );
			});
	};

	DivLayer.prototype.initViewportLayer = function() {
		this.$viewportLayer = $( '<div class="viewport-layer as-layer">' + this.text + '</div>' );
		Layer.prototype.initViewportLayer.call( this );
	};

	DivLayer.prototype.getData = function() {
		var data = Layer.prototype.getData.call( this );
		data.type = 'div';
		data.text = this.text;

		return data;
	};

	DivLayer.prototype.destroy = function() {
		this.$layerSettings.find( 'textarea[name="text"]' ).off( 'input' );
		this.$layerSettings.find( '.div-layer-html-code' ).codeEditor( 'destroy' );
		Layer.prototype.destroy.call( this );
	};

	/*
	 * ======================================================================
	 * Video layer
	 * ======================================================================
	 */
	
	var VideoLayer = function( data ) {
		Layer.call( this, data );
	};

	VideoLayer.prototype = Object.create( Layer.prototype );
	VideoLayer.prototype.constructor = VideoLayer;

	VideoLayer.prototype.initLayerContent = function() {
		var that = this;

		this.text = this.data.createMode === 'new' ? this.$layerSettings.find( 'textarea[name="text"]' ).val() : this.data.text;

		this.$layerSettings.find( 'textarea[name="text"]' ).on( 'input', function() {
			that.text = $( this ).val();
		});
	};

	VideoLayer.prototype.initViewportLayer = function() {
		var that = this;

		this.$viewportLayer = $( '<div class="viewport-layer as-layer has-placeholder"><span class="video-placeholder"></span></div>' );
		Layer.prototype.initViewportLayer.call( this );

		this.$layerSettings.find( 'input[name="width"], input[name="height"]' ).on( 'change', function() {
			var width = that.$layerSettings.find( 'input[name="width"]' ).val(),
				height = that.$layerSettings.find( 'input[name="height"]' ).val();

			if ( width === 'auto' ) {
				that.$viewportLayer.css( 'width', 300 );
			}

			if ( height === 'auto' ) {
				that.$viewportLayer.css( 'height', 150 );
			}
		});

		this.$layerSettings.find( 'input[name="width"], input[name="height"]' ).trigger( 'change' );
	};

	VideoLayer.prototype.initLayerSettings = function() {
		Layer.prototype.initLayerSettings.call( this );

		var that = this;

		this.$layerSettings.find( '.setting[name="preset_styles"], .setting[name="custom_class"]' ).on( 'change', function() {
			that.$viewportLayer.addClass( 'has-placeholder' );
		});
	};

	VideoLayer.prototype.getData = function() {
		var data = Layer.prototype.getData.call( this );
		data.type = 'video';

		if ( this.text === '' ) {
			data.text = this.text;
			return data;
		}

		var video = $( this.text );

		if ( ! video.hasClass( 'as-video' ) ) {
			video.addClass( 'as-video' );
		}

		if ( video.is( 'iframe' ) ) {
			var src = video.attr( 'src' );

			if ( ( src.indexOf( 'youtube.com' ) !== -1 || src.indexOf( 'youtu.be' ) !== -1 ) && src.indexOf( 'enablejsapi' ) === -1 ) {
				src += ( src.indexOf( '?' ) === -1 ? '?' : '&' ) + 'enablejsapi=1&wmode=opaque';
			}

			if ( src.indexOf( 'vimeo.com' ) !== -1 && src.indexOf( 'api' ) === -1 ) {
				src += ( src.indexOf( '?' ) === -1 ? '?' : '&' ) + 'api=1';
			}

			video.attr( 'src', src );
		} else if ( video.hasClass( 'video-js' ) && typeof video.attr( 'data-videojs-id' ) === 'undefined' ) {
			video.removeClass( 'as-video' );

			var wrapper = $( '<div class="as-video" data-videojs-id="' + video.attr( 'id' ) + '"></div>' ).append( video );
			video = wrapper.clone();
		}

		data.text = video[0].outerHTML;

		return data;
	};

	VideoLayer.prototype.destroy = function() {
		this.$layerSettings.find( 'input[name="width"]' ).off( 'change' );
		this.$layerSettings.find( 'input[name="height"]' ).off( 'change' );

		Layer.prototype.destroy.call( this );
	};

	/*
	 * ======================================================================
	 * Settings editor
	 * ======================================================================
	 */
	
	var SettingsEditor = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		editor: null,

		/**
		 * Reference to panel for which the editor was opened.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Panel}
		 */
		currentPanel: null,

		/**
		 * Indicates whether the panel's preview needs to be updated.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Boolean}
		 */
		needsPreviewUpdate: false,

		/**
		 * Open the modal window.
		 *
		 * Send an AJAX request providing the panel's settings data.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Int} id The id of the panel
		 */
		open: function( id ) {
			this.currentPanel = AccordionSliderAdmin.getPanel( id );

			var that = this,
				data = this.currentPanel.getData( 'settings' ),
				spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_settings_editor', data: JSON.stringify( data ) },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( { 'display': '', 'visibility': '' } );
				}
			});
		},

		/**
		 * Initialize the editor.
		 *
		 * Add the necessary event listeners.
		 * 
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.$editor = $( '.settings-editor' );
			
			this.$editor.find( '.close, .close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			// Listen when the content type changes in order to load a new 
			// set of input fields, associated with the new content type.
			this.$editor.find( '.panel-setting[name="content_type"]' ).on( 'change', function() {
				var type = $( this ).val();

				that.loadControls( type );
				that.needsPreviewUpdate = true;
			});

			// Check if the content type is set to 'Posts' in order
			// to load the associates taxonomies for the selected posts.
			if ( this.$editor.find( '.panel-setting[name="content_type"]' ).val() === 'posts' ) {
				this.handlePostsSelects();
			}

			$( window ).on( 'resize.settingsEditor', function() {
				if ( that.$editor.find( '.modal-window' ).outerWidth() >= $( window ).width() ) {
					that.$editor.addClass( 'modal-window-left' );
				} else {
					that.$editor.removeClass( 'modal-window-left' );
				}

				if ( that.$editor.find( '.modal-window' ).outerHeight() >= $( window ).height() - 60 ) {
					that.$editor.addClass( 'modal-window-top' );
				} else {
					that.$editor.removeClass( 'modal-window-top' );
				}
			});

			this.$editor.on( 'click', '.show-hide-info', function() {
				$( window ).trigger( 'resize' );
			});

			$( window ).trigger( 'resize' );
		},

		/**
		 * Load the input fields associated with the content type.
		 *
		 * Sends an AJAX request providing the panel's settings.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {String} type The content type.
		 */
		loadControls: function( type ) {
			var that = this,
				data = this.currentPanel.getData( 'settings' );

			this.$editor.find( '.content-type-settings' ).empty();
			
			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_load_content_type_settings', type: type, data: JSON.stringify( data ) },
				complete: function( data ) {
					$( '.content-type-settings' ).append( data.responseText );

					if ( type === 'posts' ) {
						that.handlePostsSelects();
					}
				}
			});
		},

		/**
		 * Handle changes in the post names and taxonomies select.
		 *
		 * When the selected post names change, load the new associates
		 * taxonomies and construct the options for the taxonomy terms.
		 *
		 * Also, listen when the selected taxonomy terms change in order
		 * to keep a list of all selected terms. The list is useful in
		 * case the content type changes, because the selected taxonomy
		 * terms will be automatically populated next time when the
		 * 'Posts' content type is selected.
		 * 
		 * @since 1.0.0
		 */
		handlePostsSelects: function() {
			var that = this,
				$postTypes = this.$editor.find( 'select[name="posts_post_types"]' ),
				$taxonomies = this.$editor.find( 'select[name="posts_taxonomies"]' ),
				selectedTaxonomies = $taxonomies.val() || [];


			// detect when post names change
			$postTypes.on( 'change', function() {
				var postNames = $(this).val();

				$taxonomies.empty();

				if ( postNames !== null ) {
					AccordionSliderAdmin.getTaxonomies( postNames, function( data ) {
						$.each( postNames, function( index, postName ) {
							var taxonomies = data[ postName ];
								
							$.each( taxonomies, function( index, taxonomy ) {
								var	$taxonomy = $( '<optgroup label="' + taxonomy[ 'label' ] + '"></optgroup>' ).appendTo( $taxonomies );

								$.each( taxonomy[ 'terms' ], function( index, term ) {
									var selected = $.inArray( term[ 'full' ], selectedTaxonomies ) !== -1 ? ' selected="selected"' : '';
									$( '<option value="' + term[ 'full' ] + '"' + selected + '>' + term[ 'name' ] + '</option>' ).appendTo( $taxonomy );
								});
							});
						});

						$taxonomies.multiCheck( 'refresh' );
					});
				} else {
					$taxonomies.multiCheck( 'refresh' );
				}
			});

			// detect when taxonomies change
			$taxonomies.on( 'change', function( event ) {
				$taxonomies.find( 'option' ).each( function() {
					var option = $( this ),
						term =  option.attr( 'value' ),
						index = $.inArray( term, selectedTaxonomies );

					if ( option.is( ':selected' ) === true && index === -1 ) {
						selectedTaxonomies.push( term );
					} else if ( option.is( ':selected' ) === false && index !== -1 ) {
						selectedTaxonomies.splice( index, 1 );
					}
				});
			});

			$postTypes.multiCheck( { width: 215 } );
			$taxonomies.multiCheck( { width: 215 } );
		},

		/**
		 * Save the settings.
		 *
		 * Create a new object in which the current settings are
		 * saved and pass the data to the panel.
		 *
		 * If the content type is changed, update the panel's
		 * preview.
		 * 
		 * @since 1.0.0
		 */
		save: function() {
			var that = this,
				data = {};

			this.$editor.find( '.panel-setting' ).each(function() {
				var $setting = $( this );

				if ( typeof $setting.attr( 'multiple' ) !== 'undefined' ) {
					data[ $setting.attr( 'name' ) ] =  $setting.val() !== null ? $setting.val() : [];
				} else if ( $setting.attr( 'type' ) === 'checkbox' ) {
					data[ $setting.attr( 'name' ) ] =  $setting.is( ':checked' );
				} else {
					data[ $setting.attr( 'name' ) ] =  $setting.val();
				}
			});

			this.currentPanel.setData( 'settings', data );

			if ( this.needsPreviewUpdate === true ) {
				this.currentPanel.updatePanelPreview();
				this.needsPreviewUpdate = false;
			}
		},

		/**
		 * Close the editor.
		 *
		 * Remove all event listeners.
		 * 
		 * @since 1.0.0
		 */
		close: function() {
			this.$editor.find( '.close-x' ).off( 'click' );

			$( window ).off( 'resize.settingsEditor' );

			this.$editor.find( 'select[name="posts_post_types"]' ).multiCheck( 'destroy' );
			this.$editor.find( 'select[name="posts_taxonomies"]' ).multiCheck( 'destroy' );

			this.$editor.find( 'select[name="content_type"]' ).off( 'change' );
			this.$editor.find( 'select[name="posts_post_types"]' ).off( 'change' );
			this.$editor.find( 'select[name="posts_taxonomies"]' ).off( 'change' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	/*
	 * ======================================================================
	 * Media loader
	 * ======================================================================
	 */

	var MediaLoader = {

		/**
		 * Open the WordPress media loader and pass the
		 * information of the selected images to the 
		 * callback function.
		 *
		 * The passed that is the image's url, alt, title,
		 * width and height.
		 * 
		 * @since 1.0.0
		 */
		open: function( callback ) {
			var selection = [],
				insertReference = wp.media.editor.insert;
			
			wp.media.editor.send.attachment = function( props, attachment ) {
				var image = typeof attachment.sizes[ props.size ] !== 'undefined' ? attachment.sizes[ props.size ] : attachment.sizes[ 'full' ],
					url = image.url,
					width = image.width,
					height = image.height,
					alt = attachment.alt,
					title = attachment.title;

				selection.push( { url: url, alt: alt, title: title, width: width, height: height } );
			};

			wp.media.editor.insert = function( prop ) {
				callback.call( this, selection );

				wp.media.editor.insert = insertReference;
			};

			wp.media.editor.open( 'media-loader' );
		}
	};

	/*
	 * ======================================================================
	 * Preview window
	 * ======================================================================
	 */
	
	var PreviewWindow = {

		/**
		 * Reference to the modal window.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		previewWindow: null,

		/**
		 * Reference to the accordion slider instance.
		 *
		 * @since 1.0.0
		 * 
		 * @type {jQuery Object}
		 */
		accordion: null,

		/**
		 * The accordion's data.
		 *
		 * @since 1.0.0
		 * 
		 * @type {Object}
		 */
		accordionData: null,

		/**
		 * Open the preview window and pass the accordion's data,
		 * which consists of accordion settings and each panel's
		 * settings and content.
		 *
		 * Send an AJAX request with the data and receive the 
		 * accordion's HTML markup and inline JavaScript.
		 *
		 * @since 1.0.0
		 * 
		 * @param  {Object} data The data of the accordion
		 */
		open: function( data ) {
			this.accordionData = data;

			var that = this,
				spinner = $( '.preview-spinner' ).css( { 'display': 'inline-block', 'visibility': 'visible' } );

			$( 'body' ).append( '<div class="modal-overlay"></div>' +
				'<div class="modal-window-container preview-window">' +
				'	<div class="modal-window">' +
				'		<span class="close-x"></span>' +
				'	</div>' +
				'</div>');

			this.init();

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_preview_accordion', data: JSON.stringify( data ) },
				complete: function( data ) {
					that.previewWindow.append( data.responseText );
					that.previewWindow.css( 'visibility', '' );
					spinner.css( { 'display': '', 'visibility': '' } );

					$( window ).trigger( 'resize' );
				}
			});
		},

		/**
		 * Initialize the preview.
		 *
		 * Detect when the window is resized and resize the preview
		 * window accordingly, and also based on the accordion's set
		 * width.
		 *
		 * @since 1.0.0
		 */
		init: function() {
			var that = this;

			this.previewWindow = $( '.preview-window .modal-window' );
			this.accordion = this.previewWindow.find( '.accordion-slider' );

			this.previewWindow.css( 'visibility', 'hidden' );

			this.previewWindow.find( '.close-x' ).on( 'click', function( event ) {
				that.close();
			});

			var accordionWidth = this.accordionData[ 'settings' ][ 'width' ],
				accordionHeight = this.accordionData[ 'settings' ][ 'height' ],
				isPercentageWidth = accordionWidth.toString().indexOf( '%' ) !== -1,
				isPercentageHeight = accordionHeight.toString().indexOf( '%' ) !== -1;

			if ( isPercentageWidth === true ) {
				this.accordion.accordionSlider('width', '100%');
			} else {
				accordionWidth = parseInt( accordionWidth, 10 );
			}

			if ( isPercentageHeight === true ) {
				this.accordion.accordionSlider('height', '100%');
			}

			$( window ).on( 'resize.accordionSlider', function() {
				if ( isPercentageWidth === true ) {
					that.previewWindow.css( 'width', $( window ).width() * ( parseInt( accordionWidth, 10 ) / 100 ) - 60 );
				} else if ( accordionWidth >= $( window ).width() - 60 ) {
					that.previewWindow.css( 'width', $( window ).width() - 60 );
				} else {
					that.previewWindow.css( 'width', accordionWidth );
				}

				if ( isPercentageHeight === true ) {
					that.previewWindow.css( 'height', $( window ).height() * ( parseInt( accordionHeight, 10 ) / 100 ) - 200 );
				}

				if ( that.previewWindow.outerWidth() >= $( window ).width() ) {
					that.previewWindow.parent().addClass( 'modal-window-left' );
				} else {
					that.previewWindow.parent().removeClass( 'modal-window-left' );
				}
 
				if ( that.previewWindow.outerHeight() >= $( window ).height() - 60 ) {
					that.previewWindow.parent().addClass( 'modal-window-top' );
				} else {
					that.previewWindow.parent().removeClass( 'modal-window-top' );
				}
			});
		},

		/**
		 * Close the preview window.
		 *
		 * Remove event listeners and elements.
		 *
		 * @since 1.0.0
		 */
		close: function() {
			this.previewWindow.find( '.close-x' ).off( 'click' );
			$( window ).off( 'resize.accordionSlider' );

			this.accordion.accordionSlider( 'destroy' );
			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	$( document ).ready(function() {
		AccordionSliderAdmin.init();
	});

	window.accordionSlider = window.accordionSlider || {};

	window.accordionSlider.admin = AccordionSliderAdmin;
	window.accordionSlider.preview = PreviewWindow;

})( jQuery );

/*
 * ======================================================================
 * MultiCheck
 * ======================================================================
 */
	
;(function( $ ) {

	var MultiCheck = function( instance, options ) {

		this.options = options;
		this.isOpened = false;

		this.$select = $( instance );
		this.$multiCheck = null;
		this.$multiCheckHeader = null;
		this.$multiCheckContent = null;

		this.uid = new Date().valueOf() * Math.random();
		this.counter = 0;

		this.init();
	};

	MultiCheck.prototype = {

		init: function() {
			var that = this;

			this.settings = $.extend( {}, this.defaults, this.options );

			this.$multiCheck = $( '<div class="multi-check"></div>' ).css( 'width', this.settings.width );
			this.$multiCheckHeader = $( '<button type="button" class="multi-check-header"><span class="multi-check-header-text"></span><span class="multi-check-header-arrow">▼</span></button>' ).appendTo( this.$multiCheck );
			this.$multiCheckContent = $( '<ul class="multi-check-content"></ul>' ).appendTo( this.$multiCheck );

			this.$multiCheckHeader.on( 'mousedown.multiCheck', function( event ) {
				if ( that.isOpened === false ) {
					that.open();
				} else if ( that.isOpened === true ) {
					that.close();
				}
			});
			
			$( document ).on( 'mousedown.multiCheck.' + this.uid , function( event ) {
				if ( $.contains( that.$multiCheck[0], event.target ) === false ) {
					that.close();
				}
			});

			this.refresh();

			this.$select.after( this.$multiCheck );
			this.$select.hide();
			this.$multiCheckContent.hide();
		},

		refresh: function() {
			var that = this;

			this.counter = 0;

			this.$multiCheckContent.find( '.single-check' ).off( 'change.multiCheck' );
			this.$multiCheckContent.empty();

			this.$select.children().each(function() {
				if ( $( this ).is( 'optgroup' ) ) {
					$( '<li class="group-label">' + $( this ).attr( 'label' ) + '</li>' ).appendTo( that.$multiCheckContent );

					$( this ).children().each(function() {
						that._optionToCheckbox( $( this ) );
					});
				} else {
					that._optionToCheckbox( $( this ) );
				}
			});

			this.$multiCheckContent.find( '.single-check' ).on( 'change.multiCheck', function() {
				if ( $( this ).is( ':checked' ) ) {
					$( this ).data( 'option' ).prop( 'selected', true );
				} else {
					$( this ).data( 'option' ).prop( 'selected', false );
				}

				that.$select.trigger( 'change' );

				that._updateHeader();
			});

			this._updateHeader();
		},

		_optionToCheckbox: function( target ) {
			var $singleCheckContainer = $( '<li class="single-check-container"></li>' ).appendTo( this.$multiCheckContent ),
				$singleCheck = $( '<input id="single-check-' + this.uid + '-' + this.counter + '" class="single-check" type="checkbox" value="' + target.attr( 'value' ) + '"' + ( target.is( ':selected' ) ? ' checked="checked"' : '' ) + ' />' ).appendTo( $singleCheckContainer ),
				$singleCheckLabel = $( '<label for="single-check-' + this.uid + '-' + this.counter + '">' + target.text() + '</label>' ).appendTo( $singleCheckContainer );
			
			$singleCheck.data( 'option', target );

			this.counter++;
		},

		_updateHeader: function() {
			var $headerText = this.$multiCheckHeader.find( '.multi-check-header-text' ),
				text = '',
				count = 0,
				that = this;

			this.$multiCheckContent.find( '.single-check' ).each( function() {
				if ( $( this ).is( ':checked' ) ) {
					if ( text !== '' ) {
						text += ', ';
					}

					text += $( this ).siblings( 'label' ).text();
					count++;
				}
			});

			if ( count === 0 ) {
				text = 'Click to select';
			} else if ( count >= 2 ) {
				text = count + ' selected';
			}

			$headerText.text( text );
		},

		open: function() {
			var that = this;

			this.isOpened = true;

			this.$multiCheckContent.show();
		},

		close: function() {
			this.isOpened = false;

			this.$multiCheckContent.hide();
		},

		destroy: function() {
			this.$select.removeData( 'multiCheck' );
			this.$multiCheckHeader.off( 'mousedown.multiCheck' );
			$( document ).off( 'mousedown.multiCheck.' + this.uid );
			this.$multiCheckContent.find( '.single-check' ).off( 'change.multiCheck' );
			this.$multiCheck.remove();
			this.$select.show();
		},

		defaults: {
			width: 200
		}

	};

	$.fn.multiCheck = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		return this.each(function() {
			if ( typeof $( this ).data( 'multiCheck' ) === 'undefined' ) {
				var newInstance = new MultiCheck( this, options );

				$( this ).data( 'multiCheck', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'multiCheck' );

				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else {
					$.error( options + ' does not exist in multiCheck.' );
				}
			}
		});
	};

})( jQuery );

/*
 * ======================================================================
 * LightSortable
 * ======================================================================
 */

;(function( $ ) {

	var LightSortable = function( instance, options ) {

		this.options = options;
		this.$container = $( instance );
		this.$selectedChild = null;
		this.$placeholder = null;

		this.currentMouseX = 0;
		this.currentMouseY = 0;
		this.panelInitialX = 0;
		this.panelInitialY = 0;
		this.initialMouseX = 0;
		this.initialMouseY = 0;
		this.isDragging = false;
		
		this.checkHover = 0;

		this.uid = new Date().valueOf();

		this.events = $( {} );
		this.startPosition = 0;
		this.endPosition = 0;

		this.init();
	};

	LightSortable.prototype = {

		init: function() {
			this.settings = $.extend( {}, this.defaults, this.options );

			this.$container.on( 'mousedown.lightSortable' + this.uid, $.proxy( this._onDragStart, this ) );
			$( document ).on( 'mousemove.lightSortable.' + this.uid, $.proxy( this._onDragging, this ) );
			$( document ).on( 'mouseup.lightSortable.' + this.uid, $.proxy( this._onDragEnd, this ) );
		},

		_onDragStart: function( event ) {
			if ( event.which !== 1 || $( event.target ).is( 'select' ) || $( event.target ).is( 'input' ) || $( event.target ).is( 'a' ) ) {
				return;
			}

			this.$selectedChild = $( event.target ).is( this.settings.children ) ? $( event.target ) : $( event.target ).parents( this.settings.children );

			if ( this.$selectedChild.length === 1 ) {
				this.initialMouseX = event.pageX;
				this.initialMouseY = event.pageY;
				this.panelInitialX = this.$selectedChild.position().left;
				this.panelInitialY = this.$selectedChild.position().top;

				this.startPosition = this.$selectedChild.index();

				event.preventDefault();
			}
		},

		_onDragging: function( event ) {
			if ( this.$selectedChild === null || this.$selectedChild.length === 0 )
				return;

			event.preventDefault();

			this.currentMouseX = event.pageX;
			this.currentMouseY = event.pageY;

			if ( ! this.isDragging ) {
				this.isDragging = true;

				this.trigger( { type: 'sortStart' } );
				if ( $.isFunction( this.settings.sortStart ) ) {
					this.settings.sortStart.call( this, { type: 'sortStart' } );
				}

				var tag = this.$container.is( 'ul' ) || this.$container.is( 'ol' ) ? 'li' : 'div';

				this.$placeholder = $( '<' + tag + '>' ).addClass( 'ls-ignore ' + this.settings.placeholder )
					.insertAfter( this.$selectedChild );

				if ( this.$placeholder.width() === 0 ) {
					this.$placeholder.css( 'width', this.$selectedChild.outerWidth() );
				}

				if ( this.$placeholder.height() === 0 ) {
					this.$placeholder.css( 'height', this.$selectedChild.outerHeight() );
				}

				this.$selectedChild.css( {
						'pointer-events': 'none',
						'position': 'absolute',
						left: this.$selectedChild.position().left,
						top: this.$selectedChild.position().top,
						width: this.$selectedChild.width(),
						height: this.$selectedChild.height()
					} )
					.addClass( 'ls-ignore' );

				this.$container.append( this.$selectedChild );

				$( 'body' ).css( 'user-select', 'none' );

				var that = this;

				this.checkHover = setInterval( function() {

					that.$container.find( that.settings.children ).not( '.ls-ignore' ).each( function() {
						var $currentChild = $( this );

						if ( that.currentMouseX > $currentChild.offset().left &&
							that.currentMouseX < $currentChild.offset().left + $currentChild.width() &&
							that.currentMouseY > $currentChild.offset().top &&
							that.currentMouseY < $currentChild.offset().top + $currentChild.height() ) {

							if ( $currentChild.index() >= that.$placeholder.index() )
								that.$placeholder.insertAfter( $currentChild );
							else
								that.$placeholder.insertBefore( $currentChild );
						}
					});
				}, 200 );
			}

			this.$selectedChild.css( { 'left': this.currentMouseX - this.initialMouseX + this.panelInitialX, 'top': this.currentMouseY - this.initialMouseY + this.panelInitialY } );
		},

		_onDragEnd: function() {
			if ( this.isDragging ) {
				this.isDragging = false;

				$( 'body' ).css( 'user-select', '');

				this.$selectedChild.css( { 'position': '', left: '', top: '', width: '', height: '', 'pointer-events': '' } )
									.removeClass( 'ls-ignore' )
									.insertAfter( this.$placeholder );

				this.$placeholder.remove();

				clearInterval( this.checkHover );

				this.endPosition = this.$selectedChild.index();

				this.trigger( { type: 'sortEnd' } );
				if ( $.isFunction( this.settings.sortEnd ) ) {
					this.settings.sortEnd.call( this, { type: 'sortEnd', startPosition: this.startPosition, endPosition: this.endPosition } );
				}
			}

			this.$selectedChild = null;
		},

		destroy: function() {
			this.$container.removeData( 'lightSortable' );

			if ( this.isDragging ) {
				this._onDragEnd();
			}

			this.$container.off( 'mousedown.lightSortable.' + this.uid );
			$( document ).off( 'mousemove.lightSortable.' + this.uid );
			$( document ).off( 'mouseup.lightSortable.' + this.uid );
		},

		on: function( type, callback ) {
			return this.events.on( type, callback );
		},
		
		off: function( type ) {
			return this.events.off( type );
		},

		trigger: function( data ) {
			return this.events.triggerHandler( data );
		},

		defaults: {
			placeholder: '',
			sortStart: function() {},
			sortEnd: function() {}
		}

	};

	$.fn.lightSortable = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );

		return this.each(function() {
			if ( typeof $( this ).data( 'lightSortable' ) === 'undefined' ) {
				var newInstance = new LightSortable( this, options );

				$( this ).data( 'lightSortable', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'lightSortable' );

				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else {
					$.error( options + ' does not exist in lightSortable.' );
				}
			}
		});
	};

})( jQuery );

/*
 * ======================================================================
 * lightURLParse
 * ======================================================================
 */

;(function( $ ) {

	$.lightURLParse = function( url ) {
		var urlArray = url.split( '?' )[1].split( '&' ),
			result = [];

		$.each( urlArray, function( index, element ) {
			var elementArray = element.split( '=' );
			result[ elementArray[ 0 ] ] = elementArray[ 1 ];
		});

		return result;
	};

})( jQuery );

/*
 * ======================================================================
 * CodeEditor
 * ======================================================================
 */
	
;(function( $ ) {

	var CodeEditor = function( instance, options = {} ) {

		this.options = options;
		this.$textarea = $( instance );
		this.isCodeMirror = false;
		this.codeMirror = null;

		this.init();
	};

	CodeEditor.prototype = {

		init: function() {
			var that = this;

			this.settings = $.extend( {}, this.defaults, this.options );

			if ( typeof wp.codeEditor.initialize !== 'undefined' ) {
				var cm = wp.codeEditor.initialize( this.$textarea, this.setting );

				this.codeMirror = cm.codemirror;
				this.isCodeMirror = true;

				this.codeMirror.on( 'change', function() {
					that.trigger({ type: 'edit', value: that.codeMirror.getValue() });
				});
			} else {
				this.$textarea.on( 'input', function() {
					that.trigger({ type: 'edit', value: that.$textarea.val() });
				});
			}
		},

		getValue: function() {
			return this.isCodeMirror === true ? this.codeMirror.getValue() : this.$textarea.val();
		},

		// Attach an event handler to the textarea
		on: function( type, callback ) {
			return this.$textarea.on( type, callback );
		},

		// Detach an event handler to the textarea
		off: function( type ) {
			return this.$textarea.off( type );
		},

		// Trigger an event on the textarea
		trigger: function( data ) {
			return this.$textarea.triggerHandler( data );
		},

		refresh: function() {
			if ( this.isCodeMirror === true ) {
				this.codeMirror.refresh();
			}
		},

		destroy: function() {
			this.$textarea.removeData( 'codeEditor' );

			if ( this.isCodeMirror === true ) {
				this.codeMirror.toTextArea();
				this.codeMirror.off( 'change' );
			} else {
				this.$textarea.off( 'input' );
			}
		},

		defaults: {
			
		}
	};

	$.fn.codeEditor = function( options ) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		return this.each(function() {
			if ( typeof $( this ).data( 'codeEditor' ) === 'undefined' ) {
				var newInstance = new CodeEditor( this, options );

				$( this ).data( 'codeEditor', newInstance );
			} else if ( typeof options !== 'undefined' ) {
				var	currentInstance = $( this ).data( 'codeEditor' );

				if ( typeof currentInstance[ options ] === 'function' ) {
					currentInstance[ options ].apply( currentInstance, args );
				} else {
					$.error( options + ' does not exist in codeEditor.' );
				}
			}
		});
	};

})( jQuery );