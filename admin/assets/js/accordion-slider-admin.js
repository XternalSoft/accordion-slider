(function($) {

	var AccordionSliderAdmin = {

		panels: [],

		panelCounter: 0,

		postsData: {},

		init: function() {
			if ( as_js_vars.page === 'single' ) {
				this.initSingleAccordionPage();
			} else if ( as_js_vars.page === 'all' ) {
				this.initAllAccordionsPage();
			}
		},

		initSingleAccordionPage: function() {
			var that = this;

			this.initPanels();

			if ( parseInt( as_js_vars.id, 10 ) !== -1 ) {
				this.loadAccordionData();
			}

			$( 'form' ).on( 'submit', function( event ) {
				event.preventDefault();
				that.saveAccordion();
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

			$( '.breakpoints' ).on( 'click', '.add-setting', function( event ) {
				event.preventDefault();

				var name = $( this ).siblings( '.setting-selector' ).val(),
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

			$( window ).resize(function() {
				that.resizePanelImages();
			});

			$( '.postbox .hndle, .postbox .handlediv' ).on( 'click', function() {
				$( this ).parent( '.postbox' ).toggleClass( 'closed' );
			});

			$( '.sidebar-settings label' ).on( 'mouseover', function() {
				that.showInfo( $( this ) );
			});
		},

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

			$( '.accordions-list tbody' ).lightSortable( {
				children: '.accordion-row',
				placeholder: ''
			} );

			$( '.clear-all-cache' ).on( 'click', function( event ) {
				event.preventDefault();

				$.ajax({
					url: as_js_vars.ajaxurl,
					type: 'post',
					data: { action: 'accordion_slider_clear_all_cache', nonce: as_js_vars.cac_nonce },
					complete: function( data ) {
						
					}
				});
			});
		},

		loadAccordionData: function() {
			var that = this;

			$( '.panel-spinner' ).css( 'display', 'inline-block' );

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

					$( '.panel-spinner' ).css( 'display', '' );
				}
			});
		},

		saveAccordion: function() {
			var accordionData = this.getAccordionData();
			accordionData[ 'nonce' ] = as_js_vars.sa_nonce;
			accordionData[ 'action' ] = 'save';

			var accordionDataString = JSON.stringify( accordionData );

			var spinner = $( '.update-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_save_accordion', data: accordionDataString },
				complete: function( data ) {
					spinner.css( 'display', '' );

					if ( $( '.updated' ).length === 0 ) {
						$( 'h2' ).after( '<div class="updated"><p>' + as_js_vars.accordion_update + '</p></div>' );
					}

					if ( parseInt( as_js_vars.id, 10 ) === -1 && isNaN( data.responseText ) === false ) {
						window.location = as_js_vars.admin + '?page=accordion-slider&id=' + data.responseText + '&action=edit';
					}
				}
			});
		},

		getAccordionData: function() {
			var that = this;

			var accordionData = {
				'id': as_js_vars.id,
				'name': $( 'input#title' ).val(),
				'settings': {},
				'panels': [],
				'panels_state': {}
			};

			$( '.panels-container' ).find( '.panel' ).each(function( index, element ) {
				var panelData = that.getPanel( parseInt( $( element ).attr('data-id'), 10) ).getData( 'all' );
				panelData.position = parseInt( $( element ).attr( 'data-position' ), 10 );

				accordionData.panels[ index ] = panelData;
			});

			$( '.sidebar-settings' ).find( '.setting' ).each(function() {
				var setting = $( this );
				accordionData.settings[ setting.attr( 'name' ) ] = setting.attr( 'type' ) === 'checkbox' ? setting.is( ':checked' ) : setting.val();
			});

			var breakpoints = [];

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

		previewAccordion: function() {
			PreviewWindow.open( this.getAccordionData() );
		},

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

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

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

		exportAccordion: function( target ) {
			var url = $.lightURLParse( target.attr( 'href' ) ),
				nonce = url.ea_nonce,
				id = parseInt( url.id, 10 );

			ExportWindow.open( id, nonce );
		},

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

		initPanel: function( element, data ) {
			var that = this;

			var panel = new Panel( element, this.panelCounter, data );
			this.panels.push( panel );

			panel.on( 'duplicatePanel', function( event ) {
				that.duplicatePanel( event.panelData );
			});

			panel.on( 'deletePanel', function( event ) {
				that.deletePanel( event.id );
			});

			element.attr( 'data-id', this.panelCounter );
			element.attr( 'data-position', this.panelCounter );

			this.panelCounter++;
		},

		getPanel: function( id ) {
			var that = this,
				panel;

			$.each( that.panels, function( index, element ) {
				if ( element.id === id ) {
					panel = element;
					return false;
				}
			});

			return panel;
		},

		duplicatePanel: function( panelData ) {
			var that = this,
				newPanelData = $.extend( true, {}, panelData );


			var images = [ {
				background_source: newPanelData.background.background_source
			} ];

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_add_panels', data: JSON.stringify( images ) },
				complete: function( data ) {
					var panel = $( data.responseText ).appendTo( $( '.panels-container' ) );

					that.initPanel( panel, newPanelData );
				}
			});
		},

		deletePanel: function( id ) {
			var that = this;

			var panel = that.getPanel( id ),
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
				'</div>'
			).appendTo( 'body' );

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

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

		addImagePanels: function() {
			var that = this;
			
			MediaLoader.open(function( selection ) {
				var images = [];

				$.each( selection, function( index, element ) {
					images.push({
						background_source: element.url,
						background_alt: element.alt,
						background_title: element.title,
						background_width: element.width,
						background_height: element.height
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
					}
				});
			});
		},

		addPostsPanels: function() {
			var that = this;

			var data =  [{
				background_source: '[as_image_src]',
				background_alt: '[as_image_alt]',
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
							background_link: '[as_link]'
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

		addGalleryPanels: function() {
			var that = this;

			var data =  [{
				background_source: '[as_image_src]',
				background_alt: '[as_image_alt]',
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

		addFlickrPanels: function() {
			var that = this;

			var data =  [{
				background_source: '[as_image_src]',
				background_alt: '[as_image_alt]',
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

		addDynamicPanel: function() {
			var that = this;
		},

		addBreakpoint: function() {
			var that = this,
				size = '';

			var previousWidth = $( 'input[name="breakpoint_width"]' ).last().val();
			
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

		getTaxonomies: function( posts, callback ) {
			var that = this;
			
			var postsToLoad = [];

			$.each( posts, function( index, element ) {
				if ( typeof that.postsData[ element ] === 'undefined' ) {
					postsToLoad.push( element );
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
		}
	};

	var ExportWindow = {

		exportWindow: null,

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

		close: function() {
			this.exportWindow.remove();
		}
	};

	var ImportWindow = {

		importWindow: null,

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
					var row = $( data.responseText ).appendTo( $( '.accordions-list tbody' ) );
					
					row.hide().fadeIn();
					that.close();
				}
			});
		},

		close: function() {
			this.importWindow.remove();
		}
	};

	var Panel = function( element, id, data ) {
		this.$element = element;
		this.id = id;
		this.data = data;
		this.events = $( {} );

		if ( typeof this.data === 'undefined' ) {
			this.data = { background: {}, layers: {}, html: '', settings: {} };
		}

		this.init();
	};

	Panel.prototype = {

		init: function() {
			var that = this;

			this.$element.find( '.edit-background-image' ).on( 'click', function( event ) {
				event.preventDefault();
				BackgroundImageEditor.open( that.id );
			});

			this.$element.find( '.panel-preview' ).on( 'click', function( event ) {
				var contentType = that.getData( 'settings' )[ 'content_type' ];

				if ( typeof contentType === 'undefined' || contentType === 'custom' ) {
					MediaLoader.open(function( selection ) {
						var image = selection[ 0 ];

						that.setData( 'background', { background_source: image.url, background_alt: image.alt, background_title: image.title, background_width: image.width, background_height: image.height } );
						that.updateBackgroundImage();
					});
				}
			});

			this.$element.find( '.edit-html' ).on( 'click', function( event ) {
				event.preventDefault();
				HTMLEditor.open( that.id );
			});

			this.$element.find( '.edit-layers' ).on( 'click', function( event ) {
				event.preventDefault();
				LayersEditor.open( that.id );
			});

			this.$element.find( '.edit-settings' ).on( 'click', function( event ) {
				event.preventDefault();
				SettingsEditor.open( that.id );
			});

			this.$element.find( '.delete-panel' ).on( 'click', function( event ) {
				event.preventDefault();
				that.trigger( { type: 'deletePanel', id: that.id } );
			});

			this.$element.find( '.duplicate-panel' ).on( 'click', function( event ) {
				event.preventDefault();
				that.trigger( { type: 'duplicatePanel', panelData: that.data } );
			});

			this.resizeImage();
		},

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

		remove: function() {
			this.$element.find( '.edit-background-image' ).off( 'click' );
			this.$element.find( '.panel-preview' ).off( 'click' );
			this.$element.find( '.delete-panel' ).off( 'click' );
			this.$element.find( '.duplicate-panel' ).off( 'click' );

			this.$element.fadeOut( 500, function() {
				$( this ).remove();
			});
		},

		updateBackgroundImage: function() {
			var panelPreview = this.$element.find( '.panel-preview' ),
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
			} else if ( contentType === 'posts' ) {
				$( '<p class="dynamic-panel">[ ' + as_js_vars.posts_panels + ' ]</p>' ).appendTo( panelPreview );
			} else if ( contentType === 'gallery' ) {
				$( '<p class="dynamic-panel">[ ' + as_js_vars.gallery_panels + ' ]</p>' ).appendTo( panelPreview );
			} else if ( contentType === 'flickr' ) {
				$( '<p class="dynamic-panel">[ ' + as_js_vars.flickr_panels + ' ]</p>' ).appendTo( panelPreview );
			}

			
		},

		resizeImage: function() {
			var panelPreview = this.$element.find( '.panel-preview' ),
				panelImage = this.$element.find( '.panel-preview > img' );

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

		on: function( type, handler ) {
			this.events.on( type, handler );
		},

		off: function( type ) {
			this.events.off( type );
		},

		trigger: function( type ) {
			this.events.triggerHandler( type );
		}
	};

	var BackgroundImageEditor = {

		editor: null,

		currentPanel: null,

		open: function( id ) {
			var that = this;

			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			
			var data = this.currentPanel.getData( 'background' ),
				contentType = this.currentPanel.getData( 'settings' )[ 'content_type' ];

			if ( typeof contentType === 'undefined' ) {
				contentType = 'custom';
			}

			var spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_background_image_editor', data: JSON.stringify( data ), content_type: contentType },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( 'display', '' );
				}
			});
		},

		init: function() {
			var that = this;

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

			this.editor = $( '.background-image-editor' );

			this.editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			this.editor.find( '.image-loader, .retina-loader' ).on( 'click', function( event ) {
				event.preventDefault();
				that.openMediaLibrary( event );
			});

			this.editor.find( '.clear-fieldset' ).on( 'click', function( event ) {
				event.preventDefault();
				that.clearFieldset( event );
			});
		},

		openMediaLibrary: function( event ) {
			event.preventDefault();

			var that = this,
				target = $( event.target ).parents( '.fieldset' ).hasClass( 'opened-background-image' ) === true ? 'opened-background' : 'background',
				imageLoader = this.editor.find( '.' + target + '-image .image-loader' ),
				isRetina = $( event.target ).hasClass( 'retina-loader' );

			MediaLoader.open(function( selection ) {
				var image = selection[ 0 ];

				if ( isRetina === true ) {
					if ( target === 'background' ) {
						that.editor.find( 'input[name="background_retina_source"]' ).val( image.url );
					} else if ( target === 'opened-background' ) {
						that.editor.find( 'input[name="opened_background_retina_source"]' ).val( image.url );
					}
				} else {
					if ( imageLoader.find( 'img' ).length !== 0 ) {
						imageLoader.find( 'img' ).attr( 'src', image.url );
					} else {
						imageLoader.find( '.no-image' ).remove();
						$( '<img src="' + image.url + '" />' ).appendTo( imageLoader );
					}

					if ( target === 'background' ) {
						that.editor.find( 'input[name="background_source"]' ).val( image.url );
						that.editor.find( 'input[name="background_alt"]' ).val( image.alt );
						that.editor.find( 'input[name="background_title"]' ).val( image.title );
						that.editor.find( 'input[name="background_width"]' ).val( image.width );
						that.editor.find( 'input[name="background_height"]' ).val( image.height );
					} else if ( target === 'opened-background' ) {
						that.editor.find( 'input[name="opened_background_source"]' ).val( image.url );
						that.editor.find( 'input[name="opened_background_alt"]' ).val( image.alt );
						that.editor.find( 'input[name="opened_background_title"]' ).val( image.title );
						that.editor.find( 'input[name="opened_background_width"]' ).val( image.width );
						that.editor.find( 'input[name="opened_background_height"]' ).val( image.height );
					}
				}
			});
		},

		clearFieldset: function( event ) {
			event.preventDefault();

			var target = $( event.target ).parents( '.fieldset' ),
				imageLoader = target.find( '.image-loader' );

			target.find( 'input' ).val( '' );

			if ( imageLoader.find( 'img' ).length !== 0 ) {
				imageLoader.find( 'img' ).remove();
				$( '<p class="no-image">' + as_js_vars.no_image + '</p>' ).appendTo( imageLoader );
			}
		},

		save: function() {
			var that = this,
				data = {};

			this.editor.find( '.field' ).each(function() {
				var field = $( this );
				data[ field.attr('name') ] = field.val();
			});

			this.currentPanel.setData( 'background', data );
			this.currentPanel.updateBackgroundImage();
		},

		close: function() {
			this.editor.find( '.close-x' ).off( 'click' );
			this.editor.find( '.image-loader' ).off( 'click' );
			this.editor.find( '.clear-fieldset' ).off( 'click' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	var HTMLEditor = {

		editor: null,

		currentPanel: null,

		open: function( id ) {
			var that = this;

			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			
			var data = this.currentPanel.getData( 'html' );

			var spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_html_editor', data: data },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( 'display', '' );
				}
			});
		},

		init: function() {
			var that = this;

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

			this.editor = $( '.html-editor' );

			this.editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});
		},

		save: function() {
			this.currentPanel.setData( 'html', this.editor.find( 'textarea' ).val() );
		},

		close: function() {
			this.editor.find( '.close-x' ).off( 'click' );
			this.editor.find( '.image-loader' ).off( 'click' );
			this.editor.find( '.clear-fieldset' ).off( 'click' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	var LayersEditor = {

		editor: null,

		currentPanel: null,

		layersData: null,

		layers: [],

		counter: 0,

		isWorking: false,

		open: function( id ) {
			var that = this;

			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			this.layersData = this.currentPanel.getData( 'layers' );

			var spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_layers_editor', data: JSON.stringify( this.layersData ) },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( 'display', '' );
				}
			});
		},

		init: function() {
			var that = this;

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

			this.counter = 0;

			this.editor = $( '.layers-editor' );

			this.editor.find( '.close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			this.editor.find( '.add-layer-group' ).on( 'click', function( event ) {
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

			this.editor.find( '.delete-layer' ).on( 'click', function( event ) {
				event.preventDefault();
				that.deleteLayer();
			});

			this.editor.find( '.duplicate-layer' ).on( 'click', function( event ) {
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

			$( '.layers-list' ).lightSortable( {
				children: '.layers-list-item',
				placeholder: 'layers-list-item-placeholder',
				sortEnd: function( event ) {
					var layer = that.layers[ event.startPosition ];
					that.layers.splice( event.startPosition, 1 );
					that.layers.splice( event.endPosition, 0, layer );

					var $viewportLayers = that.editor.find( '.viewport-layers' ),
						total = $viewportLayers.children().length - 1;

					$( '.layers-list' ).find( '.layers-list-item' ).each(function( index, element ) {
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

			$( '.layers-list' ).find( '.layers-list-item' ).each(function( index, element ) {
				$( element ).attr( 'data-position', index );
			});

			if ( this.layers.length !== 0 ) {
				this.layers[ 0 ].triggerSelect();
			}
		},

		initViewport: function() {
			var accordionWidth = parseInt( $( '.sidebar-settings' ).find( '.setting[name="width"]' ).val(), 10),
				accordionHeight = parseInt( $( '.sidebar-settings' ).find( '.setting[name="height"]' ).val(), 10),
				backgroundData = this.currentPanel.getData( 'background' );

			var $viewport = this.editor.find( '.viewport' ).css( { 'width': accordionWidth, 'height': accordionHeight } ),
				$viewportLayers = $( '<div class="accordion-slider viewport-layers"></div>' ).appendTo( $viewport );

			if ( typeof backgroundData.background_source !== 'undefined' &&
				backgroundData.background_source !== '' &&
				backgroundData.background_source.indexOf( '[' ) === -1 ) {
				var $viewportImage = $( '<img class="viewport-image" src="' + backgroundData.background_source + '" />' ).prependTo( $viewport );
			}
		},

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

			this.editor.find( '.disabled' ).removeClass( 'disabled' );
		},

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
					$( '<li class="layers-list-item" data-id="' + that.counter + '" data-position="' + that.layers.length + '">Layer ' + that.counter + '</li>' ).prependTo( that.editor.find( '.layers-list' ) );

					that.createLayer( { id: that.counter, type: type, createMode: 'new' } );
				}
			});
		},

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
				this.editor.find( '.delete-layer, .duplicate-layer' ).addClass( 'disabled' );
				return;
			}

			if ( removedIndex === 0 ) {
				this.layers[ 0 ].triggerSelect();
			} else {
				this.layers[ removedIndex - 1 ].triggerSelect();
			}
		},
		
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
					$( '<li class="layers-list-item" data-id="' + that.counter + '">Layer ' + that.counter + '</li>' ).prependTo( that.editor.find( '.layers-list' ) );

					layerData.id = that.counter;
					layerData.createMode = 'duplicate';
					that.createLayer( layerData );
				}
			});
		},

		save: function() {
			var data = [];

			$.each( this.layers, function( index, element ) {
				data.push( element.getData() );
			});

			this.currentPanel.setData( 'layers', data );
		},

		close: function() {
			this.layers.length = 0;

			this.editor.find( '.close-x' ).off( 'click' );

			$( '.layers-list' ).lightSortable( 'destroy' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	var Layer = function( data ) {
		this.data = data;
		this.id = this.data.id;

		this.selected = false;
		this.events = $( {} );

		this.editor = $( '.layers-editor' );
		this.$viewportLayers = this.editor.find( '.viewport-layers' );

		this.$viewportLayer = null;
		this.$layerListItem = this.editor.find( '.layers-list-item[data-id="' + this.id + '"]' );
		this.$layerSettings = this.editor.find( '.layer-settings[data-id="' + this.id + '"]' );

		this.init();
	};

	Layer.prototype = {

		init: function() {
			this.initLayerContent();
			this.initLayerSettings();
			this.initViewportLayer();
			this.initLayerDragging();
			this.initLayerListItem();
		},

		getData: function() {
			var data = {};

			data.id = this.id;
			data.position = parseInt( this.$layerListItem.attr( 'data-position' ), 10);
			data.name = this.$layerListItem.text();
			
			data.settings = {};

			this.$layerSettings.find( '.setting' ).each(function() {
				var settingField = $( this ),
					type = settingField.attr( 'type' );

				if ( type === 'radio' ) {
					if ( settingField.is( ':checked' ) ) {
						data.settings[ settingField.attr( 'name' ).split( '-' )[ 0 ] ] = settingField.val();
					}
				} else if (type === 'checkbox' ) {
					data.settings[ settingField.attr( 'name' ) ] = settingField.is( ':checked' );
				} else {
					data.settings[ settingField.attr( 'name' ) ] = settingField.val();
				}
			});

			return data;
		},

		getID: function() {
			return this.id;
		},

		select: function() {
			this.selected = true;

			this.$layerListItem.addClass( 'selected-layers-list-item' );
			this.$layerSettings.addClass( 'selected-layer-settings' );
		},

		deselect: function() {
			this.selected = false;

			this.$layerListItem.removeClass( 'selected-layers-list-item' );
			this.$layerSettings.removeClass( 'selected-layer-settings' );
		},

		triggerSelect: function() {
			this.trigger( { type: 'select', id: this.id } );
		},

		isSelected: function() {
			return this.selected;
		},

		destroy: function() {
			this.$viewportLayer.off( 'mousedown' );
			this.$viewportLayer.off( 'mouseup' );
			this.$viewportLayer.off( 'click' );

			this.$layerListItem.off( 'click' );
			this.$layerListItem.off( 'dblclick' );
			this.$layerListItem.off( 'selectstart' );

			this.editor.off( 'mousemove.layer' + this.id );
			this.editor.off( 'click.layer' + this.id );

			this.$layerSettings.find( 'select[name="preset_styles"]' ).multiCheck( 'destroy' );

			this.$viewportLayer.remove();
			this.$layerListItem.remove();
			this.$layerSettings.remove();
		},

		on: function( type, handler ) {
			this.events.on( type, handler );
		},

		off: function( type ) {
			this.events.off( type );
		},

		trigger: function( type ) {
			this.events.triggerHandler( type );
		},

		initViewportLayer: function() {
			var that = this;

			this.$viewportLayer.attr( 'data-id', this.id );

			if ( this.data.createMode === 'new' || this.data.createMode === 'duplicate' ) {
				this.$viewportLayer.appendTo( this.$viewportLayers );
			} else if ( this.data.createMode === 'init' ) {
				this.$viewportLayer.prependTo( this.$viewportLayers );
			}

			if ( this.data.createMode === 'new' ) {
				this.$viewportLayer.css( { 'width': 'auto', 'height': 'auto', 'left': 0, 'top': 0 } );

				if ( this.$viewportLayer.hasClass( 'as-layer' ) ) {
					this.$viewportLayer.addClass( 'as-black as-padding' );
				} else {
					this.$viewportLayer.find( '.as-layer' ).addClass( 'as-black as-padding' );
				}
			} else if ( this.data.createMode === 'init' || this.data.createMode === 'duplicate' ) {
				var classes = '';
				classes += ' ' + this.data.settings.preset_styles !== null ? this.data.settings.preset_styles.join( ' ' ) : '';
				classes += ' ' + this.data.settings.custom_class;

				if ( this.$viewportLayer.hasClass( 'as-layer' ) ) {
					this.$viewportLayer.addClass( classes );
				} else {
					this.$viewportLayer.find( '.as-layer' ).addClass( classes );
				}

				this.$viewportLayer.css( { 'width': this.data.settings.width, 'height': this.data.settings.height } );

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

			this.$viewportLayer.on( 'mousedown', function() {
				that.triggerSelect();
			});
		},

		initLayerDragging: function() {
			var that = this,
				mouseX = 0,
				mouseY = 0,
				layerX = 0,
				layerY = 0,
				hasFocus = false,
				autoRightBottom = false;

			this.$viewportLayer.on( 'mousedown', function( event ) {
				mouseX = event.pageX;
				mouseY = event.pageY;
				layerX = that.$viewportLayer[ 0 ].offsetLeft;
				layerY = that.$viewportLayer[ 0 ].offsetTop;

				hasFocus = true;
			});

			this.editor.on( 'mousemove.layer' + this.id, function( event ) {
				if ( hasFocus === true ) {
					that.$viewportLayer.css( { 'left': layerX + event.pageX - mouseX, 'top': layerY + event.pageY - mouseY } );

					if ( autoRightBottom === false ) {
						autoRightBottom = true;
						that.$viewportLayer.css( { 'right': 'auto', 'bottom': 'auto' } );
					}
				}
			});

			this.$viewportLayer.on( 'mouseup', function( event ) {
				var position = that.$layerSettings.find( '.setting[name="position"]' ).val().toLowerCase(),
					horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left',
					verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

				hasFocus = false;
				autoRightBottom = false;

				if ( horizontalPosition === 'left' ) {
					that.$layerSettings.find( '.setting[name="horizontal"]' ).val( that.$viewportLayer.position().left );
				} else if ( horizontalPosition === 'right' ) {
					var right = that.editor.find( '.viewport-layers' ).width() - that.$viewportLayer.position().left - that.$viewportLayer.outerWidth( true );

					that.$layerSettings.find( '.setting[name="horizontal"]' ).val( right );
					that.$viewportLayer.css( { 'left': 'auto', 'right': right } );
				}

				if ( verticalPosition === 'top' ) {
					that.$layerSettings.find( '.setting[name="vertical"]' ).val( that.$viewportLayer.position().top );
				} else if ( verticalPosition === 'bottom' ) {
					var bottom = that.editor.find( '.viewport-layers' ).height() - that.$viewportLayer.position().top - that.$viewportLayer.outerHeight( true );

					that.$layerSettings.find( '.setting[name="vertical"]' ).val( bottom );
					that.$viewportLayer.css( { 'top': 'auto', 'bottom': bottom } );
				}
			});
		},

		initLayerListItem: function() {
			var that = this,
				isEditingLayerName = false;

			this.$layerListItem.on( 'click', function( event ) {
				that.trigger( { type: 'select', id: that.id } );
			});

			this.$layerListItem.on( 'dblclick', function( event ) {
				if ( isEditingLayerName === true ) {
					return;
				}

				isEditingLayerName = true;

				var name = that.$layerListItem.text();

				var input = $( '<input type="text" value="' + name + '" />' ).appendTo( that.$layerListItem );
			});

			this.$layerListItem.on( 'selectstart', function( event ) {
				event.preventDefault();
			});

			this.editor.on( 'click.layer' + this.id, function( event ) {
				if ( ! $( event.target ).is( 'input' ) && isEditingLayerName === true ) {
					isEditingLayerName = false;

					var input = that.$layerListItem.find( 'input' );

					that.$layerListItem.text( input.val() );
					input.remove();
				}
			});
		},

		initLayerContent: function() {

		},

		initLayerSettings: function() {
			var that = this,
				position = this.$layerSettings.find( '.setting[name="position"]' ).val().toLowerCase(),
				horizontalPosition = position.indexOf( 'right' ) !== -1 ? 'right' : 'left',
				verticalPosition = position.indexOf( 'bottom' ) !== -1 ? 'bottom' : 'top';

			this.$layerSettings.find( 'select[name="preset_styles"]' ).multiCheck( { width: 120} );

			this.$layerSettings.find( '.setting[name="width"]' ).on( 'change', function() {
				that.$viewportLayer.css( 'width', $( this ).val() );
			});

			this.$layerSettings.find( '.setting[name="height"]' ).on( 'change', function() {
				that.$viewportLayer.css( 'height', $( this ).val() );
			});

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
					suffix = horizontal.indexOf( 'px' ) === -1 && horizontal.indexOf( '%' ) === -1 ? 'px' : '';
					that.$viewportLayer.css( horizontalPosition, horizontal + suffix );
				}

				if ( vertical === 'center' ) {
					that.$viewportLayer.css( { 'height': that.$viewportLayer.outerHeight( true ),  'marginTop': 'auto', 'marginBottom': 'auto', 'top': 0, 'bottom': 0 } );
				} else {
					suffix = vertical.indexOf( 'px' ) === -1 && vertical.indexOf( '%' ) === -1 ? 'px' : '';
					that.$viewportLayer.css( verticalPosition, vertical + suffix );
				}
			});

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
			that.$viewportLayer.text( that.text );
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

	var ImageLayer = function( data ) {
		Layer.call( this, data );
	};

	ImageLayer.prototype = Object.create( Layer.prototype );
	ImageLayer.prototype.constructor = ImageLayer;

	ImageLayer.prototype.initLayerContent = function() {
		var that = this;

		this.imageSource = this.data.createMode === 'new' ? 'placeholder.png' : this.data.image_source;

		this.$layerSettings.find( 'input[name="image_source"]' ).on( 'change', function() {
			that.imageSource = $( this ).val();

			if ( that.imageSource !== '' ) {
				that.$viewportLayer.attr( 'src', that.imageSource );
			} else {
				that.$viewportLayer.attr( 'src', 'placeholder.png' );
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

	ImageLayer.prototype.initViewportLayer = function() {
		this.$viewportLayer = $( '<img class="viewport-layer as-layer" src="' + this.imageSource + '" draggable="false" />' );
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

	var DivLayer = function( data ) {
		Layer.call( this, data );
	};

	DivLayer.prototype = Object.create( Layer.prototype );
	DivLayer.prototype.constructor = DivLayer;

	DivLayer.prototype.initLayerContent = function() {
		var that = this;

		this.text = this.data.createMode === 'new' ? this.$layerSettings.find( 'textarea[name="text"]' ).val() : this.data.text;

		this.$layerSettings.find( 'textarea[name="text"]' ).on( 'input', function() {
			that.text = $( this ).val();
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
		this.$viewportLayer = $( '<div class="viewport-layer as-layer"></div>' );
		Layer.prototype.initViewportLayer.call( this );
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

	var SettingsEditor = {

		editor: null,

		currentPanel: null,

		open: function( id ) {
			var that = this;

			this.currentPanel = AccordionSliderAdmin.getPanel( id );
			
			var data = this.currentPanel.getData( 'settings' );

			var spinner = $( '.panel[data-id="' + id + '"]' ).find( '.panel-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				dataType: 'html',
				data: { action: 'accordion_slider_load_settings_editor', data: JSON.stringify( data ) },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( 'display', '' );
				}
			});
		},

		init: function() {
			var that = this;

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

			this.editor = $( '.settings-editor' );
			
			this.editor.find( '.close, .close-x' ).on( 'click', function( event ) {
				event.preventDefault();
				that.save();
				that.close();
			});

			this.editor.find( '.panel-setting[name="content_type"]' ).on( 'change', function() {
				that.loadControls( $( this ).val() );
			});

			if ( this.editor.find( '.panel-setting[name="content_type"]' ).val() === 'posts' ) {
				this.handlePostsSelects();
			}
		},

		loadControls: function( type ) {
			var that = this,
				data = this.currentPanel.getData( 'settings' );

			this.editor.find( '.content-type-settings' ).empty();
			
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

		handlePostsSelects: function() {
			var that = this,
				$postTypes = this.editor.find( 'select[name="posts_post_types"]' ),
				$taxonomies = this.editor.find( 'select[name="posts_taxonomies"]' ),
				selectedTaxonomies = $taxonomies.val() || [];


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

			$postTypes.multiCheck( { width: 215} );
			$taxonomies.multiCheck( { width: 215} );
		},

		save: function( ) {
			var that = this,
				data = {};

			this.editor.find( '.panel-setting' ).each(function() {
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
			this.currentPanel.updateBackgroundImage();
		},

		close: function() {
			this.editor.find( '.close-x' ).off( 'click' );

			this.editor.find( 'select[name="posts_post_types"]' ).multiCheck( 'destroy' );
			this.editor.find( 'select[name="posts_taxonomies"]' ).multiCheck( 'destroy' );

			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}

	};

	var MediaLoader = {

		open: function( callback ) {
			var selection = [],
				insertReference = wp.media.editor.insert;
			
			wp.media.editor.send.attachment = function( props, attachment ) {
				var url = attachment.sizes[ props.size ].url,
					alt = attachment.alt,
					title = attachment.title,
					width = attachment.width,
					height = attachment.height;

				selection.push( { url: url, alt: alt, title: title, width: width, height: height } );
			};

			wp.media.editor.insert = function( prop ) {
				callback.call( this, selection );

				wp.media.editor.insert = insertReference;
			};

			wp.media.editor.open( 'media-loader' );
		}

	};

	var PreviewWindow = {

		previewWindow: null,

		accordion: null,

		open: function( data ) {
			var that = this;
			this.accordionData = data;

			var spinner = $( '.preview-spinner' ).css( 'display', 'inline-block' );

			$.ajax({
				url: as_js_vars.ajaxurl,
				type: 'post',
				data: { action: 'accordion_slider_preview_accordion', data: JSON.stringify( data ) },
				complete: function( data ) {
					$( 'body' ).append( data.responseText );
					that.init();

					spinner.css( 'display', '' );
				}
			});
		},

		init: function() {
			var that = this;

			$( '.modal-window-container' ).css( 'top', $( window ).scrollTop() );

			this.previewWindow = $( '.preview-window .modal-window' );
			this.accordion = this.previewWindow.find( '.accordion-slider' );

			this.previewWindow.find( '.close-x' ).on( 'click', function( event ) {
				that.close();
			});

			var accordionWidth = this.accordionData[ 'settings' ][ 'width' ],
				isPercetageWidth = accordionWidth.indexOf( '%' ) !== -1;

			if ( isPercetageWidth === false ) {
				accordionWidth = parseInt( accordionWidth, 10 );
			}

			$( window ).on( 'resize', function() {
				if ( isPercetageWidth === true ) {
					that.previewWindow.css( 'width', $( window ).width() - 100 );
				} else if ( accordionWidth + 100 >= $( window ).width() ) {
					that.previewWindow.css( 'width', $( window ).width() - 100 );
				} else {
					that.previewWindow.css( 'width', accordionWidth );
				}
			});

			$( window ).trigger( 'resize' );
			$( window ).trigger( 'resize' );
		},

		close: function() {
			this.previewWindow.find( '.close-x' ).off( 'click' );

			this.accordion.accordionSlider( 'destroy' );
			$( 'body' ).find( '.modal-overlay, .modal-window-container' ).remove();
		}
	};

	$( document ).ready(function() {
		AccordionSliderAdmin.init();
	});

})( jQuery );

;(function( $, window, document ) {

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
					$( this ).data( 'option' ).attr( 'selected', 'selected' );
				} else {
					$( this ).data( 'option' ).removeAttr( 'selected' );
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

			if ( text === '' ) {
				text = 'Click to select';
			}

			$headerText.text( text );

			setTimeout(function() {
				if ( $headerText.width() > that.$multiCheckHeader.width() - 10 ) {
					$headerText.text( count + ' selected' );
				}
			}, 1);
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

})(jQuery, window, document);

;(function( $, window, document ) {

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
			if ( event.which !== 1 || $( event.target ).is( 'select' ) || $( event.target ).is( 'input' ) ) {
				return;
			}

			this.$selectedChild = $( event.target ).is( this.settings.children ) ? $( event.target ) : $( event.target ).parents( this.settings.children );

			if ( this.$selectedChild.length === 1 ) {
				this.initialMouseX = event.pageX;
				this.initialMouseY = event.pageY;
				this.panelInitialX = this.$selectedChild.position().left;
				this.panelInitialY = this.$selectedChild.position().top;

				this.startPosition = this.$selectedChild.index();
			}
		},

		_onDragging: function( event ) {
			if ( this.$selectedChild === null || this.$selectedChild.length === 0 )
				return;

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

})(jQuery, window, document);

;(function( $, window, document ) {

	$.lightURLParse = function( url ) {
		var urlArray = url.split( '?' )[1].split( '&' ),
			result = [];

		$.each( urlArray, function( index, element ) {
			var elementArray = element.split( '=' );
			result[ elementArray[ 0 ] ] = elementArray[ 1 ];
		});

		return result;
	};

})(jQuery, window, document);