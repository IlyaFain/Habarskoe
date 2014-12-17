$ ->
	$columns = $('@column')
	$(window).on 'resize', ->
		$columns.css('height', 'auto')
		heights = []
		console.log $columns.length
		$columns.each (i, item) =>
			heights.push($(item).outerHeight())
		height = Math.max.apply(Math, heights)
		console.log heights, height
		$columns.css('height', height)
	after 500, =>
		$(window).trigger('resize')

$ ->

	$body = $('body')

	$showBlockLinks = $('@showBlock')
	$hideBlockLinks = $('@hideBlock')
	$switchBlockLinks = $('@switchBlock')
	$toggleBlockLinks = $('@toggleBlock')
	$showLightboxLinks = $('@lightbox')
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

	hideBlock = (role) ->
		getLink(role).removeClass('is-active')
		getBlock(role).removeClass('is-visible')
		bodyUnlock(role)
		$body.off 'keyup.hideBlock'

	showBlock = (role) ->
		getLink(role).addClass('is-active')
		getBlock(role).addClass('is-visible')
		bodyLock(role)
		$body.on 'keyup.hideBlock', (e) ->
			if e.keyCode is 27
				hideBlock(role)

	$showBlockLinks.on 'click', ->
		role = $(this).attr('data-target')
		showBlock(role)

	$hideBlockLinks.on 'click', ->
		role = $(this).attr('data-target')
		hideBlock(role)

	$toggleBlockLinks.on 'click', ->
		role = $(this).attr('data-target')
		toggleBlock(role)

	$switchBlockLinks.on 'click', ->
		targetRole = $(this).attr('data-target')
		targetsRole = $(this).attr('data-targets')
		$('@'+targetsRole).removeClass('is-visible').filter('@'+targetRole).addClass('is-visible')
		$('[data-targets="'+targetsRole+'"]').removeClass('is-active').filter($(this)).addClass('is-active')


	$closeModalLinks = $('@modal-close')
	$zoomModalLinks = $('@modal-zoom')

	$closeModalLinks.on 'click', ->
		$modal = $(this).closest('@modal')
		$modal.removeClass('is-visible')
		role = $modal.roles()[1]
		$('[data-target="'+role+'"]').removeClass('is-active')
		bodyUnlock(role)

	$zoomModalLinks.on 'click', ->
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



	$showLightboxLinks.on 'click', ->
		role = 'photos'
		$original = $(this).find('img')
		setPhoto($original)
		showBlock(role)
		return false

$ ->
	swiperSoon = $('@swiper@soon').swiper
		mode: 'horizontal'
		loop: false
		slidesPerView: 3
		calculateHeight: true
		visibilityFullFit: false
		createPagination: false
		roundLengths: true
	$('@soonPrev').on 'click', ->
		swiperSoon.swipePrev()
	$('@soonNext').on 'click', ->
		swiperSoon.swipeNext()

	swiperPhotos = $('@swiper@photos').swiper
		mode: 'horizontal'
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

