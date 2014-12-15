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

	hideBlock = (role) ->
		getLink(role).removeClass('is-active')
		getBlock(role).removeClass('is-visible')
		$body.off 'keyup.hideBlock'

	showBlock = (role) ->
		getLink(role).addClass('is-active')
		getBlock(role).addClass('is-visible')
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



$ ->
	swiper = $('@swiper').swiper
		mode: 'horizontal'
		loop: false
		slidesPerView: 3
		calculateHeight: true
		visibilityFullFit: false
		createPagination: true

