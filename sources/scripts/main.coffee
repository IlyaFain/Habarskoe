$ ->

	$body = $('body')

	$showBlockLinks = $('@showBlock')
	$hideBlockLinks = $('@hideBlock')
	$switchBlockLinks = $('@switchBlock')
	$toggleBlockLinks = $('@toggleBlock')


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
		bodyUnock(role)
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

