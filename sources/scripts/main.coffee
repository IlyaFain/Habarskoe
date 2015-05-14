$ ->
	$columns = $('@column')
	likeFooterHeight = (cb) ->
		height = $('.footer').outerHeight()
		$('@likeFooterHeight').innerHeight(height)
		if swiperPhotos then swiperPhotos.resizeFix()
		if swiperSoon then swiperSoon.resizeFix()
		cb()
	$(window).on 'resize', ->
		likeFooterHeight ->
			$columns.css('height', 'auto')
			heights = []
			$columns.each (i, item) =>
				heights.push($(item).outerHeight())
			height = Math.max.apply(Math, heights)
			$columns.css('height', height)

	$(window).on 'load', ->
		$(window).trigger('resize')

$ ->

	$body = $('body')

	$showBlockLinks = '@showBlock'
	$hideBlockLinks = '@hideBlock'
	$switchBlockLinks = '@switchBlock'
	$toggleBlockLinks = '@toggleBlock'
	$showLightboxLinks = '@lightbox'
	$photos = $('@photos').find('@lightbox').find('img')



	getLink = (role) ->
		return $('[data-target="'+role+'"]')

	getBlock = (role) ->
		return $('@'+role)

	toggleBlock = (role) ->
		getLink(role).toggleClass('is-active')
		getBlock(role).toggleClass('is-visible')

	bodyLock = (role) ->
		if getBlock(role).hasRole('modal')
			$body.addClass('is-locked')

	bodyUnlock = (role) ->
		if getBlock(role).hasRole('modal')
			$body.removeClass('is-locked')

	window.hideBlock = (role) ->
		getLink(role).removeClass('is-active')
		getBlock(role).removeClass('is-visible')
		bodyUnlock(role)
		$body.off 'keyup.hideBlock'

	window.showBlock = (role) ->
		getLink(role).addClass('is-active')
		getBlock(role).addClass('is-visible')
		bodyLock(role)
		$body.on 'keyup.hideBlock', (e) ->
			if e.keyCode is 27
				hideBlock(role)

	$body.on 'click', $showBlockLinks, ->
		role = $(this).attr('data-target')
		showBlock(role)
		$(window).trigger('resize')

	$body.on 'click', $hideBlockLinks, ->
		role = $(this).attr('data-target')
		hideBlock(role)
		$(window).trigger('resize')

	$body.on 'click', $toggleBlockLinks, ->
		role = $(this).attr('data-target')
		toggleBlock(role)
		$(window).trigger('resize')

	$body.on 'click', $switchBlockLinks, ->
		targetRole = $(this).attr('data-target')
		targetsRole = $(this).attr('data-targets')
		$('@'+targetsRole).removeClass('is-visible').filter('@'+targetRole).addClass('is-visible')
		$('[data-targets="'+targetsRole+'"]').removeClass('is-active').filter($(this)).addClass('is-active')


	$closeModalLinks = '@modal-close'
	$zoomModalLinks = '@modal-zoom'

	$body.on 'click', $closeModalLinks, ->
		$modal = $(this).closest('@modal')
		$modal.removeClass('is-visible')
		role = $modal.roles()[1]
		$('[data-target="'+role+'"]').removeClass('is-active')
		bodyUnlock(role)

	$body.on 'click', $zoomModalLinks, ->
		$modal = $(this).closest('@modal')
		$modal.toggleClass('is-zoomed')

	setPhoto = ($original) ->

		$modal = $('@modal@photos')
		$modalPicPlace = $modal.find('@modal-pic')
		$modalTitlePlace = $modal.find('@modal-title')
		$modalTitlePlace.html('')

		$img = $original.clone().addRole('modal-zoom')
		$modalPicPlace.html($img)
		$modalTitlePlace.html($img.attr('title'))

		setArrows($photos, $original)

	setArrows = ($photos, $original) ->
		$arrows = $('@modal@photos').find('@modal-arrows')
		$prev = $('@modal@photos').find('@modal-prev')
		$next = $('@modal@photos').find('@modal-next')
		i = $photos.index($original)
		if $photos.length > 1
			if i > 0
				$prev.addClass('is-visible')
			else
				$prev.removeClass('is-visible')

			if i + 1 is $photos.length
				$next.removeClass('is-visible')
			else
				$next.addClass('is-visible')
		else
			$arrows.removeClass('is-visible')
		$next.on 'click', ->
			# debugger
			setPhoto($photos.eq(i+1))
		$prev.on 'click', ->
			setPhoto($photos.eq(i-1))



	$body.on 'click', $showLightboxLinks, ->
		role = 'photos'
		$original = $(this).find('img')
		setPhoto($original)
		showBlock(role)
		return false

$ ->
	window.swiperSoon = $('@swiper@soon').swiper
		direction: 'horizontal'
		loop: false
		slidesPerView: 3
		calculateHeight: true
		visibilityFullFit: false
		createPagination: false
		roundLengths: true
		autoResize: true
		resizeReInit: true
	$('@soonPrev').on 'click', ->
		swiperSoon.swipePrev()
	$('@soonNext').on 'click', ->
		swiperSoon.swipeNext()

$ ->
	window.swiperPhotos = $('@swiper@photos').swiper
		direction: 'horizontal'
		loop: false
		slidesPerView: 3
		slidesPerGroup: 3
		slidesPerViewFit: true
		calculateHeight: true
		visibilityFullFit: false
		roundLengths: true

		createPagination: true
		pagination: '.swiper-pagination'
		paginationClickable: true
		paginationAsRange: true

		autoResize: true
		resizeReInit: true




$ ->


	swiperPhotos = $('@swiper@archive').swiper
		direction: 'vertical'
		speed: 300
		loop: false
		slidesPerView: 'auto'
		# calculateHeight: tr
		calculateHeight: false
		cssWidthAndHeight: true
		width: '100%'

		slidesPerViewFit: false
		visibilityFullFit: true

		freeMode: true
		# freeModeFluid: true
		mousewheelControl: true
		scrollContainer: true
		scrollbar: '.swiper-scrollbar'
		onInit: ->

			$swiperContainer = $('@swiper@archive')
			swiperContainer = $swiperContainer[0]

			$swiperContainer.on 'mousewheel', ->
				console.log '1333'

			wheelDistance = (e) ->
				e = e or event
				w = e.wheelDelta
				d = e.detail
				console.log '123'
				if w then w / 120 else if d then -d / 3 else 0


			# swiper.addEventListener 'mousewheel', wheelDistance, false
			swiperContainer.addEventListener 'WheelEvent', wheelDistance, false # for Firefox




$ ->
	$column = $('@columnFixed')
	$constrain = $('.constrain').first()
	$(window).on 'resize', ->
		$column.css('right', $constrain.offset().left)
	if $column[0]
		$(window).resize()
		$column.addClass('is-visible')

$ ->
	$('@fotorama').fotorama
		arrows: false
		nav: 'thumbs'
		thumbWidth: 120
		thumbHeight: 90
		thumbmargin: 10
		thumbborderwidth: 1
		width: '100%'
		fit: 'cober'

$ ->
	$gallery =
	$images = $('@gallery img')
	l = $images.length - 1
	$images.waitForImages
		waitForAll: true
		each: (a, b, c) ->
			if a is l
				console.log 'last'
				$gallery = $('@gallery').isotope
					itemSelector: '.gallery-item'
					masonry:
						columnWidth: 280
						gutter: 10
				# $gallery.isotope 'on', 'layoutComplete', onComplete()

	# onComplete = ->
	# 	console.log 'compleate'



$ ->
	if $('.hero').length
		w = $(window)
		top = $('.hero').offset().top
		w.on 'scroll', (e) ->
			if $('@headerInteractive').hasClass('is-visible')
				if w.scrollTop() > 50
					$('@toggleBlock[data-target="headerInteractive"]').click()

$ ->
	if $('@scrollToTop').length
		$('@scrollToTop').on 'click', ->
			$('body').animate {scrollTop: 0}, 300

$ ->
	$('@request').on 'submit', (e, data) ->
		console.log e, data
		modalRole = $('@request').closest('@modal').roles()[1]
		hideBlock(modalRole)
		showBlock('thanks')
		return false

$ ->
	$('@toSummer').on 'click', ->
		$('@headerNav').addClass('headerNav--summer')
	$('@toWinter').on 'click', ->
		$('@headerNav').removeClass('headerNav--summer')

$ ->
	$('#test').on 'click', ->
		console.log '123'